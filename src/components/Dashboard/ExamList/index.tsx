"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FiArrowRight, FiAlertCircle } from "react-icons/fi"; // Importing icons
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use from next/navigation
import { toast } from "react-toastify";

// Define the TypeScript interface for the exam object
interface Exam {
  title: string | null;
  duration_mode: string | null;
  exam_duration: number;
  is_free: number;
  price: number;
  total_questions: number;
  total_marks: number;
  total_time: number;
  point: number;
  slug: string | null;
  point_mode: string | null;
}

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // Modal state
  const router = useRouter(); // Use router from next/navigation

  // Fetch exams when the component is mounted
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication or category data is missing.");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exam-all`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            params: {
              category: category_id,
            },
          }
        );

        if (response.data && response.data.data) {
          setExams(response.data.data); // Set the exams data in state
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch exams from the server.");
      }
    };

    fetchExams();
  }, []);
    
  // Function to handle payment logic
  const handlePayment = async (slug: string) =>  {
    try {
      // Get JWT token from cookies
      const jwt = Cookies.get("jwt");
      const type = "exams"; // assuming "quizzes" is the type

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
        // toast.success(`Subscription is active. Access granted for ${slug}.`);
        router.push(`${slug}`);
      } else {
        toast.error('Please buy a subscription to access this course.');
        router.push("/pricing");
      }
    } catch (error:any) {
      console.log(error);
      // Handle errors such as network issues or API errors
      if (error.response) {
        // API responded with an error status
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className=" mb-5">
      {/* Modal component */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <FiAlertCircle className="text-4xl text-red-500 mb-4 mx-auto"  /> {/* Icon added here */}
            <h2 className="text-2xl font-semibold mb-4">Subscribe to Access</h2>
            <p className="mb-4">
              You don't have an active plan to see this content. Please subscribe.
            </p>
            <button
              className="bg-defaultcolor text-white py-2 px-5 rounded-full mx-auto hover:bg-defaultcolor-dark flex items-center justify-center gap-2"
              onClick={() => router.push("/pricing")} // Using router.push for immediate navigation
            >
              <span>Go to Pricing</span>

              <FiArrowRight /> {/* Arrow icon added to the button */}
            </button>
          </div>
        </div>
      )}

      {/* Flexbox container to align heading and "See All" link */}
      <div className="flex justify-between items-center  flex-wrap">
        <h2 className="text-lg lg:text-2xl font-bold mb-3">All Exams</h2>
      </div>

      {/* Table container with horizontal scrolling on small screens */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
      <table className="min-w-full table-auto rounded-lg overflow-hidden">
          <thead className="bg-defaultcolor text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left">Duration Mode</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
              <th className="p-3 text-left">Total Time</th>
              <th className="p-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.title || "-"}</td>{" "}
                {/* Handle missing titles */}
                <td className="p-4">{exam.duration_mode || "-"}</td>{" "}
                {/* Handle missing duration mode */}
                <td className="p-4">
                  <span
                    className={`${
                      exam.is_free
                        ? "text-sm rounded-full font-semibold py-1 px-5 bg-green-500 text-white"
                        : "text-sm rounded-full font-semibold py-1 px-5 bg-secondary text-white"
                    }`}
                  >
                    {exam.is_free ? "Free" : "Paid"}
                  </span>
                </td>
                <td className="p-4">
                  {exam.total_questions !== null
                    ? exam.total_questions
                    : "-"}
                </td>
                <td className="p-4">
                  {exam.point_mode == "manual"
                    ? exam.point * exam.total_questions
                    : exam.total_marks}
                </td>{" "}
                {/* Handle missing marks */}
                <td className="p-4">
                  {exam.duration_mode == "manual"
                    ? exam.exam_duration
                    : Math.floor(exam.total_time / 60)}{" "}
                  min
                </td>
                <td className="p-4">
                  {exam.is_free === 1 ? (
                    <Link
                      href={`/dashboard/exam-detail/${exam.slug}`}
                      className="text-defaultcolor font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button
                      className="bg-defaultcolor text-white py-1 px-5 rounded-full font-semibold hover:bg-defaultcolor-dark text-sm"
                     onClick={() => handlePayment(`/dashboard/exam-detail/${exam.slug}`)}
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
