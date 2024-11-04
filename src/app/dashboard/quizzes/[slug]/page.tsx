"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import Loader from "@/components/Common/Loader";

interface QuizDetail {
  title: string;
  slug: string;
  questions: number;
  time: string;
  marks: number | string;
  is_free: number;
  schedule: {
    start_date: string;
    start_time: string;
    end_date: string | null;
    end_time: string | null;
    grace_period: string | null;
    schedule_type: string;
  };
}

const CACHE_KEY = "serverTimeCache";
const CACHE_DURATION = 60000;

export default function QuizTypeDetailPage({ params }: { params: { slug: string } }) {
  const [quizzes, setQuizzes] = useState<QuizDetail[]>([]);
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getCachedServerTime = (): Date | null => {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { serverTime, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return new Date(serverTime);
      }
    }
    return null;
  };

  const cacheServerTime = (time: Date) => {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ serverTime: time.toISOString(), timestamp: Date.now() })
    );
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      const category = Cookies.get("category_id");
      const jwt = Cookies.get("jwt");
      if (!jwt || !category) {
        toast.error("Authentication or category data is missing.");
        return;
      }

      try {
        let cachedServerTime = getCachedServerTime();
        if (!cachedServerTime) {
          const timeResponse = await axios.get('/api/time');
          cachedServerTime = new Date(timeResponse.data.serverTime);
          cacheServerTime(cachedServerTime);
        }
        setServerTime(cachedServerTime);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-quiz`, {
          params: { slug: params.slug, category },
          headers: { Authorization: `Bearer ${jwt}` },
        });

        // Filter out past quizzes based on end_date and end_time
        const filteredQuizzes = response.data.data.filter((quiz: QuizDetail) => {
          const endDateTime = quiz.schedule.end_date && quiz.schedule.end_time
            ? new Date(`${quiz.schedule.end_date}T${quiz.schedule.end_time}`)
            : null;
          return !endDateTime || endDateTime >= cachedServerTime;
        });

        if (response.data.status) {
          setQuizzes(filteredQuizzes);
        } else {
          toast.error("No quizzes found for this category.");
          router.push("/dashboard/quizzes");
        }
      } catch (error) {
        toast.error("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [params, router]);

  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        router.push("/signin");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { type: "quizzes" },
      });

      if (response.data.status) {
        router.push(`/dashboard/quiz-detail/${slug}`);
      } else {
        toast.error("Please buy a subscription to access this quiz.");
        router.push("/pricing");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("User is not authenticated. Please log in.");
        router.push("/signin");
      } else if (error.response?.status === 403) {
        toast.error("Upgrade subscription to access this feature.");
        router.push("/pricing");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (quizzes.length === 0) {
    return <div className="text-center text-gray-500">No quizzes available at this time.</div>;
  }

  return (
    <div className="mb-5">
      <div className="flex items-center mb-5">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-quaternary flex items-center"
        >
          <FaArrowLeftLong className="text-gray-900" size={24} />
        </button>
        <h1 className="text-xl md:text-3xl font-semibold ml-4 capitalize text-black">
          {params.slug.replace(/-/g, " ")}
        </h1>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white hidden md:block">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-quaternary text-white">
            <tr>
              <th className="p-3 text-left font-semibold">S.No</th>
              <th className="p-3 text-left font-semibold">Quiz Title</th>
              <th className="p-3 text-left font-semibold">Available Between</th>
              <th className="p-3 text-left font-semibold">Free/Paid</th>
              <th className="p-3 text-left font-semibold">Questions</th>
              <th className="p-3 text-left font-semibold">Marks</th>
              <th className="p-3 text-left font-semibold">Time</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quizzes.map((quiz, index) => {
              const startTime = new Date(`${quiz.schedule.start_date}T${quiz.schedule.start_time}`);
              const endTime = quiz.schedule.end_date && quiz.schedule.end_time
                ? new Date(`${quiz.schedule.end_date}T${quiz.schedule.end_time}`)
                : null;
              const isUpcoming = serverTime && startTime > serverTime;

              let scheduleInfo;
              if (quiz.schedule.schedule_type === "flexible") {
                scheduleInfo = `${quiz.schedule.start_date} ${quiz.schedule.start_time} - ${quiz.schedule.end_date ?? "N/A"} ${quiz.schedule.end_time ?? "N/A"}`;
              } else {
                scheduleInfo = `${quiz.schedule.start_date} ${quiz.schedule.start_time}`;
              }

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{quiz.title}</td>
                  <td className="p-4">{scheduleInfo}</td>
                  <td className="p-4">
                    <span
                      className={`${
                        quiz.is_free
                          ? "text-sm rounded-full font-semibold py-1 px-5 bg-green-500 text-white"
                          : "text-sm rounded-full font-semibold py-1 px-5 bg-secondary text-white"
                      }`}
                    >
                      {quiz.is_free ? "Free" : "Paid"}
                    </span>
                  </td>
                  <td className="p-4">{quiz.questions}</td>
                  <td className="p-4">{quiz.marks}</td>
                  <td className="p-4">{quiz.time} mins</td>
                  <td className="p-4">
                    {isUpcoming ? (
                      <span className="bg-gray-300 text-gray-500 py-1 px-5 rounded-full font-semibold text-sm">
                        Upcoming
                      </span>
                    ) : quiz.is_free === 1 ? (
                      <Link href={`/dashboard/quiz-detail/${quiz.slug}`} className="text-quaternary font-semibold">
                        View Details
                      </Link>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white py-1 px-5 rounded-full font-semibold"
                        onClick={() => handlePayment(quiz.slug)}
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {quizzes.map((quiz, index) => {
          const startTime = new Date(`${quiz.schedule.start_date}T${quiz.schedule.start_time}`);
          const endTime = quiz.schedule.end_date && quiz.schedule.end_time
            ? new Date(`${quiz.schedule.end_date}T${quiz.schedule.end_time}`)
            : null;
          const isUpcoming = serverTime && startTime > serverTime;

          let scheduleInfo;
          if (quiz.schedule.schedule_type === "flexible") {
            scheduleInfo = `${quiz.schedule.start_date} ${quiz.schedule.start_time} - ${quiz.schedule.end_date ?? "N/A"} ${quiz.schedule.end_time ?? "N/A"}`;
          } else {
            scheduleInfo = `${quiz.schedule.start_date} ${quiz.schedule.start_time}`;
          }

          return (
            <div key={index} className="p-4 bg-white shadow-sm rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                {quiz.is_free === 1 && <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Free</span>}
              </div>
              <div className="text-gray-600 flex flex-col mb-3">
                <div className="flex items-center justify-between border-b border-dashed pb-2 mb-2">
                  <div className="flex items-center">
                    <FaQuestionCircle className="text-gray-400 mr-2" />
                    <span className="font-medium">Questions:</span>
                  </div>
                  <span>{quiz.questions}</span>
                </div>
                <div className="flex items-center justify-between border-b border-dashed pb-2 mb-2">
                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-2" />
                    <span className="font-medium">Time:</span>
                  </div>
                  <span>{quiz.time} mins</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="text-gray-400 mr-2" />
                    <span className="font-medium">Marks:</span>
                  </div>
                  <span>{quiz.marks}</span>
                </div>
              </div>
              <div className="text-gray-700 mb-3">
                <span className="font-semibold">Available Between:</span> {scheduleInfo}
              </div>
              {isUpcoming ? (
                <span className="bg-gray-300 text-gray-500 py-2 px-5 rounded-sm text-sm block w-full text-center">Upcoming</span>
              ) : quiz.is_free === 1 ? (
                <Link href={`/dashboard/quiz-detail/${quiz.slug}`} className="bg-quaternary text-white py-2 px-5 block rounded-sm text-center w-full">
                  View Details
                </Link>
              ) : (
                <button
                  onClick={() => handlePayment(quiz.slug)}
                  className="bg-yellow-500 text-white py-2 px-5 rounded-sm block w-full"
                >
                  Pay Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
