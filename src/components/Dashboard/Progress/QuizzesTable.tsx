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

// Helper function to format dates using native JavaScript
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // You can customize the format further if needed
};

const QuizzesTable: React.FC = () => {
  const [data, setData] = useState<QuizData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz progress data from the API when the component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Get JWT and category_id from cookies
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication data is missing.");
          return;
        }

        // Make the API request to fetch quiz progress data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-progress`, {
          headers: {
            Authorization: `Bearer ${jwt}`, // Pass the JWT token in headers
          },
          params: {
            category: category_id, // Pass the category_id as a parameter
          },
        });

        // Assuming the response contains the data in the expected format
        if (response.data && response.data.data) {
          setData(response.data.data); // Set the quiz progress data in state
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
        <thead className="bg-defaultcolor text-white">
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
            data.map((quiz, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td> {/* S.No */}
                <td className="p-4">{quiz.quiz_title}</td>
                <td className="p-4">{formatDate(quiz.updated_at)}</td> {/* Date formatting */}
                <td className="p-4">
                  {quiz.student_percentage !== null ? `${quiz.student_percentage}%` : "-"}
                </td> {/* Student Percentage */}
                <td className="p-4">{quiz.pass_percentage}%</td> {/* Pass Percentage */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      quiz.status === "complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                  </span>
                </td> {/* Status Badge */}
                <td className="p-4">
                  <Link href={`/dashboard/quiz-result/${quiz.uuid}`} className="bg-green-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-600 transition">
                  Result
                  </Link>
                </td> {/* Action Button */}
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4" colSpan={7}>
                Result
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuizzesTable;
