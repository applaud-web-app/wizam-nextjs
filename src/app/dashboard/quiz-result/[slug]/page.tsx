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
  correctAnswer: string[] | string;
  userAnswer?: string[] | string;
  isCorrect?: boolean;
  explanation?: string;
  options?: Option[] | string[];
}

interface ExamData {
  title: string;
  duration: string;
  questions: Question[];
}

interface UserResult {
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

const ExamResult = ({ params }: { params: { slug: string } }) => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userResult, setUserResult] = useState<UserResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const { slug } = params;

    const fetchExams = async () => {
      try {
        const response = await axios.get(`https://wizam.awmtab.in/api/quiz-result/${slug}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        if (response.data.status) {
          const resultData = response.data;

          setExamData({
            title: resultData.quiz.title,
            duration: resultData.quiz.duration,
            questions: resultData.exam_preview.map((q: any) => ({
              id: q.question_id,
              question: q.question_text,
              correctAnswer: Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer],
              userAnswer: Array.isArray(q.user_answer) ? q.user_answer.map(String) : [q.user_answer],
              isCorrect: q.is_correct,
              options: q.question_option || [],
            })),
          });

          setUserResult({
            correctCount: parseInt(resultData.result.correct),
            wrongCount: parseInt(resultData.result.incorrect),
            skippedCount: resultData.result.skipped,
            marks: parseInt(resultData.result.marks),
            status: resultData.result.status,
            timeTaken: resultData.result.timeTaken,
          });
        } else {
          toast.error("No exams found for this category");
        }
      } catch (error) {
        toast.error("Error fetching exam results: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [params, router]);

  if (loading || !examData || !userResult) {
    return <Loader />;
  }

  const passingScore = 0.6;
  const totalQuestions = examData.questions.length;
  const percentageCorrect = userResult.correctCount / totalQuestions;
  const passed = percentageCorrect >= passingScore;

  const formatTimeTaken = (time?: number) => {
    if (!time) return "N/A";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
  };

  const renderQuestionResult = (question: Question) => {
    const isCorrect = question.isCorrect;

    const renderOptions = () => {
      if (!question.options) return null;

      switch (question.type) {
        case "MSA":
        case "MMA":
        case "TOF":
          return (
            <div className="mb-4">
              {question.options.map((option, index) => {
                const isUserAnswer = question.userAnswer?.includes(String(option)) || false;
                const isCorrectAnswer = question.correctAnswer.includes(String(option));

                return (
                  <div key={index} className="flex items-center mb-2">
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
        case "SAQ":
          return (
            <div className="p-4 bg-gray-100 rounded-lg">
              {Array.isArray(question.userAnswer) ? question.userAnswer[0] : question.userAnswer || "Skipped"}
            </div>
          );
        case "FIB":
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
        case "MTF":
          return (
            <div>
              <p className="mb-4 font-medium">Match the following:</p>
              {question.options?.slice(0, question.options.length / 2).map((opt, i) => (
                <div key={i} className="flex space-x-4 mb-4">
                  <p className="flex-1 p-2 rounded bg-gray-100">{typeof opt === "string" ? opt : opt.text}</p>
                  <div className="flex-1 p-2 rounded bg-gray-200">{question.userAnswer?.[i] || ""}</div>
                </div>
              ))}
            </div>
          );
        case "ORD":
          return (
            <ul>
              {Array.isArray(question.userAnswer) ? (
                question.userAnswer.map((option, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-lg mb-2 flex items-center justify-between">
                    {option}
                  </li>
                ))
              ) : (
                <li className="p-4 bg-gray-100 rounded-lg mb-2 flex items-center justify-between">
                  {question.userAnswer || "No answer provided"}
                </li>
              )}
            </ul>
          );
        case "EMQ":
          return (
            <div>
              {Array.isArray(question.question) &&
                question.question.map((subQuestion, questionIndex) => (
                  <div key={questionIndex} className="mb-4">
                    <p className="font-medium" dangerouslySetInnerHTML={{ __html: subQuestion }} />
                    {question.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg mb-3 ${
                          question.userAnswer?.includes(String(option)) ? "bg-green-200" : "bg-gray-100"
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

    return (
      <div key={question.id} className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          {Array.isArray(question.question) ? question.question[0] : question.question}
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
              <p className="text-gray-600 mt-2">You did not reach the required score to pass.</p>
            </div>
          )}
        </div>

        {/* User's Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Total Questions</h3>
            <p className="text-2xl">{totalQuestions}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Correct Answers</h3>
            <p className="text-2xl text-green-500">{userResult.correctCount}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Wrong Answers</h3>
            <p className="text-2xl text-red-500">{userResult.wrongCount}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Skipped</h3>
            <p className="text-2xl text-gray-500">{userResult.skippedCount}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Marks</h3>
            <p className="text-2xl">{userResult.marks}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Time Taken</h3>
            <p className="text-2xl">{formatTimeTaken(userResult.timeTaken)}</p>
          </div>
        </div>

        {/* Render Questions */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Exam Review</h2>
          <div className="grid gap-6">{examData.questions.map((question) => renderQuestionResult(question))}</div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
