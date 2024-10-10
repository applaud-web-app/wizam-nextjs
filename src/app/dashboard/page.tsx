"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import ExamTable from "@/components/ExamTable";
import QuizTable from "@/components/QuizTable";
import { FiCheckCircle, FiPercent, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import DashboardCard from "@/components/DashboardCards";
import NoData from "@/components/Common/NoData";
import Loader from "@/components/Common/Loader";
import { useRouter } from 'next/navigation';

// Type definitions for the response
interface Exam {
  title: string;
  duration_mode: string;
  total_questions: number;
  total_marks: string;
  total_time: number;
  duration:string;
  point_mode:string;
  point:number;
}

interface Quiz {
  title: string;
  sub_category_name: string;
  total_questions: number;
  pass_percentage: string;
  total_marks: string;
  duration:string;
  point_mode:string;
  point:number;
  duration_mode: string;
  total_time: number;
}

interface DashboardData {
  pass_exam: number;
  failed_exam: number;
  average_exam: number;
  exams: Exam[];
  quizzes: Quiz[];
  completed_exam: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null); // Initialize with null to handle data loading
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      <Loader />
      // Retrieve JWT and category_id from cookies using js-cookie
      const jwt = Cookies.get("jwt");
      const category_id = Cookies.get("category_id");

      if (!jwt) {
        setError("Missing authentication data.");
        return;
      }
      if (!category_id) {
        router.push("/dashboard/change-syllabus");
        return;
      }
      try {
        const response = await axios.get<DashboardData>(`${process.env.NEXT_PUBLIC_API_URL}/student-dashboard`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: { category: category_id }, // Send category_id as a query parameter
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        setError("Failed to fetch data");
      }
      
    };

    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <NoData message="No Data Found"/>; // Wait for data to be fetched

  // Calculate rounded average score and total completed exams
  const roundedAverageScore = Math.round(data.average_exam);

  return (
    <div className="dashboard-page">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Completed Exams" content={`${data.completed_exam} Completed`} icon={<FiThumbsUp />} iconColor="text-green-500" />
        <DashboardCard title="Passed Exams" content={`${data.pass_exam} Passed`} icon={<FiCheckCircle />} iconColor="text-primary" />
        <DashboardCard title="Failed Exams" content={`${data.failed_exam} Failed`} icon={<FiThumbsDown />} iconColor="text-red-500" />
        <DashboardCard title="Average Score" content={`${roundedAverageScore}% Score`} icon={<FiPercent />} iconColor="text-indigo-500" />
       
      </div>

      {/* Check if exams and quizzes exist before rendering */}
      {data.exams && data.exams.length > 0 ? <ExamTable exams={data.exams} /> : ''}
      {data.quizzes && data.quizzes.length > 0 ? <QuizTable quizzes={data.quizzes} /> : ''}
    </div>
  );
}
