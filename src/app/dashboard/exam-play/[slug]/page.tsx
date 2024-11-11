"use client";

import Loader from "@/components/Common/Loader";
import { AiOutlineArrowRight, AiOutlineClockCircle } from "react-icons/ai"; // For icons
import { MdOutlineBookmarks } from "react-icons/md";

import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { useState, useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaArrowRight,
  FaRegWindowClose,
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
  total_time: string;
  saved_answers: string;
}

export default function PlayExamPage({ params }: { params: { slug: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] | null }>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds)
  const [submitted, setSubmitted] = useState<boolean>(false); // Controls whether exam is submitted
  const [slug, setSlug] = useState<string | null>(null);
  const [currentSubIndex, setCurrentSubIndex] = useState<number | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);


  const [examData, setExamData] = useState<ExamData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [uuid, setUuid] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // State to control modal visibility
  let timerId: NodeJS.Timeout | null = null;

  const answersRef = useRef<{ [key: number]: string[] | null }>({});
  const examDataRef = useRef<ExamData | null>(null);
  const submittedRef = useRef<boolean>(false);
  const hasFetchedData = useRef(false);
  const searchParams = useSearchParams();
  const [visitedQuestionIndices, setVisitedQuestionIndices] = useState<
    Set<number>
  >(new Set());

  const sid = searchParams.get("sid");
  if (!sid || Number(sid) < 0) {
    router.push("/dashboard");
    return null;
  }

  const [notReviewedQuestions, setNotReviewedQuestions] = useState<{
    [key: number]: boolean;
  }>({});

  // Utility function to shuffle an array
  const shuffleArray = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // State to store initial shuffled options for ORD questions
  const [initialShuffledOptions, setInitialShuffledOptions] = useState<{
    [key: number]: string[];
  }>({});

  // Function to compare two arrays for equality
  const arraysEqual = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    return a.every((value, index) => {
      const normalize = (str: string) => str.replace(/<[^>]*>/g, "").trim();
      return normalize(value) === normalize(b[index]);
    });
  };

  useEffect(() => {
    setVisitedQuestionIndices((prev) => {
      const newSet = new Set(prev);
      newSet.add(getAdjustedQuestionIndex() + 1);
      return newSet;
    });
  }, [currentQuestionIndex, currentSubIndex]);

  useEffect(() => {
    answersRef.current = answers;
    examDataRef.current = examData;
    submittedRef.current = submitted;
  }, [answers, examData, submitted]);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");

    const fetchExamSet = async () => {
      Cookies.set("redirect_url", `/dashboard/exam-detail/${slug}?sid=${sid}`, {
        expires: 1,
      });
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/play-exam/${slug}`,
          {
            params: { category, schedule_id: sid },
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
            total_time: fetchExamData.total_time,
            saved_answers: fetchExamData.saved_answers,
          });
          setTimeLeft(Math.round(parseFloat(fetchExamData.duration) * 60));

          // Now that examData is loaded, set up saved answers
          if (fetchExamData.saved_answers) {
            const formattedAnswers = fetchExamData.saved_answers.reduce(
              (acc: any, answerData: any) => {
                const questionType = answerData.type;
                const questionId = answerData.id;
                let formattedAnswer;
                const question = fetchExamData.questions.find(
                  (q: Question) => q.id === questionId
                );

                switch (questionType) {
                  case "MSA":
                    formattedAnswer =
                      answerData.answer !== null
                        ? [question?.options[answerData.answer - 1]]
                        : [];
                    break;
                  case "MMA":
                    formattedAnswer = answerData.answer.map(
                      (index: number) => question?.options[index]
                    );
                    break;
                  case "TOF":
                    formattedAnswer = [
                      answerData.answer === 1 ? "true" : "false",
                    ];
                    break;
                  case "SAQ":
                    formattedAnswer = [answerData.answer];
                    break;
                  case "FIB":
                    formattedAnswer = answerData.answer;
                    break;
                  case "MTF":
                    formattedAnswer = Object.entries(answerData.answer).map(
                      ([key, value]) => [
                        question?.options[parseInt(key) - 1],
                        value,
                      ]
                    );
                    break;
                  case "ORD":
                    formattedAnswer = answerData.answer.map(
                      (index: number) => question?.options[index]
                    );
                    break;
                  case "EMQ":
                    formattedAnswer = answerData.answer.map(
                      (index: number) => question?.options[index - 1]
                    );
                    break;
                  default:
                    formattedAnswer = [];
                }

                acc[questionId] = formattedAnswer;
                return acc;
              },
              {}
            );

            setAnswers(formattedAnswers);
            setIsInitialized(true); // Indicate that initialization is complete

            // For ORD questions, if there are saved answers, we should not shuffle the options
            // Also, set the initialShuffledOptions to the saved answers for comparison later
            fetchExamData.questions.forEach((question: Question) => {
              if (question.type === "ORD") {
                if (formattedAnswers[question.id]) {
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: [...formattedAnswers[question.id]], // Make a copy
                  }));
                  setInitialShuffledOptions((prev) => ({
                    ...prev,
                    [question.id]: [...formattedAnswers[question.id]], // Make a copy
                  }));
                } else {
                  const shuffledOptions = shuffleArray(question.options || []);
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: [...shuffledOptions], // Make a copy
                  }));
                  setInitialShuffledOptions((prev) => ({
                    ...prev,
                    [question.id]: [...shuffledOptions], // Make a copy
                  }));
                }
              }
            });
          } else {
            // If there are no saved answers, initialize ORD questions
            fetchExamData.questions.forEach((question: Question) => {
              if (question.type === "ORD") {
                const shuffledOptions = shuffleArray(question.options || []);
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: [...shuffledOptions], // Make a copy
                }));
                setInitialShuffledOptions((prev) => ({
                  ...prev,
                  [question.id]: [...shuffledOptions], // Make a copy
                }));
              }
            });
          }
        } else {
          toast.error("No exam found for this category");
        }
      } catch (error: any) {
        console.error("Error fetching practice set:", error);
        if (error.response) {
          const { status, data } = error.response;
          if (data.error === "Maximum Attempt Reached") {
            toast.error(data.error);
            router.push("/dashboard/all-exams");
          } else if (status === 401) {
            toast.error("User is not authenticated. Please log in.");
            router.push("/signin");
          } else if (status === 404) {
            toast.error("Please buy a subscription to access this course.");
            Cookies.set(
              "redirect_url",
              `/dashboard/exam-detail/${slug}?sid=${sid}`,
              {
                expires: 1,
              }
            );
            router.push("/pricing");
          } else if (status === 403) {
            toast.error(
              "Feature not available in your plan. Please upgrade your subscription."
            );
            Cookies.set(
              "redirect_url",
              `/dashboard/exam-detail/${slug}?sid=${sid}`,
              {
                expires: 1,
              }
            );
            router.push("/pricing");
          } else {
            toast.error(`An error occurred: ${data.error || "Unknown error"}`);
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExamSet();
  }, [params, router]);

  const clearAnswer = () => {
    if (!examData) {
      return; // Exit if examData is null
    }

    const question = examData.questions[currentQuestionIndex];
    const questionId = question.id;

    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };

      if (question.type === "EMQ" && Array.isArray(question.question)) {
        // For EMQ questions with sub-questions
        if (currentSubIndex !== null) {
          // Clear answer for the specific sub-question
          if (updatedAnswers[questionId]) {
            updatedAnswers[questionId][currentSubIndex] = "";
          }
        } else {
          // Clear all sub-answers
          const subQuestionCount = question.question.length - 1; // Exclude main question
          updatedAnswers[questionId] = Array(subQuestionCount).fill("");
        }
      } else if (question.type === "ORD") {
        // For ORD questions, reset to initial order
        updatedAnswers[questionId] = initialShuffledOptions[questionId];
      } else if (question.type === "MTF") {
        // For MTF questions, clear all pairs
        updatedAnswers[questionId] = [];
      } else {
        // For other question types, set answer to empty array
        updatedAnswers[questionId] = [];
      }

      // Build the formatted answers as per submission payload format
      const formattedAnswers = examData.questions.map((q) => {
        const userAnswer = updatedAnswers[q.id];

        if (!userAnswer || userAnswer.length === 0) {
          return {
            id: q.id,
            type: q.type,
            answer: [],
          };
        }

        switch (q.type) {
          case "MSA":
            return {
              id: q.id,
              type: q.type,
              answer: q.options ? q.options.indexOf(userAnswer[0]) + 1 : 0,
            };

          case "MMA":
            return {
              id: q.id,
              type: q.type,
              answer: userAnswer.map((ans) =>
                q.options ? q.options.indexOf(ans) + 1 : 0
              ),
            };

          case "TOF":
            return {
              id: q.id,
              type: q.type,
              answer: userAnswer[0] === "true" ? 1 : 2,
            };

          case "SAQ":
            return {
              id: q.id,
              type: q.type,
              answer: userAnswer[0],
            };

          case "FIB":
            return {
              id: q.id,
              type: q.type,
              answer: Array.isArray(userAnswer)
                ? userAnswer.map((ans) =>
                    typeof ans === "string" ? ans : String(ans)
                  )
                : [],
            };

          case "MTF":
            const matches = {};
            return {
              id: q.id,
              type: q.type,
              answer: matches,
            };

          case "ORD":
            return {
              id: q.id,
              type: q.type,
              answer: userAnswer.map((opt) =>
                q.options ? q.options.indexOf(opt) : -1
              ),
            };

          case "EMQ":
            const filteredAnswers = userAnswer.map((ans) => {
              return ans
                ? q.options
                  ? q.options.indexOf(ans) + 1
                  : null
                : null;
            });
            return {
              id: q.id,
              type: q.type,
              answer: filteredAnswers.length > 0 ? filteredAnswers : [],
            };

          default:
            return null;
        }
      });

      // Save the answer progress
      saveAnswerProgress(
        uuid,
        formattedAnswers.filter((answer) => answer !== null)
      );

      return updatedAnswers;
    });
  };

  useEffect(() => {
    if (!examData || submitted) return;
    timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerId!);
          if (!submittedRef.current) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
              className="bg-[#E74444] text-white px-4 py-2 rounded hover:bg-red-600"
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

  // Toggle "Not Reviewed" status
  const toggleNotReviewed = (questionId: number) => {
    setNotReviewedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
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

      // Build the formatted answers as per submission payload format
      const formattedAnswers = examData?.questions.map((question) => {
        const userAnswer = existingAnswers[question.id];

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
              answer: userAnswer.map((ans: any) =>
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
            const filteredAnswers = userAnswer.map((ans: string) => {
              return ans
                ? question.options
                  ? question.options.indexOf(ans) + 1
                  : null
                : null;
            });
            return {
              id: question.id,
              type: question.type,
              answer: filteredAnswers.length > 0 ? filteredAnswers : [],
            };

          default:
            return null;
        }
      });

      // Log the formatted answer structure
      console.log(
        "Current formatted answers:",
        formattedAnswers?.filter((answer) => answer !== null)
      );
      saveAnswerProgress(
        uuid,
        formattedAnswers?.filter((answer) => answer !== null)
      );
      return existingAnswers;
    });
  };

  const saveAnswerProgress = async (uuid: any, formattedAnswers: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/save-answer-progress/${uuid}`,
        { answers: formattedAnswers },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      if (response.data.status) {
        console.log(
          "Answer progress saved successfully:",
          response.data.message
        );
        // toast.success("Answer progress saved successfully!");
      } else {
        console.error("Failed to save answer progress:", response.data.message);
        toast.error("Failed to save answer progress.");
      }
    } catch (error) {
      console.error("Error saving answer progress:", error);
      toast.error("Failed to save answer progress.");
    }
  };

  const handleNextQuestion = () => {
    if (
      examData?.questions &&
      currentQuestionIndex < examData.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentSubIndex(null); // Reset sub-question index when moving to the next question
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentSubIndex(null); // Reset sub-question index when moving to the previous question
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
            const filteredAnswers = userAnswer.map((ans: string) => {
              return ans
                ? question.options
                  ? question.options.indexOf(ans) + 1
                  : null
                : null;
            });
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
    let count = 0;
    for (const questionId in answers) {
      const answer = answers[questionId];
      const question = examData?.questions.find(
        (q) => q.id === parseInt(questionId)
      );

      if (Array.isArray(answer)) {
        if (question?.type === "ORD") {
          if (!arraysEqual(answer, initialShuffledOptions[questionId])) {
            count++;
          }
        } else if (answer.some((ans) => ans !== null && ans !== "")) {
          count++;
        }
      } else if (answer !== null && answer !== "") {
        count++;
      }
    }
    return count;
  };

  const getSkippedCount = () => {
    return examData?.questions
      ? getTotalQuestionCount() - getAnsweredCount()
      : 0;
  };

  const getNotReviewedCount = () => {
    return Object.keys(notReviewedQuestions).filter(
      (questionId) => notReviewedQuestions[parseInt(questionId)]
    ).length;
  };

  const moveItem = (questionId: number, fromIndex: number, toIndex: number) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];

      if (toIndex < 0 || toIndex >= currentAnswers.length) {
        return prevAnswers;
      }

      const reorderedAnswers = [...currentAnswers];
      const [movedItem] = reorderedAnswers.splice(fromIndex, 1);
      reorderedAnswers.splice(toIndex, 0, movedItem);

      return {
        ...prevAnswers,
        [questionId]: reorderedAnswers,
      };
    });
  };

  const getTotalQuestionCount = (): number => {
    if (!examData || !examData.questions) {
      return 0; // Return 0 or a fallback value if examData or questions are undefined
    }

    return examData.questions.reduce((count, question) => {
      if (question.type === "EMQ" && Array.isArray(question.question)) {
        // Exclude the first (common) question and count each sub-question
        return count + question.question.length - 1;
      }
      return count + 1; // Non-EMQ questions count as 1
    }, 0);
  };

  const getAdjustedQuestionIndex = (): number => {
    let index = 0;
    for (let i = 0; i < currentQuestionIndex; i++) {
      const question = examData?.questions[i];
      if (question?.type === "EMQ" && Array.isArray(question.question)) {
        index += question.question.length - 1; // Number of sub-questions
      } else {
        index += 1;
      }
    }
    if (examData?.questions[currentQuestionIndex]?.type === "EMQ") {
      return index + (currentSubIndex || 0);
    }
    return index;
  };

  useEffect(() => {
    if (examData?.questions && !isInitialized) {
      examData.questions.forEach((question) => {
        if (question.type === "ORD") {
          if (answers[question.id]) {
            // Do not re-initialize if answers are already present
            return;
          }
          const shuffledOptions = shuffleArray(question.options || []);
          setAnswers((prev) => ({
            ...prev,
            [question.id]: [...shuffledOptions],
          }));
          setInitialShuffledOptions((prev) => ({
            ...prev,
            [question.id]: [...shuffledOptions],
          }));
        }
      });
      setIsInitialized(true); // Set initialization flag to true
    }
  }, [examData]);
  

  const renderQuestion = (question: Question) => {
    const baseQuestionNumber = getAdjustedQuestionIndex();
    const questionNumber =
      question.type === "EMQ" ? baseQuestionNumber + 1 : baseQuestionNumber + 1;

    return (
      <div>
        {(() => {
          switch (question.type) {
            case "MSA": {
              return (
                <div className="flex justify-normal bg-[#f6f7f9]">
                  <div className="bg-defaultcolor p-3">
                    <h5 className="text-white font-semibold text-3xl">
                      {questionNumber}
                    </h5>
                  </div>
                  <div className="space-y-4 p-4 w-full">
                    <p
                      className="mb-4 bg-white p-3 rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(question.question)
                          ? question.question[0]
                          : question.question,
                      }}
                    ></p>
                    {question.options?.map((option, index) => {
                      const isChecked = answers[question.id]?.includes(option);
                      return (
                        <label
                          key={index}
                          className={`flex items-center justify-between space-x-3 p-3 bg-white border rounded-lg cursor-pointer transition-all mb-3 ${
                            isChecked ? "border-defaultcolor" : "border-white"
                          } hover:bg-yellow-100`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full text-black transition-all ${
                                isChecked
                                  ? "bg-defaultcolor text-white"
                                  : "bg-gray-200"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div
                              className={`transition-all ${
                                isChecked ? "text-defaultcolor" : "text-black"
                              }`}
                              dangerouslySetInnerHTML={{ __html: option }}
                            ></div>
                          </div>
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            onChange={() =>
                              handleAnswerChange(question.id, [option])
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
                </div>
              );
            }

            case "MMA": {
              return (
                <div className="flex justify-normal bg-[#f6f7f9]">
                  <div className="bg-defaultcolor p-3">
                    <h5 className="text-white font-semibold text-3xl">
                      {questionNumber}
                    </h5>
                  </div>
                  <div className="space-y-4 p-4 w-full">
                    <p
                      className="mb-4 bg-white p-3 rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(question.question)
                          ? question.question[0]
                          : question.question,
                      }}
                    ></p>
                    {question.options?.map((option, index) => {
                      const isChecked = answers[question.id]?.includes(option);
                      return (
                        <label
                          key={index}
                          className={`flex items-center justify-between space-x-3 p-3 bg-white border rounded-lg cursor-pointer transition-all mb-3 ${
                            isChecked ? "border-defaultcolor" : "border-white"
                          } hover:bg-yellow-100`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full text-black transition-all ${
                                isChecked
                                  ? "bg-defaultcolor text-white"
                                  : "bg-gray-200"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div
                              className={`transition-all ${
                                isChecked ? "text-defaultcolor" : "text-black"
                              }`}
                              dangerouslySetInnerHTML={{ __html: option }}
                            ></div>
                          </div>
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
                    })}
                  </div>
                </div>
              );
            }

            case "TOF": {
              return (
                <div className="flex justify-normal bg-[#f6f7f9]">
                  <div className="bg-defaultcolor p-3">
                    <h5 className="text-white font-semibold text-3xl">
                      {questionNumber}
                    </h5>
                  </div>
                  <div className="space-y-4 p-4 w-full">
                    <p
                      className="mb-4 bg-white p-3 rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(question.question)
                          ? question.question[0]
                          : question.question,
                      }}
                    ></p>
                    <label
                      className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all bg-white hover:bg-yellow-100 ${
                        answers[question.id]?.includes("true")
                          ? "border-defaultcolor"
                          : "border-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
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
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="true"
                        onChange={() =>
                          handleAnswerChange(question.id, ["true"])
                        }
                        checked={
                          answers[question.id]?.includes("true") || false
                        }
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
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="false"
                        onChange={() =>
                          handleAnswerChange(question.id, ["false"])
                        }
                        checked={
                          answers[question.id]?.includes("false") || false
                        }
                        className={`cursor-pointer focus:ring-1 focus:ring-defaultcolor ${
                          answers[question.id]?.includes("false")
                            ? "checked:bg-defaultcolor"
                            : ""
                        }`}
                      />
                    </label>
                  </div>
                </div>
              );
            }

            case "SAQ": {
              return (
                <div className="flex justify-normal bg-[#f6f7f9]">
                  <div className="bg-defaultcolor p-3">
                    <h5 className="text-white font-semibold text-3xl">
                      {questionNumber}
                    </h5>
                  </div>
                  <div className="space-y-4 p-4 w-full">
                    <p
                      className="mb-4 bg-white p-3 rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(question.question)
                          ? question.question[0]
                          : question.question,
                      }}
                    ></p>
                    <textarea
                      className="w-full p-4 rounded-lg border border-gray-300 focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor"
                      placeholder="Type your answer here..."
                      value={answers[question.id]?.[0] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, [e.target.value])
                      }
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              );
            }

            case "MTF": {
              return (
                <div className="flex justify-normal bg-[#f6f7f9]">
                  <div className="bg-defaultcolor p-3">
                    <h5 className="text-white font-semibold text-3xl">
                      {questionNumber}
                    </h5>
                  </div>
                  <div className="space-y-4 p-4 w-full">
                    <p className="mb-4 font-medium">Match the following:</p>
                    {question.options
                      ?.slice(0, question.options.length / 2)
                      .map((opt, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:space-x-4 mb-4 space-y-2 sm:space-y-0"
                        >
                          <p
                            className="flex-1 p-2 rounded bg-white text-left"
                            dangerouslySetInnerHTML={{ __html: opt }}
                          ></p>
                          <select
                            className="flex-1 p-2 rounded border border-gray-300 focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor w-full sm:w-auto appearance-none"
                            onChange={(e) =>
                              handleAnswerChange(question.id, [
                                opt,
                                e.target.value,
                              ])
                            }
                            value={
                              answers[question.id]?.find(
                                (pair) => pair[0] === opt
                              )?.[1] || ""
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
                </div>
              );
            }

            case "ORD": {
              return (
                <div className="flex justify-normal bg-[#f6f7f9]">
                  <div className="bg-defaultcolor p-3">
                    <h5 className="text-white font-semibold text-3xl">
                      {questionNumber}
                    </h5>
                  </div>
                  <div className="space-y-4 p-4 w-full">
                    <p className="mb-4 font-medium">
                      Arrange in sequence (Use the arrows to reorder):
                    </p>
                    <ul>
                      {answers[question.id]?.map((option, index) => (
                        <li
                          key={index}
                          className="p-3 bg-white rounded-lg mb-2 flex items-center justify-between"
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: option }}
                          ></div>
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
                                index ===
                                (answers[question.id]?.length || 0) - 1
                              }
                            >
                              ↓
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            case "FIB": {
              const numberOfBlanks = parseInt(question.options?.[0] ?? "0", 10);
              return (
                <div className="flex justify-normal bg-[#f6f7f9]">
                  <div className="bg-defaultcolor p-3">
                    <h5 className="text-white font-semibold text-3xl">
                      {questionNumber}
                    </h5>
                  </div>
                  <div className="space-y-4 p-4 w-full">
                    <p
                      className="mb-4 bg-white p-3 rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: Array.isArray(question.question)
                          ? question.question[0]
                          : question.question,
                      }}
                    ></p>
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
                </div>
              );
            }
            case "EMQ": {
              const mainQuestion = Array.isArray(question.question)
                ? question.question[0]
                : "";
              const subQuestions = Array.isArray(question.question)
                ? question.question.slice(1)
                : [];

              return (
                <div className="space-y-4">
                  {/* Display Main Question */}
                  <div className="bg-white rounded-lg mb-4 p-4">
                    <p
                      className="font-semibold"
                      dangerouslySetInnerHTML={{ __html: mainQuestion }}
                    ></p>
                  </div>

                  {/* Display each Sub-question with layout and number */}
                  {subQuestions.map((subQuestion, subIndex) => {
                    const adjustedQuestionNumber =
                      baseQuestionNumber + subIndex + 1;

                    return (
                      <div
                        key={subIndex}
                        className="flex justify-normal bg-[#f6f7f9] mb-6"
                      >
                        <div className="bg-defaultcolor p-3">
                          <h5 className="text-white font-semibold text-3xl">
                            {adjustedQuestionNumber}
                          </h5>
                        </div>
                        <div className="space-y-4 p-4 w-full">
                          <div className="text-lg bg-white p-3 rounded-sm">
                            <span
                              dangerouslySetInnerHTML={{ __html: subQuestion }}
                              className="font-normal"
                            ></span>
                          </div>

                          {/* Dropdown for each Sub-question */}
                          <select
                            className="p-3 rounded-lg border border-gray-300 w-full focus:ring-1 focus:ring-defaultcolor"
                            onChange={(e) =>
                              handleAnswerChange(
                                question.id,
                                [e.target.value],
                                subIndex
                              )
                            }
                            value={answers[question.id]?.[subIndex] || ""}
                          >
                            <option value="">Select an answer</option>
                            {question.options?.map((option, optionIndex) => (
                              <option
                                key={optionIndex}
                                value={option}
                                dangerouslySetInnerHTML={{
                                  __html: option,
                                }}
                              ></option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

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
            <h1 className="text-2xl border p-3 font-semibold mb-5 flex items-center gap-2">
              {examData.title}
            </h1>

            <div className="render_questions_view">
              {renderQuestion(examData.questions[currentQuestionIndex])}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-between mt-6 items-center">
              {/* First set of buttons */}
              <div className="flex space-x-4">
                <button
                  className="flex items-center justify-center w-16 h-12 rounded-lg focus:outline-none border border-gray-600 text-gray-600"
                  onClick={clearAnswer}
                >
                  <FaRegWindowClose size={20} />
                </button>

                {/* "Not Reviewed" Button */}
                <button
                  className={`flex items-center justify-center w-16 h-12 rounded-lg border  focus:outline-none  ${
                    notReviewedQuestions[
                      examData.questions[currentQuestionIndex].id
                    ]
                      ? "bg-[#C9BC0F] text-white"
                      : "bg-gray-400 text-white"
                  }`}
                  onClick={() =>
                    toggleNotReviewed(
                      examData.questions[currentQuestionIndex].id
                    )
                  }
                >
                  <MdOutlineBookmarks size={20} />
                </button>
              </div>

              {/* Second set of buttons */}

              <button
                className="flex items-center justify-center w-32 h-12 bg-white text-defaultcolor border border-defaultcolor rounded-lg disabled:opacity-50"
                disabled={currentQuestionIndex === 0}
                onClick={handlePreviousQuestion}
              >
                <FaArrowLeft className="inline mr-2" /> Previous
              </button>

              {currentQuestionIndex < examData.questions.length - 1 ? (
                <button
                  className="flex items-center justify-center w-32 h-12 bg-defaultcolor text-white rounded-lg hover:bg-defaultcolor-dark transition-colors"
                  onClick={handleNextQuestion}
                >
                  Next <FaArrowRight className="inline ml-2" />
                </button>
              ) : examData?.finish_button === "enable" ? (
                <button
                  className="flex items-center justify-center w-32 h-12 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  onClick={handleFinishClick}
                >
                  Submit Exam
                </button>
              ) : null}
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
        <div className="w-full md:w-1/4 bg-white shadow-sm rounded-lg">
          <div className="p-4 flex items-center space-x-3">
            <FaCircle className="text-green-400" />
            <p>
              {getAnsweredCount()}/{getTotalQuestionCount()} answered
            </p>
          </div>

          <div className="px-4 py-6  bg-gray-100  border-y  border-gray-200">
            <div className="h-3 w-full bg-gray-200 rounded-full relative">
              <div
                className="h-full bg-quaternary rounded-full"
                style={{
                  width: `${
                    (getAnsweredCount() / getTotalQuestionCount()) * 100
                  }%`,
                }}
              ></div>
              <span
                className="absolute top-[-8px] text-white text-sm bg-quaternary border border-white px-3 py-0.5 rounded-full"
                style={{
                  left: `${
                    (getAnsweredCount() / getTotalQuestionCount()) * 100 - 2
                  }%`,
                }}
              >
                {Math.round(
                  (getAnsweredCount() / getTotalQuestionCount()) * 100
                )}
                %
              </span>
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
                {examData.questions.reduce(
                  (acc: JSX.Element[], question, questionIndex) => {
                    const questionId = question.id;

                    // Check if question has been answered based on its type
                    const isAnswered = (() => {
                      if (question.type === "ORD") {
                        const userAnswer = answers[questionId];
                        const initialOptions =
                          initialShuffledOptions[questionId];
                        if (!userAnswer || !initialOptions) return false;
                        const normalizeArray = (arr: string[]) =>
                          arr.map((str) => str.replace(/<[^>]*>/g, "").trim());
                        const userNormalized = normalizeArray(userAnswer);
                        const initialNormalized =
                          normalizeArray(initialOptions);
                        return !arraysEqual(userNormalized, initialNormalized);
                      } else {
                        return (
                          Array.isArray(answers[questionId]) &&
                          answers[questionId]?.some(
                            (ans) => ans !== null && ans !== ""
                          )
                        );
                      }
                    })();

                    // Handle EMQ questions with sub-questions
                    if (
                      question.type === "EMQ" &&
                      Array.isArray(question.question)
                    ) {
                      const subQuestions = question.question.slice(1); // Exclude main question text

                      subQuestions.forEach((_, subIndex) => {
                        const adjustedIndex = acc.length + 1;
                        const isActive =
                          currentQuestionIndex === questionIndex &&
                          currentSubIndex === subIndex;
                        const isAnswered =
                          !!answers[questionId]?.[subIndex] &&
                          answers[questionId][subIndex] !== "";
                        const isNotReviewed =
                          !!notReviewedQuestions[questionId];
                        const isVisited =
                          visitedQuestionIndices.has(adjustedIndex);

                        // Determine colors based on status
                        let borderColor = "border-[#989898]";
                        let textColor = "text-[#989898]";
                        let bottomDivColor = "bg-[#989898]";

                        if (isActive) {
                          borderColor = "border-defaultcolor";
                          textColor = "text-defaultcolor";
                          bottomDivColor = "bg-defaultcolor";
                        } else if (isNotReviewed) {
                          borderColor = "border-[#C9BC0F]";
                          textColor = "text-[#C9BC0F]";
                          bottomDivColor = "bg-[#C9BC0F]";
                        } else if (isAnswered) {
                          borderColor = "border-[#76b51b]";
                          textColor = "text-[#76b51b]";
                          bottomDivColor = "bg-[#76b51b]";
                        } else if (isVisited) {
                          borderColor = "border-[#E74444]";
                          textColor = "text-[#E74444]";
                          bottomDivColor = "bg-[#E74444]";
                        }

                        acc.push(
                          <div
                            key={`${questionIndex}-${subIndex}`}
                            className={`relative flex items-center justify-center text-lg w-12 h-12 border ${borderColor} ${textColor} transition duration-200 bg-white`}
                            onClick={() => {
                              setCurrentQuestionIndex(questionIndex); // Set the question index
                              setCurrentSubIndex(subIndex); // Set the sub-question index
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {adjustedIndex}
                            <div
                              className={`absolute inset-x-0 bottom-0 h-2 ${bottomDivColor}`}
                            />
                          </div>
                        );
                      });
                    } else {
                      // For non-EMQ questions, add a single navigation item
                      const adjustedIndex = acc.length + 1;
                      const isActive = currentQuestionIndex === questionIndex;
                      const isNotReviewed = !!notReviewedQuestions[questionId];
                      const isVisited =
                        visitedQuestionIndices.has(adjustedIndex);

                      // Determine colors based on isAnswered status using questionId to handle reordering
                      let borderColor = "border-[#989898]";
                      let textColor = "text-[#989898]";
                      let bottomDivColor = "bg-[#989898]";

                      if (isActive) {
                        borderColor = "border-defaultcolor";
                        textColor = "text-defaultcolor";
                        bottomDivColor = "bg-defaultcolor";
                      } else if (isNotReviewed) {
                        borderColor = "border-[#C9BC0F]";
                        textColor = "text-[#C9BC0F]";
                        bottomDivColor = "bg-[#C9BC0F]";
                      } else if (isAnswered) {
                        borderColor = "border-[#76b51b]";
                        textColor = "text-[#76b51b]";
                        bottomDivColor = "bg-[#76b51b]";
                      } else if (isVisited) {
                        borderColor = "border-[#E74444]";
                        textColor = "text-[#E74444]";
                        bottomDivColor = "bg-[#E74444]";
                      }

                      acc.push(
                        <div
                          key={questionId} // Use questionId as key
                          className={`relative flex items-center justify-center text-lg w-12 h-12 border ${borderColor} ${textColor} transition duration-200 bg-white`}
                          onClick={() => {
                            setCurrentQuestionIndex(questionIndex); // Maintain question index for display
                            setCurrentSubIndex(null); // Reset sub-index for non-EMQ questions
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {adjustedIndex}
                          <div
                            className={`absolute inset-x-0 bottom-0 h-2 ${bottomDivColor}`}
                          />
                        </div>
                      );
                    }

                    return acc;
                  },
                  []
                )}
              </div>
            ) : (
              // The else block remains unchanged
              <div className="flex items-center justify-center flex-wrap gap-3 text-center">
                {examData.questions.reduce(
                  (acc: JSX.Element[], question, questionIndex) => {
                    const questionId = question.id;

                    // Handle EMQ questions with sub-questions
                    if (
                      question.type === "EMQ" &&
                      Array.isArray(question.question)
                    ) {
                      const subQuestions = question.question.slice(1); // Exclude main question text

                      subQuestions.forEach((_, subIndex) => {
                        const adjustedIndex = acc.length + 1;
                        const isActive =
                          currentQuestionIndex === questionIndex &&
                          currentSubIndex === subIndex;
                        const isAnswered =
                          !!answers[questionId]?.[subIndex] &&
                          answers[questionId][subIndex] !== "";
                        const isNotReviewed =
                          !!notReviewedQuestions[questionId];
                        const isVisited =
                          visitedQuestionIndices.has(adjustedIndex);

                        // Determine colors based on status
                        let borderColor = "border-[#989898]";
                        let textColor = "text-[#989898]";
                        let bottomDivColor = "bg-[#989898]";

                        if (isActive) {
                          borderColor = "border-defaultcolor";
                          textColor = "text-defaultcolor";
                          bottomDivColor = "bg-defaultcolor";
                        } else if (isNotReviewed) {
                          borderColor = "border-[#C9BC0F]";
                          textColor = "text-[#C9BC0F]";
                          bottomDivColor = "bg-[#C9BC0F]";
                        } else if (isAnswered) {
                          borderColor = "border-[#76b51b]";
                          textColor = "text-[#76b51b]";
                          bottomDivColor = "bg-[#76b51b]";
                        } else if (isVisited) {
                          borderColor = "border-[#E74444]";
                          textColor = "text-[#E74444]";
                          bottomDivColor = "bg-[#E74444]";
                        }

                        acc.push(
                          <div
                            key={`${questionIndex}-${subIndex}`}
                            className={`relative flex items-center justify-center text-lg w-12 h-12 border ${borderColor} ${textColor} transition duration-200 bg-white cursor-not-allowed`}
                          >
                            {adjustedIndex}
                            <div
                              className={`absolute inset-x-0 bottom-0 h-2 ${bottomDivColor}`}
                            />
                          </div>
                        );
                      });
                    } else {
                      // For non-EMQ questions, add a single navigation item
                      const adjustedIndex = acc.length + 1;
                      const isActive = currentQuestionIndex === questionIndex;
                      const isAnswered =
                        Array.isArray(answers[questionId]) &&
                        answers[questionId]?.some(
                          (ans) => ans !== null && ans !== ""
                        );
                      const isNotReviewed = !!notReviewedQuestions[questionId];
                      const isVisited =
                        visitedQuestionIndices.has(adjustedIndex);

                      // Determine colors based on status
                      let borderColor = "border-[#989898]";
                      let textColor = "text-[#989898]";
                      let bottomDivColor = "bg-[#989898]";

                      if (isActive) {
                        borderColor = "border-defaultcolor";
                        textColor = "text-defaultcolor";
                        bottomDivColor = "bg-defaultcolor";
                      } else if (isNotReviewed) {
                        borderColor = "border-[#C9BC0F]";
                        textColor = "text-[#C9BC0F]";
                        bottomDivColor = "bg-[#C9BC0F]";
                      } else if (isAnswered) {
                        borderColor = "border-[#76b51b]";
                        textColor = "text-[#76b51b]";
                        bottomDivColor = "bg-[#76b51b]";
                      } else if (isVisited) {
                        borderColor = "border-[#E74444]";
                        textColor = "text-[#E74444]";
                        bottomDivColor = "bg-[#E74444]";
                      }

                      acc.push(
                        <div
                          key={questionIndex}
                          className={`relative flex items-center justify-center text-lg w-12 h-12 border ${borderColor} ${textColor} transition duration-200 bg-white cursor-not-allowed`}
                        >
                          {adjustedIndex}
                          <div
                            className={`absolute inset-x-0 bottom-0 h-2 ${bottomDivColor}`}
                          />
                        </div>
                      );
                    }

                    return acc;
                  },
                  []
                )}
              </div>
            )}
          </div>

          <div className="h-6 bg-gray-100  border-y  border-gray-200"></div>

          {/* Legend */}
          <div className="flex justify-between items-center flex-wrap text-center p-4">
            <div className="flex items-center w-1/2 space-x-2">
              <div className="w-4 h-4 bg-[#76b51b]"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <div className="w-4 h-4 bg-[#C9BC0F]"></div>
              <span>Under Review</span>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <div className="w-4 h-4 bg-[#E74444]"></div>
              <span>Unanswered</span>
            </div>
            <div className="flex items-center w-1/2 space-x-2">
              <div className="w-4 h-4 bg-[#989898]"></div>
              <span>Not Visited</span>
            </div>
          </div>

          {/* <div className="h-6 bg-gray-100  border-y  border-gray-200"></div> */}

          {/* Answered, Skipped, and Not Reviewed Count */}
          {/* <div className="flex justify-around items-center space-x-2 text-center p-4">
            <div className="w-1/3 flex items-center justify-center space-x-2 px-5 py-1 rounded-md bg-green-100 shadow-inner">
              <FaRegSmile className="text-green-600" size={20} />
              <span className="text-md font-medium text-green-700">
                Attempted:{" "}
                <span className="text-lg font-semibold">
                  {getAnsweredCount()}
                </span>
              </span>
            </div>
            <div className="w-1/3  flex items-center justify-center space-x-2 px-5 py-1 rounded-md bg-yellow-100 shadow-inner">
              <FaRegFrown className="text-yellow-600" size={20} />
              <span className="text-md font-medium text-yellow-700">
                Skipped:{" "}
                <span className="text-lg font-semibold">
                  {getSkippedCount()}
                </span>
              </span>
            </div>
            <div className="w-1/3  flex items-center justify-center space-x-2 px-5 py-1 rounded-md bg-orange-100 shadow-inner">
              <FaRegSmile className="text-orange-600" size={20} />
              <span className="text-md font-medium text-orange-700">
                Under Review:{" "}
                <span className="text-lg font-semibold">
                  {getNotReviewedCount()}
                </span>
              </span>
            </div>
          </div> */}

          <div className="h-6 bg-gray-100  border-y  border-gray-200"></div>

          {/* Exam Instructions */}
          <div className="p-4 text-center">
            <button
              className="bg-[#E74444] block text-white w-full px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
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
