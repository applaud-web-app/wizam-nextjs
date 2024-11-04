"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

interface QuizData {
  sno: number;
  quiz_title: string;
  updated_at: string;
  student_percentage: string | null;
  pass_percentage: string;
  status: string;
  uuid: string;
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const QuizzesTable: React.FC = () => {
  const [data, setData] = useState<QuizData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz progress data from the API when the component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication data is missing.");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-progress`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            category: category_id,
          },
        });

        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch quiz progress data.");
      }
    };

    fetchQuizData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto whitespace-nowrap">
        <thead className="bg-quaternary text-white">
          <tr>
            <th className="p-3 text-left rounded-tl-lg">S.No</th>
            <th className="p-3 text-left">Quiz Title</th>
            <th className="p-3 text-left">Completed Date</th>
            <th className="p-3 text-left">Student Percentage</th>
            <th className="p-3 text-left">Pass Percentage</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left rounded-tr-lg">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((quiz, index) => {
              const isPassed = quiz.student_percentage !== null &&
                               parseFloat(quiz.student_percentage) >= parseFloat(quiz.pass_percentage);

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{quiz.quiz_title}</td>
                  <td className="p-4">{formatDate(quiz.updated_at)}</td>
                  <td className="p-4">{quiz.student_percentage ? `${quiz.student_percentage}%` : "0%"}</td>
                  <td className="p-4">{quiz.pass_percentage}%</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isPassed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isPassed ? "Passed" : "Failed"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/dashboard/quiz-result/${quiz.uuid}`} className="bg-defaultcolor text-white px-5 py-1 text-sm rounded-full hover:bg-defaultcolor-dark transition">
                      Result
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="p-4" colSpan={7}>
                <p className="text-center">No Quiz data found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuizzesTable;
