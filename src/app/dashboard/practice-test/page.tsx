"use client"; // Indicate this is a client component

import { useState, useEffect } from 'react';
import { FaBook, FaClock, FaQuestionCircle, FaCheck } from 'react-icons/fa'; // React icons
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie'; // To handle cookies
import Loader from '@/components/Common/Loader';
import NoData from '@/components/Common/NoData';
import { toast } from 'react-toastify'; // Optional: For notifications
import { useRouter } from "next/navigation"; // Use router to redirect

// Define interfaces for skills and practice sets
interface PracticeSet {
  title: string;
  slug: string;
  syllabus: string; // Syllabus replaces category
  questions: number; // Number of questions
  time: number; // Time limit for the practice set
  marks: number; // Total marks for the practice set
  is_free:number;
}

interface skillsData {
  name: string;
  practiceSets: PracticeSet[]; // Practice sets for each skill
}

export default function PracticeSetPage() {
  const [pracitceData, setPracticeSet] = useState<skillsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch all videos from the API
  useEffect(() => {
    const fetchVideos = async () => {
      const token = Cookies.get('jwt'); // Get JWT token from cookies
      const categoryId = Cookies.get('category_id'); // Get category_id from cookies
      const categoryName = Cookies.get('category_name'); // Get category_id from cookies

      if (!token || !categoryId) {
        setError('Missing token or category ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/practice-set`, {
          params: {
            category: categoryId, // Pass category_id as a query parameter
          },
          headers: {
            Authorization: `Bearer ${token}`, // Pass JWT token in Authorization header
          },
        });

        if (response.data && response.data.status) {
          console.log(response.data);
          // Transform API data to match the required structure
          const transformedData = Object.keys(response.data.data).map((key: string) => ({
            name: key, // This will dynamically set the name to 'Learning', 'Music', etc.
            practiceSets: response.data.data[key].map((practice: any) => ({
              title: practice.practice_title,
              syllabus: categoryName,
              slug: practice.practice_slug,
              questions: practice.practice_question,
              time: practice.practice_time, // Time in seconds
              marks: practice.practice_marks,
              is_free: practice.is_free,
            })),
          }));

          setPracticeSet(transformedData);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('No Practice Test Found');
      }

      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NoData message={error} />;
  }

  return (
    <div className="dashboard-page">
      <div className="mb-3">
        {pracitceData.map((skill) => (
          <div key={skill.name} className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{skill.name}</h2> {/* Skill Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skill.practiceSets.map((practiceSet) => (
                <div key={practiceSet.slug} className="card bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2">{practiceSet.title}</h3>

                  {/* Syllabus */}
                  <p className="text-gray-600 mb-1">
                    <FaBook className="inline mr-2 text-defaultcolor" /> <strong>Syllabus: </strong>{practiceSet.syllabus}
                  </p>

                  {/* Questions */}
                  <p className="text-gray-600 mb-1">
                    <FaQuestionCircle className="inline mr-2 text-defaultcolor" /> <strong>Questions: </strong>{practiceSet.questions}
                  </p>

                  {/* Time */}
                  <p className="text-gray-600 mb-1">
                    <FaClock className="inline mr-2 text-defaultcolor" /> 
                    <strong>Time: </strong>{practiceSet.time ? Math.floor(practiceSet.time / 60) : 0} min
                  </p>

                  {/* Marks */}
                  <p className="text-gray-600 mb-4">
                    <FaCheck className="inline mr-2 text-defaultcolor" /> <strong>Marks: </strong>{practiceSet.marks}
                  </p>

                  {/* Start Test Button */}
                  {practiceSet.is_free === 1 ? (
                    <Link href={`/dashboard/practice-test/${practiceSet.slug}`}>
                      <span className="bg-green-500 block text-center text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 w-full">
                        Start Test
                      </span>
                    </Link>
                  ) : (
                    <button onClick={() => handlePayment(`/dashboard/practice-test/${practiceSet.slug}`)} className="bg-defaultcolor block text-center text-white px-4 py-2 rounded hover:bg-defaultcolor-dark transition duration-200 w-full">Paid Exam</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
