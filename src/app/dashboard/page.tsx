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
}

interface UpcomingExams {
  id: number;
  exam_slug: string;
  exam_name: string;
  duration_mode: string;
  exam_duration: number | null;
  total_questions: number;
  total_marks: string;
  total_time: number;
  point_mode: string;
  point: number | null;
  schedule_type: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
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
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        const dashboardResponse = await axios.get<DashboardData>(`${process.env.NEXT_PUBLIC_API_URL}/student-dashboard`, {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { category: category_id },
        });

        setData(dashboardResponse.data);

        const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        setUserName(profileResponse.data.user.name);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!data) return <NoData message="No Data Found" />;

  const roundedAverageScore = Math.round(data.average_exam);

  const examEvents = [
    { title: "Math Exam", date: "2024-01-10" },
    { title: "Physics Exam", date: "2024-02-15" },
    // Additional exam events can go here
  ];

  const quizEvents = [
    { title: "Math Quiz", date: "2024-01-05" },
    { title: "Physics Quiz", date: "2024-02-10" },
    // Additional quiz events can go here
  ];

  const renderEventContent = (eventInfo: any) => (
    <Tooltip content={`Event: ${eventInfo.event.title} on ${eventInfo.event.startStr}`}>
      <div className="text-center cursor-pointer">{eventInfo.event.title}</div>
    </Tooltip>
  );

  return (
    <div className="dashboard-page">
      <h1 className="text-3xl lg:text-4xl font-bold mb-6">
        Welcome <span className="text-defaultcolor">{userName ? userName : "Student"}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Completed Exams" content={`${data.completed_exam}`} icon={<FiThumbsUp />} iconColor="text-green-500" />
        <DashboardCard title="Passed Exams" content={`${data.pass_exam}`} icon={<FiCheckCircle />} iconColor="text-defaultcolor" />
        <DashboardCard title="Failed Exams" content={`${data.failed_exam}`} icon={<FiThumbsDown />} iconColor="text-red-500" />
        <DashboardCard title="Average Score" content={`${roundedAverageScore}%`} icon={<FiPercent />} iconColor="text-indigo-500" />
      </div>

      {/* Render ResumeExamTable with dynamic data */}
      {data.resumedExam && data.resumedExam.length > 0 && <ResumeExamTable resumedExam={data.resumedExam} />}
      {data.upcomingExams && data.upcomingExams.length > 0 && (
        <UpcomingExamsTable upcomingExams={data.upcomingExams} />
      )}

      {/* {data.exams && data.exams.length > 0 && <ExamTable exams={data.exams} />}
      {data.quizzes && data.quizzes.length > 0 && <QuizTable quizzes={data.quizzes} />} */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Exam Calendar */}
        <div className="bg-white p-3 shadow-sm rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Exams</h2>
          
          <FullCalendar
            eventClassNames="text-center text-blue-500 cursor-pointer"
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={examEvents} // Use same for quizEvents FullCalendar instance
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

        {/* Quiz Calendar */}
        <div className="bg-white p-3 shadow-sm rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Quizzes</h2>
          
          <FullCalendar
            eventClassNames="text-center text-blue-500 cursor-pointer"
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={quizEvents} // Use same for quizEvents FullCalendar instance
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
  );
}
