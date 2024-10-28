"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface Quiz {
  id: string; // Unique identifier for each quiz
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

interface QuizTableProps {
  quizzes: Quiz[];
}

export default function QuizTable({ quizzes }: QuizTableProps) {
  if (!quizzes || quizzes.length === 0) return <p>No quizzes available</p>;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-lg lg:text-2xl font-bold mb-3">All Quizzes</h2>
        <Link
          href="/dashboard/quizzes"
          className="text-quaternary font-semibold flex items-center space-x-2 hover:underline transition duration-200 mb-3"
        >
          <span>See All</span>
          <FiArrowRight />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-quaternary text-white rounded-t-lg">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Quiz Title</th>
              <th className="p-3 text-left">Duration (Min)</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 rounded-b-lg">
            {quizzes.map((quiz, index) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{quiz.title}</td>
                <td className="p-4">
                  {quiz.duration_mode === "manual"
                    ? quiz.duration
                    : Math.floor(quiz.total_time / 60)}{" "}
                  min
                </td>
                <td className="p-4">{quiz.total_questions}</td>
                <td className="p-4">
                  {quiz.point_mode === "manual"
                    ? quiz.total_questions * quiz.point
                    : quiz.total_marks}
                </td>
                <td className="p-4">
                  <Link
                    href={`/dashboard/quiz/${quiz.id}`}
                    className="text-quaternary font-semibold hover:underline transition duration-200"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
