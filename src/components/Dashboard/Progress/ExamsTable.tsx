"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Define the structure of the exam data
interface ExamData {
  updated_at: string;
  student_percentage: string | null;
  pass_percentage: string;
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

  // Fetch exam progress data from the API when the component mounts
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        // Get JWT and category_id from cookies
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication data is missing.");
          return;
        }

        // Make the API request to fetch exam progress data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exam-progress`, {
          headers: {
            Authorization: `Bearer ${jwt}`, // Pass the JWT token in headers
          },
          params: {
            category: category_id, // Pass the category_id as a parameter
          },
        });

        // Assuming the response contains the data in the expected format
        if (response.data && response.data.data) {
          setData(response.data.data); // Set the exam progress data in state
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch exam progress data.");
      }
    };

    fetchExamData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto whitespace-nowrap">
        <thead className="bg-primary text-white">
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
                <td className="p-4">{index + 1}</td> {/* S.No */}
                <td className="p-4">{exam.exam_title}</td>
                <td className="p-4">{formatDate(exam.updated_at)}</td> {/* Completed Date */}
                <td className="p-4">
                  {exam.student_percentage !== null ? `${exam.student_percentage}%` : "-"}
                </td> {/* Student Percentage */}
                <td className="p-4">{exam.pass_percentage}%</td> {/* Pass Percentage */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      exam.status === "complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </span>
                </td> {/* Status Badge */}
                <td className="p-4">
                  <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-600 transition">
                    View Exam Details
                  </button>
                </td> {/* Action Button */}
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4" colSpan={7}>
                No exams found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExamsTable;
