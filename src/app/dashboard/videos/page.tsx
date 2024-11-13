"use client"; // Indicate this is a client component

import { useState, useEffect } from 'react';
import { FaVideo, FaClock, FaPlayCircle } from 'react-icons/fa'; // React icons for videos
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie'; // To handle cookies
import Loader from '@/Components/Common/Loader';
import NoData from '@/Components/Common/NoData';
import { useRouter } from "next/navigation"; // Use router to redirect
import { toast } from 'react-toastify'; // Optional: For notifications

// Define interfaces for videos and skills
interface Video {
  title: string;
  slug: string;
  syllabus: string;
  difficulty: string;
  watchTime: string;
  is_free: number;
}

interface Skill {
  name: string;
  videos: Video[];
}

export default function VideosPage() {
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For redirecting to other pages

   // Function to handle payment logic
   const handlePayment = async (slug: string) =>  {
    try {
      // Get JWT token from cookies
      const jwt = Cookies.get("jwt");
      const type = "videos"; // assuming "quizzes" is the type

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

      if (!token || !categoryId) {
        setError('Missing token or category ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-video`, {
        
          params: {
            category: categoryId, // Pass category_id as a query parameter
          },
          headers: {
            Authorization: `Bearer ${token}`, // Pass JWT token in Authorization header
          },
        });

        if (response.data && response.data.status) {
          // Transform API data to match the required structure
          const transformedData = Object.keys(response.data.data).map((key: string) => ({
            name: key, // This will dynamically set the name to 'Learning', 'Music', etc.
            videos: response.data.data[key].map((video: any) => ({
              title: video.video_title,
              slug: video.video_slug,
              syllabus: video.video_syllabus,
              difficulty: video.video_level,
              watchTime: `${video.video_watch_time} min`,
              is_free: video.is_free,
            })),
          }));
          setSkillsData(transformedData);
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
        {skillsData.map((skill) => (
          <div key={skill.name} className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{skill.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skill.videos.map((video) => (
                <div key={video.slug} onClick={() => handlePayment(`/dashboard/videos/${video.slug}`)}>
                  <div className="card bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-shadow border border-white hover:border-defaultcolor">
                    <div className="flex items-center mb-3">
                      <FaPlayCircle className="text-defaultcolor mr-2" /> {/* Video play icon */}
                      <h3 className="text-lg font-semibold">{video.title}</h3>
                    </div>
                    <p className="text-gray-600">Syllabus: {video.syllabus}</p>
                    <p className="text-gray-600">Difficulty: {video.difficulty.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</p>
                    <p className="text-gray-600">Watch Time: {video.watchTime}</p>
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
