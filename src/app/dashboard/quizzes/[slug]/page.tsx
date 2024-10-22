"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from 'react';
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa"; // Icons for the card
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi'; // For the modal icons
import axios from 'axios';
import Cookies from 'js-cookie';
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
  const [showModal, setShowModal] = useState<boolean>(false); // Modal state
  const [modalRedirecting, setModalRedirecting] = useState<boolean>(false); // Redirect state for the modal
  const [quizSlug, setQuizSlug] = useState<string | null>(null); // Store the quiz slug for payment handling
  const [hasSubscription, setHasSubscription] = useState<boolean>(false); // Track user subscription status
  const router = useRouter(); // For redirecting to other pages

  // Fetch the quiz based on the slug from params
  useEffect(() => {
    const { slug } = params;
    setSlug(slug);
    const category = Cookies.get("category_id"); // Get category from cookies

    // Fetch quiz from API based on slug and category
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-quiz`, {
          params: { slug, category }, // Send slug and category as query params
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // JWT token from cookies
          },
        });

        if (response.data.status) {
          const fetchedQuiz = response.data.data[slug] || [];
          setQuizzes(fetchedQuiz);
        } else {
          toast.error('No quiz found for this category');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        toast.error('An error occurred while fetching quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params, router]);

  // Check subscription status after the page loads
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // JWT token from cookies
          },
          params: {
            type: "quizzes",
          },
        });

        if (response.data.status === true) {
          setHasSubscription(true); // The user has a valid subscription
        } else {
          setHasSubscription(false); // The user doesn't have a subscription
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false); // Assume no subscription in case of error
      }
    };

    checkSubscription(); // Call the function to check subscription status
  }, []);

  // Handle case where slug is not a string
  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

  // Function to handle payment logic and show modal
  const handlePayment = async (quizSlug: string) => {
    if (hasSubscription) {
      // If the user already has a subscription, redirect them to the quiz directly
      router.push(`/dashboard/quiz-detail/${quizSlug}`);
    } else {
      setQuizSlug(quizSlug); // Store the slug for payment
      setShowModal(true); // Show modal when user clicks "Pay Now"
    }
  };

  // If the user clicks to proceed or 3 seconds pass, redirect them to pricing page
  useEffect(() => {
    if (showModal && modalRedirecting) {
      const timer = setTimeout(() => {
        router.push("/pricing"); // Redirect to pricing page
      }, 3000); // 3-second timer

      return () => clearTimeout(timer); // Cleanup timeout on component unmount
    }
  }, [showModal, modalRedirecting, router]);

  // Function to handle "Go to Pricing" button click
  const redirectToPricing = () => {
    setModalRedirecting(true); // Trigger redirect after 3 seconds
  };

  // If loading, show loader
  if (loading) {
    return <Loader />; // Show loading state
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
      <h1 className="text-3xl font-bold mb-6 text-black capitalize">
        {formattedSlug}
      </h1>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-5 rounded-lg  transition duration-300"
          >
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
              {quiz.title}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaQuestionCircle className="text-secondary" />
                <span className="text-sm md:text-base">
                  <strong>Questions:</strong> {quiz.questions}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaClock className="text-secondary" />
                <span className="text-sm md:text-base">
                  <strong>Time:</strong> {quiz.time}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaStar className="text-secondary" />
                <span className="text-sm md:text-base">
                  <strong>Marks:</strong> {quiz.marks}
                </span>
              </div>
              <div className="text-sm md:text-base text-gray-700 capitalize">
                <strong>Quiz Type:</strong> {formattedSlug}
              </div>
            </div>
            {quiz.is_free ? (
              <Link href={`/dashboard/quiz-detail/${quiz?.slug}`} className="mt-4 block text-center w-full bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition-colors">
                Start Quiz
              </Link>
            ) : (
              <button className="mt-4 block text-center w-full bg-secondary text-white font-semibold py-2 px-4 rounded hover:bg-secondary-dark transition-colors" onClick={() => handlePayment(quiz.slug)}>
                Pay Now
              </button>
            )}
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
              You don't have an active plan to access this quiz. Redirecting to pricing...
            </p>
            <button
              className="bg-defaultcolor text-white py-2 px-5 rounded-full mx-auto hover:bg-defaultcolor-dark flex items-center justify-center gap-2"
              onClick={redirectToPricing} // Trigger immediate redirection to pricing
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
