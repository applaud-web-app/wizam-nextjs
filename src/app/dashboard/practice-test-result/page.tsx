"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaRegCircle, FaCheck, FaTimes } from "react-icons/fa";

// Option interface
interface Option {
  text: string;
  image?: string;
}

// Question interface
interface Question {
  id: number;
  type: string;
  question: string;
  image?: string;
  options?: Option[];
  correctAnswer?: string[];
  explanation?: string;
}

// PracticeData interface
interface PracticeData {
  title: string;
  questions: Question[];
  duration: string;
}

// User's answer and time data interface
interface UserResult {
  answers: { [key: number]: string[] };
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  timeTaken: number;
}

const PracticeResult = () => {
  const [practiceData, setPracticeData] = useState<PracticeData | null>(null);
  const [userResult, setUserResult] = useState<UserResult | null>(null);

  useEffect(() => {
    // Simulate dynamic practice data (dummy)
    const dummyPracticeData: PracticeData = {
      title: "Practice Test: Programming Languages",
      questions: [
        {
          id: 1,
          type: "single",
          question: "Which language is used for web development?",
          correctAnswer: ["JavaScript"],
          explanation: "JavaScript is primarily used for web development.",
          options: [
            { text: "Python" },
            { text: "Java" },
            { text: "JavaScript" },
            { text: "C++" },
          ],
        },
        {
          id: 2,
          type: "multiple",
          question: "Which of the following are scripting languages?",
          correctAnswer: ["JavaScript", "Python"],
          explanation: "JavaScript and Python are considered scripting languages.",
          options: [
            { text: "JavaScript" },
            { text: "Java" },
            { text: "Python" },
            { text: "C++" },
          ],
        },
      ],
      duration: "15 mins",
    };

    // Simulate user's answers and results (dummy)
    const dummyUserResult: UserResult = {
      answers: {
        1: ["JavaScript"],
        2: ["JavaScript", "Java"],
      },
      correctCount: 1,
      wrongCount: 1,
      skippedCount: 0,
      timeTaken: 800, // 13 minutes and 20 seconds
    };

    setPracticeData(dummyPracticeData);
    setUserResult(dummyUserResult);
  }, []);

  if (!practiceData || !userResult) {
    return <div>Loading result...</div>;
  }

  const totalQuestions = practiceData.questions.length;
  const percentageCorrect = (userResult.correctCount / totalQuestions) * 100;

  const formatTimeTaken = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
  };

  const renderQuestionResult = (question: Question) => {
    const userAnswer = userResult.answers[question.id] || [];
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);

    return (
      <div key={question.id} className="p-4 border rounded-lg bg-white shadow-sm">
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

  return (
    <div className="dashboard-page">
      <div className="w-full">
        {/* Section 1: Summary */}
        <div className="text-center mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FaCheckCircle className="text-green-500 mx-auto mb-3" size={60} />
            <h1 className="text-4xl font-bold">Practice Test Results</h1>
            <p className="text-gray-600 mt-2">
              You have completed the practice test. Review your answers below.
            </p>
          </div>
        </div>

        {/* Section 2: Analytics Card */}
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
            <h3 className="text-xl font-semibold mb-2">Skipped Questions</h3>
            <p className="text-2xl text-yellow-500">{userResult.skippedCount}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Time Taken</h3>
            <p className="text-2xl">{formatTimeTaken(userResult.timeTaken)}</p>
          </div>
          <div className="p-6 border rounded-lg bg-white text-center shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Score</h3>
            <p className="text-2xl text-green-500">{percentageCorrect.toFixed(2)}%</p>
          </div>
        </div>

        {/* Section 3: Detailed Review */}
        <h2 className="text-3xl font-semibold mb-6">Practice Test Review</h2>
        <div className="grid grid-cols-1 gap-3">
          {practiceData.questions.map((question) => renderQuestionResult(question))}
        </div>
      </div>
    </div>
  );
};

export default PracticeResult;
