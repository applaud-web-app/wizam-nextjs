"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaCheck, FaTimes, FaRegCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Loader from "@/components/Common/Loader";

// TypeScript interfaces
interface Option {
  text: string;
  image?: string;
}

interface Question {
  id: number;
  type: string;
  question: string | string[];
  correctAnswer: string[] | string | Record<string, string>;
  userAnswer?: string[] | string | Record<string, string>;
  isCorrect?: boolean;
  explanation?: string;
  options?: Option[] | string[];
}

interface QuizData {
  title: string;
  duration: string;
  questions: Question[];
}

interface UserQuizResult {
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  status: string;
  marks: number;
  timeTaken?: number;
}

interface LeaderboardEntry {
  username: string;
  score: number;
  status: string;
}

interface QuizResultProps {
  params: {
    slug: string;
  };
}

const QuizResult = ({ params }: QuizResultProps) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userQuizResult, setUserQuizResult] = useState<UserQuizResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const { slug } = params;

    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exam-result/${slug}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        if (response.data.status) {
          const resultData = response.data;

          setQuizData({
            title: resultData.exam.title,
            duration: resultData.exam.duration,
            questions: resultData.exam_preview.map((q: any) => ({
              id: q.question_id,
              type: q.question_type,
              question: q.question_text,
              correctAnswer: q.correct_answer,
              userAnswer: q.user_answer,
              isCorrect: q.is_correct,
              options: q.question_option || [],
            })),
          });

          setUserQuizResult({
            correctCount: parseInt(resultData.result.correct),
            wrongCount: parseInt(resultData.result.incorrect),
            skippedCount: resultData.result.skipped,
            marks: parseInt(resultData.result.marks),
            status: resultData.result.status,
            timeTaken: resultData.result.timeTaken, 
          });
        } else {
          toast.error("No Exam results found for this category");
        }
      } catch (error) {
        toast.error("Error fetching Exam results: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, [params, router]);

  if (loading || !quizData || !userQuizResult) {
    return <Loader />;
  }

  const passingScore = 0.6;
  const totalQuestions = quizData.questions.length;
  const percentageCorrect = userQuizResult.correctCount / totalQuestions;
  const passed = percentageCorrect >= passingScore;

// Time formatting function for minutes and seconds
const formatTimeTaken = (timeInMinutes?: number) => {
  if (!timeInMinutes) return "N/A";
 
  return `${timeInMinutes} min`; // Display minutes and seconds
}; 

  const isUserAnswerIncludes = (option: string, userAnswer?: string[] | string | Record<string, string>) => {
    if (Array.isArray(userAnswer)) {
      return userAnswer.includes(option);
    }
    return false;
  };

  const renderQuestionResult = (question: Question, index: number) => {
    const isCorrect = question.isCorrect;

    const renderOptions = () => {
      if (!question.options) return null;

      switch (question.type) {
        case "TOF": // True or False
        case "MSA": // Multiple Single Answer
        case "MMA": // Multiple Match Answer
          return (
            <div className="mb-4">
              {question.options.map((option, index) => {
                const isUserAnswer = isUserAnswerIncludes(String(option), question.userAnswer);
                const isCorrectAnswer = Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.includes(String(option))
                  : question.correctAnswer === String(option);

                return (
                  <div key={index} className="flex items-center bg-gray-100 p-3 rounded-md mb-2">
                    <span className="mr-2">
                      {isCorrectAnswer ? (
                        <FaCheck className="text-green-500" />
                      ) : isUserAnswer ? (
                        <FaTimes className="text-red-500" />
                      ) : (
                        <FaRegCircle className="text-gray-400" />
                      )}
                    </span>
                    <span
                      className={isCorrectAnswer ? "text-green-600" : isUserAnswer ? "text-red-600" : ""}
                    >
                      <div dangerouslySetInnerHTML={{ __html: typeof option === "string" ? option : option.text }} />
                    </span>
                  </div>
                );
              })}
            </div>
          );
        case "SAQ": // Short Answer Question
          return (
            <div className="p-4 bg-gray-100 rounded-lg">
              {Array.isArray(question.userAnswer)
                ? question.userAnswer[0]
                : typeof question.userAnswer === "string"
                ? question.userAnswer
                : JSON.stringify(question.userAnswer) || "Skipped"} {/* Safely handle object */}
            </div>
          );
        
        case "FIB": // Fill in the Blanks
          const blanks = Number(question.options?.[0]) || 0;
          return (
            <div>
              {Array.from({ length: blanks }).map((_, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg mb-2">
                  {Array.isArray(question.userAnswer) ? question.userAnswer[index] : ""}
                </div>
              ))}
            </div>
          );
        case "MTF": // Match the Following
          const correctAnswerPairs = Object.entries(question.correctAnswer as Record<string, string>);
          const userAnswerPairs = Object.entries(question.userAnswer || {});
        
          return (
            <div>
              <p className="mb-4 font-medium">Match the following:</p>
              {correctAnswerPairs.map(([key, value], index) => (
                <div key={index} className="flex space-x-4 mb-4">
                  {/* Using dangerouslySetInnerHTML for key (question side) */}
                  <div className="flex-1 p-2 rounded bg-gray-100">
                    <div dangerouslySetInnerHTML={{ __html: key }} />
                  </div>
        
                  {/* User answer, using dangerouslySetInnerHTML */}
                  <div className="flex-1 p-2 rounded bg-gray-200">
                    {userAnswerPairs[index] ? (
                      <div dangerouslySetInnerHTML={{ __html: userAnswerPairs[index][1] }} />
                    ) : (
                      ""
                    )}
                  </div>
        
                  {/* Correct answer, using dangerouslySetInnerHTML */}
                  <div className="flex-1 p-2 rounded bg-gray-300">
                    Correct: <div dangerouslySetInnerHTML={{ __html: value }} />
                  </div>
                </div>
              ))}
            </div>
          );
        
        case "ORD": // Ordering
          return (
            <ul>
              {Array.isArray(question.userAnswer) ? (
                question.userAnswer.map((option, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-lg mb-2 flex items-center justify-between">
                    {typeof option === 'string' ? option : JSON.stringify(option)} {/* Ensure it's a string */}
                  </li>
                ))
              ) : (
                <li className="p-4 bg-gray-100 rounded-lg mb-2 flex items-center justify-between">
                  {typeof question.userAnswer === 'string' 
                    ? question.userAnswer 
                    : "No answer provided"}
                </li>
              )}
            </ul>
          );
        
          case "EMQ": // Extended Matching Questions
          return (
            <div>
              {Array.isArray(question.question) &&
                question.question
                  .slice(1) // Skip the first question by slicing the array
                  .map((subQuestion, questionIndex) => (
                    <div key={questionIndex + 1} className="mb-4"> {/* Adjust key to start at 1 */}
                      <p className="font-medium" dangerouslySetInnerHTML={{ __html: subQuestion }} />
                      {question.options?.map((option, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg mb-3 ${
                            Array.isArray(question.userAnswer) && question.userAnswer.includes(String(option))
                              ? "bg-green-200"
                              : "bg-gray-100"
                          }`}
                        >
                          <div dangerouslySetInnerHTML={{ __html: String(option) }} />
                        </div>
                      ))}
                    </div>
                  ))}
            </div>
          );
        
        default:
          return <p>Unknown question type</p>;
      }
    };

    const questionSkipped = !question.userAnswer || (Array.isArray(question.userAnswer) && question.userAnswer.length === 0);

    return (
      <div 
        key={question.id} 
        className={`p-4 border rounded-lg bg-white shadow-sm ${questionSkipped ? 'bg-yellow-100' : ''}`} // Set yellow bg if skipped
      >
        <h3 className="text-lg font-semibold mb-2">
          <span className="underline">Question {index + 1}:</span> {/* Question Number */}
          <div dangerouslySetInnerHTML={{ __html: Array.isArray(question.question) ? question.question[0] : question.question }} />
        </h3>
        {renderOptions()}

        <p className={`font-semibold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
          Your answer: {Array.isArray(question.userAnswer) ? question.userAnswer.join(", ") : "Skipped"}
        </p>
        <p className="font-semibold text-green-600">
          Correct answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(", ") : "N/A"}
        </p>

        {question.explanation && (
          <p className="mt-2 text-gray-600">
            <strong>Explanation: </strong>{question.explanation}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="w-full">
        {/* Pass/Fail Message */}
        <div className="text-center mb-8">
          {passed ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaCheckCircle className="text-green-500 mx-auto mb-3" size={60} />
              <h1 className="text-4xl font-bold text-green-500">Congratulations! You Passed!</h1>
              <p className="text-gray-600 mt-2">You have successfully passed the exam.</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaTimesCircle className="text-red-500 mx-auto mb-3" size={60} />
              <h1 className="text-4xl font-bold text-red-500">Sorry, You Failed</h1>
              <p className="text-gray-600 mt-2">You did not reach the required score to pass the exam.</p>
            </div>
          )}
        </div>

        {/* User's exam Result Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-5">
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Total Questions</h3>
            <p className="text-2xl">{totalQuestions}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Correct Answers</h3>
            <p className="text-2xl text-green-500">{userQuizResult.correctCount}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Wrong Answers</h3>
            <p className="text-2xl text-red-500">{userQuizResult.wrongCount}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Skipped</h3>
            <p className="text-2xl text-gray-500">{userQuizResult.skippedCount}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Marks</h3>
            <p className="text-2xl">{userQuizResult.marks}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Time Taken</h3>
            <p className="text-2xl">{formatTimeTaken(userQuizResult.timeTaken)}</p>
          </div>
        </div>

        {/* Render Questions */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Exam Review</h2>
          <div className="grid gap-6">
            {quizData.questions.map((question, index) => renderQuestionResult(question, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
