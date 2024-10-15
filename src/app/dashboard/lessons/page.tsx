"use client"; // Indicate this is a client component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie'; // For handling cookies
import Loader from '@/components/Common/Loader';
import NoData from '@/components/Common/NoData';
import { useRouter } from "next/navigation"; // Use router to redirect
import { toast } from 'react-toastify'; // Optional: For notifications

// Define interfaces for lessons
interface Lesson {
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  readTime: string;
}

interface Skill {
  name: string;
  lessons: Lesson[];
}

export default function LessonsPage() {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For redirecting to other pages

  // Function to handle payment logic
  const handlePayment = async (slug: string) => {
    try {
      // Get JWT token from cookies
      const jwt = Cookies.get("jwt");
      const type = "lessons"; // assuming "quizzes" is the type

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
    } catch (error: any) {
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
    const controller = new AbortController();

    const fetchLessons = async () => {
      const token = Cookies.get('jwt'); // Get JWT token from cookies
      const categoryId = Cookies.get('category_id'); // Get category_id from cookies
      console.log(token, categoryId);

      if (!token || !categoryId) {
        setError('Missing token or category ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-lesson`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass JWT token in Authorization header
          },
          params: {
            category: categoryId, // Pass category_id as a query parameter
          },
          signal: controller.signal, // Attach the abort signal here
        });

        if (response.data && response.data.status) {
          const transformedData = Object.keys(response.data.data).map((key: string) => ({
            name: key, // This will dynamically set the name to 'Learning', 'Music', etc.
            lessons: response.data.data[key].map((lesson: any) => ({
              title: lesson.lesson_title,
              slug: lesson.lesson_slug,
              category: lesson.lesson_syllabus,
              difficulty: lesson.lesson_level,
              readTime: `${lesson.lesson_read_time} min`,
            })),
          }));

          setSkillsData(transformedData);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Fetch cancelled');
        } else {
          console.error('Error fetching lessons:', err);
          setError('An error occurred while fetching lessons');
        }
      }

      setLoading(false);
    };

    fetchLessons();

    return () => {
      controller.abort(); // Cleanup the fetch call on component unmount
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NoData message="No Lessons Found" />;
  }

  return (
    <div className="dashboard-page">
      <div className="mb-3">
        {/* Loop through the skills */}
        {skillsData.map((skill) => (
          <div key={skill.name} className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{skill.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Loop through the lessons */}
              {skill.lessons.map((lesson) => (
                <div key={lesson.slug} onClick={() => handlePayment(`/dashboard/lessons/${lesson.slug}`)}>
                  <div className="card bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-shadow border border-white hover:border-defaultcolor">
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    <p className="text-gray-600">Category: {lesson.category}</p>
                    <p className="text-gray-600">Difficulty: {lesson.difficulty.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</p>
                    <p className="text-gray-600">Read time: {lesson.readTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
