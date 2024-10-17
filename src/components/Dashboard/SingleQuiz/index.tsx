"use client"; // Ensure this component is client-side rendered

import { FaClock, FaQuestionCircle, FaStar, FaListAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa"; // Icons for the details
import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";
import Cookies from "js-cookie"; // Ensure js-cookie is installed
import axios from "axios"; // Make sure axios is installed
import NoData from '@/components/Common/NoData'; // Import NoData component
import Link from "next/link";
import { toast } from 'react-toastify'; // Optional: For notifications
import { useRouter } from "next/navigation"; // Use router to redirect

// Define the type for quiz details
interface QuizDetails {
  title: string;
  quizType: string;
  syllabus: string; // Adjusted to 'syllabus' for quiz
  totalQuestions: number;
  duration: string;
  marks: number; // Adjusted for quiz points instead of marks
  description: string;
  is_free: number;
}


interface SingleQuizProps {
  slug: string;
}

export default function SingleQuiz({ slug }: SingleQuizProps) {
  // State to hold quiz details, initially null
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State for loading
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

  useEffect(() => {
    const fetchExamDetails = async () => {
      const category = Cookies.get("category_id"); // Fetch category ID from cookies

      if (!category) {
        console.error("Category ID is missing");
        setLoading(false); // Stop loading if no category is found
        return;
      }

      setLoading(true); // Start loading state

      try {
        // Use axios to fetch exam details from the backend API
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-detail/${slug}`, {
          params: { category }, // Send slug and category as query params
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // JWT token from cookies
          },
        });

        const data = response.data;

        if (data.status) {
          setQuizDetails(data.data); // Set exam details if found
        } else {
          setQuizDetails(null); // Clear exam details if not found
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setQuizDetails(null); // Clear exam details on error
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchExamDetails();
  }, [slug]); // Fetch new exam details when slug changes

  // Loading state
  if (loading) {
    return <Loader />;
  }

  // No exam details found
  if (!quizDetails) {
    return <NoData />;
  }

  return (
    <div className="mx-auto p-5 shadow-sm bg-white rounded-lg">
      {/* Quiz Title and Type */}
      <div className="mb-8">
        <p className="bg-cyan-100 text-cyan-700 px-4 py-2 text-sm rounded-full inline-block mb-4">
          {quizDetails?.syllabus} {/* Adjusted to show quiz syllabus */}
        </p>
        <h1 className="text-3xl font-bold text-secondary mb-2">{quizDetails?.title}</h1>
        <h2 className="text-lg font-medium text-secondary-600">{quizDetails?.quizType}</h2>
      </div>

      {/* Syllabus and Details in a Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3 border-y border-gray-300 mb-8">
        {/* Quiz Details with Icons */}
        <div className="flex items-center space-x-2 text-gray-700">
          <FaQuestionCircle className="text-secondary" />
          <span className="text-base font-semibold">
            Questions: {quizDetails?.totalQuestions}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaClock className="text-secondary" />
          <span className="text-base font-semibold">
            Duration: {quizDetails?.duration} min
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaStar className="text-secondary" />
          <span className="text-base font-semibold">
            Points: {quizDetails?.marks} {/* Adjusted to points for quizzes */}
          </span>
        </div>
      </div>

      {/* Quiz Instructions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
          <FaCheckCircle className="text-secondary mr-2" /> Instructions
        </h3>
        <div className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300">
            <ol className="list-decimal list-inside">
              <li>Ensure you have a stable internet connection before starting the quiz.</li>
              <li>You <strong>cannot</strong> leave the quiz window once it begins.</li>
              <li>All questions are mandatory, and skipping is not allowed.</li>
              <li>No calculators are allowed; use mental math where possible.</li>
            </ol>
        </div>
      </div>

      {/* Quiz Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
          <FaInfoCircle className="text-secondary mr-2" /> Quiz Description
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: quizDetails?.description || "" }}
          className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300"
        />
      </div>

      {/* Start Quiz Button */}
      {quizDetails.is_free ? (
        <Link href={`/dashboard/quiz-play/${slug}`} className="w-full block text-center bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
          > Start Quiz </Link>
      ) : (
        <button className="mt-4 block text-center w-full bg-secondary text-white font-semibold py-2 px-4 rounded hover:bg-secondary-dark transition-colors" onClick={() => handlePayment(`/dashboard/quiz-play/${slug}`)}>
          Pay Now
        </button>
      )}
    </div>
  );
}
