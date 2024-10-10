"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // For handling cookies
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

// Define the TypeScript interface for the quiz object
interface Quiz {
  title: string;
  duration: string;
  is_free: number;
  total_questions: number;
  total_time: number;
  pass_percentage: string;
  slug: string;
  duration_mode:string;
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch quizzes when the component is mounted
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Get JWT token from cookies
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt) {
          setError("Authentication data is missing.");
          return;
        }

        // Make the API request to get the quizzes
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-all`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            category: category_id,
          },
        });

        // Check if the response has the expected structure
        if (response.data && response.data.data) {
          setQuizzes(response.data.data); // Set the quizzes data in state
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch quizzes from the server.");
      }
    };

    fetchQuizzes();
  }, []);


  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-5 bg-white shadow-sm rounded-lg mb-8">
      {/* Flexbox container to align heading and "See All" link */}
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <h2 className="text-lg font-bold mb-2 md:mb-0">All Quizzes</h2>
        {/* <a
          href="#"
          className="text-secondary font-semibold flex items-center space-x-2 hover:underline transition duration-200"
        >
          <span>See All</span>
          <FiArrowRight /> 
        </a> */}
      </div>

      {/* Table container with horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Quiz Title</th>
              <th className="p-3 text-left">Duration (mins)</th>
              <th className="p-3 text-left">Fee</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Pass Percentage</th>
              <th className="p-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{quiz.title}</td>
                {/* <td className="p-4">{quiz.duration}</td> */}
                <td className="p-4">{quiz.duration_mode == "manual" ? quiz.duration : Math.floor(quiz.total_time / 60)} min</td> 
                <td className="p-4">{quiz.is_free ? 'Free' : `$${quiz.total_time}`}</td>
                <td className="p-4">{quiz.total_questions}</td>
                <td className="p-4">{quiz.pass_percentage}%</td>
                <td className="p-4">
                  {quiz.is_free ? (
                    <Link href={`/dashboard/quiz-detail/${quiz.slug}`} className="text-secondary font-semibold hover:underline">
                      View Details
                    </Link>
                  ) : (
                    <button className="bg-secondary text-white py-1 px-5 rounded-full font-semibold hover:bg-secondary-dark text-sm" onClick={() => handlePayment(quiz.slug)}>
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Function to handle payment logic
const handlePayment = (slug: string) => {
  // Implement your payment logic here, e.g., redirect to a payment page
  alert(`Redirecting to payment for ${slug}`);
};
