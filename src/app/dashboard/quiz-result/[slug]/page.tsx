"use client";

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRegCalendarAlt,
  FaCheck,
  FaTimes,
  FaRegCircle,
  FaRibbon,
  FaQuestionCircle,
  FaMinusCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Common/Loader";
import QuizReportCard from "@/components/QuizReportCard";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import NoData from "@/components/Common/NoData";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// TypeScript interfaces
interface Option {
  text: string;
  image?: string;
}

interface Question {
  id: number;
  type: string;
  question: string | string[];
  correctAnswer: string | string[] | Record<string, string>;
  userAnswer?: string | number | string[] | Record<string, string>;
  isCorrect?: boolean;
  isUnanswered?: boolean;
  explanation?: string;
  options?: (Option | string)[];
}

interface ExamData {
  title: string;
  duration: string;
  exam_result_type: string;
  exam_result_date: string;
  exam_result_time: string;
  questions: Question[];
}

interface UserExamResult {
  title: string;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  status: string;
  marks: number;
  timeTaken?: number;
  uuid: string;
  download_report: number;
}

interface LeaderboardEntry {
  username: string;
  score: number;
  status: string;
}

interface ExamResultProps {
  params: {
    slug: string;
  };
}

const ExamResult = ({ params }: ExamResultProps) => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userExamResult, setUserExamResult] = useState<UserExamResult | null>(
    null
  );
  const [leaderBoard, setLeaderBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("A"); // New state for tabs
  const router = useRouter();

  const handleTabClick = (tab: string) => setActiveTab(tab);

  useEffect(() => {
    const { slug } = params;

    const fetchExamResults = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/quiz-result/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );
    
        if (response.data.status) {
          const resultData = response.data;
    
          if (!resultData.quiz) {
            toast.error("Quiz data is missing in the response.");
            return;
          }
    
          setExamData({
            title: resultData.quiz.title,
            duration: resultData.quiz.duration,
            exam_result_date: resultData.quiz.exam_result_date,
            exam_result_time: resultData.quiz.exam_result_time,
            exam_result_type: resultData.quiz.exam_result_type,
            questions: resultData.exam_preview.map((q: any) => ({
              id: q.question_id,
              type: q.question_type,
              question: q.question_text,
              correctAnswer: q.correct_answer,
              userAnswer: q.user_answer,
              isCorrect: q.is_correct,
              isUnanswered: q.is_unanswered,
              options: q.question_option || [],
            })),
          });
    
          setUserExamResult({
            correctCount: parseInt(resultData.result.correct),
            wrongCount: parseInt(resultData.result.incorrect),
            skippedCount: resultData.result.skipped,
            marks: parseFloat(resultData.result.marks),
            status: resultData.result.status,
            timeTaken: resultData.result.timeTaken,
            uuid: resultData.result.uuid,
            download_report: resultData.quiz.download_report ? 1 : 0,
            title: resultData.quiz.title,
          });
    
          setLeaderBoard(resultData.leaderBoard || []);
        } else {
          toast.error("No quiz results found for this category");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching quiz results: " + error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchExamResults();
  }, [params, router]);

  if (loading || !examData || !userExamResult) {
    return <Loader />;
  }

  const passingScore = 0.6;
  const totalQuestions = examData.questions.length;
  const percentageCorrect = userExamResult.correctCount / totalQuestions;
  const passed = percentageCorrect >= passingScore;

  const formatTimeTaken = (timeInMinutes?: number) => {
    if (!timeInMinutes) return "N/A";
    return `${timeInMinutes} min`;
  };

  const renderOptions = (question: Question) => {
    const correctAnswerDisplay =
    typeof question.correctAnswer === "object" && !Array.isArray(question.correctAnswer)
      ? Object.entries(question.correctAnswer)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
      : Array.isArray(question.correctAnswer)
      ? question.correctAnswer.join(", ")
      : question.correctAnswer || "N/A";

    // const userAnswerDisplay =
    //   question.userAnswer && Array.isArray(question.userAnswer) && question.userAnswer.length > 0
    //     ? question.userAnswer.join(", ")
    //     : "Unanswered";

    const userAnswerDisplay =
    question.userAnswer &&
    (Array.isArray(question.userAnswer)
      ? question.userAnswer.length > 0
        ? question.userAnswer.join(", ")
        : "Unanswered"
      : typeof question.userAnswer === "string" && question.userAnswer.trim() !== ""
      ? question.userAnswer
      : "Unanswered");

    switch (question.type) {
      case "MSA": // Multiple Single Answer

      case "TOF": // True or False
        return (
          <div className="mb-4">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={`flex justify-between border items-center p-3 rounded-md mb-2 ${
                  typeof question.correctAnswer === "string" &&
                  parseInt(question.correctAnswer) - 1 === index
                    ? "bg-green-500 text-white"
                    : typeof question.userAnswer === "number" &&
                      question.userAnswer - 1 === index
                    ? "bg-red-500 text-white"
                    : "bg-white"
                }`}
              >
                {/* Left Circle Icon with letter */}
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full  mr-2 font-bold ${
                    typeof question.correctAnswer === "string" &&
                    parseInt(question.correctAnswer) - 1 === index
                      ? "bg-white text-green-500"
                      : typeof question.userAnswer === "number" &&
                        question.userAnswer - 1 === index
                      ? "bg-white text-red-500"
                      : " bg-gray-200 text-gray-700"
                  }`}
                >
                  {String.fromCharCode(65 + index)}{" "}
                  {/* Renders A, B, C, D, etc. */}
                </span>

                {/* Option text */}
                <div
                  className="flex-grow"
                  dangerouslySetInnerHTML={{
                    __html:
                      typeof option === "string"
                        ? option
                        : (option as Option).text,
                  }}
                />

                {/* Right Icon for correct or incorrect indication */}
                <span className="ml-2">
                  {typeof question.correctAnswer === "string" &&
                  parseInt(question.correctAnswer) - 1 === index ? (
                    <FaCheck className="text-white" />
                  ) : typeof question.userAnswer === "number" &&
                    question.userAnswer - 1 === index ? (
                    <FaTimes className="text-white" />
                  ) : (
                    <FaRegCircle className="text-gray-400" />
                  )}
                </span>
              </div>
            ))}
          </div>
        );

      case "MMA": // Multiple Match Answer
        return (
          <div className="mb-4">
            {question.options?.map((option, index: any) => {
              const isCorrectAnswer =
                Array.isArray(question.correctAnswer) &&
                question.correctAnswer.includes((index + 1).toString());  // Checking if (index + 1) is in correctAnswer array as string
              const isUserAnswer =
                Array.isArray(question.userAnswer) &&
                question.userAnswer.includes(index + 1); // Checking if index is in userAnswer array

              return (
                <div
                  key={index}
                  className={`flex justify-between border items-center p-3 rounded-md mb-2 ${
                    isCorrectAnswer
                      ? "bg-green-500 text-white"
                      : isUserAnswer
                      ? "bg-red-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {/* Left Circle Icon with letter */}
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 font-bold ${
                      isCorrectAnswer
                        ? "bg-white text-green-500"
                        : isUserAnswer
                        ? "bg-white text-red-500"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  {/* Option text */}
                  <div
                    className="flex-grow"
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof option === "string"
                          ? option
                          : (option as Option).text,
                    }}
                  />

                  {/* Right Icon for correct or incorrect indication */}
                  <span className="ml-2">
                    {isCorrectAnswer ? (
                      <FaCheck className="text-white" />
                    ) : isUserAnswer ? (
                      <FaTimes className="text-white" />
                    ) : (
                      <FaRegCircle className="text-gray-400" />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case "FIB": // Fill in the Blanks
        const blanks = Number(question.options?.[0]) || 0;

        return (
          <div>
            {/* Display User's and Correct Answers for Each Blank */}
            {Array.from({ length: blanks }).map((_, index) => (
              <div key={index} className="p-4 bg-white rounded-lg mb-2">
                {/* User's Answer */}
                <p className="font-semibold">
                  <span className="text-defaultcolor">Your Answer:</span>{" "}
                  {Array.isArray(question.userAnswer)
                    ? question.userAnswer[index] || "No answer"
                    : "No answer"}
                </p>

                {/* Correct Answer */}
                <p className="font-semibold">
                  <span className="text-green-600">Correct Answer:</span>{" "}
                  {Array.isArray(question.correctAnswer)
                    ? question.correctAnswer[index] || "N/A"
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        );

      case "MTF": // Match the Following
        const correctAnswerPairs = Object.entries(
          question.correctAnswer as Record<string, string>
        );
        const userAnswerPairs = Object.entries(
          (question.userAnswer as Record<string, string>) || {}
        );

        return (
          <div>
            <p className="mb-4 font-medium">Match the following:</p>
            <div className="space-y-4">
              {correctAnswerPairs.map(([key, correctValue], index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                >
                  {/* Display the option label from question.options based on key */}
                  <div className="p-2 py-5 rounded bg-white">
                    <span className="text-gray-500 font-semibold">
                      Match {key}
                    </span>{" "}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: question.options?.[parseInt(key) - 1] || key, // Adjusts to zero-based index
                      }}
                    />
                  </div>

                  {/* Display user's selected answer */}
                  <div className="p-2 rounded bg-white">
                    <span className="text-defaultcolor font-semibold">
                      Your Answer:
                    </span>{" "}
                    {userAnswerPairs[index] ? (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: userAnswerPairs[index][1],
                          }}
                        />
                      </>
                    ) : (
                      <p className="text-red-500">No answer</p>
                    )}
                  </div>

                  {/* Display correct answer */}
                  <div className="p-2 rounded bg-white">
                    <span className="text-green-500 font-semibold">
                      Correct:
                    </span>{" "}
                    <div dangerouslySetInnerHTML={{ __html: correctValue }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "SAQ": // Short Answer Question
        return (
          <div className="p-4 bg-white rounded-lg">
            <p className="font-medium">
              Your Answer:{" "}
              <span>{userAnswerDisplay}</span>
            </p>
            <p className="text-green-600">
              Correct Answer:{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: correctAnswerDisplay,
                }}
              />
            </p>
          </div>
        );

        case "ORD": {
          const userAnswer = question.userAnswer;
          const correctAnswer = question.correctAnswer;
    
          if (
            !userAnswer ||
            (Array.isArray(userAnswer) && userAnswer.length === 0)
          ) {
            // User hasn't answered the question
            return (
              <div className="grid sm:grid-cols-2 rounded-xl gap-3">
                <div className="mt-2">
                  <p className="font-semibold text-defaultcolor mb-3">Your Answer:</p>
                  <ul className="">
                    {Array.isArray(correctAnswer) &&
                      correctAnswer.map((answer, index) => (
                        <li key={index} className="flex rounded-xl bg-white mb-3 p-3">
                          {index+1}. <div className="text-red-500"> No answer</div>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-green-500 mb-3">Correct Answer:</p>
                  <ul className="">
                    {Array.isArray(correctAnswer) &&
                      correctAnswer.map((answer, index) => (
                        <li key={index} className="flex rounded-xl bg-white mb-3  p-3">
                          {index+1}.  <div dangerouslySetInnerHTML={{ __html: answer }} />
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          } else if (Array.isArray(userAnswer)) {
            // User has answered the question
            return (
              <div className="grid sm:grid-cols-2 rounded-xl gap-3">
                <div className="mt-2">
                  <p className="font-semibold text-defaultcolor mb-3">Your Answer:</p>
                  <ul className="">
                    {userAnswer.map((answer, index) => (
                      <li key={index} className="flex rounded-xl bg-white mb-3  p-3">
                        {index+1}.  <div dangerouslySetInnerHTML={{ __html: answer }} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-green-500 mb-3">Correct Answer:</p>
                  <ul className="">
                    {Array.isArray(correctAnswer) &&
                      correctAnswer.map((answer, index) => (
                        <li key={index} className="flex rounded-xl bg-white mb-3  p-3">
                          {index+1}.  <div dangerouslySetInnerHTML={{ __html: answer }} />
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          } else {
            // Handle other possible types if necessary
            return (
              <div className=" grid sm:grid-cols-2 rounded-xl gap-3">
                <div className="mt-2">
                  <p className="font-semibold text-defaultcolor mb-3">Your Answer:</p>
                  <ul className="list-decimal list-inside">
                    {Array.isArray(correctAnswer) &&
                      correctAnswer.map((answer, index) => (
                        <li key={index} className="flex rounded-xl bg-white mb-3 p-3">
                          {index+1}.  <div className="text-red-500"> No answer</div>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-green-500 mb-3">Correct Answer:</p>
                  <ul className="list-decimal list-inside">
                    {Array.isArray(correctAnswer) &&
                      correctAnswer.map((answer, index) => (
                        <li key={index} className="flex rounded-xl bg-white mb-3  p-3">
                          {index+1}.  <div dangerouslySetInnerHTML={{ __html: answer }} />
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          }
        }
      case "EMQ": // Extended Matching Questions
        return (
          <div>
            {Array.isArray(question.question) &&
              question.question
                .slice(1) // Skip the first item (main question)
                .map((subQuestion, questionIndex) => (
                  <div key={questionIndex + 1} className="mb-4">
                    <p
                      className="font-medium"
                      dangerouslySetInnerHTML={{ __html: subQuestion }}
                    />

                    {/* Render options for the current sub-question */}
                    {question.options?.map((option, index) => {
                      // Determine user and correct answer indices for comparison
                      let userAnswerIndex: number | null = null;
                      let correctAnswerIndex: number | null = null;

                      if (Array.isArray(question.userAnswer)) {
                        const userAnswer = question.userAnswer[questionIndex];
                        userAnswerIndex =
                          typeof userAnswer === "string"
                            ? Number(userAnswer)
                            : userAnswer;
                      } else if (typeof question.userAnswer === "number") {
                        userAnswerIndex = question.userAnswer;
                      }

                      if (Array.isArray(question.correctAnswer)) {
                        const answer = question.correctAnswer[questionIndex];
                        correctAnswerIndex =
                          typeof answer === "string" ? Number(answer) : answer;
                      } else if (typeof question.correctAnswer === "number") {
                        correctAnswerIndex = question.correctAnswer;
                      }

                      const isUserAnswer = userAnswerIndex === index + 1; // 1-based index
                      const isCorrectAnswer = correctAnswerIndex === index + 1;

                      return (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-3 rounded-md mb-2 ${
                            isCorrectAnswer
                              ? "bg-green-500 text-white" // Correct answer
                              : isUserAnswer
                              ? "bg-red-500 text-white" // User's incorrect answer
                              : "bg-white"
                          }`}
                        >
                          {/* Left Circle Icon with letter */}
                          <span
                            className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 font-bold ${
                              isCorrectAnswer
                                ? "bg-white text-green-500"
                                : isUserAnswer
                                ? "bg-white text-red-500"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>

                          {/* Option text */}
                          <div
                            className="flex-grow"
                            dangerouslySetInnerHTML={{
                              __html:
                                typeof option === "string"
                                  ? option
                                  : String(option),
                            }}
                          />

                          {/* Right Icon for correct or incorrect indication */}
                          <span className="ml-2">
                            {isCorrectAnswer ? (
                              <FaCheck className="text-white" />
                            ) : isUserAnswer ? (
                              <FaTimes className="text-white" />
                            ) : (
                              <FaRegCircle className="text-gray-400" />
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  // const renderQuestionResult = (question: Question, index: number) => {
  //   return (
  //     <div
  //       key={question.id}
  //       className={`p-2 lg:p-4 border-l-[6px] lg:border-l-[12px] bg-[#f6f7f9] ${
  //         !question.userAnswer ||
  //         (Array.isArray(question.userAnswer) &&
  //           question.userAnswer.length === 0)
  //           ? "border-yellow-500"
  //           : "border-green-500"
  //       }`}
  //     >
  //       <h3 className="text-base font-semibold mb-2">
  //         <span className="underline">Question {index + 1}:</span>{" "}
  //         <div
  //           className="bg-white p-2 rounded-lg"
  //           dangerouslySetInnerHTML={{
  //             __html: Array.isArray(question.question)
  //               ? question.question[0]
  //               : question.question,
  //           }}
  //         />
  //       </h3>
  //       {renderOptions(question)}
  //     </div>
  //   );
  // };

  const renderQuestionResult = (question: Question, index: number) => {
    // Determine question status based on user's answer and correctness
    let questionStatus = "Unanswered";
    if (!question.isUnanswered) {
      questionStatus = question.isCorrect ? "Correct" : "Wrong";
    }
  
    // Define badge color based on status
    const badgeColor =
    questionStatus === "Correct"
      ? "bg-green-200 text-green-800"
      : questionStatus === "Wrong"
      ? "bg-red-200 text-red-800"
      : "bg-yellow-200 text-yellow-800"; // Yellow for Unanswered
  
    return (
      <div
        key={question.id}
        className={`p-2 lg:p-4 border-l-[6px] lg:border-l-[12px] bg-[#f6f7f9] ${
          questionStatus === "Unanswered"
          ? "border-yellow-500"
          : questionStatus === "Correct"
          ? "border-green-500"
          : "border-red-500"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold">
            <span className="underline">Question {index + 1}:</span>
          </h3>
          
          {/* Status Badge */}
          <span className={`px-2 py-1 text-xs font-semibold rounded ${badgeColor}`}>
            {questionStatus}
          </span>
        </div>
  
        <div
          className="bg-white px-3 py-4 rounded-lg mb-4"
          dangerouslySetInnerHTML={{
            __html: Array.isArray(question.question)
              ? question.question[0]
              : question.question,
          }}
        />
        {renderOptions(question)}
      </div>
    );
  };

  // Render Leaderboard and Question Results
  return (
    <div className="dashboard-page">
      {/* START  */}

      <div className="flex items-center space-x-3 mb-3">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-defaultcolor flex items-center"
        >
          <FaArrowLeftLong className="text-gray-900" size={24} />
        </button>
        <h1 className="text-3xl font-bold">{userExamResult.title}</h1>
      </div>

      <div className="flex items-center space-x-3 flex-wrap mb-3">
        <div className="mb-1">
          <p className="text-lg">Quiz Packs: {examData.exam_result_type}</p>
        </div>

        <div className="flex items-center mb-1">
          <FaRegCalendarAlt className=" mr-2" />
          <p className="text-lg">{examData.exam_result_date}</p>
        </div>

        <div className="flex items-center mb-1">
          <FaClock className="mr-2" />
          <p className="text-lg">{examData.exam_result_time}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          className={`px-4 py-2 text-lg border-b-4  bg-white text-gray-900 ${
            activeTab === "A" ? "border-defaultcolor" : "border-gray-200"
          }`}
          onClick={() => handleTabClick("A")}
        >
          Analysis
        </button>
        <button
          className={`px-4 py-2 text-lg border-b-4  bg-white text-gray-900 ${
            activeTab === "B" ? "border-defaultcolor" : "border-gray-200"
          }`}
          onClick={() => handleTabClick("B")}
        >
          Solution
        </button>
        <button
          className={`px-4 py-2 text-lg border-b-4  bg-white text-gray-900 ${
            activeTab === "C" ? "border-defaultcolor" : "border-gray-200"
          }`}
          onClick={() => handleTabClick("C")}
        >
          Top Scores
        </button>
        {/* Check if download_report is enabled */}
        {/* {userExamResult?.download_report === 1 && ( */}
          <QuizReportCard uuid={userExamResult.uuid} />
        {/* )} */}
      </div>

      {activeTab === "A" && (
        <div>
          {/* Pass or Fail Message */}
          <div className="text-center mb-8">
            {passed ? (
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <FaCheckCircle
                  className="text-green-500 mx-auto mb-3"
                  size={60}
                />
                <h1 className="text-3xl font-bold text-green-600 uppercase">
                  Congratulations! You Passed!
                </h1>
                <p className="text-gray-700 mt-2">
                  You successfully met the passing criteria for this Quiz.
                </p>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <FaTimesCircle
                  className="text-red-500 mx-auto mb-3"
                  size={60}
                />
                <h1 className="text-3xl font-bold text-red-600 uppercase">
                  Sorry, You Failed
                </h1>
                <p className="text-gray-700 mt-2">
                  Review your performance below to understand areas for
                  improvement.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white lg:p-6 p-3 rounded-lg shadow-sm">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              <ResultCard
                title="Total Questions"
                value={totalQuestions}
                icon={<FaQuestionCircle className="text-blue-700" size={32} />}
              />
              <ResultCard
                title="Correct Answers"
                value={userExamResult.correctCount}
                icon={<FaCheckCircle className="text-green-700" size={32} />}
              />
              <ResultCard
                title="Wrong Answers"
                value={userExamResult.wrongCount}
                icon={<FaTimesCircle className="text-red-700" size={32} />}
              />
              <ResultCard
                title="Unanswered"
                value={userExamResult.skippedCount}
                icon={<FaMinusCircle className="text-yellow-500" size={32} />}
              />
              <ResultCard
                title="Marks"
                value={userExamResult.marks}
                icon={<FaRibbon className="text-purple-700" size={32} />}
              />
              <ResultCard
                title="Time Taken"
                value={formatTimeTaken(userExamResult.timeTaken)}
                icon={<FaClock className="text-teal-700" size={32} />}
              />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Answer Distribution Chart */}
              <div className="border border-gray-200 p-3 rounded-lg  ">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Answer Distribution
                </h2>
                <p className="text-sm text-gray-600">
                  A breakdown of your answers, showing correct, incorrect, and
                  Unanswered responses.
                </p>
                <div
                  className="mx-auto"
                  style={{ width: "100%", maxWidth: "300px", height: "auto" }}
                >
                  <Doughnut
                    data={{
                      labels: ["Correct", "Incorrect", "Unanswered"],
                      datasets: [
                        {
                          data: [
                            userExamResult.correctCount,
                            userExamResult.wrongCount,
                            userExamResult.skippedCount,
                          ],
                          backgroundColor: ["#4CAF50", "#F44336", "#FF9800"],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "bottom" },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.label}: ${context.raw}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Score Comparison Chart */}
              <div className="border border-gray-200 p-3 rounded-lg ">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Score Comparison
                </h2>
                <p className="text-sm text-gray-600 ">
                  See how your score compares to the passing score.
                </p>
                <div className="mx-auto">
                  <Bar
                    data={{
                      labels: ["Your Score", "Passing Score"],
                      datasets: [
                        {
                          label: "Score",
                          data: [
                            userExamResult.correctCount,
                            Math.ceil(totalQuestions * passingScore),
                          ],
                          backgroundColor: ["#4CAF50", "#FFC107"],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `Score: ${context.raw}`,
                          },
                        },
                      },
                      scales: {
                        y: { beginAtZero: true, max: totalQuestions },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "B" && (
        <div>
          {/* Render Questions */}
          <div className="mb-8 bg-white p-5 rounded-lg shadow-sm">
            <div className="space-y-6">
              {examData.questions.map((question, index) =>
                renderQuestionResult(question, index)
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "C" && (
        <div>
          {/* Tab C Content - Leaderboard */}
          <div className="mb-8 bg-white shadow-sm p-1 rounded-lg">
            {leaderBoard.length > 0 ? (
              <LeaderboardTable entries={leaderBoard} />
            ) : (
              <NoData message="No leaderboard data available." />
            )}
          </div>
        </div>
      )}
      {/* ENDING */}
    </div>
  );
};

const ResultCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center p-5 border border-gray-200 rounded-lg ">
      {/* Icon Section */}
      <div className="mr-4 flex items-center justify-center w-14 h-14 rounded-full bg-gray-100">
        {icon}
      </div>

      {/* Text Section */}
      <div>
        <h3 className="text-base font-medium text-gray-600">{title}</h3>
        <p className="text-2xl lg:text-3xl font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
};

const LeaderboardTable = ({ entries }: { entries: LeaderboardEntry[] }) => {
  return (
    <div className="overflow-x-auto rounded-lg ">
      <table className="min-w-full table-auto rounded-lg overflow-hidden">
        <thead className="bg-defaultcolor text-white">
          <tr>
            <th className="py-3 px-6 text-left">S.No</th>
            <th className="py-3 px-6 text-left">Username</th>
            <th className="py-3 px-6 text-left">Score</th>
            <th className="py-3 px-6 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={index}
              className={`border-b transition duration-300 ${
                index % 2 === 0 ? "bg-white" : "bg-white"
              } hover:bg-gray-200`}
            >
              <td className="py-3 px-6">{index + 1}</td>
              <td className="py-3 px-6">{entry.username}</td>
              <td className="py-3 px-6">{entry.score}</td>
              <td className="py-3 px-6">
                {entry.status === "PASS" ? (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-200 rounded-full">
                    Passed
                  </span> // Badge for Passed status
                ) : (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-red-700 bg-red-200 rounded-full">
                    Failed
                  </span> // Badge for Failed status
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamResult;
