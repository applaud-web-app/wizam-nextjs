"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from 'react';
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa"; // Icons for the table
import { FaArrowLeftLong } from "react-icons/fa6"; // Back arrow icon
import axios from 'axios'; // Ensure axios is installed
import Cookies from 'js-cookie'; // Access cookies
import Loader from '@/components/Common/Loader';
import { useRouter } from "next/navigation"; // Use router to redirect
import { toast } from 'react-toastify'; // Optional: For notifications
import Link from 'next/link';

// Define the Quiz type
interface Quiz {
  title: string;
  slug: string;
  questions: number;
  time: string;
  marks: number;
  is_free: number;
}

export default function QuizTypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // For redirecting to other pages

  // Function to handle payment logic
  const handlePayment = async (quizSlug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      const type = "quizzes";

      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: { type },
      });

      if (response.data.status === true) {
        router.push(`${quizSlug}`);
      } else {
        toast.error('Please buy a subscription to access this course.');
        router.push("/pricing");
      }
    } catch (error: any) {
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

  // Fetch the quiz based on the slug from params
  useEffect(() => {
    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");

    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-quiz`, {
          params: { slug, category },
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        if (response.data.status) {
          const fetchedQuiz = response.data.data[slug] || [];
          setQuizzes(fetchedQuiz);
        } else {
          toast.error('No quiz found for this category');
          router.push('/dashboard/quizzes');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('An error occurred while fetching quizzes');
        router.push('/dashboard/quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params, router]);

  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  // If no quizzes are found for the current slug
  if (!slug || quizzes.length === 0) {
    return (
      <div className="p-5 bg-white shadow-sm rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-500 mb-2">No quizzes found</h2>
        <p className="text-gray-700">
          Sorry, we couldn't find any quizzes for this category. Try exploring other quiz topics or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Back arrow button and title */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-quaternary flex items-center"
        >
          <FaArrowLeftLong className="text-gray-900" size={24} />
        </button>
        <h1 className="text-3xl font-semibold ml-4 capitalize text-black">
          {formattedSlug}
        </h1>
      </div>

      {/* Table to list quizzes */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-quaternary text-white">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Questions</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Marks</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quizzes.map((quiz, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td> {/* Serial Number */}
                <td className="p-4">
                  <b>{quiz.title}</b>
                </td>
                <td className="p-4">
                  <div className="text-gray-700">
                    <span>{quiz.questions}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-700">
                    <span>{quiz.time}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-700">
                    <span>{quiz.marks}</span>
                  </div>
                </td>
                <td className="p-4">
                  {quiz.is_free === 1 ? (
                    <Link
                      href={`/dashboard/quiz-detail/${quiz.slug}`}
                      className="bg-green-600 text-white px-4 py-1 rounded-full"
                    >
                      Start Quiz
                    </Link>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white py-1 px-4 rounded-full flex items-center justify-center"
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
