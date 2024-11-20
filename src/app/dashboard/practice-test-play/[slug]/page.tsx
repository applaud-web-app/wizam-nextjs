"use client";

import Loader from "@/components/Common/Loader";
import { AiOutlineArrowRight } from "react-icons/ai";
import { MdOutlineBookmarks } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaArrowRight,
  FaRegWindowClose,
  FaArrowLeft,
  FaCircle,
  FaHourglass,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "flowbite-react";
import Link from "next/link";
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
  options?: string[];
}

// SavedAnswer interface
interface SavedAnswer {
  id: number;
  type: string;
  answer: any;
}

// PracticeSet interface
interface PracticeSet {
  question_view: string;
  title: string;
  questions: Question[];
  duration: string;
  points: number;
  finish_button: string; // "enable" or "disable"
  total_time: string;
  saved_answers: SavedAnswer[];
}

export default function PracticeSetPlay({
  params,
}: {
  params: { slug: string };
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Timer (in seconds)
  const [submitted, setSubmitted] = useState<boolean>(false); // Controls whether the test is submitted
  const [slug, setSlug] = useState<string | null>(null);
  const [currentSubIndex, setCurrentSubIndex] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [uuid, setUuid] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // State to control modal visibility
  let timerId: NodeJS.Timeout | null = null;
  const answersRef = useRef<{ [key: number]: any }>({});
  const practiceSetRef = useRef<PracticeSet | null>(null);
  const submittedRef = useRef<boolean>(false);
  const hasFetchedData = useRef(false);
  const searchParams = useSearchParams();
  const [visitedQuestionIndices, setVisitedQuestionIndices] = useState<
    Set<number>
  >(new Set());
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
  const arraysEqual = (a?: any[], b?: any[]) => {
    if (a === b) return true; // Both are the same reference or both are undefined/null
    if (!a || !b) return false; // One is undefined/null while the other isn't
    if (a.length !== b.length) return false; // Different lengths

    return a.every((value, index) => {
      const normalize = (str: any) => {
        if (typeof str !== "string") return str;
        return str.replace(/<[^>]*>/g, "").trim();
      };
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
    practiceSetRef.current = practiceSet;
    submittedRef.current = submitted;
  }, [answers, practiceSet, submitted]);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");

    const fetchExamSet = async () => {
      Cookies.set("redirect_url", `/dashboard/practice-set-play/${slug}`, {
        expires: 1,
      });
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/play-practice-set/${slug}`,
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
          setPracticeSet({
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

          // Start of Local Storage Integration
          const localStorageKey = `examStatus_${fetchExamData.uuid}`;
          const savedData = localStorage.getItem(localStorageKey);
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              setAnswers(parsedData.answers || {});
              setNotReviewedQuestions(
                parsedData.notReviewedQuestions || {}
              );
              setVisitedQuestionIndices(
                new Set(parsedData.visitedQuestionIndices || [])
              );
              setCurrentQuestionIndex(parsedData.currentQuestionIndex || 0);
              setCurrentSubIndex(parsedData.currentSubIndex || null);
              setTimeLeft(
                parsedData.timeLeft ||
                  Math.round(parseFloat(fetchExamData.duration) * 60)
              );
              setInitialShuffledOptions(
                parsedData.initialShuffledOptions || {}
              );
            } catch (error) {
              console.error("Error parsing local storage data:", error);
              initializeAnswers(fetchExamData);
            }
          } else {
            initializeAnswers(fetchExamData);
          }
        } else {
          toast.error("No practice test found for this category");
        }
      } catch (error: any) {
        console.error("Error fetching practice test:", error);
        if (error.response) {
          const { status, data } = error.response;
          if (data.error === "Maximum Attempt Reached") {
            toast.error(data.error);
            router.push("/dashboard/practice-test");
          } else if (status === 401) {
            toast.error("User is not authenticated. Please log in.");
            router.push("/signin");
          } else if (status === 404) {
            toast.error("Please buy a subscription to access this course.");
            Cookies.set("redirect_url", `/dashboard/practice-test/${slug}`, {
              expires: 1,
            });
            router.push("/pricing");
          } else if (status === 403) {
            toast.error(
              "Feature not available in your plan. Please upgrade your subscription."
            );
            Cookies.set("redirect_url", `/dashboard/practice-test/${slug}`, {
              expires: 1,
            });
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

  // Initialize Answers Function
  const initializeAnswers = (fetchExamData: PracticeSet) => {
    const formattedAnswers: { [key: number]: any } = {};
    const shuffledOptionsMap: { [key: number]: string[] } = {};

    if (!fetchExamData.saved_answers || !fetchExamData.questions) {
      console.error(
        "Missing saved_answers or questions in practice test data."
      );
      return;
    }

    // Populate answers from saved answers in fetchExamData
    fetchExamData.questions.forEach((question) => {
      const savedAnswer = fetchExamData.saved_answers.find(
        (ans) => ans.id === question.id
      );

      if (question.type === "ORD") {
        // Shuffle options and store in initialShuffledOptions
        const shuffledOptions = shuffleArray(question.options || []);
        shuffledOptionsMap[question.id] = shuffledOptions;

        // Set answers[question.id] to null to indicate not answered
        formattedAnswers[question.id] = savedAnswer?.answer || null;
      } else if (question.type === "FIB") {
        if (savedAnswer && Array.isArray(savedAnswer.answer)) {
          // If the answer is already an array, use it directly
          formattedAnswers[question.id] = savedAnswer.answer;
        } else if (savedAnswer && typeof savedAnswer.answer === "string") {
          // If the answer is a string (e.g., "himanshu, dev"), split it into an array
          formattedAnswers[question.id] = savedAnswer.answer
            .split(",")
            .map((ans) => ans.trim());
        } else {
          formattedAnswers[question.id] = null;
        }
      } else if (question.type === "MTF") {
        if (savedAnswer && typeof savedAnswer.answer === "object") {
          const pairs = Object.entries(savedAnswer.answer).map(
            ([key, value]) => {
              const term = question.options
                ? question.options[parseInt(key) - 1]
                : "";
              return [term, value];
            }
          );
          formattedAnswers[question.id] = pairs;
        } else {
          formattedAnswers[question.id] = [];
        }
      } else {
        formattedAnswers[question.id] = savedAnswer?.answer || null;
      }
    });

    setAnswers(formattedAnswers);
    setInitialShuffledOptions(shuffledOptionsMap);
    setIsInitialized(true);

    // Set the current question index to the last answered question
    let lastAnsweredIndex = 0;
    fetchExamData.questions.forEach((question, index) => {
      const savedAnswer = fetchExamData.saved_answers.find(
        (ans) => ans.id === question.id
      );
      if (
        savedAnswer &&
        savedAnswer.answer &&
        (Array.isArray(savedAnswer.answer)
          ? savedAnswer.answer.some((ans) => ans !== "")
          : savedAnswer.answer !== "")
      ) {
        lastAnsweredIndex = index;
      }
    });
    setCurrentQuestionIndex(lastAnsweredIndex);
  };

  const clearAnswer = () => {
    if (!practiceSet) {
      return; // Exit if practiceSet is null
    }

    const question = practiceSet.questions[currentQuestionIndex];
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
      const formattedAnswers = practiceSet.questions.map((q) => {
        const userAnswer = updatedAnswers[q.id];

        if (!userAnswer || userAnswer.length === 0) {
          let blankAnswer;
          switch (q.type) {
            case "MSA":
            case "TOF":
            case "SAQ":
              blankAnswer = null;
              break;
            case "ORD":
            case "FIB":
              blankAnswer = null;
              break;
            default:
              blankAnswer = [];
          }
          return {
            id: q.id,
            type: q.type,
            answer: blankAnswer,
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
              answer: userAnswer.map((ans: any) =>
                q.options ? q.options.indexOf(ans) + 1 : 1
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
                : null,
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
              answer: null,
            };

          case "EMQ":
            const filteredAnswers = userAnswer.map((ans: any) => {
              return ans
                ? q.options
                  ? q.options.indexOf(ans) + 1
                  : null
                : null;
            });
            return {
              id: q.id,
              type: q.type,
              answer:
                filteredAnswers.length > 0 ? filteredAnswers : null,
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
    if (!practiceSet || submitted) return;
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
  }, [practiceSet]);

  // Modal Dialog for Confirming Submission
  const ConfirmationModal = ({}) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1001]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="font-bold text-lg mb-2">Are you sure?</h2>
          <p className="text-gray-600 mb-4">
            Are you sure you want to submit the test? Once submitted, you
            will not be able to make further changes.
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
              Finish Practice Test
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
    answer: any,
    subQuestionIndex?: number // for handling sub-questions like in EMQ
  ) => {
    setAnswers((prev: any) => {
      const existingAnswers = { ...prev };

      // Handle sub-questions (like in EMQ)
      if (typeof subQuestionIndex === "number") {
        const updatedSubAnswers = existingAnswers[questionId] || [];
        updatedSubAnswers[subQuestionIndex] = answer[0];
        existingAnswers[questionId] = updatedSubAnswers;
      } else if (
        practiceSet?.questions.find((q) => q.id === questionId)?.type ===
          "MTF" &&
        answer.length === 2
      ) {
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
      } else if (
        practiceSet?.questions.find((q) => q.id === questionId)?.type === "ORD"
      ) {
        // For ORD, set the new order directly
        existingAnswers[questionId] = [...answer];
      } else {
        // For other question types, set the answer directly
        existingAnswers[questionId] = answer;
      }

      // Build the formatted answers as per submission payload format
      const formattedAnswers = practiceSet?.questions.map((question) => {
        const userAnswer = existingAnswers[question.id];

        // Handle Unattempted Questions Properly
        if (
          !userAnswer ||
          (Array.isArray(userAnswer) && userAnswer.length === 0)
        ) {
          let blankAnswer;
          switch (question.type) {
            case "MSA":
            case "TOF":
            case "SAQ":
              blankAnswer = null;
              break;
            case "ORD":
            case "FIB":
              blankAnswer = null;
              break;
            default:
              blankAnswer = [];
          }
          return {
            id: question.id,
            type: question.type,
            answer: blankAnswer,
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
                question.options
                  ? question.options.indexOf(ans) + 1
                  : 1
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
                : null,
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
                    const termIndex =
                      question.options.indexOf(pair[0]) + 1;
                    matches[termIndex] = pair[1];
                  }
                }
              );
            }
            return {
              id: question.id,
              type: question.type,
              answer:
                Object.keys(matches).length > 0 ? matches : null,
            };

          case "ORD":
            return {
              id: question.id,
              type: question.type,
              answer: userAnswer ? [...userAnswer] : null,
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
              answer:
                filteredAnswers.length > 0 ? filteredAnswers : null,
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
    // Return early if practiceSet or uuid is null
    if (!practiceSet || !uuid) return;

    try {
      const ordQuestionIds = practiceSet.questions
        .filter((question) => question.type === "ORD")
        .map((question) => question.id);

      const answersToSave = formattedAnswers
        .map((answer: { id: number; answer: any }) => {
          // Check for ORD answers if they match initial shuffled options
          if (ordQuestionIds.includes(answer.id)) {
            const initialOrder = initialShuffledOptions[answer.id] || [];
            const currentOrder = answers[answer.id] || [];

            // Only save if the order has changed
            if (!arraysEqual(currentOrder, initialOrder)) {
              return answer;
            } else {
              return null;
            }
          }
          return answer;
        })
        .filter(Boolean); // Filter out null values where answers are unchanged

      if (answersToSave.length === 0) return; // If no answers to save, skip API call

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/save-practice-set-answer-progress/${uuid}`,
        { answers: answersToSave },
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
      } else {
        console.error(
          "Failed to save answer progress:",
          response.data.message
        );
        toast.error("Failed to save answer progress.");
      }
    } catch (error) {
      console.error("Error saving answer progress:", error);
      toast.error("Failed to save answer progress.");
    }
  };

  const handleNextQuestion = () => {
    if (
      practiceSet?.questions &&
      currentQuestionIndex < practiceSet.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentSubIndex(null); // Reset sub-question index when moving to the next question
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentSubIndex(null); // Reset sub-index for non-EMQ questions
    }
  };

  const handleSubmit = async () => {
    // Prevent submission if it has already been submitted
    if (submittedRef.current) return; // Use ref to guard against duplicate submissions

    setSubmitted(true);
    submittedRef.current = true; // Set ref to prevent future calls
    if (timerId) clearInterval(timerId); // Stop the timer when submitting

    const formattedAnswers = practiceSetRef.current?.questions.map(
      (question: Question) => {
        const userAnswer = answersRef.current[question.id];

        // Handle Unattempted Questions Properly
        if (
          !userAnswer ||
          (Array.isArray(userAnswer) && userAnswer.length === 0)
        ) {
          let blankAnswer;
          switch (question.type) {
            case "MSA":
            case "TOF":
            case "SAQ":
              blankAnswer = null;
              break;
            case "ORD":
            case "FIB":
              blankAnswer = null;
              break;
            default:
              blankAnswer = [];
          }
          return {
            id: question.id,
            type: question.type,
            answer: blankAnswer,
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
                question.options
                  ? question.options.indexOf(ans) + 1
                  : 1
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
                : null,
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
                    const termIndex =
                      question.options.indexOf(pair[0]) + 1;
                    matches[termIndex] = pair[1];
                  }
                }
              );
            }
            return {
              id: question.id,
              type: question.type,
              answer:
                Object.keys(matches).length > 0 ? matches : null,
            };

          case "ORD":
            // Only include answer if user has rearranged options
            if (
              Array.isArray(userAnswer) &&
              !arraysEqual(userAnswer, initialShuffledOptions[question.id])
            ) {
              return {
                id: question.id,
                type: question.type,
                answer: userAnswer ? [...userAnswer] : null,
              };
            } else {
              // User hasn't rearranged, so consider it unanswered
              return {
                id: question.id,
                type: question.type,
                answer: null,
              };
            }

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
              answer:
                filteredAnswers.length > 0 ? filteredAnswers : null,
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
        `${process.env.NEXT_PUBLIC_API_URL}/finish-practice-set/${uuid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Practice Test submitted successfully!");
        // Clear Local Storage Upon Successful Submission
        const localStorageKey = `examStatus_${uuid}`;
        localStorage.removeItem(localStorageKey);
      } else {
        toast.error("Error submitting practice test");
      }
    } catch (error) {
      console.error("Error submitting practice test:", error);
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
      const question = practiceSet?.questions.find(
        (q) => q.id === parseInt(questionId)
      );

      if (question?.type === "ORD") {
        if (
          Array.isArray(answer) &&
          !arraysEqual(answer, initialShuffledOptions[questionId])
        ) {
          count++;
        }
      } else if (Array.isArray(answer)) {
        if (answer.some((ans) => ans !== null && ans !== "")) {
          count++;
        }
      } else if (answer !== null && answer !== "") {
        count++;
      }
    }
    return count;
  };

  const getSkippedCount = () => {
    return practiceSet?.questions
      ? getTotalQuestionCount() - getAnsweredCount()
      : 0;
  };

  const getNotReviewedCount = () => {
    return Object.keys(notReviewedQuestions).filter(
      (questionId) => notReviewedQuestions[parseInt(questionId)]
    ).length;
  };

  const moveItem = (
    questionId: number,
    fromIndex: number,
    toIndex: number
  ) => {
    setAnswers((prevAnswers) => {
      const answerArray = prevAnswers[questionId];
      const optionsToModify = Array.isArray(answerArray)
        ? [...answerArray]
        : [...initialShuffledOptions[questionId]];

      if (toIndex < 0 || toIndex >= optionsToModify.length) {
        return prevAnswers;
      }

      const [movedItem] = optionsToModify.splice(fromIndex, 1);
      optionsToModify.splice(toIndex, 0, movedItem);

      return {
        ...prevAnswers,
        [questionId]: optionsToModify,
      };
    });
  };

  const getTotalQuestionCount = (): number => {
    if (!practiceSet || !practiceSet.questions) {
      return 0; // Return 0 or a fallback value if practiceSet or questions are undefined
    }

    return practiceSet.questions.reduce((count, question) => {
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
      const question = practiceSet?.questions[i];
      if (question?.type === "EMQ" && Array.isArray(question.question)) {
        index += question.question.length - 1; // Number of sub-questions
      } else {
        index += 1;
      }
    }
    if (practiceSet?.questions[currentQuestionIndex]?.type === "EMQ") {
      return index + (currentSubIndex || 0);
    }
    return index;
  };

  // Persist Progress to Local Storage
  useEffect(() => {
    if (!uuid) return;
    const localStorageKey = `examStatus_${uuid}`;
    const dataToSave = {
      answers,
      notReviewedQuestions,
      visitedQuestionIndices: Array.from(visitedQuestionIndices),
      currentQuestionIndex,
      currentSubIndex,
      timeLeft,
      initialShuffledOptions,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(dataToSave));
  }, [
    uuid,
    answers,
    notReviewedQuestions,
    visitedQuestionIndices,
    currentQuestionIndex,
    currentSubIndex,
    timeLeft,
    initialShuffledOptions,
  ]);

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
                      const isChecked = Array.isArray(answers[question.id])
                        ? answers[question.id]?.includes(option)
                        : false;
                      return (
                        <label
                          key={index}
                          className={`flex items-center justify-between space-x-3 p-3 bg-white border rounded-lg cursor-pointer transition-all mb-3 ${
                            isChecked
                              ? "border-defaultcolor"
                              : "border-white"
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
                                isChecked
                                  ? "text-defaultcolor"
                                  : "text-black"
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
                            isChecked
                              ? "border-defaultcolor"
                              : "border-white"
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
                                isChecked
                                  ? "text-defaultcolor"
                                  : "text-black"
                              }`}
                              dangerouslySetInnerHTML={{ __html: option }}
                            ></div>
                          </div>
                          <input
                            type="checkbox"
                            name={`question-${question.id}`}
                            value={option}
                            onChange={() => {
                              const currentAnswers =
                                answers[question.id] || [];
                              const newAnswers = currentAnswers.includes(option)
                                ? currentAnswers.filter(
                                    (a: any) => a !== option
                                  )
                                : [...currentAnswers, option];
                              // Update answer immediately on a single click
                              setAnswers((prevAnswers) => ({
                                ...prevAnswers,
                                [question.id]: newAnswers,
                              }));
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

                    {/* "True" Option */}
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
                        } // Only checked if true is explicitly saved
                        className={`cursor-pointer focus:ring-1 focus:ring-defaultcolor ${
                          answers[question.id]?.includes("true")
                            ? "checked:bg-defaultcolor"
                            : ""
                        }`}
                      />
                    </label>

                    {/* "False" Option */}
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
                        } // Only checked if false is explicitly saved
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
                              handleAnswerChange(
                                question.id,
                                [opt, e.target.value],
                                undefined
                              )
                            }
                            value={
                              answers[question.id]?.find(
                                (pair: string[]) => pair[0] === opt
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
                                  dangerouslySetInnerHTML={{
                                    __html: match,
                                  }}
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
              const answerArray = answers[question.id];
              const optionsToDisplay = Array.isArray(answerArray)
                ? answerArray
                : initialShuffledOptions[question.id] || [];

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
                      {optionsToDisplay.map((option, index) => (
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
                                index === optionsToDisplay.length - 1
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
              const numberOfBlanks = parseInt(
                question.options?.[0] ?? "0",
                10
              );

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
                    {Array.from({ length: numberOfBlanks }).map(
                      (_, index) => (
                        <input
                          key={index}
                          type="text"
                          className="p-3 w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor mb-2"
                          placeholder={`Answer ${index + 1}`}
                          value={
                            Array.isArray(answers[question.id])
                              ? answers[question.id]?.[index] ?? ""
                              : "" // Default to an empty string if not initialized
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const currentAnswers = Array.isArray(
                              answers[question.id]
                            )
                              ? [...answers[question.id]!]
                              : Array(numberOfBlanks).fill(""); // Initialize with blank values if null/undefined
                            currentAnswers[index] = e.target.value; // Update the specific blank's value
                            handleAnswerChange(question.id, currentAnswers); // Update the answers state
                          }}
                        />
                      )
                    )}
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
                              dangerouslySetInnerHTML={{
                                __html: subQuestion,
                              }}
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
                            value={
                              answers[question.id]?.[subIndex] || ""
                            }
                          >
                            <option value="">Select an answer</option>
                            {question.options?.map(
                              (option, optionIndex) => (
                                <option
                                  key={optionIndex}
                                  value={option}
                                  dangerouslySetInnerHTML={{
                                    __html: option,
                                  }}
                                ></option>
                              )
                            )}
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

  if (!practiceSet || !practiceSet.questions)
    return <NoData message="No Practice Test data available" />;

  return (
    <div className="dashboard-page flex flex-col md:flex-row gap-6">
      {/* Main Practice test Content */}
      <div className="flex-1 lg:p-6 bg-white rounded-lg shadow-sm p-4">
        {!submitted ? (
          <>
            <h1 className="text-2xl border p-3 font-semibold mb-5 flex items-center gap-2">
              {practiceSet.title}
            </h1>

            <div className="render_questions_view">
              {renderQuestion(practiceSet.questions[currentQuestionIndex])}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-between mt-6 items-center">
              {/* First set of buttons */}
              <div className="flex space-x-4">
                <Tooltip content="Clear Answer" placement="top">
                  <button
                    className="flex items-center justify-center w-16 h-12 rounded-lg focus:outline-none border border-gray-600 text-gray-600"
                    onClick={clearAnswer}
                  >
                    <FaRegWindowClose size={20} />
                  </button>
                </Tooltip>
                {/* "Not Reviewed" Button */}
                <Tooltip content="Mark as Not Reviewed" placement="top">
                  <button
                    className={`flex items-center justify-center w-16 h-12 rounded-lg border  focus:outline-none  ${
                      notReviewedQuestions[
                        practiceSet.questions[currentQuestionIndex].id
                      ]
                        ? "bg-[#C9BC0F] text-white"
                        : "bg-gray-400 text-white"
                    }`}
                    onClick={() =>
                      toggleNotReviewed(
                        practiceSet.questions[currentQuestionIndex].id
                      )
                    }
                  >
                    <MdOutlineBookmarks size={20} />
                  </button>
                </Tooltip>
              </div>

              {/* Second set of buttons */}

              <button
                className="flex items-center justify-center w-32 h-12 bg-white text-defaultcolor border border-defaultcolor rounded-lg disabled:opacity-50"
                disabled={currentQuestionIndex === 0}
                onClick={handlePreviousQuestion}
              >
                <FaArrowLeft className="inline mr-2" /> Previous
              </button>

              {currentQuestionIndex < practiceSet.questions.length - 1 ? (
                <button
                  className="flex items-center justify-center w-32 h-12 bg-defaultcolor text-white rounded-lg hover:bg-defaultcolor-dark transition-colors"
                  onClick={handleNextQuestion}
                >
                  Next <FaArrowRight className="inline ml-2" />
                </button>
              ) : (
                <button
                  className="flex items-center justify-center w-32 h-12 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  onClick={handleFinishClick}
                >
                  Submit Test
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
              Thank you for completing the practice test. Your answers have
              been submitted successfully!
            </p>
            <div>
              <Link
                href={`/dashboard/practice-test-result/${uuid}`}
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
            <div className="flex items-center justify-center flex-wrap gap-3 text-center">
              {practiceSet.questions.reduce(
                (acc: JSX.Element[], question, questionIndex) => {
                  const questionId = question.id;

                  // Check if question has been answered based on its type
                  const isAnswered = (() => {
                    if (question.type === "ORD") {
                      const userAnswer = answers[questionId];
                      const initialOptions =
                        initialShuffledOptions[questionId];
                      if (!userAnswer || !initialOptions) return false;
                      return !arraysEqual(userAnswer, initialOptions);
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
                    const isAnswered =
                      Array.isArray(answers[questionId]) &&
                      answers[questionId]?.some(
                        (ans) => ans !== null && ans !== ""
                      );
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

          {/* Exam Instructions */}
          <div className="p-4 text-center">
            <button
              className="bg-[#E74444] block text-white w-full px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={handleFinishClick}
            >
              Finish Practice Test
            </button>
          </div>
        </div>
      )}
      {showModal && <ConfirmationModal />}{" "}
    </div>
  );
}
