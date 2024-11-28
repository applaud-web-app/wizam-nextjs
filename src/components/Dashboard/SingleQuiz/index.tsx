import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";
import { FaClock, FaQuestionCircle, FaStar, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import NoData from "@/components/Common/NoData";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

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
  const [isChecked, setIsChecked] = useState<boolean>(false); // For checkbox state
  const router = useRouter();
  
  const searchParams = useSearchParams(); 
  const sid = searchParams.get("sid");

  if (!sid || Number(sid) < 0) {
    router.push("/dashboard");
    return null;
  }

  const handlePayment = async (slug: string) => {
    // try {
    //   const jwt = Cookies.get("jwt");
    //   const type = "quizzes";

    //   if (!jwt) {
    //     toast.error("User is not authenticated. Please log in.");
    //     return;
    //   }

    //   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
    //     headers: { Authorization: `Bearer ${jwt}` },
    //     params: { type },
    //   });

    //   if (response.data.status === true) {
    //     router.push(`${slug}`);
    //   } else {
    //     toast.error("Please buy a subscription to access this course.");
    //     router.push("/pricing");
    //   }
    // } catch (error: any) {
    //   if (error.response) {
    //     const { status, data } = error.response;
    //     if (status === 401) {
    //       toast.error("User is not authenticated. Please log in.");
    //       router.push("/login");
    //     } else if (status === 404) {
    //       toast.error("Please buy a subscription to access this course.");
    //       router.push("/pricing");
    //     } else if (status === 403) {
    //       toast.error("Feature not available in your plan. Please upgrade your subscription.");
    //       router.push("/pricing");
    //     } else {
    //       toast.error(`An error occurred: ${data.error || "Unknown error"}`);
    //     }
    //   } else {
    //     toast.error("An error occurred. Please try again.");
    //   }
    // }
    toast.error("Please buy a subscription to access this quiz.");
    router.push("/pricing");
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
      } catch (error: any) {
        console.error("Error fetching practice set:", error);

        // Handle errors during the API request
        if (error.response) {
          const { status, data } = error.response;

          // Handle specific error statuses
          if (status === 401) {
            toast.error("User is not authenticated. Please log in.");
            router.push("/login"); // Redirect to sign-in page
          } else if (status === 404) {
            toast.error("Please buy a subscription to access this course.");
            Cookies.set("redirect_url", `/dashboard/quiz-detail/${slug}?sid=${sid}`, {
              expires: 1,
            });
            router.push("/pricing"); // Redirect to pricing page
          } else if (status === 403) {
            toast.error(
              "Feature not available in your plan. Please upgrade your subscription."
            );
            Cookies.set("redirect_url", `/dashboard/quiz-detail/${slug}?sid=${sid}`, {
              expires: 1,
            });
            router.push("/pricing"); // Redirect to pricing page
          } else {
            toast.error(`An error occurred: ${data.error || "Unknown error"}`);
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false); // Stop the loading state once the request is complete
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
    <div>
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
          <div className="border border-gray-300 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-indigo-500" size={24} />
              <span className="text-lg font-semibold text-gray-700">Questions</span>
            </div>
            <span className="bg-indigo-100 text-indigo-600 text-sm font-bold px-3 py-1 rounded-full">
              {quizDetails.totalQuestions}
            </span>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaClock className="text-green-500" size={24} />
              <span className="text-lg font-semibold text-gray-700">Duration</span>
            </div>
            <span className="bg-green-100 text-green-600 text-sm font-bold px-3 py-1 rounded-full">
              {quizDetails.duration}
            </span>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
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
        <div dangerouslySetInnerHTML={{ __html: quizDetails.description || "" }} />
      </div>
      <div className="bg-white p-3 rounded-lg">
      {/* Terms and Conditions Checkbox */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="terms"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="w-5 h-5 text-blue-600 bg-white border-gray-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="ml-2 text-gray-600">
          I have read all the instructions.
        </label>
      </div>


      {/* Start/Pay Button */}
      {quizDetails.is_free ? (
        <Link
          href={`/dashboard/quiz-play/${slug}?sid=${sid}`}
          className={`block w-full ${
            isChecked ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
          } text-white text-center font-semibold py-3 rounded-lg transition-colors`}
          onClick={(e) => {
            if (!isChecked) e.preventDefault();
          }}
        >
          Start Quiz
        </Link>
      ) : (
        <button
          className={`block w-full ${
            isChecked ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-300 cursor-not-allowed"
          } text-white text-center font-semibold py-3 rounded-lg transition-colors`}
          onClick={() => handlePayment(`/dashboard/quiz-play/${slug}?sid=${sid}`)}
          disabled={!isChecked}
        >
          Pay Now
        </button>
      )}
    </div>
    </div>
  );
}
