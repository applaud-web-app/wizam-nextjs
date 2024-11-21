"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '@/components/Common/Loader';
import NoData from '@/components/Common/NoData';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { FaFolder, FaSignal, FaClock, FaBookOpen, FaLock } from "react-icons/fa";

interface Lesson {
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  readTime: string;
  isFree: boolean;
}

interface Skill {
  name: string;
  lessons: Lesson[];
}

export default function LessonsPage() {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePayment = async (slug: string) => {
    try {
      const jwt = Cookies.get("jwt");
      if (!jwt) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-subscription`, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { type: "lessons" },
      });

      if (response.data.status === true) {
        router.push(slug);
      } else {
        toast.error('Please buy a subscription to access this course.');
        router.push("/pricing");
      }
    } catch (error: any) {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          toast.error('Please log in.');
          router.push("/login");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchLessons = async () => {
      const token = Cookies.get('jwt');
      const categoryId = Cookies.get('category_id');

      if (!token || !categoryId) {
        setError('Missing token or category ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-lesson`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { category: categoryId },
        });

        if (response.data && response.data.status) {
          const transformedData = Object.keys(response.data.data).map((key: string) => ({
            name: key,
            lessons: response.data.data[key].map((lesson: any) => ({
              title: lesson.lesson_title,
              slug: lesson.lesson_slug,
              category: lesson.lesson_syllabus,
              difficulty: lesson.lesson_level,
              readTime: `${lesson.lesson_read_time} min`,
              isFree: lesson.isFree, // Capture isFree property
            })),
          }));

          setSkillsData(transformedData);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching lessons');
      }

      setLoading(false);
    };

    fetchLessons();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NoData message="No Lessons Found" />;
  }

  return (
    <div className="mb-3">
      {/* Loop through the skills */}
      {skillsData.map((skill) => (
        <div key={skill.name} className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{skill.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Loop through the lessons */}
            {skill.lessons.map((lesson) => (
              <div
                key={lesson.slug}
                onClick={() => lesson.isFree ? router.push(`/dashboard/lessons/${lesson.slug}`) : handlePayment(`/dashboard/lessons/${lesson.slug}`)}
                className="card bg-white rounded-lg p-5 cursor-pointer transition-all border border-gray-200 hover:border-defaultcolor "
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{lesson.title}</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <FaFolder className="mr-2 text-gray-500" />
                  <span>Category: {lesson.category}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <FaSignal className="mr-2 text-gray-500" />
                  <span>Difficulty: {lesson.difficulty.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <FaClock className="mr-2 text-gray-500" />
                  <span>Read time: {lesson.readTime}</span>
                </div>

                {/* Button */}
                <button 
                  className={`w-full py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition ${
                    lesson.isFree ? "bg-green-500 text-white hover:bg-green-600" : "bg-defaultcolor text-white hover:bg-opacity-90"
                  }`}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    lesson.isFree ? router.push(`/dashboard/lessons/${lesson.slug}`) : handlePayment(`/dashboard/lessons/${lesson.slug}`);
                  }}
                >
                  {lesson.isFree ? <FaBookOpen /> : <FaLock />}
                  {lesson.isFree ? "View Lesson" : "Subscribe to Access"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
