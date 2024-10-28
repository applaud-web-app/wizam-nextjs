"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from "react";
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Loader from "@/components/Common/Loader";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Exam {
  title: string;
  questions: number;
  time: string;
  marks: number;
  slug: string;
  is_free: number; // 1 for free, 0 for paid
}

export default function ExamTypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      const type = "exams";

      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user-subscription`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: { type },
        }
      );

      if (response.data.status === true) {
        router.push(`${slug}`);
      } else {
        toast.error("Please buy a subscription to access this course.");
        router.push("/pricing");
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error("User is not authenticated. Please log in.");
          router.push("/signin");
        } else if (status === 404) {
          toast.error("Please buy a subscription to access this course.");
          router.push("/pricing");
        } else if (status === 403) {
          toast.error(
            "Feature not available in your plan. Please upgrade your subscription."
          );
          router.push("/pricing");
        } else {
          toast.error(`An error occurred: ${data.error || "Unknown error"}`);
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id");

    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/all-exams`,
          {
            params: { slug, category },
            headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
          }
        );

        if (response.data.status) {
          const fetchedExams = response.data.data[slug] || [];
          setExams(fetchedExams);
        } else {
          toast.error("No exams found for this category");
          router.push("/dashboard/all-exams");
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("An error occurred while fetching exams");
        router.push("/dashboard/all-exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [params, router]);

  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

  if (loading) {
    return <Loader />;
  }

  if (!slug || exams.length === 0) {
    return (
      <div className="p-5 bg-white shadow-sm rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-500 mb-2">
          No Exams found
        </h2>
        <p className="text-gray-700">
          Sorry, we couldn't find any exam for this syllabus. Try exploring
          other exams or check back later.
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
          className="text-gray-500 hover:text-defaultcolor flex items-center"
        >
          <FaArrowLeftLong className="text-gray-900" size={24} />
        </button>
        <h1 className="text-xl md:text-3xl font-semibold ml-4 capitalize text-black">
          {formattedSlug}
        </h1>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-4 text-left font-semibold">S.No</th>
              <th className="p-4 text-left font-semibold">Title</th>
              <th className="p-4 text-left font-semibold">Questions</th>
              <th className="p-4 text-left font-semibold">Time</th>
              <th className="p-4 text-left font-semibold">Marks</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-bold">{exam.title}</td>
                <td className="p-4">{exam.questions}</td>
                <td className="p-4">{exam.time}</td>
                <td className="p-4">{exam.marks}</td>
                <td className="p-4">
                  {exam.is_free === 1 ? (
                    <Link
                      href={`/dashboard/exam-detail/${exam.slug}`}
                      className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition-all duration-200"
                    >
                      Start Exam
                    </Link>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white py-1 px-4 rounded-full hover:bg-yellow-600 transition-all duration-200"
                      onClick={() =>
                        handlePayment(`/dashboard/exam-detail/${exam.slug}`)
                      }
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
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {exams.map((exam, index) => (
          <div
            key={index}
            className="p-5 bg-white shadow-sm rounded-xl flex flex-col justify-between transform transition-transform hover:scale-105 duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {exam.title}
              </h3>
              {exam.is_free === 1 && (
                <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Free
                </span>
              )}
            </div>

            <div className="text-gray-600 flex flex-col mb-4">
              <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-3 mb-3">
                <div className="flex items-center">
                  <FaQuestionCircle className="text-gray-400 mr-2" />
                  <span className="font-medium">Questions:</span>
                </div>
                <span className="text-gray-700">{exam.questions}</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-3 mb-3">
                <div className="flex items-center">
                  <FaClock className="text-gray-400 mr-2" />
                  <span className="font-medium">Time:</span>
                </div>
                <span className="text-gray-700">{exam.time} mins</span>
              </div>
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center">
                  <FaStar className="text-gray-400 mr-2" />
                  <span className="font-medium">Marks:</span>
                </div>
                <span className="text-gray-700">{exam.marks}</span>
              </div>
            </div>

            {exam.is_free === 1 ? (
              <Link
                href={`/dashboard/exam-detail/${exam.slug}`}
                className=" bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-center transition-all duration-200"
              >
                Start Exam
              </Link>
            ) : (
              <button
                onClick={() => handlePayment(`/dashboard/exam-detail/${exam.slug}`)}
                className=" bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
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
