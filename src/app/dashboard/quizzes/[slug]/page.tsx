"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from 'react';
import { FaArrowLeftLong, } from "react-icons/fa6"; // Back arrow icon
import { FaQuestionCircle, FaClock, FaStar } from 'react-icons/fa';

import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '@/components/Common/Loader';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Quiz {
  title: string;
  slug: string;
  questions: number;
  time: string;
  marks: string; // Adjusted to match the response
  is_free: number; // 1 for free, 0 for paid
}

export default function QuizTypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const category = Cookies.get("category_id");

  const handlePayment = async (quizSlug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        router.push("/signin");
        return;
      }

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { type: "quizzes" },
      });

      if (data.status) {
        router.push(quizSlug);
      } else {
        toast.error('Please buy a subscription to access this course.');
        router.push("/pricing");
      }
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const jwt = Cookies.get("jwt");
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-quiz`, {
          params: { slug: params.slug, category },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (data.status) {
          setQuizzes(data.data || []);
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
  }, [params.slug, router, category]);

  const formattedSlug = params.slug.replace(/-/g, " ");

  const handleAxiosError = (error: any) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        toast.error('User is not authenticated. Please log in.');
        router.push("/signin");
      } else if (status === 404 || status === 403) {
        toast.error('Please buy a subscription to access this course.');
        router.push("/pricing");
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (quizzes.length === 0) {
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
      <div className="flex items-center mb-5">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-quaternary flex items-center"
        >
          <FaArrowLeftLong className="text-gray-900" size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-semibold ml-4 capitalize text-black">
          {formattedSlug}
        </h1>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm">
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
              <tr key={quiz.slug} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4"><b>{quiz.title}</b></td>
                <td className="p-4">{quiz.questions}</td>
                <td className="p-4">{quiz.time}</td>
                <td className="p-4">{quiz.marks}</td>
                <td className="p-4">
                  {quiz.is_free === 1 ? (
                    <Link href={`/dashboard/quiz-detail/${quiz.slug}`} className="bg-green-600 text-white px-4 py-1 rounded-full">
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


          {/* Mobile Grid Cards */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {quizzes.map((quiz, index) => (
              <div
                key={quiz.slug}
                className="p-5 bg-white shadow-md rounded-xl flex flex-col justify-between transform transition-transform hover:scale-105 duration-200"
              >
                {/* Header with Free Badge and Title */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                  {quiz.is_free === 1 && (
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>

                {/* Quiz Details with Labels */}
                <div className="text-gray-600 flex flex-col mb-4">
                  <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-3 mb-3">
                    <div className="flex items-center">
                      <FaQuestionCircle className="text-gray-400 mr-2" />
                      <span className="font-medium">Questions:</span>
                    </div>
                    <span className="text-gray-700">{quiz.questions}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-3 mb-3">
                    <div className="flex items-center">
                      <FaClock className="text-gray-400 mr-2" />
                      <span className="font-medium">Time:</span>
                    </div>
                    <span className="text-gray-700">{quiz.time} mins</span>
                  </div>
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center">
                      <FaStar className="text-gray-400 mr-2" />
                      <span className="font-medium">Marks:</span>
                    </div>
                    <span className="text-gray-700">{quiz.marks}</span>
                  </div>
                </div>

                {/* Action Button */}
                {quiz.is_free === 1 ? (
                  <Link
                    href={`/dashboard/quiz-detail/${quiz.slug}`}
                    className=" bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-center"
                  >
                    Start Quiz
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePayment(`/dashboard/quiz-detail/${quiz.slug}`)}
                    className=" bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            ))}
          </div>

    </div>
  );
}
