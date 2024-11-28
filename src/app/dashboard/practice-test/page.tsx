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
import { FiPlay } from 'react-icons/fi';

// Define interfaces for skills and practice sets
interface PracticeSet {
  title: string;
  slug: string;
  syllabus: string; // Syllabus replaces category
  questions: number; // Number of questions
  time: number; // Time limit for the practice set
  marks: number; // Total marks for the practice set
  is_free: number;
  is_resume: number;
}

interface SkillsData {
  name: string;
  practiceSets: PracticeSet[]; // Practice sets for each skill
}

export default function PracticeSetPage() {
  const [practiceData, setPracticeSet] = useState<SkillsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For redirecting to other pages

  // Function to handle the logic for starting or redirecting based on payment status
  const handlePracticeSetClick = (slug: string, isFree: number, isResume: number) => {
    if (isFree === 1) {
      // If it's a free practice set, allow the user to start or resume the test
      router.push(isResume === 1 ? `/dashboard/practice-test-play/${slug}` : `/dashboard/practice-test/${slug}`);
    } else {
      // If it's a paid practice set, redirect to pricing page and show message
      toast.error('Please buy a subscription to access this test.');
      router.push("/pricing");
    }
  };

  // Fetch practice sets from the API
  useEffect(() => {
    const fetchPracticeSets = async () => {
      const token = Cookies.get('jwt'); // Get JWT token from cookies
      const categoryId = Cookies.get('category_id'); // Get category_id from cookies
      const categoryName = Cookies.get('category_name'); // Get category_name from cookies

      if (!token || !categoryId) {
        setError('Missing token or category ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/practice-set`, {
          params: { category: categoryId },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.status) {
          const transformedData = Object.keys(response.data.data).map((key: string) => ({
            name: key,
            practiceSets: response.data.data[key].map((practice: any) => ({
              title: practice.practice_title,
              syllabus: categoryName,
              slug: practice.practice_slug,
              questions: practice.practice_question,
              time: practice.practice_time, // Time in seconds
              marks: practice.practice_marks,
              is_free: practice.is_free,
              is_resume: practice.is_resume,
            })),
          }));

          setPracticeSet(transformedData);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('No Practice Test Found');
      }

      setLoading(false);
    };

    fetchPracticeSets();
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
        {practiceData.map((skill) => (
          <div key={skill.name} className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{skill.name}</h2>
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

                  {/* Start/Resume/Pay Button */}
                  {practiceSet.is_free === 1 ? (
                    <Link
                      href={practiceSet.is_resume === 1 ? `/dashboard/practice-test-play/${practiceSet.slug}` : `/dashboard/practice-test/${practiceSet.slug}`}
                      className={`${
                        practiceSet.is_resume === 1 ? "bg-[#C9BC0F] hover:bg-[#928c38]" : "bg-green-500 hover:bg-green-700"
                      } text-center text-white px-4 py-2 rounded transition duration-200 w-full flex items-center justify-center space-x-1`}
                    >
                      {practiceSet.is_resume === 1 ? <FiPlay /> : null}
                      <span>{practiceSet.is_resume === 1 ? "Resume" : "Start Test"}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handlePracticeSetClick(practiceSet.slug, practiceSet.is_free, practiceSet.is_resume)}
                      className="bg-defaultcolor hover:bg-defaultcolor-dark block text-center text-white px-4 py-2 rounded transition duration-200 w-full"
                    >
                      Pay Now
                    </button>
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
