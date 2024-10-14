"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Define the structure of the practice test data
interface PracticeTestData {
  updated_at: string;
  student_percentage: string | null;
  status: string;
  uuid: string;
  practice_title: string;
}

// Helper function to format dates using native JavaScript
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // Customize the format as needed
};

const PracticeTestsTable: React.FC = () => {
  const [data, setData] = useState<PracticeTestData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch practice test progress data from the API when the component mounts
  useEffect(() => {
    const fetchPracticeTestData = async () => {
      try {
        // Get JWT and category_id from cookies
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication data is missing.");
          return;
        }

        // Make the API request to fetch practice test progress data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pratice-set-progress`, {
          headers: {
            Authorization: `Bearer ${jwt}`, // Pass the JWT token in headers
          },
          params: {
            category: category_id, // Pass the category_id as a parameter
          },
        });

        // Assuming the response contains the data in the expected format
        if (response.data && response.data.data) {
          setData(response.data.data); // Set the practice test progress data in state
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch practice test progress data.");
      }
    };

    fetchPracticeTestData();
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
            <th className="p-3 text-left">Practice Title</th>
            <th className="p-3 text-left">Completed Date</th>
            <th className="p-3 text-left">Student Percentage</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left rounded-tr-lg">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((test, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td> {/* S.No */}
                <td className="p-4">{test.practice_title}</td> {/* Practice Title */}
                <td className="p-4">{formatDate(test.updated_at)}</td> {/* Completed Date */}
                <td className="p-4">
                  {test.student_percentage !== null ? `${test.student_percentage}%` : "-"}
                </td> {/* Student Percentage */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      test.status === "complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                </td> {/* Status Badge */}
                <td className="p-4">
                  <button className="bg-yellow-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-yellow-600 transition">
                    View Test Details
                  </button>
                </td> {/* Action Button */}
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4" colSpan={6}>
                No practice sets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PracticeTestsTable;
