"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FiCheckCircle, FiPercent, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import DashboardCard from "@/components/DashboardCards";
import NoData from "@/components/Common/NoData";
import Loader from "@/components/Common/Loader";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Tooltip } from "flowbite-react";
import ResumeExamTable from "@/components/ResumeExamTable";
import UpcomingExamsTable from "@/components/UpcomingExamsTable";
import { toast } from "react-toastify";

interface Exam {
  id: string;
  title: string;
  duration_mode: string;
  total_questions: number;
  total_marks: string;
  total_time: number;
  exam_duration: number;
  point_mode: string;
  point: number;
}

interface Quiz {
  id: string;
  title: string;
  sub_category_name: string;
  total_questions: number;
  pass_percentage: string;
  total_marks: string;
  duration: string;
  point_mode: string;
  point: number;
  duration_mode: string;
  total_time: number;
}

interface ResumeExam {
  slug: string;
  title: string;
  duration_mode: string;
  total_questions: number;
  total_marks: string;
  total_time: number;
  exam_duration: number;
  point_mode: string;
  point: number;
  schedule_id: string;
}

interface UpcomingExams {
  id: number;
  exam_slug: string;
  exam_name: string;
  duration_mode: string;
  exam_duration: string | null; // Changed from number | null to string | null
  total_questions: string;      // Changed from number to string
  total_marks: string;
  total_time: string;           // Changed from number to string
  point_mode: string;
  point: number | null;
  schedule_type: string;
  schedule_id: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  is_free: number; // Indicates if the exam is free
  is_resume: boolean; // Indicates if the exam can be resumed
  total_attempts: string | null; // Changed from number | null to string | null
  restrict_attempts: number; // Added based on sample data
}
interface CalendarExam {
  slug: string;
  title: string;
  schedule_type: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  grace_period: string;
}

interface CalendarQuiz {
  slug: string;
  title: string;
  start_date: string;
}

interface DashboardData {
  resumedExam: ResumeExam[];
  upcomingExams: UpcomingExams[];
  pass_exam: number;
  failed_exam: number;
  average_exam: number;
  exams: Exam[];
  quizzes: Quiz[];
  completed_exam: number;
  calenderExam: CalendarExam[];
  calenderQuiz: CalendarQuiz[];
}

const CACHE_KEY = "serverTimeCache";
const CACHE_DURATION = 60000; // 1 minute in milliseconds

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const priceId: string | undefined = Cookies.get("plan_id");
    const priceType: string | undefined = Cookies.get("priceType");

    // Check if cookies exist and remove them
    if (priceId) {
      Cookies.remove("plan_id");
    }
    if (priceType) {
      Cookies.remove("priceType");
    }
  }, []); // Empty dependency array to run once on mount

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
      const jwt = Cookies.get("jwt");
      const category_id = Cookies.get("category_id");

      if (!jwt) {
        setError("Missing authentication data.");
        setLoading(false);
        return;
      }
      if (!category_id) {
        router.push("/dashboard/change-syllabus");
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

        const dashboardResponse = await axios.get<DashboardData>(
          `${process.env.NEXT_PUBLIC_API_URL}/student-dashboard`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
            params: { category: category_id },
          }
        );

        setData(dashboardResponse.data);

        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        setUserName(profileResponse.data.user.name);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!data) return <NoData message="No Data Found" />;

  const roundedAverageScore = Math.round(data.average_exam);

  // Generate events dynamically from API response
  const examEvents =
    data.calenderExam?.map((exam) => ({
      title: exam.title,
      date: exam.start_date,
    })) || [];

  const quizEvents =
    data.calenderQuiz?.map((quiz) => ({
      title: quiz.title,
      date: quiz.start_date,
    })) || [];

  const renderEventContent = (eventInfo: { event: { title: string; startStr: string } }) => (
    <Tooltip
      placement="bottom"
      content={`Event: ${eventInfo.event.title || "N/A"} on ${
        eventInfo.event.startStr || "N/A"
      }`}
      className="tooltip-content z-50"
    >
      <div className="text-center cursor-pointer">
        {eventInfo.event.title || "Untitled Event"}
      </div>
    </Tooltip>
  );

  return (
    <div className="dashboard-page">
      <h1 className="text-3xl lg:text-4xl font-bold mb-6 capitalize">
        Welcome <span className="text-defaultcolor">{userName ? userName : "Student"}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Completed Exams"
          content={`${data.completed_exam}`}
          icon={<FiThumbsUp />}
          iconColor="text-green-500"
        />
        <DashboardCard
          title="Average Score"
          content={`${roundedAverageScore}%`}
          icon={<FiPercent />}
          iconColor="text-indigo-500"
        />
        <DashboardCard
          title="Passed"
          content={`${data.pass_exam}`}
          icon={<FiCheckCircle />}
          iconColor="text-defaultcolor"
        />
        <DashboardCard
          title="Failed"
          content={`${data.failed_exam}`}
          icon={<FiThumbsDown />}
          iconColor="text-red-500"
        />
      </div>

      {/* Render ResumeExamTable with dynamic data */}
      {data.resumedExam && data.resumedExam.length > 0 && (
        <ResumeExamTable resumedExam={data.resumedExam} />
      )}

      {data.upcomingExams && data.upcomingExams.length > 0 && (
        <UpcomingExamsTable upcomingExams={data.upcomingExams} serverTime={serverTime} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Exam Calendar */}
        <div>
          <h2 className="text-lg lg:text-2xl font-bold mb-3">Exams</h2>
          <div className="bg-white p-2 shadow-sm rounded-lg">
            <FullCalendar
              eventClassNames="text-center text-blue-500 cursor-pointer"
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={examEvents}
              eventContent={renderEventContent}
              headerToolbar={{
                left: "today",
                center: "title",
                right: "prev next",
              }}
              height="auto"
              contentHeight="auto"
            />
          </div>
        </div>

        {/* Quiz Calendar */}
        <div>
          <h2 className="text-lg lg:text-2xl font-bold mb-3">Quizzes</h2>
          <div className="bg-white p-2 shadow-sm rounded-lg">
            <FullCalendar
              eventClassNames="text-center text-blue-500 cursor-pointer"
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={quizEvents}
              eventContent={renderEventContent}
              headerToolbar={{
                left: "today",
                center: "title",
                right: "prev next",
              }}
              height="auto"
              contentHeight="auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
