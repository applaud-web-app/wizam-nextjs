"use client"; // Indicate this is a client component

import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for API calls
import { useRouter } from 'next/navigation'; // useRouter for navigation in Next.js
import { FaClock, FaBook, FaPlayCircle } from 'react-icons/fa'; // Icons for video details
import Loader from '@/Components/Common/Loader';
import NoData from '@/Components/Common/NoData';
import Cookies from 'js-cookie'; // To handle cookies
import { toast } from 'react-toastify'; // Optional: For notifications

export default function VideoDetailPage({ params }: { params: { slug: string } }) {
  const [videoData, setVideoData] = useState<any>(null); // State for storing video data
  const [loading, setLoading] = useState(true); // Loading state
  const [currentDate, setCurrentDate] = useState<string | null>(null); // State for the current date
  const [countdown, setCountdown] = useState<number>(0); // State for countdown
  const [playing, setPlaying] = useState<boolean>(false); // State for video play tracking
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter(); // For navigation

  // Fetch video details based on slug and category_id
  useEffect(() => {
    const fetchVideoDetail = async () => {
      const token = Cookies.get('jwt'); // Get JWT token from cookies
      const categoryId = Cookies.get('category_id'); // Get category_id from cookies

      if (!token || !categoryId) {
        setError('Missing token or category ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/video-detail/${params.slug}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass JWT token in Authorization header
          },
          params: {
            category: categoryId, // Pass category_id as a query parameter
          },
        });

        if (response.data && response.data.status) {
          setVideoData(response.data.data); // Set video data from API response
          setCountdown(response.data.data.watch_time * 60); // Set countdown in seconds based on watch time
        } else {
          setError('Failed to fetch video details');
        }
      }catch (error:any) {
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

      setLoading(false);
    };

    fetchVideoDetail();
  }, [params.slug]);

  // Fetch the current date when the component mounts
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString()); // Set the current date
  }, []);

  // Start the countdown when the video is played
  const handlePlayClick = () => {
    if (!videoData) return;

    setPlaying(true); // Mark video as playing

    // Start countdown timer and redirect when it finishes
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalId);
          router.push('/dashboard/videos'); // Redirect to videos list after countdown finishes
        }
        return prevCountdown - 1;
      });
    }, 1000); // 1-second interval for countdown

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  };

  // Function to render video based on its type
  const renderVideo = () => {
    if (!videoData) return null;

    const { video, video_type } = videoData;

    if (video_type === "YouTube") {
      // Embed YouTube video with the video ID
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video}`}
          title={videoData.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      );
    } else if (video_type === "Vimeo") {
      // Embed Vimeo video with the video ID
      return (
        <iframe
          width="100%"
          height="100%"
          src={`https://player.vimeo.com/video/${video}`}
          title={videoData.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg "
        ></iframe>
      );
    } else if (video_type === "MP4") {
    
      return (
        <video
          width="100%"
          height="100%"
          controls
          className="rounded-lg  h-full"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <NoData message="Unsupported video type." />;
    }
  };

  if (loading) {
    return <Loader />; // Display Loader while fetching data
  }

  if (error) {
    return <NoData message={error} />; // Display error message if there's an error
  }

  if (!videoData) {
    return <NoData message="No video data found." />; // Display NoData component if video not found
  }

  return (
    <div className="dashboard-page">
    <div className="relative card bg-white rounded-lg shadow-sm lg:p-8 p-5 mb-6 border border-gray-200">
  
      {/* Countdown Display in the top right corner */}
      {countdown > 0 && playing && (
        <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-2 rounded-full text-xs sm:text-sm shadow-md flex items-center">
          <FaClock className="inline mr-1" />
          <span>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')} min</span>
        </div>
      )}
  
      {/* Video title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3">{videoData.title}</h1>
  
      {/* Video details badges */}
      <div className="text-gray-600 mb-6 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-wrap gap-2">
        <div className="inline-flex items-center text-xs sm:text-sm px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          <FaClock className="inline mr-2" /> <strong>Date: </strong>{currentDate}
        </div>
        <div className="inline-flex items-center text-xs sm:text-sm px-3 sm:px-4 py-2 bg-green-100 text-green-800 rounded-full">
          <FaBook className="inline mr-2" /> <strong>Syllabus: </strong>{videoData.skill}
        </div>
        <div className="inline-flex items-center text-xs sm:text-sm px-3 sm:px-4 py-2 bg-purple-100 text-purple-800 rounded-full">
          <FaClock className="inline mr-2" /> <strong>Watch Time: </strong>{videoData.watch_time} min
        </div>
      </div>
  
      {/* Video or Thumbnail */}
      <div className="mb-6 relative" style={{ height: '300px', maxHeight: '500px' }}>
        {/* Responsive thumbnail handling */}
        {videoData.thumbnail && !playing ? (
          <div className="relative cursor-pointer h-full" onClick={handlePlayClick}>
            <img src={videoData.thumbnail} alt="Video Thumbnail" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 flex justify-center items-center">
              <FaPlayCircle className="text-white bg-black p-1 rounded-full text-5xl sm:text-6xl opacity-80 animate-pulse hover:scale-110 transition-transform duration-300 ease-in-out" />
            </div>
          </div>
        ) : (
          renderVideo() // Render video if thumbnail is not available or when playing
        )}
      </div>
  
      {/* Render description */}
      {videoData.description && (
        <div
          className="text-gray-800 mt-4 space-y-6 leading-relaxed text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: videoData.description }}
        />
      )}
  
      {/* Tags Section */}
      <div className="mt-8">
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {videoData.tags && JSON.parse(videoData.tags).map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm px-3 py-1 rounded-full"
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
