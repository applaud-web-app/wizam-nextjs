"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { FiPlay } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";

interface Quiz {
  id: number;
  exam_type_name: string;
  slug: string;
  title: string | null;
  duration_mode: string;
  exam_duration: number | null;
  point_mode: string | null;
  point: number | null;
  is_free: number;
  is_resume: number;
  total_questions: number;
  total_marks: number | string;
  total_time: number;
  schedules: {
    schedule_id: string;
    schedule_type: string;
    start_date: string;
    start_time: string;
    end_date: string | null;
    end_time: string | null;
    grace_period: string | null;
  };
}

const CACHE_KEY = "serverTimeCache";
const CACHE_DURATION = 60000;

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
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
    const fetchData = async () => {
      try {
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication or category data is missing.");
          return;
        }

        let cachedServerTime = getCachedServerTime();
        if (!cachedServerTime) {
          const timeResponse = await axios.get("/api/time");
          cachedServerTime = new Date(timeResponse.data.serverTime);
          cacheServerTime(cachedServerTime);
        }
        setServerTime(cachedServerTime);

        const quizzesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/quiz-all`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
            params: { category: category_id },
          }
        );

        const upcomingQuizzes = quizzesResponse.data.data.filter((quiz: Quiz) => {
          const endDateTime =
            quiz.schedules.end_date && quiz.schedules.end_time
              ? new Date(`${quiz.schedules.end_date}T${quiz.schedules.end_time}`)
              : null;
          return !endDateTime || endDateTime >= cachedServerTime;
        });

        setQuizzes(upcomingQuizzes);
      } catch (error) {
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update serverTime every second and refresh quiz availability
  useEffect(() => {
    const intervalId = setInterval(() => {
      setServerTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      const type = "quizzes";

      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user-subscription`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { type },
        }
      );

      if (response.data.status) {
        router.push(`/dashboard/quiz-detail/${slug}`);
      } else {
        toast.error("Please buy a subscription to access this course.");
        router.push("/pricing");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error("User is not authenticated. Please log in.");
          router.push("/signin");
        } else if (status === 403 || status === 404) {
          toast.error("Please buy a subscription to access this course.");
          router.push("/pricing");
        } else {
          toast.error(`An error occurred: ${data.error || "Unknown error"}`);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const formatDateTime = (dateString: string, timeString: string | null) => {
    const date = new Date(`${dateString}T${timeString || "00:00"}`);
    return date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-5">{error}</div>;
  }

  if (quizzes.length === 0) {
    return <NoData message="No quizzes available at the moment" />;
  }

  return (
    <div className="mb-5">
      <h2 className="text-lg lg:text-2xl font-bold mb-3">All Quizzes</h2>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto rounded-lg overflow-hidden text-nowrap">
          <thead className="bg-quaternary text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Quiz Title</th>
              <th className="p-3 text-left">Available Between</th>
              <th className="p-3 text-left">Questions</th>
              <th className="p-3 text-left">Marks</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz, index) => {
              const { schedules } = quiz;
              const quizStartDateTime = new Date(
                `${schedules.start_date}T${schedules.start_time}`
              );
              const currentTime = serverTime || new Date();
              const isUpcoming = quizStartDateTime > currentTime;

              let scheduleInfo;
              if (schedules.schedule_type === "flexible") {
                scheduleInfo = `${formatDateTime(schedules.start_date, schedules.start_time)} - ${formatDateTime(schedules.end_date!, schedules.end_time)}`;
              } else if (schedules.schedule_type === "fixed") {
                scheduleInfo = `Fixed - ${formatDateTime(schedules.start_date, schedules.start_time)}`;
              } else {
                scheduleInfo = `${formatDateTime(schedules.start_date, schedules.start_time)}`;
              }

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{quiz.title || "-"}</td>
                  <td className="p-4">{scheduleInfo}</td>
                  <td className="p-4">{quiz.total_questions || "-"}</td>
                  <td className="p-4">
                    {quiz.point_mode === "manual"
                      ? quiz.point! * quiz.total_questions
                      : quiz.total_marks}
                  </td>
                  <td className="p-4">
                    {quiz.duration_mode === "manual"
                      ? quiz.exam_duration
                      : Math.floor(quiz.total_time / 60)}{" "}
                    min
                  </td>
                  {/* <td className="p-4">
                    {isUpcoming ? (
                      <button
                        className="bg-[#ffc300] hover:bg-yellow-500 text-white py-1 px-5 rounded-full font-semibold text-sm cursor-not-allowed inline-flex items-center space-x-1 w-32"
                        disabled
                      >
                        <MdLockOutline className="flex-shrink-0" />
                        <span>Upcoming</span>
                      </button>
                    ) : quiz.is_free === 1 ? (
                      <Link
                        href={`/dashboard/quiz-detail/${quiz.slug}?sid=${schedules.schedule_id}`}
                        className="bg-green-600 text-white px-5 py-1 rounded-full font-semibold text-sm hover:bg-green-700 transition duration-200 inline-flex items-center justify-center w-32"
                      >
                        Start Quiz
                      </Link>
                    ) : (
                      <button
                        className="bg-quaternary text-white py-1 px-5 rounded-full font-semibold text-sm hover:bg-quaternary-dark w-32"
                        onClick={() => handlePayment(quiz.slug+"?sid="+schedules.schedule_id)}
                      >
                        Pay Now
                      </button>
                    )}
                  </td> */}

                  <td>
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
                        href={`/dashboard/quiz-play/${quiz.slug}?sid=${schedules.schedule_id}`}
                        className="text-white bg-[#C9BC0F] px-5 py-1 rounded-full hover:bg-[#928c38] transition duration-200 inline-flex items-center justify-center space-x-1 font-semibold text-sm w-32"
                      >
                        <FiPlay />
                        <span>Resume</span>
                      </Link>
                    ) : quiz.is_free === 1 ? (
                      <Link
                      href={`/dashboard/quiz-detail/${quiz.slug}?sid=${schedules.schedule_id}`}
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
