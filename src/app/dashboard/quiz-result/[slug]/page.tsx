"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaCheck, FaTimes, FaRegCircle } from "react-icons/fa"; // Icons
import axios from 'axios'; // For API calls
import { toast } from 'react-toastify'; // Optional: For notifications
import Cookies from 'js-cookie'; // For cookies
import { useRouter } from "next/navigation"; // For navigation
import Loader from '@/components/Common/Loader'; // Custom Loader (if you have one)

// Interfaces
interface Option {
  text: string;
  image?: string; // Optional image for options
}

interface Question {
  id: number;
  type: string; // E.g., "single", "multiple", "truefalse", etc.
  question: string;
  correctAnswer: string[];
  userAnswer?: string[];
  isCorrect?: boolean;
  explanation?: string;
  options?: Option[];
}

interface ExamData {
  title: string;
  duration: string; // E.g., "30 mins"
  questions: Question[];
}

interface UserResult {
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  status: string;
  timeTaken?: number; // Optional field for time taken
}

interface LeaderboardEntry {
  username: string;
  score: number;
  status: string; // "PASS" or "FAIL"
}

const ExamResult = ({ params }: { params: { slug: string } }) => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userResult, setUserResult] = useState<UserResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // For navigation

  useEffect(() => {
    const { slug } = params;

    const fetchExams = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-result/${slug}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // Replace with actual auth token
          },
        });

        if (response.data.status) {
          const resultData = response.data;

          // Map the exam and user result data from API response
          setExamData({
            title: "resultData.quiz.title",
            duration: "resultData.quiz.duration",
            questions: resultData.exam_preview.map((q: any) => ({
              id: q.question_id,
              question: q.question_text,
              correctAnswer: q.correct_answer,
              userAnswer: q.user_answer,
              isCorrect: q.is_correct,
              options: q.options || [], // Ensure options are optional
              explanation: q.explanation, // If explanation is provided
            })),
          });

          setUserResult({
            correctCount: parseInt(resultData.result.correct),
            wrongCount: parseInt(resultData.result.incorrect),
            skippedCount: resultData.result.skipped,
            status: resultData.result.status,
            timeTaken: resultData.result.timeTaken, // Add time taken if available
          });

          // Map leaderboard data
          setLeaderboard(resultData.leaderBoard.map((entry: any) => ({
            username: entry.username,
            score: entry.score,
            status: entry.status,
          })));
        } else {
          toast.error('No exams found for this category');
        //   router.push('/dashboard/all-exams');
        }
      } catch (error) {
        toast.error('Error fetching exam results : ' + error);
        // router.push('/dashboard/all-exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [params, router]);

  if (loading || !examData || !userResult) {
    return <Loader />;
  }

  // Calculate whether the user passed the exam
  const passingScore = 0.6; // 60% passing criteria
  const totalQuestions = examData.questions.length;
  const percentageCorrect = userResult.correctCount / totalQuestions;
  const passed = percentageCorrect >= passingScore;

  // Helper function to format time
  const formatTimeTaken = (time?: number) => {
    if (!time) return "N/A";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Render each question result
  const renderQuestionResult = (question: Question) => {
    const isCorrect = question.isCorrect;

    return (
      <div key={question.id} className="p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2" dangerouslySetInnerHTML={{ __html: question.question }}></h3>
        
        {/* Render options if available */}
        {question.options && (
          <div className="mb-4">
            {question.options.map((option, index) => {
              const isUserAnswer = question.userAnswer?.includes(option.text) || false;
              const isCorrectAnswer = question.correctAnswer.includes(option.text);

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
                  <span className={isCorrectAnswer ? "text-green-600" : isUserAnswer ? "text-red-600" : ""}>
                    {option.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* User's Answer and Correct Answer */}
        <p className={`font-semibold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
          {/* Your answer: {question.userAnswer?.join(", ") || "Skipped"} */}
          {question.userAnswer}
        </p>
        <p className="font-semibold text-green-600">
          {/* Correct answer: {question.correctAnswer.join(", ")} */}
          Correct answer: {question.correctAnswer}
        </p>

        {/* Explanation if available */}
        {question.explanation && (
          <p className="mt-2 text-gray-600">
            <strong>Explanation: </strong>{question.explanation}
          </p>
        )}
      </div>
    );
  };

  // Render the leaderboard
  const renderLeaderboard = () => (
    <div className="mt-10">
      <h2 className="text-3xl font-semibold mb-4">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3 px-6 border-b">Rank</th>
              <th className="py-3 px-6 border-b">Username</th>
              <th className="py-3 px-6 border-b">Score</th>
              <th className="py-3 px-6 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard
              .sort((a, b) => b.score - a.score)
              .map((entry, index) => (
                <tr
                  key={index}
                  className={`${
                    entry.username === "You"
                      ? "bg-blue-100 text-primary font-bold"
                      : index % 2 === 0
                      ? "bg-gray-100"
                      : "bg-white"
                  } text-center`}
                >
                  <td className="py-3 px-6 border-b">{index + 1}</td>
                  <td className="py-3 px-6 border-b">{entry.username}</td>
                  <td className="py-3 px-6 border-b">{entry.score}%</td>
                  <td className="py-3 px-6 border-b">{entry.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
            <h3 className="text-xl font-semibold mb-2">Time Taken</h3>
            <p className="text-2xl">{formatTimeTaken(userResult.timeTaken)}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Status</h3>
            <p className="text-2xl">{userResult.status}</p>
          </div>
        </div>

        {/* Render Questions */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Exam Review</h2>
          <div className="grid gap-6">
            {examData.questions.map((question) => renderQuestionResult(question))}
          </div>
        </div>

        {/* Render Leaderboard */}
        {leaderboard.length > 0 && renderLeaderboard()}
      </div>
    </div>
  );
};

export default ExamResult;
