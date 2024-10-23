"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // For handling cookies
import { toast } from 'react-toastify'; // Optional: For notifications
import { useRouter } from "next/navigation"; // Use router to redirect
import Link from "next/link";
import Loader from '@/components/Common/Loader'; // Assuming you have a Loader component

// Define the TypeScript interface for the quiz object
interface Quiz {
  title: string;
  duration: string;
  is_free: number;
  total_questions: number;
  total_time: number;
  pass_percentage: string;
  slug: string;
  duration_mode: string;
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const router = useRouter(); // For redirecting to other pages
  
  // Function to handle payment logic
  const handlePayment = async (slug: string) =>  {
    try {
      // Get JWT token from cookies
      const jwt = Cookies.get("jwt");
      const type = "quizzes"; // assuming "quizzes" is the type

      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      // Make the API request to check the user's subscription
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          type: type, // Pass the type as a parameter
        },
      });

      // Handle the response
      if (response.data.status === true) {
        router.push(`${slug}`);
      } else {
        toast.error('Please buy a subscription to access this course.');
        router.push("/pricing");
      }
    } catch (error: any) {
      console.log(error);
      // Handle errors such as network issues or API errors
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          toast.error('User is not authenticated. Please log in.');
          router.push("/signin");
        } else if (status === 404) {
          toast.error('Please buy a subscription to access this course.');
          router.push("/pricing");
        } else if (status === 403) {
          toast.error('Feature not available in your plan. Please upgrade your subscription.');
          router.push("/pricing");
        } else {
          toast.error(`An error occurred: ${data.error || 'Unknown error'}`);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

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
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <Loader />; // Display loader while data is being fetched
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message
  }

  return (
    <div className="mb-5">
      {/* Flexbox container to align heading and "See All" link */}
      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-lg lg:text-2xl font-bold mb-3">All Quizzes</h2>
      </div>

      {/* Table container with horizontal scrolling on small screens */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-quaternary text-white">
            <tr> 
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Quiz Title</th>
              <th className="p-3 text-left">Duration (mins)</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Pass Percentage</th>
              <th className="p-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No quizzes available.
                </td>
              </tr>
            ) : (
              quizzes.map((quiz, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{quiz.title}</td>
                  <td className="p-4">{quiz.duration_mode === "manual" ? quiz.duration : Math.floor(quiz.total_time / 60)} min</td> 
                  <td className="p-4">
                    <span className={`${quiz.is_free ? 'text-sm rounded-full font-semibold py-1 px-5 bg-green-500 text-white' : 'text-sm rounded-full font-semibold py-1 px-5 bg-quaternary text-white'}`}>
                      {quiz.is_free ? 'Free' : 'Paid'}
                    </span>
                  </td>
                  <td className="p-4">{quiz.total_questions}</td>
                  <td className="p-4">{quiz.pass_percentage}%</td>
                  <td className="p-4">
                    {quiz.is_free ? (
                      <Link href={`/dashboard/quiz-detail/${quiz.slug}`} className="text-quaternary font-semibold hover:underline">
                        View Details
                      </Link>
                    ) : (
                      <button className="bg-quaternary text-white py-1 px-5 rounded-full font-semibold hover:bg-quaternary-dark text-sm" onClick={() => handlePayment(`/dashboard/quiz-detail/${quiz.slug}`)}>
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
