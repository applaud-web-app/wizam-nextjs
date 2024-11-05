"use client";

import Loader from "@/components/Common/Loader";
import { AiOutlineArrowRight, AiOutlineClockCircle } from "react-icons/ai"; // For icons
import { useState, useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaBook,
  FaClock,
  FaRegSmile,
  FaRegFrown,
  FaCircle,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import NoData from "@/components/Common/NoData";
import { FaHourglass } from "react-icons/fa6";

// Option interface
interface Option {
  text: string;
}

// Question interface
interface Question {
  id: number;
  type: string; // Question type (MSA, MMA, TOF, etc.)
  question: string | string[]; // The question text
  options?: string[];
}

// ExamData interface
interface ExamData {
  question_view: string;
  title: string;
  questions: Question[];
  duration: string;
  points: number;
  finish_button: string; // "enable" or "disable"
}

export default function PlayExamPage({ params }: { params: { slug: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] | null }>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds)
  const [submitted, setSubmitted] = useState<boolean>(false); // Controls whether exam is submitted
  const [slug, setSlug] = useState<string | null>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [uuid, setUuid] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // State to control modal visibility
  let timerId: NodeJS.Timeout | null = null;

  // Refs to hold the latest state values
  const answersRef = useRef<{ [key: number]: string[] | null }>({});
  const examDataRef = useRef<ExamData | null>(null);
  const submittedRef = useRef<boolean>(false); // Added ref for submitted flag
  const hasFetchedData = useRef(false); // New ref to track if API call has been made

  // Synchronize refs with state
  useEffect(() => {
    answersRef.current = answers;
    examDataRef.current = examData;
    submittedRef.current = submitted; // Keep ref updated with submitted state
  }, [answers, examData, submitted]);

  // Fetch exam data on component mount
  useEffect(() => {
    if (hasFetchedData.current) return; // Skip if API call already made
    hasFetchedData.current = true; // Set to true after first API call

    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");

    const fetchExamSet = async () => {
      Cookies.set("redirect_url", `/dashboard/exam-play/${slug}`, {
        expires: 1,
      });
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/play-exam/${slug}`,
          {
            params: { category },
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );
        if (response.data.status) {
          const fetchExamData = response.data.data;
          setUuid(fetchExamData.uuid);
          Cookies.remove("redirect_url");
          setExamData({
            title: fetchExamData.title,
            questions: fetchExamData.questions,
            duration: fetchExamData.duration,
            points: fetchExamData.points,
            question_view: fetchExamData.question_view,
            finish_button: fetchExamData.finish_button,
          });
          setTimeLeft(Math.round(parseFloat(fetchExamData.duration) * 60));
        } else {
          toast.error("No exam found for this category");
        }
      } catch (error: any) {
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
            Cookies.set("redirect_url", `/dashboard/exam-play/${slug}`, {
              expires: 1,
            });
            console.log("exam-play");
            router.push("/pricing"); // Redirect to pricing page
          } else if (status === 403) {
            toast.error(
              "Feature not available in your plan. Please upgrade your subscription."
            );
            Cookies.set("redirect_url", `/dashboard/exam-play/${slug}`, {
              expires: 1,
            });
            console.log("exam-play");
            router.push("/pricing"); // Redirect to pricing page
          } else {
            toast.error(`An error occurred: ${data.error || "Unknown error"}`);
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false); // Stop the loading state once the request is complete
      }
    };

    fetchExamSet();
  }, [params, router]);

  // Countdown timer for exam
  useEffect(() => {
    if (!examData || submitted) return;

    // Set the interval for countdown timer
    timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerId!);
          if (!submittedRef.current) {
            handleSubmit(); // Auto-submit when time runs out
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerId!);
  }, [examData]);

  // Modal Dialog for Confirming Submission
  const ConfirmationModal = ({}) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1001]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="font-bold text-lg mb-2">Are you sure?</h2>
          <p className="text-gray-600 mb-4">
            Are you sure you want to submit the test? Once submitted, you will
            not be able to make further changes.
          </p>
          <div className="mt-6 flex justify-between">
            <button
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                setShowModal(false);
                handleSubmit();
              }}
            >
              Finish Exam
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleAnswerChange = (
    questionId: number,
    answer: string[],
    subQuestionIndex?: number // for handling sub-questions like in EMQ
  ) => {
    setAnswers((prev: any) => {
      const existingAnswers = { ...prev };

      // Handle sub-questions (like in EMQ)
      if (typeof subQuestionIndex === "number") {
        const updatedSubAnswers = existingAnswers[questionId] || [];
        updatedSubAnswers[subQuestionIndex] = answer[0];
        existingAnswers[questionId] = updatedSubAnswers;
      } else if (answer.length === 2) {
        // For MTF, handle pairs of answers
        const updatedPairs = [...(existingAnswers[questionId] || [])];
        const existingIndex = updatedPairs.findIndex(
          (pair) => pair[0] === answer[0]
        );

        if (existingIndex > -1) {
          updatedPairs[existingIndex] = answer;
        } else {
          updatedPairs.push(answer);
        }
        existingAnswers[questionId] = updatedPairs;
      } else {
        existingAnswers[questionId] = answer;
      }

      return existingAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (
      examData?.questions &&
      currentQuestionIndex < examData.questions.length - 1
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
    // Prevent submission if it has already been submitted
    if (submittedRef.current) return; // Use ref to guard against duplicate submissions

    setSubmitted(true);
    submittedRef.current = true; // Set ref to prevent future calls
    if (timerId) clearInterval(timerId); // Stop the timer when submitting

    const formattedAnswers = examDataRef.current?.questions.map(
      (question: Question) => {
        const userAnswer = answersRef.current[question.id];

        // Ensure that blank answers are submitted if no answer is provided
        if (!userAnswer || userAnswer.length === 0) {
          return {
            id: question.id,
            type: question.type,
            answer: [],
          };
        }

        switch (question.type) {
          case "MSA":
            return {
              id: question.id,
              type: question.type,
              answer: question.options
                ? question.options.indexOf(userAnswer[0]) + 1
                : 0,
            };

          case "MMA":
            return {
              id: question.id,
              type: question.type,
              answer: userAnswer.map((ans: string) =>
                question.options ? question.options.indexOf(ans) + 1 : 0
              ),
            };

          case "TOF":
            return {
              id: question.id,
              type: question.type,
              answer: userAnswer[0] === "true" ? 1 : 2,
            };

          case "SAQ":
            return {
              id: question.id,
              type: question.type,
              answer: userAnswer[0],
            };

          case "FIB":
            return {
              id: question.id,
              type: question.type,
              answer: Array.isArray(userAnswer)
                ? userAnswer.map((ans) =>
                    typeof ans === "string" ? ans : String(ans)
                  )
                : [],
            };

          case "MTF":
            const matches: { [key: number]: string } = {};
            if (
              Array.isArray(userAnswer) &&
              userAnswer.every(
                (pair) => Array.isArray(pair) && pair.length === 2
              )
            ) {
              (userAnswer as unknown as [string, string][]).forEach(
                (pair: [string, string]) => {
                  if (question.options) {
                    const termIndex = question.options.indexOf(pair[0]) + 1;
                    matches[termIndex] = pair[1];
                  }
                }
              );
            }
            return {
              id: question.id,
              type: question.type,
              answer: matches,
            };

          case "ORD":
            return {
              id: question.id,
              type: question.type,
              answer: userAnswer.map((opt: string) =>
                question.options ? question.options.indexOf(opt) : -1
              ),
            };

          case "EMQ":
            const filteredAnswers = userAnswer
              .map((ans: string, index: number) => {
                return ans
                  ? question.options
                    ? question.options.indexOf(ans) + 1
                    : null
                  : null;
              })
              .filter((ans) => ans !== null);
            return {
              id: question.id,
              type: question.type,
              answer: filteredAnswers.length > 0 ? filteredAnswers : [],
            };

          default:
            return null;
        }
      }
    );

    const payload = {
      examId: uuid,
      answers: formattedAnswers?.filter((answer: any) => answer !== null),
    };

    console.log("Submitting answers:", payload);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/finish-exam/${uuid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Exam submitted successfully!");
      } else {
        toast.error("Error submitting exam");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("An error occurred during submission");
    }
  };

  const handleFinishClick = () => {
    setShowModal(true);
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
    return examData?.questions
      ? examData.questions.length - getAnsweredCount()
      : 0;
  };

  const moveItem = (questionId: number, fromIndex: number, toIndex: number) => {
    const currentAnswers = answers[questionId] || [];

    if (toIndex < 0 || toIndex >= currentAnswers.length) {
      return;
    }

    const reorderedAnswers = [...currentAnswers];
    const [movedItem] = reorderedAnswers.splice(fromIndex, 1);
    reorderedAnswers.splice(toIndex, 0, movedItem);

    handleAnswerChange(questionId, reorderedAnswers);
  };

  useEffect(() => {
    if (examData?.questions) {
      examData.questions.forEach((question) => {
        if (!answers[question.id] && question.type === "ORD") {
          setAnswers((prev) => ({
            ...prev,
            [question.id]: question.options || [],
          }));
        }
      });
    }
  }, [examData?.questions, answers]);

  const renderQuestion = (question: Question) => {
    return (
      <div>
        <p
          className="mb-4 bg-white p-3 rounded-lg"
          dangerouslySetInnerHTML={{
            __html: Array.isArray(question.question)
              ? question.question[0]
              : question.question,
          }}
        ></p>

        {(() => {
          switch (question.type) {
            case "MSA":
              return question.options?.map((option, index) => {
                const isChecked = answers[question.id]?.includes(option);

                return (
                  <label
                    key={index}
                    className={`flex items-center justify-between space-x-3 p-3 bg-white border rounded-lg cursor-pointer transition-all mb-3 ${
                      isChecked ? "border-defaultcolor" : "border-white"
                    } hover:bg-yellow-100`}
                  >
                    {/* Circle for A, B, C, D */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-black transition-all ${
                          isChecked
                            ? "bg-defaultcolor text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}{" "}
                        {/* Converts index 0,1,2,3 to A,B,C,D */}
                      </div>
                      <div
                        className={`transition-all ${
                          isChecked ? "text-defaultcolor" : "text-black"
                        }`}
                        dangerouslySetInnerHTML={{ __html: option }}
                      ></div>
                    </div>

                    {/* Input on the right */}
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      onChange={() => handleAnswerChange(question.id, [option])}
                      checked={isChecked || false}
                      className={`cursor-pointer focus:ring-1 focus:ring-defaultcolor ${
                        isChecked ? "checked:bg-defaultcolor" : ""
                      }`}
                    />
                  </label>
                );
              });

            case "MMA":
              return question.options?.map((option, index) => {
                const isChecked = answers[question.id]?.includes(option);

                return (
                  <label
                    key={index}
                    className={`flex items-center justify-between space-x-3 p-3 bg-white border rounded-lg cursor-pointer transition-all mb-3 ${
                      isChecked ? "border-defaultcolor" : "border-white"
                    } hover:bg-yellow-100`}
                  >
                    {/* Circle for A, B, C, D */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-black transition-all ${
                          isChecked
                            ? "bg-defaultcolor text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}{" "}
                        {/* Converts index 0,1,2,3 to A,B,C,D */}
                      </div>
                      <div
                        className={`transition-all ${
                          isChecked ? "text-defaultcolor" : "text-black"
                        }`}
                        dangerouslySetInnerHTML={{ __html: option }}
                      ></div>
                    </div>

                    {/* Checkbox on the right */}
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
                      checked={isChecked || false}
                      className={`cursor-pointer focus:ring-1 focus:ring-defaultcolor ${
                        isChecked ? "checked:bg-defaultcolor" : ""
                      }`}
                    />
                  </label>
                );
              });

            case "TOF":
              return (
                <div className="space-y-4">
                  <label
                    className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all bg-white hover:bg-yellow-100 ${
                      answers[question.id]?.includes("true")
                        ? "border-defaultcolor"
                        : "border-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Circle for T (True) */}
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-black transition-all ${
                          answers[question.id]?.includes("true")
                            ? "bg-defaultcolor text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        T
                      </div>
                      <span
                        className={`transition-all ${
                          answers[question.id]?.includes("true")
                            ? "text-defaultcolor"
                            : "text-black"
                        }`}
                      >
                        True
                      </span>
                    </div>

                    {/* Radio input for True */}
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="true"
                      onChange={() => handleAnswerChange(question.id, ["true"])}
                      checked={answers[question.id]?.includes("true") || false}
                      className={`cursor-pointer focus:ring-1 focus:ring-defaultcolor ${
                        answers[question.id]?.includes("true")
                          ? "checked:bg-defaultcolor"
                          : ""
                      }`}
                    />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all bg-white hover:bg-yellow-100 ${
                      answers[question.id]?.includes("false")
                        ? "border-defaultcolor"
                        : "border-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Circle for F (False) */}
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-black transition-all ${
                          answers[question.id]?.includes("false")
                            ? "bg-defaultcolor text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        F
                      </div>
                      <span
                        className={`transition-all ${
                          answers[question.id]?.includes("false")
                            ? "text-defaultcolor"
                            : "text-black"
                        }`}
                      >
                        False
                      </span>
                    </div>

                    {/* Radio input for False */}
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="false"
                      onChange={() =>
                        handleAnswerChange(question.id, ["false"])
                      }
                      checked={answers[question.id]?.includes("false") || false}
                      className={`cursor-pointer focus:ring-1 focus:ring-defaultcolor ${
                        answers[question.id]?.includes("false")
                          ? "checked:bg-defaultcolor"
                          : ""
                      }`}
                    />
                  </label>
                </div>
              );

            case "SAQ":
              return (
                <textarea
                  className="w-full p-4 rounded-lg border border-gray-300 focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor"
                  placeholder="Type your answer here..."
                  value={answers[question.id]?.[0] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, [e.target.value])
                  }
                  rows={4} // Adjust the number of rows as needed
                ></textarea>
              );

              case "MTF":
                return (
                  <div>
                    <p className="mb-4 font-medium">Match the following:</p>
                    {question.options
                      ?.slice(0, question.options.length / 2)
                      .map((opt, i) => (
                        <div
                          key={i}
                          className="flex flex-col md:flex-row md:space-x-4 mb-4 space-y-2 md:space-y-0"
                        >
                          <p
                            className="flex-1 p-2 rounded bg-white text-center md:text-left"
                            dangerouslySetInnerHTML={{ __html: opt }}
                          ></p>
                          <select
                            className="flex-1 p-2 rounded border border-gray-300 focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor w-full"
                            onChange={(e) =>
                              handleAnswerChange(question.id, [opt, e.target.value])
                            }
                            value={
                              answers[question.id]?.find((pair) => pair[0] === opt)?.[1] || ""
                            }
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
                        className="p-3 bg-white rounded-lg mb-2 flex items-center justify-between"
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
                              index === (answers[question.id]?.length || 0) - 1
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

            case "FIB":
              // Assuming question.options[0] contains the number of blanks
              const numberOfBlanks = parseInt(question.options?.[0] ?? "0", 10);

              return (
                <div>
                  {Array.from({ length: numberOfBlanks }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      className="p-3 w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor mb-2"
                      placeholder={`Answer ${index + 1}`}
                      value={answers[question.id]?.[index] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newAnswers = [
                          ...(answers[question.id] ||
                            Array(numberOfBlanks).fill("")),
                        ];

                        newAnswers[index] = e.target.value;

                        handleAnswerChange(question.id, newAnswers);
                      }}
                    />
                  ))}
                </div>
              );

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
                              className="mb-4 font-medium bg-white p-3 rounded-lg"
                              dangerouslySetInnerHTML={{
                                __html: subQuestion,
                              }}
                            ></p>

                            {question.options?.map((option, index) => {
                              const isChecked =
                                answers[question.id]?.[questionIndex]?.includes(
                                  option
                                );

                              return (
                                <label
                                  key={index}
                                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all mb-3 ${
                                    isChecked
                                      ? "border-defaultcolor bg-white"
                                      : "border-white bg-white"
                                  } hover:bg-yellow-100`}
                                >
                                  {/* Circle for A, B, C, D */}
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`flex items-center justify-center w-8 h-8 rounded-full text-black transition-all ${
                                        isChecked
                                          ? "bg-defaultcolor text-white"
                                          : "bg-gray-200"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + index)}{" "}
                                      {/* Converts index 0,1,2,3 to A,B,C,D */}
                                    </div>
                                    <div
                                      className={`transition-all ${
                                        isChecked
                                          ? "text-defaultcolor"
                                          : "text-black"
                                      }`}
                                      dangerouslySetInnerHTML={{
                                        __html: option,
                                      }}
                                    ></div>
                                  </div>

                                  {/* Radio input on the right */}
                                  <input
                                    type="radio"
                                    name={`question-${question.id}-${questionIndex}`}
                                    value={option}
                                    onChange={() =>
                                      handleAnswerChange(
                                        question.id,
                                        [option],
                                        questionIndex
                                      )
                                    }
                                    checked={isChecked || false}
                                    className={`cursor-pointer focus:ring-1 focus:ring-defaultcolor ${
                                      isChecked ? "checked:bg-defaultcolor" : ""
                                    }`}
                                  />
                                </label>
                              );
                            })}
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

  if (!examData || !examData.questions)
    return <NoData message="No Exam data available" />;

  return (
    <div className="dashboard-page flex flex-col md:flex-row gap-6">
      {/* Main Exam Content */}
      <div className="flex-1 lg:p-6 bg-white rounded-lg shadow-sm p-4">
        {!submitted ? (
          <>
            <h1 className="text-2xl font-semibold mb-5 flex items-center gap-2">
              <FaBook className="text-defaultcolor" /> {examData.title}
            </h1>
            <div className="border-s-4 border-defaultcolor bg-[#f6f7f9] p-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-2xl font-semibold text-defaultcolor">
                  Question {currentQuestionIndex + 1}/
                  {examData.questions.length}
                </h3>
                <FaClock className="text-defaultcolor" size={24} />
              </div>

              <div className="space-y-4">
                {renderQuestion(examData.questions[currentQuestionIndex])}
              </div>
            </div>

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
                  className="bg-defaultcolor text-white px-4 py-2 rounded-lg hover:bg-defaultcolor-dark transition-colors"
                  onClick={handleNextQuestion}
                >
                  Next <FaArrowRight className="inline ml-2" />
                </button>
              ) : examData?.finish_button === "enable" ? ( // Check if finish_button is enabled
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={handleFinishClick} // Trigger modal on click
                >
                  Submit Exam
                </button>
              ) : (
                <></>
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
            <div>
              <Link
                href={`/dashboard/exam-result/${uuid}`}
                className="mt-4 text-center w-full bg-defaultcolor text-white font-semibold py-2 px-4 rounded hover:bg-defaultcolor-dark transition-colors flex justify-center items-center"
              >
                Go to Result
                <AiOutlineArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
      {!submitted && timeLeft > 0 && (
        <div className="w-full md:w-1/3 bg-white shadow-sm rounded-lg">
          <div className="p-4 flex items-center space-x-3">
            <FaCircle className="text-green-400" />
            <p>
              {currentQuestionIndex + 1}/{examData.questions.length} answered
            </p>
          </div>

          <div className="px-4 py-6  bg-gray-100  border-y  border-gray-200">
            <div className="h-3 w-full bg-gray-200 rounded-full relative">
              <div
                className="h-full bg-quaternary rounded-full"
                style={{
                  width: `${
                    (Object.keys(answers).length / examData.questions.length) *
                    100
                  }%`,
                }}
              ></div>
              <span
                className="absolute top-[-8px] text-white text-sm bg-quaternary border border-white px-3 py-0.5 rounded-full"
                style={{
                  left: `${
                    ((Object.keys(answers).length / examData.questions.length) * 100) - 2
                  }%`,
                }}
              >
                {Math.round(
                  (Object.keys(answers).length / examData.questions.length) * 100
                )}
                %
              </span>
            </div>
          </div>

          {/* Exam Name and Total Time */}
          <div className="flex justify-between items-center  bg-white p-4 ">
            <div className="flex items-center space-x-2">
              <AiOutlineClockCircle className="text-gray-600" size={30} />
              <h3 className="text-3xl font-semibold text-gray-600">
                {parseFloat(examData.duration).toFixed(0)}
              </h3>
              <p className="text-lg font-semibold text-gray-500">Minutes</p>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="text-center flex space-x-3 items-center bg-[#ffc300] p-4 ">
            <FaHourglass className="text-black" size={24} />
            <p className="text-3xl font-bold text-black">
              {formatTimeLeft(timeLeft)}
            </p>
          </div>

          <div className="h-6 bg-gray-100  border-y  border-gray-200"></div>

          <div className="p-4">
            {/* Question Navigation Grid */}
            {examData.question_view === "enable" ? (
              <div className="flex items-center justify-center flex-wrap gap-3 text-center">
                {examData.questions.map((question, index) => {
                  const isActive = currentQuestionIndex === index;
                  const isAnswered = !!answers[question.id];

                  return (
                    <div
                      key={index}
                      className={`relative flex items-center justify-center text-lg w-12 h-12 border transition duration-200  bg-white ${
                        isActive
                          ? "border-defaultcolor text-defaultcolor shadow-lg"
                          : isAnswered
                          ? "border-green-500 text-green-500"
                          : "border-yellow-300 text-yellow-600"
                      }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                      style={{
                        cursor:
                          examData.question_view === "enable"
                            ? "pointer"
                            : "not-allowed",
                      }}
                    >
                      {index + 1}
                      <div
                        className={`absolute inset-x-0 bottom-0 h-2  ${
                          isActive
                            ? "bg-defaultcolor"
                            : isAnswered
                            ? "bg-green-500"
                            : "bg-yellow-300"
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-wrap text-lg gap-3 text-center">
                {examData.questions.map((question, index) => {
                  const isActive = currentQuestionIndex === index;
                  const isAnswered = !!answers[question.id];

                  return (
                    <div
                      key={index}
                      className={`relative flex items-center justify-center w-12 h-12 border transition-colors duration-200 bg-white cursor-not-allowed  ${
                        isActive
                          ? "border-defaultcolor text-gray-900 shadow"
                          : isAnswered
                          ? "border-green-500 text-gray-900"
                          : "border-yellow-300 text-gray-900"
                      }`}
                    >
                      {index + 1}
                      <div
                        className={`absolute inset-x-0 bottom-0 h-2  ${
                          isActive
                            ? "bg-defaultcolor"
                            : isAnswered
                            ? "bg-green-500"
                            : "bg-yellow-300"
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-6 bg-gray-100  border-y  border-gray-200"></div>

          {/* Answered and Skipped Count */}
          <div className="flex justify-around items-center space-x-2 text-center p-4">
            <div className="w-1/2 flex items-center justify-center space-x-2 px-5 py-1 rounded-md bg-green-100 shadow-inner">
              <FaRegSmile className="text-green-600" size={20} />
              <span className="text-md font-medium text-green-700">
                Attempted:{" "}
                <span className="text-lg font-semibold">
                  {getAnsweredCount()}
                </span>
              </span>
            </div>
            <div className="w-1/2  flex items-center justify-center space-x-2 px-5 py-1 rounded-md bg-yellow-100 shadow-inner">
              <FaRegFrown className="text-yellow-600" size={20} />
              <span className="text-md font-medium text-yellow-700">
                Skipped:{" "}
                <span className="text-lg font-semibold">
                  {getSkippedCount()}
                </span>
              </span>
            </div>
          </div>

          <div className="h-6 bg-gray-100  border-y  border-gray-200"></div>

          {/* Exam Instructions */}
          <div className="p-4 text-center">
            <button
              className="bg-red-500 block text-white w-full px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={handleFinishClick}
            >
              Finish Exam
            </button>
          </div>
        </div>
      )}
      {showModal && <ConfirmationModal />}{" "}
    </div>
  );
}
