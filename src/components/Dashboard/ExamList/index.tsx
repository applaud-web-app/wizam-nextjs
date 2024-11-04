"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";

interface Exam {
  title: string | null;
  is_free: number;
  price: number | null;
  total_questions: number;
  total_marks: number;
  total_time: number;
  point: number | null;
  slug: string | null;
  point_mode: string | null;
  duration_mode: string;
  exam_duration: number;
  schedules: {
    schedule_type: string;
    start_date: string;
    start_time: string;
    end_date: string | null;
    end_time: string | null;
  };
}

const CACHE_KEY = "serverTimeCache";
const CACHE_DURATION = 60000; // 1 minute in milliseconds

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
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
          const timeResponse = await axios.get('/api/time');
          cachedServerTime = new Date(timeResponse.data.serverTime);
          cacheServerTime(cachedServerTime);
        }
        setServerTime(cachedServerTime);

        const examsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exam-all`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
            params: { category: category_id },
          }
        );

        // Filter out exams that have already ended
        const filteredExams = examsResponse.data.data.filter((exam: Exam) => {
          const endDateTime = exam.schedules.end_date && exam.schedules.end_time
            ? new Date(`${exam.schedules.end_date}T${exam.schedules.end_time}`)
            : null;
          return !endDateTime || endDateTime >= cachedServerTime;
        });

        setExams(filteredExams);
      } catch (error) {
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      const type = "exams";

      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: { type },
      });

      if (response.data.status === true) {
        router.push(`/dashboard/exam-detail/${slug}`);
      } else {
        toast.error('Please buy a subscription to access this course.');
        router.push("/pricing");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error('User is not authenticated. Please log in.');
          router.push("/signin");
        } else if (status === 403 || status === 404) {
          toast.error('Please buy a subscription to access this course.');
          router.push("/pricing");
        } else {
          toast.error(`An error occurred: ${data.error || 'Unknown error'}`);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-5">{error}</div>;
  }

  if (exams.length === 0) {
    return <NoData message="No exams available at the moment" />;
  }

  return (
    <div className="mb-5">
      <h2 className="text-lg lg:text-2xl font-bold mb-3">All Exams</h2>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto rounded-lg overflow-hidden text-nowrap">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left">Available Between</th>
              <th className="p-3 text-left">Free/Paid</th>
              <th className="p-3 text-left">Questions</th>
              <th className="p-3 text-left">Marks</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam, index) => {
              const { schedules } = exam;
              const examStartDateTime = new Date(`${schedules.start_date}T${schedules.start_time}`);
              const isUpcoming = serverTime && examStartDateTime > serverTime;

              let scheduleInfo;
              if (schedules.schedule_type === "flexible") {
                scheduleInfo = `${schedules.start_date} ${schedules.start_time} - ${schedules.end_date ?? "N/A"} ${schedules.end_time ?? "N/A"}`;
              } else {
                scheduleInfo = `${schedules.start_date} ${schedules.start_time}`;
              }

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{exam.title || "-"}</td>
                  <td className="p-4">{scheduleInfo}</td>
                  <td className="p-4">
                    <span
                      className={`${
                        exam.is_free
                          ? "text-sm rounded-full font-semibold py-1 px-5 bg-green-500 text-white"
                          : "text-sm rounded-full font-semibold py-1 px-5 bg-secondary text-white"
                      }`}
                    >
                      {exam.is_free ? "Free" : "Paid"}
                    </span>
                  </td>
                  <td className="p-4">{exam.total_questions || "-"}</td>
                  <td className="p-4">
                    {exam.point_mode === "manual"
                      ? exam.point! * exam.total_questions
                      : exam.total_marks}
                  </td>
                  <td className="p-4">
                    {exam.duration_mode === "manual"
                      ? exam.exam_duration
                      : Math.floor(exam.total_time / 60)}{" "}
                    min
                  </td>
                  <td className="p-4">
                    {isUpcoming ? (
                      <span className="bg-gray-300 text-gray-500 py-1 px-5 rounded-full font-semibold text-sm cursor-not-allowed">
                        Upcoming
                      </span>
                    ) : exam.is_free === 1 ? (
                      <Link
                        href={`/dashboard/exam-detail/${exam.slug}`}
                        className="text-defaultcolor font-semibold hover:underline"
                      >
                        View Details
                      </Link>
                    ) : (
                      <button
                        className="bg-defaultcolor text-white py-1 px-5 rounded-full font-semibold hover:bg-defaultcolor-dark text-sm"
                        onClick={() => handlePayment(`/dashboard/exam-detail/${exam.slug}`)}
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
