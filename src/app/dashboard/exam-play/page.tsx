"use client";

import Loader from "@/components/Common/Loader";
import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaClock,
  FaRegSmile,
  FaRegFrown,
} from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Option {
  text: string;
  image?: string; // Optional image for options
}

interface Question {
  id: number;
  type: string; // "single", "multiple", "truefalse", "short", "match", "sequence", "fill", "extended"
  question: string;
  image?: string; // Optional image for the question
  options?: Option[];
  correctAnswers?: string[];
  blanks?: { position: number; value?: string }[]; // for fill in the blanks
}

interface ExamData {
  title: string;
  questions: Question[];
  duration: string; // e.g., "30 mins"
}

export default function PlayExam() {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds, 30 minutes)
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // Mock data for the exam with different question types
    const examMockData: ExamData = {
      title: "Advanced Quiz",
      questions: [
        {
          id: 1,
          type: "single",
          question:
            "Who was the first female Prime Minister of the United Kingdom?",
          image:
            "https://media.licdn.com/dms/image/D4E12AQG0hyhZmq0AyQ/article-cover_image-shrink_600_2000/0/1700488940348?e=2147483647&v=beta&t=eZtDe_xSbm65L-mR1tnM8vnfMpM3aWcSe8rw8o7sjSs", // Example image URL
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
          options: [
            {
              text: "JavaScript",
              image:
                "https://media.licdn.com/dms/image/D4E12AQG0hyhZmq0AyQ/article-cover_image-shrink_600_2000/0/1700488940348?e=2147483647&v=beta&t=eZtDe_xSbm65L-mR1tnM8vnfMpM3aWcSe8rw8o7sjSs",
            }, // Example image for an option
            { text: "HTML" },
            { text: "Python" },
            { text: "CSS" },
          ],
        },
        {
          id: 3,
          type: "truefalse",
          question: "The earth is flat.",
        },
        {
          id: 4,
          type: "short",
          question: "What is the capital of Australia?",
        },
        {
          id: 5,
          type: "match",
          question: "Match the following animals to their sounds:",
          options: [
            {
              text: "Dog",
              image:
                "https://media.licdn.com/dms/image/D4E12AQG0hyhZmq0AyQ/article-cover_image-shrink_600_2000/0/1700488940348?e=2147483647&v=beta&t=eZtDe_xSbm65L-mR1tnM8vnfMpM3aWcSe8rw8o7sjSs",
            },
            { text: "Cat" },
            { text: "Cow" },
            { text: "Bark" },
            { text: "Meow" },
            { text: "Moo" },
          ],
        },
        {
          id: 6,
          type: "sequence",
          question:
            "Arrange the following planets by size (smallest to largest):",
          options: [
            { text: "Mercury" },
            { text: "Earth" },
            { text: "Mars" },
            { text: "Jupiter" },
          ],
        },
        {
          id: 7,
          type: "fill",
          question: "The capital of France is _____.",
          blanks: [{ position: 1 }],
        },
        {
          id: 8,
          type: "extended",
          question: "Explain the theory of relativity in brief.",
        },
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

  const handleAnswerChange = (questionId: number, answer: string[]) => {
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
    return examData?.questions.length
      ? examData.questions.length - getAnsweredCount()
      : 0;
  };

  const onDragEnd = (result: any, questionId: number) => {
    if (!result.destination) return;
    const currentAnswers = [...(answers[questionId] || [])];
    const [reorderedItem] = currentAnswers.splice(result.source.index, 1);
    currentAnswers.splice(result.destination.index, 0, reorderedItem);
    handleAnswerChange(questionId, currentAnswers);
  };

  const renderQuestion = (question: Question) => {
    return (
      <div>
        {/* Render question image if available */}
        {question.image && (
          <img
            src={question.image}
            alt="Question related"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <p className="text-lg mb-4">{question.question}</p>

        {/* Render based on question type */}
        {(() => {
          switch (question.type) {
            case "single":
              return question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all mb-3 ${
                    answers[question.id]?.includes(option.text)
                      ? "bg-yellow-200"
                      : "bg-gray-100"
                  } hover:bg-yellow-100`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.text}
                    checked={answers[question.id]?.includes(option.text)}
                    onChange={() =>
                      handleAnswerChange(question.id, [option.text])
                    }
                    className="cursor-pointer"
                  />
                  {/* Render option image if available */}
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.text}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  )}
                  <span>{option.text}</span>
                </label>
              ));

            case "multiple":
              return question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all mb-3 ${
                    answers[question.id]?.includes(option.text)
                      ? "bg-yellow-200"
                      : "bg-gray-100"
                  } hover:bg-yellow-100`}
                >
                  <input
                    type="checkbox"
                    name={`question-${question.id}`}
                    value={option.text}
                    checked={answers[question.id]?.includes(option.text)}
                    onChange={() => {
                      const currentAnswers = answers[question.id] || [];
                      const newAnswers = currentAnswers.includes(option.text)
                        ? currentAnswers.filter((a) => a !== option.text)
                        : [...currentAnswers, option.text];
                      handleAnswerChange(question.id, newAnswers);
                    }}
                    className="cursor-pointer"
                  />
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.text}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  )}
                  <span>{option.text}</span>
                </label>
              ));

            case "truefalse":
              return (
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all bg-gray-100 hover:bg-yellow-100">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="true"
                      checked={answers[question.id]?.includes("true")}
                      onChange={() =>
                        handleAnswerChange(question.id, ["true"])
                      }
                      className="cursor-pointer"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all bg-gray-100 hover:bg-yellow-100">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="false"
                      checked={answers[question.id]?.includes("false")}
                      onChange={() =>
                        handleAnswerChange(question.id, ["false"])
                      }
                      className="cursor-pointer"
                    />
                    <span>False</span>
                  </label>
                </div>
              );

            case "short":
              return (
                <input
                  type="text"
                  className="w-full p-4 rounded-lg border border-gray-300"
                  placeholder="Type your answer here..."
                  value={answers[question.id]?.[0] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, [e.target.value])
                  }
                />
              );

            case "match":
              return (
                <div>
                  <p className="mb-4">Match the following:</p>
                  {question.options?.slice(0, 3).map((opt, i) => (
                    <div key={i} className="flex space-x-4 mb-4">
                      <p className="flex-1 p-2 rounded bg-gray-100">
                        {opt.text}
                      </p>
                      <select
                        className="flex-1 p-2 rounded border border-gray-300"
                        onChange={(e) =>
                          handleAnswerChange(question.id, [e.target.value])
                        }
                      >
                        {question.options?.slice(3).map((match, i) => (
                          <option key={i} value={match.text}>
                            {match.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              );

            case "sequence":
              return (
                <div>
                  <p className="mb-4">Arrange in sequence (Drag and Drop):</p>
                  <DragDropContext
                    onDragEnd={(result:any) => onDragEnd(result, question.id)}
                  >
                    <Droppable droppableId="sequence">
                      {(provided:any) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {answers[question.id]?.map((option, index) => (
                            <Draggable
                              key={option}
                              draggableId={option}
                              index={index}
                            >
                              {(provided:any) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
                                >
                                  <span>{option}</span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              );

            case "fill":
              return (
                <div>
                  {question.blanks?.map((blank, index) => (
                    <input
                      key={index}
                      type="text"
                      className="p-4 rounded-lg border border-gray-300 w-full mb-2"
                      placeholder="Type your answer here..."
                      value={answers[question.id]?.[index] || ""}
                      onChange={(e) => {
                        const newAnswers = answers[question.id] || [];
                        newAnswers[index] = e.target.value;
                        handleAnswerChange(question.id, newAnswers);
                      }}
                    />
                  ))}
                </div>
              );

            case "extended":
              return (
                <textarea
                  className="w-full p-4 rounded-lg border border-gray-300"
                  rows={6}
                  placeholder="Write your answer..."
                  value={answers[question.id]?.[0] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, [e.target.value])
                  }
                />
              );

            default:
              return <div>Unknown question type</div>;
          }
        })()}
      </div>
    );
  };

  if (!examData) return <Loader />;

  return (
    <div className="dashboard-page flex flex-col md:flex-row gap-6">
      {/* Main Exam Content */}
      <div className="flex-1 lg:p-6 bg-white rounded-lg shadow-sm p-4 ">
        {!submitted ? (
          <>
            <div className="flex justify-between mb-4">
              <h3 className="text-2xl font-semibold text-primary">
                Question {currentQuestionIndex + 1}/{examData.questions.length}
              </h3>
              <FaClock className="text-primary" size={24} />
            </div>

            {/* Render question based on type */}
            <div className="space-y-4">
              {renderQuestion(examData.questions[currentQuestionIndex])}
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
              Thank you for completing the exam. Your answers have been
              submitted successfully!
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
      <div className="w-full md:w-1/3 bg-white shadow-sm p-4 lg:p-6 rounded-lg ">
        <div className="mb-6 text-center">
          <h3 className="text-gray-600">Time Remaining</h3>
          <p className="text-3xl text-orange-600 font-semibold">
            {formatTimeLeft(timeLeft)}
          </p>
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
              style={{
                width: `${
                  (Object.keys(answers).length / examData.questions.length) *
                  100
                }%`,
              }}
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
