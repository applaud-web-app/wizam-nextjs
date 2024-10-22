"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from 'react';
import { FaClock, FaQuestionCircle, FaStar, FaLock } from "react-icons/fa"; // Import FaLock for the paid exam icon
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi'; // Icons for the modal
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Loader from '@/components/Common/Loader';
import { useRouter } from "next/navigation";
import Link from 'next/link';

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
  const [showModal, setShowModal] = useState<boolean>(false); // Modal state
  const router = useRouter(); // For redirecting to other pages

  // Check if slug already exists to prevent unnecessary re-fetching
  useEffect(() => {
    if (!params.slug) return; // If params.slug is missing, don't run the fetch logic
    setSlug(params.slug);
  }, [params.slug]); // Only trigger when params.slug changes

  // Fetch the exams based on the slug from params
  useEffect(() => {
    if (!slug) return; // Prevent fetching if slug is not set
    const category = Cookies.get("category_id"); // Get category from cookies

    const fetchExams = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-exams`, {
          params: { slug, category }, // Send slug and category as query params
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // JWT token from cookies
          },
        });

        if (response.data.status) {
          const fetchedExams = response.data.data[slug] || [];
          setExams(fetchedExams);
        } else {
          toast.error('No exams found for this category');
          router.push('/dashboard/all-exams');
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        toast.error('An error occurred while fetching exams');
        router.push('/dashboard/all-exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [slug, router]); // Only trigger the fetch when slug or router changes

  // Handle case where slug is not a string
  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

  // Function to handle the "Paid Exam" button click
  const handlePaidExamClick = () => {
    setShowModal(true); // Show the modal when clicking on paid exams
  };

  // UseEffect to automatically redirect after 3 seconds when modal is shown
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        router.push("/pricing");
      }, 3000); // Redirect to pricing page after 3 seconds

      return () => clearTimeout(timer); // Cleanup timeout on component unmount
    }
  }, [showModal, router]);

  // If loading, show loader
  if (loading) {
    return <Loader />; // Show loading state
  }

  // If no exams are found for the current slug
  if (!slug || exams.length === 0) {
    return (
      <div className="p-5 bg-white shadow-sm rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-500 mb-2">No Exams found</h2>
        <p className="text-gray-700">
          Sorry, we couldn't find any exam for this syllabus. Try exploring other exams or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="text-3xl font-bold mb-6 text-black capitalize">
        {formattedSlug}
      </h1>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
        {exams.map((exam, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-5 rounded-lg transition duration-300"
          >
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
              {exam.title}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaQuestionCircle className="text-defaultcolor" />
                <span className="text-sm md:text-base">
                  <strong>Questions:</strong> {exam.questions}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaClock className="text-defaultcolor" />
                <span className="text-sm md:text-base">
                  <strong>Time:</strong> {exam.time}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaStar className="text-defaultcolor" />
                <span className="text-sm md:text-base">
                  <strong>Marks:</strong> {exam.marks}
                </span>
              </div>
              <div className="text-sm md:text-base text-gray-700 capitalize">
                <strong>Exam Type:</strong> {formattedSlug}
              </div>
            </div>
            <div>
              {exam.is_free === 1 ? (
                <Link
                  href={`/dashboard/exam-detail/${exam.slug}`}
                  className="mt-4 block text-center w-full bg-defaultcolor text-white font-semibold py-2 px-4 rounded hover:bg-defaultcolor-dark transition-colors"
                >
                  Start Exam
                </Link>
              ) : (
                <button
                  className="mt-4 w-full text-center text-white bg-yellow-500 font-semibold py-2 px-4 rounded flex items-center justify-center"
                  onClick={handlePaidExamClick} // Handle click for paid exams
                >
                  <FaLock className="mr-2" /> Paid Exam
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Subscription */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[1001]">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <FiAlertCircle className="text-4xl text-red-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold mb-4">Subscribe to Access</h2>
            <p className="mb-4">
              You don't have an active plan to access this exam. Redirecting to pricing...
            </p>
            <button
              className="bg-defaultcolor text-white py-2 px-5 rounded-full mx-auto hover:bg-defaultcolor-dark flex items-center justify-center gap-2"
              onClick={() => router.push("/pricing")} // Redirect to pricing page
            >
              <span>Go to Pricing</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
