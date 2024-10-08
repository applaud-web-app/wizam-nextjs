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

export default function PlayQuiz({ params }: { params: { slug: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds)
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [quizData, setQuiz] = useState<QuizData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [uuid, setUuid] = useState<string | null>(null);
  let timerId: NodeJS.Timeout | null = null; // Variable to store the timer reference

  useEffect(() => {
    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");
  
    const fetchQuiz = async () => {
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
          setUuid(fetchQuizData.uuid);
          // Convert duration to seconds
          setTimeLeft(Math.round(parseFloat(fetchQuizData.duration) * 60));
        } else {
          toast.error("No quizzes found for this category");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        toast.error("An error occurred while fetching quizzes");
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuiz();
  }, [params, router]);

  useEffect(() => {
    if (quizData && quizData.questions && !answers[quizData.questions[currentQuestionIndex]?.id]) {
      setAnswers((prev) => ({
        ...prev,
        [quizData.questions[currentQuestionIndex]?.id]:
          quizData.questions[currentQuestionIndex]?.options || [],
      }));
    }
  }, [quizData, currentQuestionIndex]);

  // Countdown timer logic
  useEffect(() => {
    if (!quizData || submitted) return;

    timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (!submitted) {
            clearInterval(timerId!); // Clear the timer first
            handleSubmit(); // Auto-submit when time is up
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId!); // Clean up the timer when the component unmounts
  }, [quizData, submitted]);

  const handleAnswerChange = (
    questionId: number,
    answer: string[],
    subQuestionIndex?: number // for handling sub-questions like in EMQ
  ) => {
    setAnswers((prev: any) => {
      const existingAnswers = prev[questionId] || [];
  
      if (typeof subQuestionIndex === "number") {
        // For EMQ, update a specific sub-question's answer
        existingAnswers[subQuestionIndex] = answer[0];
        return { ...prev, [questionId]: existingAnswers };
      } else if (answer.length === 2) {
        // For MTF, we need to handle pairs of answers
        const updatedPairs = [...existingAnswers];
        const existingIndex = updatedPairs.findIndex(
          (pair) => pair[0] === answer[0] // Find the left-side option match
        );
  
        if (existingIndex > -1) {
          // If the left-side option already exists, update its right-side match
          updatedPairs[existingIndex] = answer;
        } else {
          // Otherwise, add the new pair
          updatedPairs.push(answer);
        }
  
        return { ...prev, [questionId]: updatedPairs };
      } else {
        // For other question types, just update the answer
        return { ...prev, [questionId]: answer };
      }
    });
  };

  const handleNextQuestion = () => {
    if (quizData?.questions && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (submitted) return; // Prevent resubmission if already submitted
    setSubmitted(true); // Mark as submitted

    if (timerId) clearInterval(timerId); // Stop the timer when submitting manually

    // Structure answers in the required format for submission
    const formattedAnswers = quizData?.questions.map((question) => {
      if (question.type === "MTF") {
        // For MTF, the answers are stored as pairs
        return {
          [question.id]: answers[question.id] || [],
        };
      } else if (question.type === "EMQ") {
        // For EMQ, each sub-question has its own answer
        return {
          [question.id]: answers[question.id] || [],
        };
      } else {
        // For other question types
        return {
          [question.id]: answers[question.id] || [], // Default to empty array if no answer
        };
      }
    });

    // Preview the answers in the console for testing
    console.log("Submitting answers:", formattedAnswers);

    // Send the formattedAnswers object to the backend here
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
    return quizData?.questions ? quizData.questions.length - getAnsweredCount() : 0;
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
                              handleAnswerChange(question.id, [opt, e.target.value])
                            }
                            value={
                              answers[question.id]?.find((pair) => pair[0] === opt)?.[1] || ""
                            } // Display the selected match
                          >
                            <option value="">Select match</option>
                            {question.options
                              ?.slice(question.options.length / 2)
                              .map((match, j) => (
                                <option key={j} value={match} dangerouslySetInnerHTML={{ __html: match }}>
                                  
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
                            onClick={() =>
                              moveItem(question.id, index, index - 1)
                            }
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() =>
                              moveItem(question.id, index, index + 1)
                            }
                            disabled={
                              index === answers[question.id]?.length - 1
                            }
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
                            <b>{"Question " + questionIndex}</b>
                            <p
                              className="mb-4 font-medium"
                              dangerouslySetInnerHTML={{
                                __html: subQuestion,
                              }}
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
                                    handleAnswerChange(question.id, [option], questionIndex)
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

  if (!quizData || !quizData.questions) return <div>No quiz data available</div>;

  return (
    <div className="dashboard-page flex flex-col md:flex-row gap-6">
      {/* Main Quiz Content */}
      <div className="flex-1 lg:p-6 bg-white rounded-lg shadow-sm p-4">
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
                quizData.finish_button === "enable" && ( // Conditionally show submit button
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={handleSubmit}
                  >
                    Submit Quiz
                  </button>
                )
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
              Quiz Submitted
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for completing the quiz. Your answers have been
              submitted successfully!
            </p>
          </div>
        )}
      </div>

      {/* Sidebar for Timer and Progress */}
      {!submitted && timeLeft > 0 && (
        <div className="w-full md:w-1/3 bg-white shadow-sm p-4 lg:p-6 rounded-lg">
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
                    (Object.keys(answers).length / quizData.questions.length) * 100
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
                className={`p-2 rounded-lg border ${
                  currentQuestionIndex === index
                    ? "bg-primary text-white"
                    : answers[question.id]
                    ? "bg-green-200 text-black"
                    : "bg-yellow-200 text-black"
                } ${quizData.question_view === "enable" ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() =>
                  quizData.question_view === "enable" && setCurrentQuestionIndex(index)
                }
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Quiz Instructions */}
          <div className="mt-3 ">
            <h3 className="text-lg text-gray-700 font-semibold">Quiz Guide</h3>
            <p className="text-sm text-gray-500">
              - Answer all questions to the best of your ability.
              <br />
              - You can navigate between questions.
              <br />
              - Make sure to submit your quiz before time runs out.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
