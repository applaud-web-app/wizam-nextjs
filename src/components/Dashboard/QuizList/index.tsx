"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // For handling cookies
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { toast } from 'react-toastify'; // Optional: For notifications
import { useRouter } from "next/navigation"; // Use router to redirect

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
  const [showModal, setShowModal] = useState<boolean>(false); // Modal state
  const router = useRouter(); // For redirecting to other pages
  const [modalSlug, setModalSlug] = useState<string | null>(null); // To track the quiz slug for the modal

  // Function to handle payment logic
  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      const type = "quizzes"; // assuming "quizzes" is the type

      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          type: type, // Pass the type as a parameter
        },
      });

      if (response.data.status === true) {
        router.push(`${slug}`);
      } else {
        setModalSlug(slug); // Set the slug to track which quiz the modal is shown for
        setShowModal(true); // Show modal when user does not have a subscription
        setTimeout(() => {
          router.push("/pricing");
        }, 3000); // Redirect after 3 seconds
      }
    } catch (error:any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error('User is not authenticated. Please log in.');
          router.push("/signin");
        } else if (status === 404 || status === 403) {
          setModalSlug(slug); // Set the slug to track the quiz for the modal
          setShowModal(true); // Show modal when subscription is missing or access is restricted
          setTimeout(() => {
            router.push("/pricing");
          }, 5000);
        } else {
          toast.error(`An error occurred: ${data.error || 'Unknown error'}`);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt) {
          setError("Authentication data is missing.");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-all`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            category: category_id,
          },
        });

        if (response.data && response.data.data) {
          setQuizzes(response.data.data);
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
      {/* Modal component */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Subscribe to Access</h2>
            <p className="mb-4">
              You don't have an active plan to see this content. Please subscribe.
            </p>
            <button
              className="bg-secondary text-white py-2 px-5 mx-auto rounded-full font-semibold hover:bg-secondary-dark flex items-center justify-center gap-2"
              onClick={() => router.push("/pricing")}
            >
              <span>Go to Pricing</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* Flexbox container to align heading and "See All" link */}
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <h2 className="text-lg font-bold mb-2 md:mb-0">All Quizzes</h2>
      </div>

      {/* Table container with horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-secondary text-white">
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
            {quizzes.map((quiz, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{quiz.title}</td>
                <td className="p-4">{quiz.duration_mode === "manual" ? quiz.duration : Math.floor(quiz.total_time / 60)} min</td>
                <td className="p-4">
                  <span className={`${quiz.is_free ? 'text-sm rounded-full font-semibold py-1 px-5 bg-green-500 text-white' : 'text-sm rounded-full font-semibold py-1 px-5 bg-secondary text-white'}`}>
                    {quiz.is_free ? 'Free' : 'Paid'}
                  </span>
                </td>
                <td className="p-4">{quiz.total_questions}</td>
                <td className="p-4">{quiz.pass_percentage}%</td>
                <td className="p-4">
                  {quiz.is_free ? (
                    <Link href={`/dashboard/quiz-detail/${quiz.slug}`} className="text-secondary font-semibold hover:underline">
                      View Details
                    </Link>
                  ) : (
                    <button
                      className="bg-secondary text-white py-1 px-5 rounded-full font-semibold hover:bg-secondary-dark text-sm"
                      onClick={() => handlePayment(`/dashboard/quiz-detail/${quiz.slug}`)}
                    >
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
