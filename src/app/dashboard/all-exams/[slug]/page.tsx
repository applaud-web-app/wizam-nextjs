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
import { FiPlay } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";

interface ExamDetail {
  title: string;
  slug: string;
  questions: number;
  time: string;
  marks: number | string;
  is_free: number; // 1 for free, 0 for paid
  is_resume: boolean;
  is_public: number;
  total_attempts: number | null | string;
  schedule: {
    schedule_id: string;
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

const formatDateTime = (dateString: string, timeString: string | null) => {
  if (!dateString) return "Always Available";
  const date = new Date(`${dateString}T${timeString || "00:00"}`);
  return (
    date.toLocaleDateString("en-GB") +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

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
          const timeResponse = await axios.get("/api/time");
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

          // No need to filter exams here, we'll handle it in the render method
          setExams(examsData);
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
  }, [params.slug, router]);

  // Update serverTime every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (serverTime) {
      interval = setInterval(() => {
        setServerTime((prevTime) => new Date(prevTime!.getTime() + 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [serverTime]);

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
        toast.error("Please buy a subscription to access this course.");
        router.push("/pricing");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error("User is not authenticated. Please log in.");
          router.push("/login");
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

  if (loading) {
    return <Loader />;
  }

  if (exams.length === 0) {
    return <NoData message="No exams available right now. Please check back later" />;
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
              <th className="p-3 text-left">Attempts</th>
              <th className="p-3 text-left font-semibold">Questions</th>
              <th className="p-3 text-left font-semibold">Marks</th>
              <th className="p-3 text-left font-semibold">Time</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map((exam, index) => {
              const { schedule } = exam;
              const currentTime = serverTime || new Date();

              let isUpcoming = false;
              let isAvailable = false;
              let isOver = false;

              const startDateTime = new Date(
                `${schedule.start_date}T${schedule.start_time}`
              );
              const endDateTime =
                schedule.end_date && schedule.end_time
                  ? new Date(`${schedule.end_date}T${schedule.end_time}`)
                  : null;

              if (exam.is_public === 1) {
                // Public exams are always available
                isAvailable = true;
              } else {
                if (
                  schedule.schedule_type === "flexible" ||
                  schedule.schedule_type === "fixed"
                ) {
                  if (currentTime < startDateTime) {
                    isUpcoming = true;
                  } else if (endDateTime && currentTime > endDateTime) {
                    isOver = true;
                  } else {
                    isAvailable = true;
                  }
                } else if (schedule.schedule_type === "attempts") {
                  if (currentTime < startDateTime) {
                    isUpcoming = true;
                  } else {
                    isAvailable = true;
                  }
                }
              }

              // Skip over exams
              if (isOver) {
                return null;
              }

              let scheduleInfo;
              if (schedule.schedule_type === "flexible") {
                scheduleInfo = `${formatDateTime(
                  schedule.start_date,
                  schedule.start_time
                )} - ${formatDateTime(schedule.end_date!, schedule.end_time)}`;
              } else if (schedule.schedule_type === "fixed") {
                scheduleInfo = `Fixed - ${formatDateTime(
                  schedule.start_date,
                  schedule.start_time
                )}`;
              } else if (schedule.schedule_type === "attempts") {
                scheduleInfo = `From ${formatDateTime(
                  schedule.start_date,
                  schedule.start_time
                )}`;
              } else {
                scheduleInfo = `${formatDateTime(
                  schedule.start_date,
                  schedule.start_time
                )}`;
              }

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{exam.title}</td>
                  <td className="p-4">{scheduleInfo}</td>
                  <td className="p-4">
                    {exam.total_attempts === "" ||
                    exam.total_attempts === null ||
                    exam.total_attempts === undefined
                      ? "-"
                      : exam.total_attempts}
                  </td>
                  <td className="p-4">{exam.questions}</td>
                  <td className="p-4">{exam.marks}</td>
                  <td className="p-4">{exam.time} mins</td>
                  <td className="p-4">
                    {isUpcoming ? (
                      <button
                        className="bg-[#ffc300] hover:bg-yellow-500 text-white py-1 px-5 rounded-full font-semibold text-sm cursor-not-allowed inline-flex items-center space-x-1 w-32"
                        disabled
                      >
                        <MdLockOutline className="flex-shrink-0" />
                        <span>Upcoming</span>
                      </button>
                    ) : exam.is_resume ? (
                      <Link
                        href={`/dashboard/exam-play/${exam.slug}?sid=${schedule.schedule_id ?? 0}`}
                        className="text-white bg-[#C9BC0F] px-5 py-1 rounded-full hover:bg-[#928c38] transition duration-200 inline-flex items-center justify-center space-x-1 font-semibold text-sm w-32"
                      >
                        <FiPlay />
                        <span>Resume</span>
                      </Link>
                    ) : exam.is_free === 1 ? (
                      <Link
                        href={`/dashboard/exam-detail/${exam.slug}?sid=${schedule.schedule_id ?? 0}`}
                        className="bg-green-600 text-white px-5 py-1 rounded-full font-semibold text-sm hover:bg-green-700 transition duration-200 inline-flex items-center justify-center w-32"
                      >
                        Start Exam
                      </Link>
                    ) : (
                      <button
                        className="bg-defaultcolor text-white py-1 px-5 rounded-full font-semibold text-sm hover:bg-defaultcolor-dark w-32"
                        onClick={() =>
                          handlePayment(`${exam.slug}?sid=${schedule.schedule_id ?? 0}`)
                        }
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
          const { schedule } = exam;
          const currentTime = serverTime || new Date();

          let isUpcoming = false;
          let isAvailable = false;
          let isOver = false;

          const startDateTime = new Date(
            `${schedule.start_date}T${schedule.start_time}`
          );
          const endDateTime =
            schedule.end_date && schedule.end_time
              ? new Date(`${schedule.end_date}T${schedule.end_time}`)
              : null;

          if (exam.is_public === 1) {
            // Public exams are always available
            isAvailable = true;
          } else {
            if (
              schedule.schedule_type === "flexible" ||
              schedule.schedule_type === "fixed"
            ) {
              if (currentTime < startDateTime) {
                isUpcoming = true;
              } else if (endDateTime && currentTime > endDateTime) {
                isOver = true;
              } else {
                isAvailable = true;
              }
            } else if (schedule.schedule_type === "attempts") {
              if (currentTime < startDateTime) {
                isUpcoming = true;
              } else {
                isAvailable = true;
              }
            }
          }

          // Skip over exams
          if (isOver) {
            return null;
          }

          let scheduleInfo;
          if (schedule.schedule_type === "flexible") {
            scheduleInfo = `${formatDateTime(
              schedule.start_date,
              schedule.start_time
            )} - ${formatDateTime(schedule.end_date!, schedule.end_time)}`;
          } else if (schedule.schedule_type === "fixed") {
            scheduleInfo = `Fixed - ${formatDateTime(
              schedule.start_date,
              schedule.start_time
            )}`;
          } else if (schedule.schedule_type === "attempts") {
            scheduleInfo = `From ${formatDateTime(
              schedule.start_date,
              schedule.start_time
            )}`;
          } else {
            scheduleInfo = `${formatDateTime(
              schedule.start_date,
              schedule.start_time
            )}`;
          }

          return (
            <div key={index} className="p-4 bg-white shadow-sm rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{exam.title}</h3>
                {exam.is_free === 1 && (
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Free
                  </span>
                )}
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
                <span className="font-semibold">Available Between:</span>{" "}
                {scheduleInfo}
              </div>
              {isUpcoming ? (
                <button
                  className="bg-[#ffc300] hover:bg-yellow-500 text-white py-2 px-5 rounded-full font-semibold text-sm cursor-not-allowed inline-flex items-center justify-center space-x-1 w-full"
                  disabled
                >
                  <MdLockOutline className="flex-shrink-0" />
                  <span>Upcoming</span>
                </button>
              ) : exam.is_resume ? (
                <Link
                  href={`/dashboard/exam-play/${exam.slug}?sid=${schedule.schedule_id ?? 0}`}
                  className="text-white bg-[#C9BC0F] px-5 py-2 rounded-full hover:bg-[#928c38] transition duration-200 inline-flex items-center justify-center space-x-1 font-semibold text-sm w-full"
                >
                  <FiPlay />
                  <span>Resume</span>
                </Link>
              ) : exam.is_free === 1 ? (
                <Link
                  href={`/dashboard/exam-detail/${exam.slug}?sid=${schedule.schedule_id ?? 0}`}
                  className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-green-700 transition duration-200 inline-flex items-center justify-center w-full"
                >
                  Start Exam
                </Link>
              ) : (
                <button
                  onClick={() =>
                    handlePayment(`${exam.slug}?sid=${schedule.schedule_id ?? 0}`)
                  }
                  className="bg-defaultcolor text-white py-2 px-5 rounded-full font-semibold text-sm hover:bg-defaultcolor-dark w-full"
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
