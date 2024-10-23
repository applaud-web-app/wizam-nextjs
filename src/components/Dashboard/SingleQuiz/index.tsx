import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";
import { FaClock, FaQuestionCircle, FaStar, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import Cookies from "js-cookie"; // Ensure js-cookie is installed
import axios from "axios"; // Make sure axios is installed
import NoData from "@/components/Common/NoData"; // Import NoData component
import Link from "next/link";
import { toast } from "react-toastify"; // Optional: For notifications
import { useRouter } from "next/navigation"; // Use router to redirect

interface QuizDetails {
  title: string;
  quizType: string;
  syllabus: string;
  totalQuestions: number;
  duration: string;
  marks: number;
  description: string;
  is_free: number;
}

interface SingleQuizProps {
  slug: string;
}

export default function SingleQuiz({ slug }: SingleQuizProps) {
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // For redirecting to other pages

  // Function to handle payment logic
  const handlePayment = async (slug: string) => {
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
          toast.error("Feature not available in your plan. Please upgrade your subscription.");
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
    const fetchQuizDetails = async () => {
      const category = Cookies.get("category_id");

      if (!category) {
        console.error("Category ID is missing");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-detail/${slug}`, {
          params: { category },
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        });

        const data = response.data;

        if (data.status) {
          setQuizDetails(data.data);
        } else {
          setQuizDetails(null);
        }
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        setQuizDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (!quizDetails) {
    return <NoData />;
  }

  return (
    <div >

    <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
      <div className="mb-5 text-center">
        <h1 className="text-4xl font-bold text-gray-900">{quizDetails.title}</h1>
        <p className="text-lg font-medium text-gray-600">{quizDetails.quizType}</p>
        <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-1 rounded-full mt-2">
          {quizDetails.syllabus}
        </span>
      </div>

      {/* Card with Quiz Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div className="border border-gray-300 bg-gray-50  p-5 rounded-lg  flex items-center justify-between">
      <div className="flex items-center space-x-3">
            <FaQuestionCircle className="text-indigo-500" size={24} />
            <span className="text-lg font-semibold text-gray-700">Questions</span>
          </div>
          <span className="bg-indigo-100 text-indigo-600 text-sm font-bold px-3 py-1 rounded-full">
            {quizDetails.totalQuestions}
          </span>
        </div>

        <div className="border border-gray-300 bg-gray-50  p-5 rounded-lg  flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <FaClock className="text-green-500" size={24} />
            <span className="text-lg font-semibold text-gray-700">Duration</span>
          </div>
          <span className="bg-green-100 text-green-600 text-sm font-bold px-3 py-1 rounded-full">
            {quizDetails.duration}
          </span>
        </div>

        <div className="border border-gray-300 bg-gray-50  p-5 rounded-lg  flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <FaStar className="text-yellow-500" size={24} />
            <span className="text-lg font-semibold text-gray-700">Marks</span>
          </div>
          <span className="bg-yellow-100 text-yellow-600 text-sm font-bold px-3 py-1 rounded-full">
            {quizDetails.marks}
          </span>
        </div>
      </div>
      </div>
      {/* Header Section */}
     

      {/* Instructions Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h3 className="text-2xl font-semibold text-quaternary mb-4 flex items-center">
          <FaCheckCircle className="text-quaternary mr-2" /> Instructions
        </h3>
        <div className="text-gray-600">
          <ul className="list-disc ml-6 space-y-2">
            <li>The quiz window cannot be exited once started.</li>
            <li>Ensure a stable internet connection before starting.</li>
            <li>All questions are mandatory, and skipping is not allowed.</li>
            <li>Use mental math where applicable; no calculators are allowed.</li>
          </ul>
        </div>
      </div>

      {/* Quiz Description */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h3 className="text-2xl font-semibold text-quaternary mb-4 flex items-center">
          <FaInfoCircle className="text-quaternary mr-2" /> Quiz Description
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: quizDetails.description || "" }}
          
        />
      </div>

      {/* Start/Pay Button */}
      {quizDetails.is_free ? (
        <Link
          href={`/dashboard/quiz-play/${slug}`}
          className="block w-full bg-green-500 text-white text-center font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Start Quiz
        </Link>
      ) : (
        <button
          className="block w-full bg-yellow-500 text-white text-center font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          onClick={() => handlePayment(`/dashboard/quiz-play/${slug}`)}
        >
          Pay Now
        </button>
      )}
    </div>
  );
}
