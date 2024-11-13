"use client";

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCheck,
  FaTimes,
  FaRegCircle,
  FaRibbon,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Common/Loader";
import Link from "next/link";
import ExamReportGenerator from "@/components/ReportCardGenerator";

// TypeScript interfaces
interface Option {
  text: string;
  image?: string;
}

interface Question {
  id: number;
  type: string;
  question: string | string[];
  correctAnswer: string | string[] | Record<string, string>;
  userAnswer?: string | number | string[] | Record<string, string>;
  isCorrect?: boolean;
  explanation?: string;
  options?: (Option | string)[];
}

interface QuizData {
  title: string;
  duration: string;
  questions: Question[];
}

interface UserExamResult {
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  status: string;
  marks: number;
  timeTaken?: number;
  uuid: string;
  download_report: number;

}

interface LeaderboardEntry {
  username: string;
  score: number;
  status: string;
}

interface ExamResultProps {
  params: {
    slug: string;
  };
}

const ExamResult = ({ params }: ExamResultProps) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userExamResult, setUserExamResult] = useState<UserExamResult | null>(
    null
  );
  const [leaderBoard, setLeaderBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const { slug } = params;

    const fetchExamResults = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exam-result/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );

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

          setUserExamResult({
            correctCount: parseInt(resultData.result.correct),
            wrongCount: parseInt(resultData.result.incorrect),
            skippedCount: resultData.result.skipped,
            marks: parseInt(resultData.result.marks),
            status: resultData.result.status,
            timeTaken: resultData.result.timeTaken,
            uuid: resultData.result.uuid,
            download_report: resultData.exam.download_report, 

          });

          setLeaderBoard(resultData.leaderBoard || []);
        } else {
          toast.error("No Exam results found for this category");
        }
      } catch (error) {
        toast.error("Error fetching Exam results: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, [params, router]);

  if (loading || !quizData || !userExamResult) {
    return <Loader />;
  }

  const passingScore = 0.6;
  const totalQuestions = quizData.questions.length;
  const percentageCorrect = userExamResult.correctCount / totalQuestions;
  const passed = percentageCorrect >= passingScore;

  const formatTimeTaken = (timeInMinutes?: number) => {
    if (!timeInMinutes) return "N/A";
    return `${timeInMinutes} min`;
  };

  const renderOptions = (question: Question) => {
    const correctAnswerDisplay =
      typeof question.correctAnswer === "object" &&
      !Array.isArray(question.correctAnswer)
        ? Object.entries(question.correctAnswer)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : Array.isArray(question.correctAnswer)
        ? question.correctAnswer.join(", ")
        : question.correctAnswer || "N/A";

    const userAnswerDisplay =
      typeof question.userAnswer === "object" &&
      !Array.isArray(question.userAnswer)
        ? Object.entries(question.userAnswer)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : Array.isArray(question.userAnswer)
        ? question.userAnswer.join(", ")
        : question.userAnswer || "Skipped";

    switch (question.type) {
      case "MSA": // Multiple Single Answer
      case "MMA": // Multiple Match Answer
      case "TOF": // True or False
        return (
          <div className="mb-4">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-md mb-2 ${
                  typeof question.correctAnswer === "string" &&
                  parseInt(question.correctAnswer) - 1 === index
                    ? "bg-green-100"
                    : typeof question.userAnswer === "number" &&
                      question.userAnswer - 1 === index
                    ? "bg-red-100"
                    : "bg-gray-100"
                }`}
              >
                <span className="mr-2">
                  {typeof question.correctAnswer === "string" &&
                  parseInt(question.correctAnswer) - 1 === index ? (
                    <FaCheck className="text-green-500" />
                  ) : typeof question.userAnswer === "number" &&
                    question.userAnswer - 1 === index ? (
                    <FaTimes className="text-red-500" />
                  ) : (
                    <FaRegCircle className="text-gray-400" />
                  )}
                </span>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof option === "string"
                        ? option
                        : (option as Option).text,
                  }}
                />
              </div>
            ))}
            <p className="font-semibold text-red-500">
              Your answer:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: userAnswerDisplay,
                }}
              />
            </p>
            <p className="font-semibold text-green-600">
              Correct answer:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: correctAnswerDisplay,
                }}
              />
            </p>
          </div>
        );

      case "FIB": // Fill in the Blanks
        const blanks = Number(question.options?.[0]) || 0;
        return (
          <div>
            {Array.from({ length: blanks }).map((_, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg mb-2">
                <p className="font-semibold">
                  {Array.isArray(question.userAnswer)
                    ? `Your Answer: ${question.userAnswer[index] || "Skipped"}`
                    : "Skipped"}
                </p>
                <p className="text-sm text-green-600">
                  Correct:{" "}
                  {Array.isArray(question.correctAnswer)
                    ? question.correctAnswer[index] || "N/A"
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        );

        case "MTF": // Match the Following
        const correctAnswerPairs = Object.entries(
          question.correctAnswer as Record<string, string>
        );
        const userAnswerPairs = Object.entries(
          (question.userAnswer as Record<string, string>) || {}
        );
      
        return (
          <div>
            <p className="mb-4 font-medium">Match the following:</p>
            {correctAnswerPairs.map(([key, correctValue], index) => (
              <div key={index} className="flex space-x-4 mb-4">
                <div className="flex-1 p-2 rounded bg-gray-100">
                  <div dangerouslySetInnerHTML={{ __html: key }} />
                </div>
      
                <div className="flex-1 p-2 rounded bg-gray-200">
                  {userAnswerPairs[index] ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: userAnswerPairs[index][1],
                      }}
                    />
                  ) : (
                    <p className="text-red-500">No answer</p>
                  )}
                </div>
      
                <div className="flex-1 p-2 rounded bg-gray-300">
                  Correct: <div dangerouslySetInnerHTML={{ __html: correctValue }} />
                </div>
              </div>
            ))}
            
            {/* Your Answer Section */}
            <div className="mt-4">
              <h4 className="font-semibold">Your Answers:</h4>
              <ul>
                {userAnswerPairs.map(([key, userAnswer]) => (
                  <li key={key} className="text-red-600 flex space-x-3">
                    {`${key}: `}
                    <span dangerouslySetInnerHTML={{ __html: userAnswer }} />
                  </li>
                ))}
              </ul>
            </div>
      
            {/* Correct Answer Section */}
            <div className="mt-4">
              <h4 className="font-semibold">Correct Answers:</h4>
              <ul>
                {correctAnswerPairs.map(([key, correctAnswer]) => (
                  <li key={key} className="text-green-600 flex space-x-3">
                    {`${key}: `}
                    <span dangerouslySetInnerHTML={{ __html: correctAnswer }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case "SAQ": // Short Answer Question
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="font-semibold">
              Your Answer:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: userAnswerDisplay,
                }}
              />
            </p>
            <p className="text-green-600">
              Correct Answer:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: correctAnswerDisplay,
                }}
              />
            </p>
          </div>
        );

        case "ORD": // Ordering
        return (
          <div>
            <ul>
              {Array.isArray(question.userAnswer) ? (
                question.userAnswer.map((answerIndex:any, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-100 rounded-lg mb-2 flex items-center justify-between"
                  >
                    {/* Display the text corresponding to user answer using dangerouslySetInnerHTML */}
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          question.options && typeof question.options[answerIndex] === "string"
                            ? question.options[answerIndex] // Show text from options if available
                            : "No answer provided",
                      }}
                    />
      
                    {/* Show correct answer if available using dangerouslySetInnerHTML */}
                    {Array.isArray(question.correctAnswer) && index < question.correctAnswer.length ? (
                        <span
                          className="text-green-600"
                          dangerouslySetInnerHTML={{
                            __html:
                              question.options &&
                              // Ensure the index is a number before accessing options
                              typeof question.correctAnswer[index] === "number" &&
                              typeof question.options[question.correctAnswer[index] as number] === "string"
                                ? (question.options[question.correctAnswer[index] as number] as string) // Cast to string
                                : "No correct answer available",
                          }}
                        />
                      ) : null}


                  </li>
                ))
              ) : (
                <li className="p-4 bg-gray-100 rounded-lg mb-2 flex items-center justify-between">
                  {typeof question.userAnswer === "string"
                    ? question.userAnswer
                    : "No answer provided"}
                </li>
              )}
            </ul>
      
            {/* Display User's and Correct Answers */}
            <div className="mt-4">
              <div className="flex">
                <p className="font-semibold mr-3">Your Answers:</p>
                <ul className="flex space-x-3">
                  {Array.isArray(question.userAnswer) ? (
                    question.userAnswer.map((answerIndex:any, index) => (
                      <li key={index} className="text-red-600 flex space-x-3">
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              question.options && typeof question.options[answerIndex] === "string"
                                ? question.options[answerIndex]
                                : "No answer available",
                          }}
                        />
                        ,
                      </li>
                    ))
                  ) : (
                    <li>{typeof question.userAnswer === "string" ? question.userAnswer : "No answer provided"}</li>
                  )}
                </ul>
              </div>
      
              <div className="flex">
                <p className="font-semibold mr-3">Correct Answers:</p>
                <ul className="flex space-x-3">
                  {Array.isArray(question.correctAnswer) ? (
                    question.correctAnswer.map((correctIndex:any, index) => (
                      <li key={index} className="text-green-600 flex space-x-3">
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              question.options && typeof question.options[correctIndex] === "string"
                                ? question.options[correctIndex]
                                : "No correct answer available",
                          }}
                        />
                        ,
                      </li>
                    ))
                  ) : (
                    <li>{typeof question.correctAnswer === "string" ? question.correctAnswer : "No correct answer available"}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        );
      
      
      
      

        case "EMQ": // Extended Matching Questions
        return (
          <div>
            {Array.isArray(question.question) &&
              question.question
                .slice(1) // Skip the first item (main question)
                .map((subQuestion, questionIndex) => (
                  <div key={questionIndex + 1} className="mb-4">
                    <p
                      className="font-medium"
                      dangerouslySetInnerHTML={{ __html: subQuestion }}
                    />
      
                    {/* Render options for the current sub-question */}
                    {question.options?.map((option, index) => {
                      // Initialize userAnswerIndex and correctAnswerIndex
                      let userAnswerIndex: number | null = null; // Explicitly define as number | null
                      let correctAnswerIndex: number | null = null; // Explicitly define as number | null
      
                      // Check if userAnswer is an array and get the relevant index
                      if (Array.isArray(question.userAnswer)) {
                        const userAnswer = question.userAnswer[questionIndex]; // Get user answer
      
                        // Convert userAnswer to a number if it's a string
                        userAnswerIndex = typeof userAnswer === 'string' ? Number(userAnswer) : userAnswer;
                      } else if (typeof question.userAnswer === 'number') {
                        userAnswerIndex = question.userAnswer; // If it's a single number
                      }
      
                      // Check if correctAnswer is an array and get the relevant index
                      if (Array.isArray(question.correctAnswer)) {
                        const answer = question.correctAnswer[questionIndex]; // Get the correct answer
      
                        // Convert correct answer to number if it's a string
                        correctAnswerIndex = typeof answer === 'string' ? Number(answer) : answer;
                      } else if (typeof question.correctAnswer === 'number') {
                        correctAnswerIndex = question.correctAnswer; // If it's a single number
                      }
      
                      // Check if this option is the user's answer
                      const isUserAnswer = userAnswerIndex === index + 1; // Convert index to 1-based
      
                      // Ensure correctAnswerIndex is a number before comparison
                      const isCorrectAnswer = correctAnswerIndex === index + 1; // Convert index to 1-based
      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg mb-3 ${
                            isCorrectAnswer
                              ? "bg-green-200" // Highlight correct answers
                              : isUserAnswer
                              ? "bg-red-200" // Highlight user answers
                              : "bg-gray-100"
                          }`}
                        >
                          <div dangerouslySetInnerHTML={{ __html: String(option) }} />
                          {isUserAnswer && (
                            <p className="text-red-600">
                              <strong>Your Answer</strong>
                            </p>
                          )}
                          {isCorrectAnswer && (
                            <p className="text-green-600">
                              <strong>Correct Answer</strong>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
          </div>
        );   

      default:
        return <p>Unknown question type</p>;
    }
  };

  const renderQuestionResult = (question: Question, index: number) => {
    return (
      <div
      key={question.id}
      className={`p-4 border rounded-lg bg-white shadow-sm ${
        !question.userAnswer || 
        (Array.isArray(question.userAnswer) && question.userAnswer.length === 0)
          ? "bg-yellow-50"
          : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">
        <span className="underline">Question {index + 1}:</span>{" "}
        <div
          dangerouslySetInnerHTML={{
            __html: Array.isArray(question.question)
              ? question.question[0]
              : question.question,
          }}
        />
      </h3>
      {renderOptions(question)}
    </div>
    );
  };

  // Render Leaderboard and Question Results
  return (
    <div className="dashboard-page">
      <div className="w-full">
        {/* Pass/Fail Message */}
        <div className="text-center mb-8">
          {passed ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaCheckCircle className="text-green-500 mx-auto mb-3" size={60} />
              <h1 className="text-4xl font-bold text-green-500">
                Congratulations! You Passed!
              </h1>
              <p className="text-gray-600 mt-2">
                You have successfully passed the exam.
              </p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FaTimesCircle className="text-red-500 mx-auto mb-3" size={60} />
              <h1 className="text-4xl font-bold text-red-500">
                Sorry, You Failed
              </h1>
              <p className="text-gray-600 mt-2">
                You did not reach the required score to pass the exam.
              </p>
            </div>
          )}
        </div>

        {/* User's exam Result Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mb-5">
          <ResultCard title="Total Questions" value={totalQuestions} />
          <ResultCard
            title="Correct Answers"
            value={userExamResult.correctCount}
            color="green"
          />
          <ResultCard
            title="Wrong Answers"
            value={userExamResult.wrongCount}
            color="red"
          />
          <ResultCard
            title="Skipped"
            value={userExamResult.skippedCount}
            color="gray"
          />
          <ResultCard title="Marks" value={userExamResult.marks} />
          <ResultCard
            title="Time Taken"
            value={formatTimeTaken(userExamResult.timeTaken)}
          />
        </div>

        {/* Render Questions */}
        <div className="mb-8">
          <div className="flex justify-between">
              <h2 className="text-3xl font-semibold mb-4">Exam Review</h2>
             
              {/* Check if download_report is enabled */}
                {userExamResult?.download_report === 1 && (
                  <ExamReportGenerator uuid={userExamResult.uuid} />
                )}
          </div>
          
          <div className="grid gap-6">
            {quizData.questions.map((question, index) =>
              renderQuestionResult(question, index)
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-8 bg-white shadow-sm p-3 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          {leaderBoard.length > 0 ? (
            <LeaderboardTable entries={leaderBoard} />
          ) : (
            <p>No leaderboard data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ResultCard = ({
  title,
  value,
  color = "default",
}: {
  title: string;
  value: string | number;
  color?: string;
}) => {
  const textColorClass =
    color === "green" ? "text-green-500" : color === "red" ? "text-red-500" : "text-gray-500";
  return (
    <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`text-2xl ${textColorClass}`}>{value}</p>
    </div>
  );
};

const LeaderboardTable = ({ entries }: { entries: LeaderboardEntry[] }) => {
  return (
    <div className="overflow-x-auto">
    <table className="min-w-full table-auto whitespace-nowrap">
      <thead className="bg-defaultcolor text-white">
        <tr>
          <th className="py-3 px-6 text-left">S.No</th>
          <th className="py-3 px-6 text-left">Username</th>
          <th className="py-3 px-6 text-left">Score</th>
          <th className="py-3 px-6 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr
            key={index}
            className={`border-b transition duration-300 ${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            } hover:bg-gray-200`}
          >
            <td className="py-3 px-6">{index + 1}</td>
            <td className="py-3 px-6">{entry.username}</td>
            <td className="py-3 px-6">{entry.score}</td>
            <td className="py-3 px-6">
              {entry.status === "PASS" ? (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-200 rounded-full">
                  Passed
                </span> // Badge for Passed status
              ) : (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-red-700 bg-red-200 rounded-full">
                  Failed
                </span> // Badge for Failed status
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    

  );
};

export default ExamResult;
