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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

// Option interface
interface Option {
  text: string;
  image?: string; // Optional image for options
}

// Question interface
interface Question {
  id: number;
  type: string;
  question: string | string[]; // Accept array of strings for EMQ questions
  image?: string; // Optional image for the question
  options?: string[]; // options are an array of HTML strings
}

// QuizData interface
interface QuizData {
  title: string;
  questions: Question[];
  duration: string;
  points: string;
  question_view: string;
  finish_button: string;
}

export default function PlayExam({ params }: { params: { slug: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds, 30 minutes)
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [quizData, setQuiz] = useState<QuizData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");

    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/play-quiz/${slug}`,
          {
            params: { category },
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );
        if (response.data.status) {
          if(response.data.status && response.data.message == "Quiz Timed Out"){
            toast.success(response.data.message);
            const examId = response.data.data;
            console.log(examId.uuid); // EXAM PREVIEW URL
            setSubmitted(true);
          }else{
            const fetchQuizData = response.data.data;
            const Item: QuizData = {
              title: fetchQuizData.title,
              questions: fetchQuizData.questions,
              duration: fetchQuizData.duration,
              points: fetchQuizData.points,
              question_view: fetchQuizData.question_view,
              finish_button: fetchQuizData.finish_button,
            };
            setQuiz(Item);
          }
        } else {
          toast.error("No exams found for this category");
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("An error occurred while fetching exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [params, router]);

  useEffect(() => {
    if (quizData && !answers[quizData.questions[currentQuestionIndex]?.id]) {
      setAnswers((prev) => ({
        ...prev,
        [quizData.questions[currentQuestionIndex]?.id]: quizData.questions[
          currentQuestionIndex
        ].options || [],
      }));
    }
  }, [quizData, currentQuestionIndex]);

  const handleAnswerChange = (questionId: number, answer: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
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
    return quizData?.questions.length
      ? quizData.questions.length - getAnsweredCount()
      : 0;
  };

  const moveItem = (
    questionId: number,
    fromIndex: number,
    toIndex: number
  ) => {
    const currentAnswers =
      answers[questionId] ||
      quizData?.questions[questionId]?.options?.map((opt) => opt) ||
      [];

    if (toIndex < 0 || toIndex >= currentAnswers.length) {
      return; // Prevent moving out of bounds
    }

    const reorderedAnswers = [...currentAnswers];
    const [movedItem] = reorderedAnswers.splice(fromIndex, 1);
    reorderedAnswers.splice(toIndex, 0, movedItem);

    handleAnswerChange(questionId, reorderedAnswers);
  };

  const renderQuestion = (question: Question) => {
    return (
      <div>
        {question.image && (
          <img
            src={question.image}
            alt="Question related"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}

        <p
          className="mb-4"
          dangerouslySetInnerHTML={{
            __html: Array.isArray(question.question)
              ? question.question[0]
              : question.question,
          }}
        ></p>

        {(() => {
          switch (question.type) {
            case "MSA":
              return question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all mb-3 ${
                    answers[question.id]?.includes(option)
                      ? "bg-green-200"
                      : "bg-gray-100"
                  } hover:bg-yellow-100`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                   
                    onChange={() => handleAnswerChange(question.id, [option])}
                    className="cursor-pointer"
                  />
                  <div dangerouslySetInnerHTML={{ __html: option }}></div>
                </label>
              ));

            case "MMA":
              return question.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all mb-3 ${
                    answers[question.id]?.includes(option)
                      ? "bg-green-200"
                      : "bg-gray-100"
                  } hover:bg-yellow-100`}
                >
                  <input
                    type="checkbox"
                    name={`question-${question.id}`}
                    value={option}
                    onChange={() => {
                      const currentAnswers = answers[question.id] || [];
                      const newAnswers = currentAnswers.includes(option)
                        ? currentAnswers.filter((a) => a !== option)
                        : [...currentAnswers, option];
                      handleAnswerChange(question.id, newAnswers);
                    }}
                    className="cursor-pointer"
                  />
                  <div dangerouslySetInnerHTML={{ __html: option }}></div>
                </label>
              ));

            case "TOF":
              return (
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all bg-gray-100 hover:bg-yellow-100">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="true"
                      onChange={() => handleAnswerChange(question.id, ["true"])}
                      className="cursor-pointer"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all bg-gray-100 hover:bg-yellow-100">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="false"
                      onChange={() =>
                        handleAnswerChange(question.id, ["false"])
                      }
                      className="cursor-pointer"
                    />
                    <span>False</span>
                  </label>
                </div>
              );

            case "SAQ":
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

            case "MTF":
              return (
                <div>
                  <p className="mb-4 font-medium">Match the following:</p>
                  {question.options
                    ?.slice(0, question.options.length / 2)
                    .map((opt, i) => (
                      <div key={i} className="flex space-x-4 mb-4">
                        <p
                          className="flex-1 p-2 rounded bg-gray-100"
                          dangerouslySetInnerHTML={{ __html: opt }}
                        ></p>
                        <select
                          className="flex-1 p-2 rounded border border-gray-300"
                          onChange={(e) =>
                            handleAnswerChange(question.id, [e.target.value])
                          }
                        >
                          {question.options
                            ?.slice(question.options.length / 2)
                            .map((match, i) => (
                              <option key={i} value={match}>
                                <div
                                  dangerouslySetInnerHTML={{ __html: match }}
                                ></div>
                              </option>
                            ))}
                        </select>
                      </div>
                    ))}
                </div>
              );

            case "ORD":
              return (
                <div>
                  <p className="mb-4 font-medium">
                    Arrange in sequence (Use the arrows to reorder):
                  </p>
                  <ul>
                    {answers[question.id]?.map((option, index) => (
                      <li
                        key={index}
                        className="p-4 bg-gray-100 rounded-lg mb-2 flex items-center justify-between"
                      >
                        <div dangerouslySetInnerHTML={{ __html: option }}></div>
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => moveItem(question.id, index, index - 1)}
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => moveItem(question.id, index, index + 1)}
                            disabled={index === answers[question.id]?.length - 1}
                          >
                            ↓
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );

            case "FIB": {
              const numberOfBlanks = Number(question.options?.[0]) || 0;
              return (
                <div>
                  {Array.from({ length: numberOfBlanks }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      className="p-4 rounded-lg border border-gray-300 w-full mb-2"
                      placeholder={`Answer ${index + 1}`}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newAnswers = [...(answers[question.id] || [])];
                        newAnswers[index] = e.target.value;
                        handleAnswerChange(question.id, newAnswers);
                      }}
                    />
                  ))}
                </div>
              );
            }

            case "EMQ":
              return (
                <div>
                  {Array.isArray(question.question) &&
                    question.question.map((subQuestion, questionIndex) => (
                      <div key={questionIndex} className="mb-4">
                        {questionIndex > 0 && (
                          <div>
                            <b>{"Question "+questionIndex}</b><p
                              className="mb-4 font-medium"
                              dangerouslySetInnerHTML={{ __html: subQuestion }}
                            ></p>
                            {question.options?.map((option, index) => (
                              <label
                                key={index}
                                className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all mb-3 ${
                                  answers[question.id]?.includes(option)
                                    ? "bg-green-200"
                                    : "bg-gray-100"
                                } hover:bg-yellow-100`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}-${questionIndex}`}
                                  value={option}
                                  onChange={() =>
                                    handleAnswerChange(question.id, [option])
                                  }
                                  className="cursor-pointer"
                                />
                                <div
                                  dangerouslySetInnerHTML={{ __html: option }}
                                ></div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              );

            default:
              return <div>Unknown question type</div>;
          }
        })()}
      </div>
    );
  };

  if (loading) return <Loader />;

  if (!quizData) return <div>No quiz data available</div>;

  return (
    <div className="dashboard-page flex flex-col md:flex-row gap-6">
      {/* Main Exam Content */}
      <div className="flex-1 lg:p-6 bg-white rounded-lg shadow-sm p-4 ">
        {!submitted ? (
          <>
            <div className="flex justify-between mb-4">
              <h3 className="text-2xl font-semibold text-primary">
                Question {currentQuestionIndex + 1}/{quizData.questions.length}
              </h3>
              <FaClock className="text-primary" size={24} />
            </div>

            <div className="space-y-4">
              {renderQuestion(quizData.questions[currentQuestionIndex])}
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={currentQuestionIndex === 0}
                onClick={handlePreviousQuestion}
              >
                <FaArrowLeft className="inline mr-2" /> Previous
              </button>

              {currentQuestionIndex < quizData.questions.length - 1 ? (
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
            <FaCheckCircle
              className="inline text-green-600 mr-2 mb-3"
              size={42}
            />
            <h1 className="text-3xl font-bold mb-4 text-green-600">
              Exam Submitted
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for completing the exam. Your answers have been
              submitted successfully!
            </p>
            <button
              className="mt-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              onClick={() => window.location.reload()}
            >
             Go to Quiz Result
            </button>
          </div>
        )}
      </div>

      {/* Sidebar for Timer and Progress */}
      <div className="w-full md:w-1/3 bg-white shadow-sm p-4 lg:p-6 rounded-lg ">
        {/* Heading */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-primary text-center">
            Exam Progress
          </h2>
        </div>

        {/* Time Remaining */}
        <div className="mb-6 text-center">
          <h3 className="text-gray-600 font-semibold">Time Remaining</h3>
          <p className="text-3xl text-orange-600 font-semibold">
            {formatTimeLeft(timeLeft)}
          </p>
        </div>

        {/* Answered and Skipped Count */}
        <div className="mb-6 text-center">
          <div className="flex justify-around">
            <div className="flex items-center space-x-2">
              <FaRegSmile className="text-green-500" size={20} />
              <span className="text-gray-700">
                Attempted: {getAnsweredCount()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRegFrown className="text-yellow-500" size={20} />
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
                  (Object.keys(answers).length / quizData.questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Navigation Grid */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {quizData.questions.map((question, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg border cursor-pointer ${
                currentQuestionIndex === index
                  ? "bg-primary text-white"
                  : answers[question.id]
                  ? "bg-green-200 text-black"
                  : "bg-yellow-200 text-black"
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Exam Instructions */}
        <div className="mt-3 ">
          <h3 className="text-lg text-gray-700 font-semibold">Exam Guide</h3>
          <p className="text-sm text-gray-500">
            - Answer all questions to the best of your ability.
            <br />
            - You can navigate between questions.
            <br />
            - Make sure to submit your exam before time runs out.
          </p>
        </div>
      </div>
    </div>
  );
}
