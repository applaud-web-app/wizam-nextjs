"use client"; // Indicate this is a client component

import { useState, useEffect } from 'react';
import { FaBook, FaClock, FaQuestionCircle, FaCheck } from 'react-icons/fa'; // React icons
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie'; // To handle cookies
import Loader from '@/components/Common/Loader';
import NoData from '@/components/Common/NoData';

// Define interfaces for skills and practice sets
interface PracticeSet {
  title: string;
  slug: string;
  syllabus: string; // Syllabus replaces category
  questions: number; // Number of questions
  time: string; // Time limit for the practice set
  marks: number; // Total marks for the practice set
}

interface skillsData {
  name: string;
  practiceSets: PracticeSet[]; // Practice sets for each skill
}

export default function PracticeSetPage() {
  const [pracitceData, setPracticeSet] = useState<skillsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              syllabus:categoryName,
              slug: practice.practice_slug,
              questions: practice.practice_question,
              time: `${practice.practice_time} min`,
              marks: practice.practice_marks,
            })),
          }));

          setPracticeSet(transformedData);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('An error occurred while fetching videos');
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{skill.name}</h2> {/* Skill Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skill.practiceSets.map((practiceSet) => (
                <div key={practiceSet.slug} className="card bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2">{practiceSet.title}</h3>

                  {/* Syllabus */}
                  <p className="text-gray-600 mb-1">
                    <FaBook className="inline mr-2 text-primary" /> <strong>Syllabus: </strong>{practiceSet.syllabus}
                  </p>

                  {/* Questions */}
                  <p className="text-gray-600 mb-1">
                    <FaQuestionCircle className="inline mr-2 text-primary" /> <strong>Questions: </strong>{practiceSet.questions}
                  </p>

                  {/* Time */}
                  <p className="text-gray-600 mb-1">
                    <FaClock className="inline mr-2 text-primary" /> <strong>Time: </strong>{practiceSet.time}
                  </p>

                  {/* Marks */}
                  <p className="text-gray-600 mb-4">
                    <FaCheck className="inline mr-2 text-primary" /> <strong>Marks: </strong>{practiceSet.marks}
                  </p>

                  {/* Start Test Button */}
                  <Link href={`/dashboard/practice-test/${practiceSet.slug}`}>
                    <span className="bg-primary block text-center text-white px-4 py-2 rounded hover:bg-primary-dark transition duration-200 w-full">
                      Start Test
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
