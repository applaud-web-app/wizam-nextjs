import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";
import { FaClock, FaQuestionCircle, FaStar, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import Cookies from "js-cookie"; // Ensure js-cookie is installed
import axios from "axios"; // Make sure axios is installed
import NoData from '@/components/Common/NoData'; // Import NoData component


interface ExamDetails {
  title: string;
  examType: string;
  syllabus: string;
  totalQuestions: number;
  duration: string;
  marks: number;
  description: string;
}

interface SingleExamProps {
  slug: string;
}

export default function SingleExam({ slug }: SingleExamProps) {
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exam-detail/${slug}`, {
          params: { category }, // Send slug and category as query params
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // JWT token from cookies
          },
        });

        const data = response.data;

        if (data.status) {
          setExamDetails(data.data); // Set exam details if found
        } else {
          setExamDetails(null); // Clear exam details if not found
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setExamDetails(null); // Clear exam details on error
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
  if (!examDetails) {
    return <NoData />;
  }

  return (
    <div className="mx-auto p-5 shadow-sm bg-white rounded-lg">
      {/* Display exam details */}
      <div className="mb-8">
        <p className="bg-cyan-100 text-cyan-700 px-4 py-2 text-sm rounded-full inline-block mb-4">
          {examDetails.syllabus}
        </p>
        <h1 className="text-3xl font-bold text-primary mb-2">{examDetails.title}</h1>
        <h2 className="text-lg font-medium text-primary-600">{examDetails.examType}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3 border-y border-gray-300 mb-8">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaQuestionCircle className="text-primary" />
          <span className="text-base font-semibold">Questions: {examDetails.totalQuestions}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaClock className="text-primary" />
          <span className="text-base font-semibold">Duration: {examDetails.duration}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaStar className="text-primary" />
          <span className="text-base font-semibold">Marks: {examDetails.marks}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
          <FaCheckCircle className="text-primary mr-2" /> Instructions
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

      {/* Exam Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
          <FaInfoCircle className="text-primary mr-2" /> Exam Description
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: examDetails.description || "" }}
          className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300"
        />
      </div>

      {/* Start Exam Button */}
      <button
        onClick={() => alert(`Starting exam: ${examDetails.title}`)} 
        className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition-all duration-200"
      >
        Start Exam
      </button>
    </div>
  );
}
