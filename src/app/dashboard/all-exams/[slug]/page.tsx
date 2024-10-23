"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from "react";
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa"; // Import FaArrowLeft for the back button
import { FaArrowLeftLong } from "react-icons/fa6";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Loader from "@/components/Common/Loader";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Update the Exam interface to include the is_free property
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
  const router = useRouter(); // For redirecting to other pages

  // Function to handle payment logic
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
        <h1 className="text-3xl font-semibold ml-4 capitalize text-black">
          {formattedSlug}
        </h1>
      </div>

      {/* Table to list exams */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-3 text-left">S.No</th>{" "}
              {/* Add S.No column header */}
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Questions</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Marks</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td> {/* Add Serial Number */}
                <td className="p-4">
                  <b>{exam.title}</b>
                </td>
                <td className="p-4">
                  <div className="text-gray-700">
                    <span>{exam.questions}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-700">
                    <span>{exam.time}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-700">
                    <span>{exam.marks}</span>
                  </div>
                </td>
                <td className="p-4">
                  {exam.is_free === 1 ? (
                    <Link
                      href={`/dashboard/exam-detail/${exam.slug}`}
                      className="bg-green-600 text-white px-4 py-1 rounded-full"
                    >
                      Start Exam
                    </Link>
                  ) : (
                    <button
                      className="bg-yellow-500 text-white py-1 px-4 rounded-full flex items-center justify-center"
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
    </div>
  );
}
