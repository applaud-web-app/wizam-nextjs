"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

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

interface QuizTableProps {
  quizzes: Quiz[];
}

export default function QuizTable({ quizzes }: QuizTableProps) {
  if (!quizzes || quizzes.length === 0) return <p>No quizzes available</p>; // Check if quizzes exist

  return (
    <div className=" mb-8">
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <h2 className="text-lg lg:text-2xl font-bold mb-2 md:mb-0">All Quizzes</h2>
        <Link href="/dashboard/quizzes" className="text-defaultcolor font-semibold flex items-center space-x-2 hover:underline transition duration-200">
          <span>See All</span>
          <FiArrowRight />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Quiz Title</th>
              <th className="p-3 text-left">Duration (Min)</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{quiz.title}</td>
                <td className="p-4">{quiz.duration_mode === "manual" ? quiz.duration : Math.floor(quiz.total_time / 60)} min</td>
                <td className="p-4">{quiz.total_questions}</td>
                <td className="p-4">{quiz.point_mode == "manual" ? (quiz.total_questions * quiz.point) : quiz.total_marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
