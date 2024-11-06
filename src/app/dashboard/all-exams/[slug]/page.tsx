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
import NoData from "@/components/Common/NoData";

interface ExamDetail {
  title: string;
  slug: string;
  questions: number;
  time: string;
  marks: number | string;
  is_free: number; // 1 for free, 0 for paid
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
const CACHE_DURATION = 60000; // 1 minute in milliseconds

export default function ExamDetailPage({ params }: { params: { slug: string } }) {
  const [exams, setExams] = useState<ExamDetail[]>([]);
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
    const fetchExams = async () => {
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

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-exams`, {
          params: { slug: params.slug, category },
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (response.data.status) {
          const examsData = response.data.data[params.slug] || [];
          const upcomingExams = examsData.filter((exam: ExamDetail) => {
            const examEndDate = exam.schedule.end_date ? new Date(`${exam.schedule.end_date}T${exam.schedule.end_time}`) : null;
            return !examEndDate || examEndDate >= cachedServerTime;
          });
          setExams(upcomingExams);
        } else {
          toast.error("No exams found for this category");
          router.push("/dashboard/all-exams");
        }
      } catch (error) {
        toast.error("Failed to fetch exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [params, router]);

  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { type: "exams" },
      });

      if (response.data.status) {
        router.push(`/dashboard/exam-detail/${slug}`);
      } else {
        toast.error("Please buy a subscription to access this course.");
        router.push("/pricing");
      }
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401) {
        toast.error("User is not authenticated. Please log in.");
        router.push("/signin");
      } else if (status === 403) {
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

  if (exams.length === 0) {
    return <NoData message="No exams available right now. Please check back later"/>;
  }

  return (
    <div className="mb-5">
      {/* Back arrow button and title */}
      <div className="flex items-center mb-5">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-defaultcolor flex items-center"
        >
          <FaArrowLeftLong className="text-gray-900" size={24} />
        </button>
        <h1 className="text-xl md:text-3xl font-semibold ml-4 capitalize text-black">
          {params.slug.replace(/-/g, " ")}
        </h1>
      </div>

      {/* Desktop Table View (hidden on smaller screens) */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white hidden md:block">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-3 text-left font-semibold">S.No</th>
              <th className="p-3 text-left font-semibold">Exam Title</th>
              <th className="p-3 text-left font-semibold">Available Between</th>
              {/* <th className="p-3 text-left font-semibold">Free/Paid</th> */}
              <th className="p-3 text-left font-semibold">Questions</th>
              <th className="p-3 text-left font-semibold">Marks</th>
              <th className="p-3 text-left font-semibold">Time</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map((exam, index) => {
              const startTime = new Date(`${exam.schedule.start_date}T${exam.schedule.start_time}`);
              const endTime = exam.schedule.end_date && exam.schedule.end_time
                ? new Date(`${exam.schedule.end_date}T${exam.schedule.end_time}`)
                : null;
              const isUpcoming = serverTime && startTime > serverTime;

              let scheduleInfo;
              if (exam.schedule.schedule_type === "flexible") {
                scheduleInfo = `${exam.schedule.start_date} ${exam.schedule.start_time} - ${exam.schedule.end_date ?? "N/A"} ${exam.schedule.end_time ?? "N/A"}`;
              } else {
                scheduleInfo = `${exam.schedule.start_date} ${exam.schedule.start_time}`;
              }

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{exam.title}</td>
                  <td className="p-4">{scheduleInfo}</td>
                  {/* <td className="p-4">
                    <span
                      className={`${
                        exam.is_free
                          ? "text-sm rounded-full font-semibold py-1 px-5 bg-green-500 text-white"
                          : "text-sm rounded-full font-semibold py-1 px-5 bg-secondary text-white"
                      }`}
                    >
                      {exam.is_free ? "Free" : "Paid"}
                    </span>
                  </td> */}
                  <td className="p-4">{exam.questions}</td>
                  <td className="p-4">{exam.marks}</td>
                  <td className="p-4">{exam.time} mins</td>
                  <td className="p-4">
                    {isUpcoming ? (
                      <span className="bg-gray-300 text-gray-500 py-1 px-5 rounded-full font-semibold text-sm">
                        Upcoming
                      </span>
                    ) : exam.is_free === 1 ? (
                      <Link href={`/dashboard/exam-detail/${exam.slug}`} className="text-defaultcolor font-semibold">
                        Start Exam
                      </Link>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white py-1 px-5 rounded-full font-semibold"
                        onClick={() => handlePayment(exam.slug)}
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

      {/* Mobile Card View (hidden on medium and larger screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {exams.map((exam, index) => {
          const startTime = new Date(`${exam.schedule.start_date}T${exam.schedule.start_time}`);
          const endTime = exam.schedule.end_date && exam.schedule.end_time
            ? new Date(`${exam.schedule.end_date}T${exam.schedule.end_time}`)
            : null;
          const isUpcoming = serverTime && startTime > serverTime;

          let scheduleInfo;
          if (exam.schedule.schedule_type === "flexible") {
            scheduleInfo = `${exam.schedule.start_date} ${exam.schedule.start_time} - ${exam.schedule.end_date ?? "N/A"} ${exam.schedule.end_time ?? "N/A"}`;
          } else {
            scheduleInfo = `${exam.schedule.start_date} ${exam.schedule.start_time}`;
          }

          return (
            <div key={index} className="p-4 bg-white shadow-sm rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{exam.title}</h3>
                {exam.is_free === 1 && <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Free</span>}
              </div>
              <div className="text-gray-600 flex flex-col mb-3">
                <div className="flex items-center justify-between border-b border-dashed pb-2 mb-2">
                  <div className="flex items-center">
                    <FaQuestionCircle className="text-gray-400 mr-2" />
                    <span className="font-medium">Questions:</span>
                  </div>
                  <span>{exam.questions}</span>
                </div>
                <div className="flex items-center justify-between border-b border-dashed pb-2 mb-2">
                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-2" />
                    <span className="font-medium">Time:</span>
                  </div>
                  <span>{exam.time} mins</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="text-gray-400 mr-2" />
                    <span className="font-medium">Marks:</span>
                  </div>
                  <span>{exam.marks}</span>
                </div>
              </div>
              <div className="text-gray-700 mb-3">
                <span className="font-semibold">Available Between:</span> {scheduleInfo}
              </div>
              {isUpcoming ? (
                <span className="bg-gray-300 text-gray-500 py-2 px-5 rounded-sm text-sm block w-full text-center">Upcoming</span>
              ) : exam.is_free === 1 ? (
                <Link href={`/dashboard/exam-detail/${exam.slug}`} className="bg-defaultcolor text-white py-2 px-5 block rounded-sm text-center w-full">
                  View Details
                </Link>
              ) : (
                <button
                  onClick={() => handlePayment(exam.slug)}
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
