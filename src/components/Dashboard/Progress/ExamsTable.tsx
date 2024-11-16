"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

// Define the structure of the exam data
interface ExamData {
  updated_at: string;
  student_percentage: number;
  pass_percentage: number;
  status: string;
  uuid: string;
  exam_title: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // Customize the format as needed
};

const ExamsTable: React.FC = () => {
  const [data, setData] = useState<ExamData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication data is missing.");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exam-progress`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            params: {
              category: category_id,
            },
          }
        );

        if (response.data && response.data.data) {
          const examData = response.data.data;
          setData(examData);
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch exam progress data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-500 py-5">Loading data...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto whitespace-nowrap">
        <thead className="bg-defaultcolor text-white">
          <tr>
            <th className="p-3 text-left rounded-tl-lg">S.No</th>
            <th className="p-3 text-left">Exam Title</th>
            <th className="p-3 text-left">Completed Date</th>
            <th className="p-3 text-left">Student Percentage</th>
            <th className="p-3 text-left">Pass Percentage</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left rounded-tr-lg">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.exam_title}</td>
                <td className="p-4">{formatDate(exam.updated_at)}</td>
                <td className="p-4">
                  {exam.student_percentage !== null
                    ? `${exam.student_percentage ?? 0}%`
                    : "0%"}
                </td>
                <td className="p-4">{exam.pass_percentage ?? 0}%</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      Number(exam.student_percentage) >= Number(exam.pass_percentage)
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {Number(exam.student_percentage) >= Number(exam.pass_percentage) ? "Passed" : "Failed"}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    href={`/dashboard/exam-result/${exam.uuid}`}
                    className="bg-defaultcolor text-white px-5 py-1 text-sm rounded-full hover:bg-defaultcolor-dark transition"
                  >
                    Result
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4" colSpan={7}>
                <p className="text-center">No exam data found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExamsTable;
