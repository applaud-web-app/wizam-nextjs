"use client"; // Indicate this is a client component

import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { useRouter } from 'next/navigation'; // useRouter for navigation in Next.js app directory
import { FaClock, FaBook, FaPlayCircle } from 'react-icons/fa'; // Icons for videos
import Loader from '@/components/Common/Loader';
import NoData from '@/components/Common/NoData';

// Static data for videos (example purposes)
const skillsData = [
  {
    name: 'Programming in C++', // Skill Name
    videos: [
      { 
        title: 'Introduction to C++', 
        slug: 'intro-to-cpp',
        category: 'Programming', 
        difficulty: 'Beginner', 
        watchTime: '2 min', // Watch time in minutes
        videoUrl: 'https://www.youtube.com/embed/p-kAI-qOeJA', // YouTube video URL
        thumbnailUrl: 'https://via.placeholder.com/600x400', // Placeholder thumbnail
        description: `
          <p>This video introduces the basics of C++ programming, including <strong>syntax</strong>, data types, and simple programs.</p>
        `, 
        tags: ['C++', 'Programming', 'Syntax'], 
        paid: false, // Free video
      },
    ],
  },
];

// Helper function to find the video based on slug and return the associated skill name
const findVideoBySlug = (slug: string) => {
  for (const skill of skillsData) {
    const video = skill.videos.find((video) => video.slug === slug);
    if (video) {
      return { video, skillName: skill.name }; // Return both the video and the associated skill name
    }
  }
  return null;
};

// Dynamic page component for video details
export default function VideoDetailPage({ params }: { params: { slug: string } }) {
  const [videoData, setVideoData] = useState<any>(null); // State to handle both video and skillName
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<string | null>(null); // State to hold the current date
  const [countdown, setCountdown] = useState<number>(0); // State to hold the countdown in seconds
  const [playing, setPlaying] = useState<boolean>(false); // State to track whether video is playing
  const router = useRouter(); // useRouter for programmatic navigation

  // Fetch the video data based on the slug
  useEffect(() => {
    setTimeout(() => {
      const foundVideoData = findVideoBySlug(params.slug);
      setVideoData(foundVideoData);
      setLoading(false);
    }, 1000); // Simulate 1-second delay for loading
  }, [params.slug]);

  // Fetch the current date using JavaScript
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString()); // Set the current date
  }, []);

  // Start the countdown when the user clicks play
  const handlePlayClick = () => {
    if (!videoData) return;

    setPlaying(true); // Start playing the video

    const watchTimeInMs = parseWatchTime(videoData.video.watchTime); // Convert '2 min' to milliseconds
    setCountdown(watchTimeInMs / 1000); // Set countdown in seconds

    // Schedule the redirect after the watch time
    setTimeout(() => {
      router.push('/dashboard/videos'); // Redirect to lessons page after the countdown
    }, watchTimeInMs);

    // Start the interval to update the countdown every second
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000); // 1-second interval for countdown

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  };

  // Helper function to convert watch time string (e.g., '2 min') to milliseconds
  const parseWatchTime = (watchTime: string) => {
    const [amount, unit] = watchTime.split(' '); // Split the time string into number and unit (e.g., '2', 'min')
    const minutes = unit === 'min' ? parseInt(amount) : 0;
    return minutes * 60 * 1000; // Convert minutes to milliseconds
  };

  if (loading) {
    return <Loader />; // Display Loader while fetching data
  }

  if (!videoData) {
    return <NoData message="No video data found." />; // Display NoData component if video not found
  }

  const { video, skillName } = videoData; // Destructure the video and skill name

  return (
    <div className="dashboard-page">
      <div className="relative card bg-white rounded-lg shadow-sm p-8 mb-6 border border-gray-200">

        {/* Countdown Display in the top right corner */}
        {countdown > 0 && playing && (
          <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-2 rounded-full text-sm shadow-md flex items-center">
            <FaClock className="inline mr-1" />
            <span>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')} min</span> {/* Display countdown in mm:ss format */}
          </div>
        )}

        {/* Skill Name at the top */}
        <div className="mb-3">
          <h2 className="text-lg sm:text-xl text-primary font-bold">{skillName}</h2> {/* Bold skill name */}
        </div>

        {/* Title Section */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">{video.title}</h1> {/* Primary title */}

        {/* Video Details Section with Badge Style */}
        <div className="text-gray-600 mb-6 space-x-2 space-y-2">
          <div className="inline-flex items-center text-sm px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <FaClock className="inline mr-2" /> <strong>Date: </strong>{currentDate} {/* Date badge */}
          </div>
          <div className="inline-flex items-center text-sm px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <FaBook className="inline mr-2" /> <strong>Syllabus: </strong>{video.category} {/* Syllabus badge */}
          </div>
          <div className="inline-flex items-center text-sm px-4 py-2 bg-purple-100 text-purple-800 rounded-full">
            <FaClock className="inline mr-2" /> <strong>Watch Time: </strong>{video.watchTime} {/* Watch time badge */}
          </div>
        </div>

        {/* Video or Thumbnail */}
        <div className="mb-6 relative" style={{ height: '500px' }}> {/* Ensuring both elements have the same height */}
          {!playing ? (
            <div className="relative cursor-pointer" onClick={handlePlayClick} style={{ height: '100%' }}>
              {/* Video Thumbnail */}
              <img src={video.thumbnailUrl} alt="Video Thumbnail" className="w-full h-full object-cover rounded-lg shadow-sm" /> {/* Ensuring the thumbnail fills the container */}
              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex justify-center items-center">
                <FaPlayCircle className="text-white text-6xl opacity-80 animate-pulse hover:scale-110 transition-transform duration-300 ease-in-out" /> {/* Play icon animation */}
              </div>
            </div>
          ) : (
            <iframe
              width="100%"
              height="100%" // Ensuring the video matches the height of the thumbnail
              src={video.videoUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-sm"
            ></iframe>
          )}
        </div>

        {/* Render lengthy HTML description */}
        <div 
          className="text-gray-800 mt-4 space-y-6 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: video.description }} // Inject lengthy HTML safely
        />

        {/* Tags Section */}
        <div className="mt-8">
          <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag: string, index: number) => (
              <span 
                key={index}
                className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
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
