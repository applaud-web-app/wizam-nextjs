import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";
import { FaClock, FaQuestionCircle, FaStar, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import Cookies from "js-cookie"; // Ensure js-cookie is installed
import axios from "axios"; // Make sure axios is installed
import NoData from '@/components/Common/NoData'; // Import NoData component
import Link from "next/link";
import { toast } from 'react-toastify'; // Optional: For notifications
import { useRouter } from "next/navigation"; // Use router to redirect

interface TestDetails {
  title: string;
  testType: string;
  syllabus: string;
  totalQuestions: number;
  duration: string;
  marks: number;
  description: string;
  is_free:number;
}

interface SinglePracticeSetProps {
  slug: string;
}

export default function SinglePracticeSet({ slug }: SinglePracticeSetProps) {
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // For redirecting to other pages

  // Function to handle payment logic
  const handlePayment = async (slug: string) =>  {
    try {
      // Get JWT token from cookies
      const jwt = Cookies.get("jwt");
      const type = "practice"; // assuming "practice" is the type

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
    const fetchTestDetails = async () => {
      const category = Cookies.get("category_id"); // Fetch category ID from cookies

      if (!category) {
        console.error("Category ID is missing");
        setLoading(false); // Stop loading if no category is found
        return;
      }

      setLoading(true); // Start loading state

      try {
        // Use axios to fetch test details from the backend API
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/practice-set-detail/${slug}`, {
          params: { category }, // Send slug and category as query params
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // JWT token from cookies
          },
        });

        const data = response.data;

        if (data.status) {
          setTestDetails(data.data); // Set test details if found
        } else {
          setTestDetails(null); // Clear test details if not found
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
        setTestDetails(null); // Clear test details on error
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchTestDetails();
  }, [slug]); // Fetch new test details when slug changes

  // Loading state
  if (loading) {
    return <Loader />;
  }

  // No test details found
  if (!testDetails) {
    return <NoData />;
  }

  return (
    <div className="mx-auto p-5 shadow-sm bg-white rounded-lg">
      {/* Display test details */}
      <div className="mb-8">
        <p className="bg-cyan-100 text-cyan-700 px-4 py-2 text-sm rounded-full inline-block mb-4">
          {testDetails.syllabus}
        </p>
        <h1 className="text-3xl font-bold text-defaultcolor mb-2">{testDetails.title}</h1>
        <h2 className="text-lg font-medium text-defaultcolor-600">{testDetails.testType}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3 border-y border-gray-300 mb-8">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaQuestionCircle className="text-defaultcolor" />
          <span className="text-base font-semibold">Questions: {testDetails.totalQuestions}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaClock className="text-defaultcolor" />
          <span className="text-base font-semibold">Duration: {testDetails.duration} min</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaStar className="text-defaultcolor" />
          <span className="text-base font-semibold">Marks: {testDetails.marks}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-defaultcolor mb-4 flex items-center">
          <FaCheckCircle className="text-defaultcolor mr-2" /> Instructions
        </h3>
        <div className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300">
          <ol className="list-decimal list-inside">
            <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the test. When the timer reaches zero, the test will end by itself.</li>
            <li>Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
            <li>Click on Save & Next to save your answer for the current question and then go to the next question.</li>
            <li>The Question Palette displayed on the right side of screen will show the status of each question.</li>
          </ol>
        </div>
      </div>

      {/* test Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-defaultcolor mb-4 flex items-center">
          <FaInfoCircle className="text-defaultcolor mr-2" /> Test Description
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: testDetails.description || "" }}
          className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300"
        />
      </div>

      {/* Start test Button */}
      {testDetails.is_free === 1 ? (
        <Link href={`/dashboard/practice-test-play/${slug}`} className="w-full bg-defaultcolor block text-center text-white font-semibold py-2 rounded-lg hover:bg-defaultcolor-dark transition-all duration-200">Start Test</Link>
      ) : (
        <button onClick={() => handlePayment(`/dashboard/practice-test-play/${slug}`)} className="bg-defaultcolor block text-center text-white px-4 py-2 rounded hover:bg-defaultcolor-dark transition duration-200 w-full">Paid Exam</button>
      )}
    </div>
  );
}
