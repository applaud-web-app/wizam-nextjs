"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from 'react';
import { FaClock, FaQuestionCircle, FaStar, FaLock } from "react-icons/fa"; // Import FaLock for the paid exam icon
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
  const router = useRouter(); // For redirecting to other pages

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

  // Fetch the exams based on the slug from params
  useEffect(() => {
    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id"); // Get category from cookies

    // Fetch exams from API based on slug and category
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
  }, [params, router]);

  // Handle case where slug is not a string
  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

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
                <Link href={`/dashboard/exam-detail/${exam.slug}`} className="mt-4 block text-center w-full bg-defaultcolor text-white font-semibold py-2 px-4 rounded hover:bg-defaultcolor-dark transition-colors" >
                  Start Exam
                </Link>
              ) : (
                <button className="mt-4 w-full text-center text-white bg-yellow-500 font-semibold py-2 px-4 rounded flex items-center justify-center"
                onClick={() => handlePayment(`/dashboard/exam-detail/${exam.slug}`)}>
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
