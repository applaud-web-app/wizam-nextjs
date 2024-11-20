"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

import { FiPlay } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";

interface QuizDetail {
  title: string;
  slug: string;
  questions: number;
  time: string;
  marks: number | string;
  is_free: number;
  is_resume: boolean;
  total_attempts: number | null | string;
  schedule: {
    start_date: string;
    start_time: string;
    end_date: string | null;
    end_time: string | null;
    grace_period: string | null;
    schedule_type: string;
    schedule_id: string;
  };
}

const CACHE_KEY = "serverTimeCache";
const CACHE_DURATION = 60000; // 1 minute

const formatDateTime = (dateString: string, timeString: string | null) => {
  if (!dateString) return "Always Available";
  const date = new Date(`${dateString}T${timeString || "00:00"}`);
  return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

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
          const timeResponse = await axios.get("/api/time");
          cachedServerTime = new Date(timeResponse.data.serverTime);
          cacheServerTime(cachedServerTime);
        }
        setServerTime(cachedServerTime);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-quiz`, {
          params: { slug: params.slug, category },
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (response.data.status) {
          setQuizzes(response.data.data);
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
  }, [params.slug, router]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setServerTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
    return <NoData message="No quizzes available at this time." />;
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

      <div className="overflow-x-auto rounded-lg shadow-sm bg-white hidden md:block">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-quaternary text-white">
            <tr>
              <th className="p-3 text-left font-semibold">S.No</th>
              <th className="p-3 text-left font-semibold">Quiz Title</th>
              <th className="p-3 text-left font-semibold">Available Between</th>
              <th className="p-3 text-left font-semibold">Attempts</th>
              <th className="p-3 text-left font-semibold">Questions</th>
              <th className="p-3 text-left font-semibold">Marks</th>
              <th className="p-3 text-left font-semibold">Time</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quizzes.map((quiz, index) => {
              const { schedule } = quiz;
              const currentTime = serverTime || new Date();

              const startTime = new Date(`${schedule.start_date}T${schedule.start_time}`);
              const endTime =
                schedule.end_date && schedule.end_time
                  ? new Date(`${schedule.end_date}T${schedule.end_time}`)
                  : null;

              const isUpcoming = currentTime < startTime;
              const isOver = endTime && currentTime > endTime;
              const isAvailable = !isUpcoming && !isOver;

              let scheduleInfo = `${formatDateTime(schedule.start_date, schedule.start_time)}`;
              if (schedule.schedule_type === "flexible" && schedule.end_date) {
                scheduleInfo += ` - ${formatDateTime(schedule.end_date, schedule.end_time)}`;
              }

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{quiz.title}</td>
                  <td className="p-4">{scheduleInfo}</td>
                  <td className="p-4">{quiz.total_attempts === "" ||
                    quiz.total_attempts === null ||
                    quiz.total_attempts === undefined
                      ? "-"
                      : quiz.total_attempts}</td>
                  <td className="p-4">{quiz.questions}</td>
                  <td className="p-4">{quiz.marks}</td>
                  <td className="p-4">{quiz.time}</td>
                  <td className="p-4">
                    {isUpcoming ? (
                      <button
                        className="bg-[#ffc300] hover:bg-yellow-500 text-white py-1 px-5 rounded-full font-semibold text-sm cursor-not-allowed inline-flex items-center space-x-1 w-32"
                        disabled
                      >
                        <MdLockOutline className="flex-shrink-0" />
                        <span>Upcoming</span>
                      </button>
                    ) : quiz.is_resume ? (
                      <Link
                        href={`/dashboard/quiz-play/${quiz.slug}?sid=${schedule.schedule_id ?? 0}`}
                        className="text-white bg-[#C9BC0F] px-5 py-1 rounded-full hover:bg-[#928c38] transition duration-200 inline-flex items-center justify-center space-x-1 font-semibold text-sm w-32"
                      >
                        <FiPlay />
                        <span>Resume</span>
                      </Link>
                    ) : quiz.is_free === 1 ? (
                      <Link
                        href={`/dashboard/quiz-detail/${quiz.slug}?sid=${schedule.schedule_id ?? 0}`}
                        className="bg-green-600 text-white px-5 py-1 rounded-full font-semibold text-sm hover:bg-green-700 transition duration-200 inline-flex items-center justify-center w-32"
                      >
                        Start Quiz
                      </Link>
                    ) : (
                      <button
                        onClick={() => handlePayment(quiz.slug)}
                        className="bg-yellow-500 text-white py-1 px-5 rounded-full font-semibold"
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
    </div>
  );
}
