"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaArrowRight, FaArrowLeft, FaClock, FaRegSmile, FaRegFrown } from "react-icons/fa";

interface Question {
  id: number;
  question: string;
  options: { text: string }[];
}

interface ExamData {
  title: string;
  questions: Question[];
  duration: string; // e.g., "30 mins"
}

export default function PlayExam() {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds, 30 minutes)
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // Mock data for the exam
    const examMockData: ExamData = {
      title: "General Knowledge Quiz",
      questions: [
        { id: 1, question: "Who was the first female Prime Minister of the United Kingdom?", options: [{ text: "Margaret Thatcher" }, { text: "Angela Merkel" }, { text: "Theresa May" }, { text: "Indira Gandhi" }] },
        { id: 2, question: "What is the capital city of Australia?", options: [{ text: "Sydney" }, { text: "Canberra" }, { text: "Melbourne" }, { text: "Brisbane" }] },
        { id: 3, question: "Which planet is known as the Red Planet?", options: [{ text: "Mars" }, { text: "Earth" }, { text: "Jupiter" }, { text: "Saturn" }] },
        { id: 4, question: "What is the largest ocean on Earth?", options: [{ text: "Atlantic Ocean" }, { text: "Indian Ocean" }, { text: "Pacific Ocean" }, { text: "Southern Ocean" }] },
        { id: 5, question: "Who developed the theory of relativity?", options: [{ text: "Isaac Newton" }, { text: "Albert Einstein" }, { text: "Galileo Galilei" }, { text: "Niels Bohr" }] },
        { id: 6, question: "Who wrote 'Hamlet'?", options: [{ text: "Charles Dickens" }, { text: "William Shakespeare" }, { text: "Leo Tolstoy" }, { text: "Mark Twain" }] },
        { id: 7, question: "What is the smallest prime number?", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "5" }] },
        { id: 8, question: "Which is the hardest natural substance?", options: [{ text: "Gold" }, { text: "Diamond" }, { text: "Iron" }, { text: "Quartz" }] },
        { id: 9, question: "Who painted the Mona Lisa?", options: [{ text: "Vincent van Gogh" }, { text: "Leonardo da Vinci" }, { text: "Pablo Picasso" }, { text: "Claude Monet" }] },
        { id: 10, question: "Which gas is most abundant in the Earth's atmosphere?", options: [{ text: "Oxygen" }, { text: "Carbon Dioxide" }, { text: "Nitrogen" }, { text: "Hydrogen" }] }
      ],
      duration: "30 mins",
    };
    setExamData(examMockData);

    // Timer function
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (examData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const formatTimeLeft = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getSkippedCount = () => {
    return examData?.questions.length ? examData.questions.length - getAnsweredCount() : 0;
  };

  if (!examData) return <div>Loading...</div>;

  return (
    <div className="dashboard-page flex flex-col md:flex-row p-4 gap-6">
      {/* Main Exam Content */}
      <div className="flex-1 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        {!submitted ? (
          <>
            <div className="flex justify-between mb-4">
              <h3 className="text-2xl font-semibold text-primary">
                Question {currentQuestionIndex + 1}/{examData.questions.length}
              </h3>
              <FaClock className="text-primary" size={24} />
            </div>
            <p className="text-lg mb-4">{examData.questions[currentQuestionIndex].question}</p>

            <div className="space-y-4">
              {examData.questions[currentQuestionIndex].options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
                    answers[examData.questions[currentQuestionIndex].id] === option.text ? "bg-yellow-200" : "bg-gray-100"
                  } hover:bg-yellow-100`}
                >
                  <input
                    type="radio"
                    name={`question-${examData.questions[currentQuestionIndex].id}`}
                    value={option.text}
                    checked={answers[examData.questions[currentQuestionIndex].id] === option.text}
                    onChange={() => handleAnswerChange(examData.questions[currentQuestionIndex].id, option.text)}
                    className="cursor-pointer"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={currentQuestionIndex === 0}
                onClick={handlePreviousQuestion}
              >
                <FaArrowLeft className="inline mr-2" /> Previous
              </button>

              {currentQuestionIndex < examData.questions.length - 1 ? (
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  onClick={handleNextQuestion}
                >
                  Next <FaArrowRight className="inline ml-2" />
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={handleSubmit}
                >
                  Submit Exam
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-green-600">
              <FaCheckCircle className="inline mr-2" /> Exam Submitted
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for completing the exam. Your answers have been submitted successfully!
            </p>
            <button
              className="mt-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              onClick={() => window.location.reload()}
            >
              Go Back to Exam List
            </button>
          </div>
        )}
      </div>

      {/* Sidebar for Timer and Progress */}
      <div className="w-full md:w-1/3 bg-white shadow-md p-6 rounded-lg border border-gray-200">
        <div className="mb-6 text-center">
          <h3 className="text-gray-600">Time Remaining</h3>
          <p className="text-3xl text-orange-600 font-semibold">{formatTimeLeft(timeLeft)}</p>
        </div>

        {/* Answered and Skipped Count */}
        <div className="mb-6 text-center">
          <div className="flex justify-around">
            <div className="flex items-center space-x-2">
              <FaRegSmile className="text-green-500" size={20} />
              <span className="text-gray-700">Attempted: {getAnsweredCount()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRegFrown className="text-red-500" size={20} />
              <span className="text-gray-700">Skipped: {getSkippedCount()}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700 mb-2">Progress</p>
          <div className="h-2 w-full bg-gray-200 rounded-lg overflow-hidden mt-2">
            <div
              className="h-full bg-primary"
              style={{ width: `${(Object.keys(answers).length / examData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Navigation Grid */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {examData.questions.map((question, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg border cursor-pointer ${
                currentQuestionIndex === index
                  ? "bg-primary text-white"
                  : answers[question.id]
                  ? "bg-yellow-200 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
