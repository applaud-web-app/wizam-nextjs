"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaRegCircle, FaCheck, FaTimes } from "react-icons/fa";

// Option interface
interface Option {
  text: string;
  image?: string; // Optional image for options
}

// Question interface
interface Question {
  id: number;
  type: string; // "single", "multiple", "truefalse", "short", "match", "sequence", "fill", "extended"
  question: string;
  image?: string; // Optional image for the question
  options?: Option[];
  correctAnswer?: string[]; // Correct answers for the question
  explanation?: string; // Explanation for the correct answer
}

// ExamData interface
interface ExamData {
  title: string;
  questions: Question[];
  duration: string; // e.g., "30 mins"
}

// User's answer and time data interface
interface UserResult {
  answers: { [key: number]: string[] };
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  timeTaken: number;
}

// Leaderboard interface
interface LeaderboardEntry {
  username: string;
  score: number;
  timeTaken: number; // Time taken in seconds
}

const ExamResult = () => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userResult, setUserResult] = useState<UserResult | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Simulate dynamic exam data (dummy)
    const dummyExamData: ExamData = {
      title: "Advanced Quiz",
      questions: [
        {
          id: 1,
          type: "single",
          question: "Who was the first female Prime Minister of the UK?",
          correctAnswer: ["Margaret Thatcher"],
          explanation: "Margaret Thatcher was the UK's first female PM, serving from 1979 to 1990.",
          options: [
            { text: "Margaret Thatcher" },
            { text: "Angela Merkel" },
            { text: "Theresa May" },
            { text: "Indira Gandhi" },
          ],
        },
        {
          id: 2,
          type: "multiple",
          question: "Which of the following are programming languages?",
          correctAnswer: ["JavaScript", "Python"],
          explanation: "JavaScript and Python are programming languages. HTML and CSS are markup and styling languages.",
          options: [
            { text: "JavaScript" },
            { text: "HTML" },
            { text: "Python" },
            { text: "CSS" },
          ],
        },
        {
          id: 3,
          type: "truefalse",
          question: "The Earth is flat.",
          correctAnswer: ["false"],
          explanation: "The Earth is round, as proven by centuries of scientific observation.",
        },
      ],
      duration: "30 mins",
    };

    // Simulate user's answers and results (dummy)
    const dummyUserResult: UserResult = {
      answers: {
        1: ["Margaret Thatcher"],
        2: ["JavaScript", "CSS"],
        3: ["true"],
      },
      correctCount: 2, // 2 correct answers
      wrongCount: 1, // 1 wrong answer
      skippedCount: 0, // no skipped questions
      timeTaken: 1200, // 20 minutes
    };

    // Simulate leaderboard data (dummy)
    const dummyLeaderboard: LeaderboardEntry[] = [
      { username: "Alice", score: 90, timeTaken: 1100 },
      { username: "Bob", score: 85, timeTaken: 1250 },
      { username: "Charlie", score: 80, timeTaken: 1150 },
      { username: "David", score: 75, timeTaken: 1300 },
      { username: "You", score: (dummyUserResult.correctCount / dummyExamData.questions.length) * 100, timeTaken: dummyUserResult.timeTaken },
    ];

    // Set the dummy data in state
    setExamData(dummyExamData);
    setUserResult(dummyUserResult);
    setLeaderboard(dummyLeaderboard);
  }, []);

  if (!examData || !userResult) {
    return <div>Loading result...</div>;
  }

  const passingScore = 0.6; // 60% to pass
  const totalQuestions = examData.questions.length;
  const percentageCorrect = userResult.correctCount / totalQuestions;
  const passed = percentageCorrect >= passingScore;

  // Time taken in minutes and seconds
  const formatTimeTaken = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
  };

  const renderQuestionResult = (question: Question) => {
    const userAnswer = userResult.answers[question.id] || [];
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);

    return (
      <div key={question.id} className=" p-4 border rounded-lg  bg-white">
        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>

        {/* Show options with icons */}
        <div className="mb-4">
          {question.options?.map((option, index) => {
            const isUserAnswer = userAnswer.includes(option.text);
            const isCorrectAnswer = question.correctAnswer?.includes(option.text);
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

        {/* Show user's answer */}
        <p className={`font-semibold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
          Your answer: {userAnswer.join(", ") || "Skipped"}
        </p>

        {/* Show correct answer */}
        <p className="font-semibold text-green-600">
          Correct answer: {question.correctAnswer?.join(", ") || "N/A"}
        </p>

        {/* Show explanation */}
        {question.explanation && (
          <p className="mt-2 text-gray-600">
            <strong>Explanation: </strong>
            {question.explanation}
          </p>
        )}
      </div>
    );
  };

  const renderLeaderboard = () => {
    return (
      <div className="mt-10">
        <h2 className="text-3xl font-semibold mb-4">Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Rank</th>
                <th className="py-2 px-4 border">Username</th>
                <th className="py-2 px-4 border">Score</th>
                <th className="py-2 px-4 border">Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard
                .sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken)
                .map((entry, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">{entry.username}</td>
                    <td className="py-2 px-4 border">{entry.score}%</td>
                    <td className="py-2 px-4 border">{formatTimeTaken(entry.timeTaken)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="w-full">
        {/* Section 1: Pass/Fail Message */}
        <div className="text-center mb-8">
          {passed ? (
            <div className="bg-white p-6 rounded-lg ">
              <FaCheckCircle className="text-green-500 mx-auto mb-3" size={60} />
              <h1 className="text-4xl font-bold text-green-500">Congratulations! You Passed!</h1>
              <p className="text-gray-600 mt-2">You have successfully passed the exam.</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg ">
              <FaTimesCircle className="text-red-500 mx-auto mb-3" size={60} />
              <h1 className="text-4xl font-bold text-red-500">Sorry, You Failed</h1>
              <p className="text-gray-600 mt-2">You did not reach the required score to pass.</p>
            </div>
          )}
        </div>

        {/* Section 2: Analytics Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          <div className="p-6 border rounded-lg  bg-white text-center">
            <h3 className="text-xl font-semibold mb-2">Total Questions</h3>
            <p className="text-2xl">{totalQuestions}</p>
          </div>
          <div className="p-6 border rounded-lg  bg-white text-center">
            <h3 className="text-xl font-semibold mb-2">Correct Answers</h3>
            <p className="text-2xl text-green-500">{userResult.correctCount}</p>
          </div>
          <div className="p-6 border rounded-lg  bg-white text-center">
            <h3 className="text-xl font-semibold mb-2">Wrong Answers</h3>
            <p className="text-2xl text-red-500">{userResult.wrongCount}</p>
          </div>
          <div className="p-6 border rounded-lg  bg-white text-center">
            <h3 className="text-xl font-semibold mb-2">Skipped Questions</h3>
            <p className="text-2xl text-yellow-500">{userResult.skippedCount}</p>
          </div>
          <div className="p-6 border rounded-lg  bg-white text-center">
            <h3 className="text-xl font-semibold mb-2">Time Taken</h3>
            <p className="text-2xl">{formatTimeTaken(userResult.timeTaken)}</p>
          </div>
          <div className="p-6 border rounded-lg  bg-white text-center">
            <h3 className="text-xl font-semibold mb-2">Score</h3>
            <p className={`text-2xl ${passed ? "text-green-500" : "text-red-500"}`}>
              {(percentageCorrect * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Section 3: Detailed Exam Review */}
        <h2 className="text-3xl font-semibold mb-6">Exam Review</h2>
        <div className="grid grid-cols-1 gap-3">
          {examData.questions.map((question) => renderQuestionResult(question))}
        </div>

        {/* Section 4: Leaderboard */}
        {renderLeaderboard()}
      </div>
    </div>
  );
};

export default ExamResult;
