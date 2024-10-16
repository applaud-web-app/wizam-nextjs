"use client";

import Loader from "@/components/Common/Loader";
import { AiOutlineArrowRight } from 'react-icons/ai'; // For icons

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
import Link from 'next/link';
import NoData from "@/components/Common/NoData";

// Option interface
interface Option {
  text: string;
}

// Question interface
interface Question {
  id: number;
  type: string; // Question type (MSA, MMA, TOF, etc.)
  question: string | string[]; // The question text
  options?: string[]; // The answer options, if applicable (for multiple-choice, matching, etc.)
}

// quizData interface
interface quizData {
  title: string;
  questions: Question[];
  duration: string;
  points: number;
}

export default function PlayQuizPage({
  params,
}: {
  params: { slug: string };
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] | null }>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds)
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [quizData, setquizData] = useState<quizData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [uuid, setUuid] = useState<string | null>(null);
  let timerId: NodeJS.Timeout | null = null; // Variable to store the timer reference

  useEffect(() => {
    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");

    const fetchPracticeSet = async () => {
      try {
        // Make the API request to fetch quizzes
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/play-quiz/${slug}`, // Ensure the slug is passed correctly
          {
            params: { category }, // Pass the category as a parameter
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`, // Include the JWT token for authentication
            },
          }
        );
    
        // Handle the response from the API
        if (response.data.status) {
          const fetchQuizData = response.data.data;
    
          // Assuming you get the necessary quiz data here
          setUuid(fetchQuizData.uuid); // Set UUID from the fetched quiz data
          setquizData({
            title: fetchQuizData.title,
            questions: fetchQuizData.questions, // Assuming questions array is included
            duration: fetchQuizData.duration, // Duration of the quiz
            points: fetchQuizData.points, // Points for the quiz
          });
    
          // Convert duration from minutes to seconds and set the timer
          setTimeLeft(Math.round(parseFloat(fetchQuizData.duration) * 60));
        } else {
          toast.error("No practice set found for this category.");
        }
      } catch (error:any) {
        console.error("Error fetching practice set:", error);
    
        // Handle errors during the API request
        if (error.response) {
          const { status, data } = error.response;
    
          // Handle specific error statuses
          if (status === 401) {
            toast.error("User is not authenticated. Please log in.");
            router.push("/signin"); // Redirect to sign-in page
          } else if (status === 404) {
            toast.error("Please buy a subscription to access this course.");
            router.push("/pricing"); // Redirect to pricing page
          } else if (status === 403) {
            toast.error("Feature not available in your plan. Please upgrade your subscription.");
            router.push("/pricing"); // Redirect to pricing page
          } else {
            toast.error(`An error occurred: ${data.error || 'Unknown error'}`);
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false); // Stop the loading state once the request is complete
      }
    };
    
    // Call the fetch function on component mount or based on dependencies
    fetchPracticeSet();
    }, [slug, router]); // Ensure necessary dependencies like slug, category, and router are included
    

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
      const existingAnswers = { ...prev }; // Clone previous answers state
  
      // Handle sub-questions (like in EMQ)
      if (typeof subQuestionIndex === "number") {
        const updatedSubAnswers = existingAnswers[questionId] || [];
        updatedSubAnswers[subQuestionIndex] = answer[0]; // Update only the sub-question's answer
        existingAnswers[questionId] = updatedSubAnswers;
      } else if (answer.length === 2) {
        // For MTF, handle pairs of answers
        const updatedPairs = [...(existingAnswers[questionId] || [])];
        const existingIndex = updatedPairs.findIndex(
          (pair) => pair[0] === answer[0] // Find the left-side option match
        );
  
        if (existingIndex > -1) {
          updatedPairs[existingIndex] = answer; // Update the right-side match
        } else {
          updatedPairs.push(answer); // Add new pair
        }
        existingAnswers[questionId] = updatedPairs;
      } else {
        existingAnswers[questionId] = answer; // For other types, just update the answer
      }
  
      return existingAnswers;
    });
  };
  


  const handleNextQuestion = () => {
    if (
      quizData?.questions &&
      currentQuestionIndex < quizData.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true); // Mark as submitted
    if (timerId) clearInterval(timerId); // Stop the timer when submitting manually
  
    // Structure answers based on question type for submission
    const formattedAnswers = quizData?.questions.map((question: Question) => {
      const userAnswer = answers[question.id];
  
      // Handle unanswered questions: Include them with an empty or null answer
      if (!userAnswer || userAnswer.length === 0) {
        return {
          id: question.id,
          type: question.type,
          answer: [], // Mark skipped questions with an empty array
        };
      }
  
      switch (question.type) {
        case "MSA": // Multiple Single Answer
          return {
            id: question.id,
            type: question.type,
            answer: question.options
              ? question.options.indexOf(userAnswer[0]) + 1 // 1-based index if options are found
              : 0, // Fallback to 0 if no options are defined
          };
  
        case "MMA": // Multiple Match Answer
          return {
            id: question.id,
            type: question.type,
            answer: userAnswer.map((ans: string) =>
              question.options ? question.options.indexOf(ans) + 1 : 0
            ), // Array of 1-based indices
          };
  
        case "TOF": // True or False
          return {
            id: question.id,
            type: question.type,
            answer: userAnswer[0] === "true" ? 1 : 2, // 1 for True, 2 for False
          };
  
        case "SAQ": // Short Answer Question
          return {
            id: question.id,
            type: question.type,
            answer: userAnswer[0], // User's text input
          };
  
        case "FIB": // Fill in the Blanks
          return {
            id: question.id,
            type: question.type,
            answer: Array.isArray(userAnswer)
              ? userAnswer.map((ans) => (typeof ans === "string" ? ans : String(ans)))
              : [],
          };
  
        case "MTF": // Match the Following
          const matches: { [key: number]: string } = {};
  
          // Check if the userAnswer is indeed an array of pairs
          if (Array.isArray(userAnswer) && userAnswer.every(pair => Array.isArray(pair) && pair.length === 2)) {
            (userAnswer as unknown as [string, string][]).forEach((pair: [string, string]) => {
              if (question.options) {
                const termIndex = question.options.indexOf(pair[0]) + 1;
                matches[termIndex] = pair[1];
              }
            });
          } else {
            console.error(`Invalid format for MTF answers in question ${question.id}`, userAnswer);
          }
  
          return {
            id: question.id,
            type: question.type,
            answer: matches,
          };
  
        case "ORD": // Ordering
          return {
            id: question.id,
            type: question.type,
            answer: userAnswer.map((opt: string) =>
              question.options ? question.options.indexOf(opt) : -1
            ), // Array of 0-based indices
          };
  
        case "EMQ": // Extended Matching Questions
          const filteredAnswers = userAnswer
            .map((ans: string, index: number) => {
              return ans ? (question.options ? question.options.indexOf(ans) + 1 : null) : null;
            })
            .filter((ans) => ans !== null); // Exclude any unanswered sub-questions
  
          // If no answers were provided for EMQ, return an empty array
          return {
            id: question.id,
            type: question.type,
            answer: filteredAnswers.length > 0 ? filteredAnswers : [], // Return empty array if nothing answered
          };
  
        default:
          return null; // Handle unknown types
      }
    });
  
    // Prepare the payload for submission
    const payload = {
      practiceSetId: uuid,
      answers: formattedAnswers?.filter((answer:any) => answer !== null), // Keep all questions, even skipped ones with empty answers
    };
  
    console.log("Submitting answers:", payload);
    // Here, you would make an API call to submit the answers
     // API call to submit the answers
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/finish-quiz/${uuid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Quiz submitted successfully!");
        // Optionally redirect or display a success message here
      } else {
        toast.error("Error submitting quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("An error occurred during submission");
    }
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
    return quizData?.questions
      ? quizData.questions.length - getAnsweredCount()
      : 0;
  };

  const moveItem = (
    questionId: number,
    fromIndex: number,
    toIndex: number
  ) => {
    const currentAnswers = answers[questionId] || [];

    if (toIndex < 0 || toIndex >= currentAnswers.length) {
      return; // Prevent moving out of bounds
    }

    const reorderedAnswers = [...currentAnswers];
    const [movedItem] = reorderedAnswers.splice(fromIndex, 1);
    reorderedAnswers.splice(toIndex, 0, movedItem);

    handleAnswerChange(questionId, reorderedAnswers);
  };

  // Move useEffect for initializing answers for "ORD" outside of the switch statement
  useEffect(() => {
    if (quizData?.questions) {
      quizData.questions.forEach((question) => {
        if (!answers[question.id] && question.type === "ORD") {
          // Initialize answers for ordering questions if not already set
          setAnswers((prev) => ({
            ...prev,
            [question.id]: question.options || [],
          }));
        }
      });
    }
  }, [quizData?.questions, answers]);

  const renderQuestion = (question: Question) => {
    return (
      <div>
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
            case "MSA": // Multiple Single Answer
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
                  checked={answers[question.id]?.includes(option) || false} // Default to false if undefined
                  className="cursor-pointer"
                />
                <div dangerouslySetInnerHTML={{ __html: option }}></div>
              </label>
            ));

            case "MMA": // Multiple Match Answer
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
                    checked={answers[question.id]?.includes(option) || false} // Default to false if undefined
                    className="cursor-pointer"
                  />
                  <div dangerouslySetInnerHTML={{ __html: option }}></div>
                </label>
              ));


  case "TOF": // True or False
  return (
    <div className="space-y-4">
      <label className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all bg-gray-100 hover:bg-yellow-100">
        <input
          type="radio"
          name={`question-${question.id}`}
          value="true"
          onChange={() => handleAnswerChange(question.id, ["true"])}
          checked={answers[question.id]?.includes("true") || false} // Default to false if undefined
          className="cursor-pointer"
        />
        <span>True</span>
      </label>
      <label className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all bg-gray-100 hover:bg-yellow-100">
        <input
          type="radio"
          name={`question-${question.id}`}
          value="false"
          onChange={() => handleAnswerChange(question.id, ["false"])}
          checked={answers[question.id]?.includes("false") || false} // Default to false if undefined
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
                              <option
                                key={j}
                                value={match}
                                dangerouslySetInnerHTML={{ __html: match }}
                              ></option>
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
                            disabled={index === 0} // Disable if it's the first item
                          >
                            ↑
                          </button>
                          <button
                            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => moveItem(question.id, index, index + 1)}
                            disabled={index === (answers[question.id]?.length || 0) - 1} // Disable if it's the last item
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

  if (!quizData || !quizData.questions)
    return <NoData message="No Quiz data available"/>;

  return (
    <div className="dashboard-page flex flex-col md:flex-row gap-6">
      {/* Main Practice Test Content */}
      <div className="flex-1 lg:p-6 bg-white rounded-lg shadow-sm p-4">
        {!submitted ? (
          <>
            <div className="flex justify-between mb-4">
              <h3 className="text-2xl font-semibold text-defaultcolor">
                Question {currentQuestionIndex + 1}/
                {quizData.questions.length}
              </h3>
              <FaClock className="text-defaultcolor" size={24} />
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
                  className="bg-defaultcolor text-white px-4 py-2 rounded-lg hover:bg-defaultcolor-dark transition-colors"
                  onClick={handleNextQuestion}
                >
                  Next <FaArrowRight className="inline ml-2" />
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={handleSubmit}
                >
                  Submit Practice Test
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
              Practice Test Submitted
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for completing the practice test. Your answers have been
              submitted successfully!
            </p>
            <div>
            <Link
                href={`/dashboard/quiz-result/${uuid}`}
                className="mt-4  text-center w-full bg-defaultcolor text-white font-semibold py-2 px-4 rounded hover:bg-defaultcolor-dark transition-colors flex justify-center items-center"
              >
                Go to Result
                <AiOutlineArrowRight className="ml-2" /> {/* Add the icon here */}
              </Link>
            </div>
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
                className="h-full bg-defaultcolor"
                style={{
                  width: `${
                    (Object.keys(answers).length /
                      quizData.questions.length) *
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
                className={`p-2 rounded-lg border ${
                  currentQuestionIndex === index
                    ? "bg-defaultcolor text-white"
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

          {/* Practice Test Instructions */}
          <div className="mt-3 ">
            <h3 className="text-lg text-gray-700 font-semibold">Test Guide</h3>
            <p className="text-sm text-gray-500">
              - Answer all questions to the best of your ability.
              <br />
              - You can navigate between questions.
              <br />
              - Make sure to submit your test before time runs out.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
