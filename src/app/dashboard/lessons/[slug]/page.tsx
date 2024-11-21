"use client"; // Indicate this is a client component

import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for server requests
import { useRouter } from 'next/navigation'; // To handle redirection after countdown
import { FaClock, FaBook, FaTag, FaDollarSign, FaCheckCircle } from 'react-icons/fa'; // Icons for lessons
import Loader from '@/components/Common/Loader';
import NoData from '@/components/Common/NoData';
import Cookies from 'js-cookie'; // To handle cookies
import { toast } from 'react-toastify'; // Optional: For notifications

export default function LessonDetailPage({ params }: { params: { slug: string } }) {
  const [lessonData, setLessonData] = useState<any>(null); // State for storing lesson data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [countdown, setCountdown] = useState<number>(0); // State for countdown
  const [currentDate, setCurrentDate] = useState<string | null>(null); // State for the current date
  const router = useRouter(); // To handle redirection

  // Fetch lesson data from API using slug and category_id from cookies
  useEffect(() => {
    const fetchLessonDetail = async () => {
      const token = Cookies.get('jwt'); // Get JWT token from cookies
      const categoryId = Cookies.get('category_id'); // Get category_id from cookies

      if (!token || !categoryId) {
        setError('Missing token or category ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lesson-detail/${params.slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            category: categoryId, // Pass category_id as a query parameter
          },
        });

        if (response.data && response.data.status) {
          const lesson = response.data.data;
          setLessonData(lesson);
          setCountdown(lesson.read_time * 60); // Convert read time (minutes) to seconds

          // Set the current date
          const today = new Date();
          const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          setCurrentDate(formattedDate);
        } else {
          setError('Failed to fetch lesson details');
        }
      }  catch (error: any) {
        console.log(error);
        // Handle errors such as network issues or API errors
        if (error.response) {
          // API responded with an error status
          const { status, data } = error.response;
  
          if (status === 401) {
            toast.error('User is not authenticated. Please log in.');
            router.push("/login");
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
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetail();
  }, [params.slug]);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // Clear interval when countdown reaches 0
            router.push('/dashboard/lessons'); // Redirect to lessons page after countdown
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [countdown, router]);

  if (loading) {
    return <Loader />; // Display Loader while fetching data
  }

  if (error) {
    return <NoData message={error} />; // Display NoData component if there is an error
  }

  if (!lessonData) {
    return <NoData message="No lesson data found." />; // Handle case where lesson data is missing
  }

  return (
    <div className="dashboard-page">
    <div className="relative card bg-white rounded-lg shadow-sm lg:p-8 p-5 mb-6 border border-gray-200">

        {/* Countdown Display in the top right corner */}
        {countdown > 0 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-2 rounded-full text-sm  flex items-center">
            <FaClock className="inline mr-1" />
            <span>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')} min</span> {/* Display countdown in mm:ss format */}
          </div>
        )}

        {/* Skill Name at the top */}
        <div className="mb-3">
          <h2 className="text-lg text-defaultcolor underline">{lessonData.skill}</h2> {/* Skill name */}
        </div>

        {/* Title Section */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">{lessonData.title}</h1>

        {/* Current Date Display */}
        {currentDate && (
          <div className="mb-4 text-lg text-gray-600 flex items-center">
            <FaClock className="inline mr-2" />
            <strong>Date: </strong> {currentDate} {/* Display current date */}
          </div>
        )}

        {/* Badge Section */}
        <div className="flex justify-start space-x-4 mb-6">
          {/* Paid or Free Badge */}
          <span className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${lessonData.is_free === 'Paid' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {lessonData.is_free === 'Paid' ? <FaDollarSign className="mr-2" /> : <FaCheckCircle className="mr-2" />}
            {lessonData.is_free}
          </span>

          {/* Difficulty Badge */}
          <span className="inline-flex items-center text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            <FaTag className="mr-2" />
            {lessonData.level}
          </span>

          {/* Category Badge */}
          <span className="inline-flex items-center text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            <FaBook className="mr-2" />
            {lessonData.skill}
          </span>

          {/* Read Time */}
          <span className="inline-flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            <FaClock className="mr-2" />
            {lessonData.read_time} min
          </span>
        </div>

        {/* Render lesson description safely */}
        <div
          className="text-gray-800 mt-4 space-y-6 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: lessonData.description }} // Inject HTML safely
        />

        {/* Tags Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Tags:</h3>
          <div className="flex flex-wrap">
            {lessonData.tags && JSON.parse(lessonData.tags).map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
