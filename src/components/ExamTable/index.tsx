"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface Exam {
  id: string; // Unique identifier for each exam
  title: string;
  duration_mode: string;
  total_questions: number;
  total_marks: string;
  total_time: number;
  exam_duration: number;
  point_mode: string;
  point: number;
}

interface ExamTableProps {
  exams: Exam[];
}

export default function ExamTable({ exams }: ExamTableProps) {
  if (!exams || exams.length === 0) return <p>No exams available</p>;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-lg lg:text-2xl font-bold mb-3">All Exams</h2>
        <Link
          href="/dashboard/all-exams"
          className="text-defaultcolor font-semibold flex items-center space-x-2 hover:underline transition duration-200 mb-3"
        >
          <span>See All</span>
          <FiArrowRight />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left">Duration (Min)</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.title}</td>
                <td className="p-4">
                  {exam.duration_mode === "manual"
                    ? exam.exam_duration
                    : Math.floor(exam.total_time / 60)}{" "}
                  min
                </td>
                <td className="p-4">{exam.total_questions}</td>
                <td className="p-4">
                  {exam.point_mode === "manual"
                    ? exam.total_questions * exam.point
                    : exam.total_marks}
                </td>
                <td className="p-4">
                  <Link
                    href={`/dashboard/exam/${exam.id}`}
                    className="text-defaultcolor font-semibold hover:underline transition duration-200"
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
