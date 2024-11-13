import { useState, useEffect } from "react";
import Loader from "@/Components/Common/Loader";
import {
  FaClock,
  FaQuestionCircle,
  FaStar,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import NoData from "@/Components/Common/NoData";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface TestDetails {
  title: string;
  testType: string;
  syllabus: string;
  totalQuestions: number;
  duration: string;
  marks: number;
  description: string;
  is_free: number;
  is_resume: number;
}

interface SinglePracticeSetProps {
  slug: string;
}

export default function SinglePracticeSet({ slug }: SinglePracticeSetProps) {
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false); // For checkbox state
  const router = useRouter();

  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      const type = "practice";

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
        router.push(slug);
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
    const fetchTestDetails = async () => {
      const category = Cookies.get("category_id");

      if (!category) {
        console.error("Category ID is missing");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/practice-set-detail/${slug}`,
          {
            params: { category },
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );

        const data = response.data;

        if (data.status) {
          setTestDetails(data.data);
        } else {
          setTestDetails(null);
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
        setTestDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (!testDetails) {
    return <NoData />;
  }

  return (
    <div>
      {/* Practice Test Header */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <div className="mb-5 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            {testDetails.title}
          </h1>
          <p className="text-lg font-medium text-gray-600">
            {testDetails.testType}
          </p>
          <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-1 rounded-full mt-2">
            {testDetails.syllabus}
          </span>
        </div>

        {/* Card with Test Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="border border-gray-300 bg-gray-50 p-5 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaQuestionCircle className="text-indigo-500" size={24} />
              <span className="text-lg font-semibold text-gray-700">
                Questions
              </span>
            </div>
            <span className="bg-indigo-100 text-indigo-600 text-sm font-bold px-3 py-1 rounded-full">
              {testDetails.totalQuestions}
            </span>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-5 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaClock className="text-green-500" size={24} />
              <span className="text-lg font-semibold text-gray-700">
                Duration
              </span>
            </div>
            <span className="bg-green-100 text-green-600 text-sm font-bold px-3 py-1 rounded-full">
              {testDetails.duration}
            </span>
          </div>

          <div className="border border-gray-300 bg-gray-50 p-5 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaStar className="text-yellow-500" size={24} />
              <span className="text-lg font-semibold text-gray-700">Marks</span>
            </div>
            <span className="bg-yellow-100 text-yellow-600 text-sm font-bold px-3 py-1 rounded-full">
              {testDetails.marks}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h3 className="text-2xl font-semibold text-defaultcolor mb-4 flex items-center">
          <FaCheckCircle className="text-defaultcolor mr-2" /> Instructions
        </h3>
        <div className="text-gray-600">
          <ul className="list-disc ml-6 space-y-2">
            <li>
              The clock is server-set. The countdown will display remaining
              time.
            </li>
            <li>Use the question palette to navigate between questions.</li>
            <li>
              Click "Save & Next" to save the current question and move to the
              next.
            </li>
            <li>The question palette indicates the status of each question.</li>
          </ul>
        </div>
      </div>

      {/* Test Description */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-5">
        <h3 className="text-2xl font-semibold text-defaultcolor mb-4 flex items-center">
          <FaInfoCircle className="text-defaultcolor mr-2" /> Test Description
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: testDetails.description || "" }}
          className="text-gray-600"
        />
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="terms"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="ml-2 text-gray-600">
          I have read all the instructions.
        </label>
      </div>

     
      {/* Start/Resume/Pay Button */}
      {testDetails.is_free === 1 ? (
        testDetails.is_resume === 1 ? (
          <Link
            href={`/dashboard/practice-test-play/${slug}`}
            className={`block w-full ${
              isChecked
                ? "bg-[#C9BC0F] hover:bg-[#928c38]"
                : "bg-gray-300 cursor-not-allowed"
            } text-white text-center font-semibold py-3 rounded-lg transition-colors`}
            onClick={(e) => {
              if (!isChecked) e.preventDefault();
            }}
          >
            Resume Test
          </Link>
        ) : (
          <Link
            href={`/dashboard/practice-test-play/${slug}`}
            className={`block w-full ${
              isChecked
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white text-center font-semibold py-3 rounded-lg transition-colors`}
            onClick={(e) => {
              if (!isChecked) e.preventDefault();
            }}
          >
            Start Test
          </Link>
        )
      ) : (
        <button
          className={`block w-full ${
            isChecked
              ? "bg-defaultcolor hover:bg-defaultcolor-dark"
              : "bg-gray-300 cursor-not-allowed"
          } text-white text-center font-semibold py-3 rounded-lg transition-colors`}
          disabled={!isChecked}
          onClick={() => handlePayment(`/dashboard/practice-test-play/${slug}`)}
        >
          Pay Now
        </button>
      )}
    </div>
  );
}
