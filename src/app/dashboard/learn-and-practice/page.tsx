"use client";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'; // To handle cookies


export default function LearnAndPractice() {
  const [practiceSetCount, setPracticeSetCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = Cookies.get("jwt"); // Replace with actual token
        const categoryId = Cookies.get('category_id'); // Replace with actual category ID

        // Fetch Practice Sets Count
        const practiceResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/practice-set`, {
          params: { category: categoryId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const practiceData = practiceResponse.data.data;
        const totalPracticeSets = Object.values(practiceData).flat().length;
        setPracticeSetCount(totalPracticeSets);

        // Fetch Videos Count
        const videoResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-video`, {
          params: { category: categoryId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const videoData = videoResponse.data.data;
        const totalVideos = Object.values(videoData).flat().length;
        setVideoCount(totalVideos);

        // Fetch Lessons Count
        const lessonResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/all-lesson`, {
          params: { category: categoryId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const lessonData = lessonResponse.data.data;
        const totalLessons = Object.values(lessonData).flat().length;
        setLessonCount(totalLessons);

      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Learn and Practice</h1>
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          
          {/* Practice Set Card */}
          <Link href="/dashboard/practice-test">
            <div className="card flex flex-col items-center justify-center rounded-lg p-4 cursor-pointer transition-transform border border-gray-300 hover:border-defaultcolor">
              <Image
                className="w-12 h-12 sm:w-16 sm:h-16"
                src="/images/live_help.svg"
                width={62}
                height={62}
                alt="Practice Set"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2 sm:mt-3"> {practiceSetCount} Practice Set</h3>
             
            </div>
          </Link>

          {/* Videos Card */}
          <Link href="/dashboard/videos">
            <div className="card flex flex-col items-center justify-center rounded-lg p-4 cursor-pointer transition-transform border border-gray-300 hover:border-defaultcolor">
              <Image
                className="w-12 h-12 sm:w-16 sm:h-16"
                src="/images/slideshow.svg"
                width={62}
                height={62}
                alt="Videos"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2 sm:mt-3">{videoCount} Videos</h3>
              
            </div>
          </Link>

          {/* Lesson Card */}
          <Link href="/dashboard/lessons">
            <div className="card flex flex-col items-center justify-center rounded-lg p-4 cursor-pointer transition-transform border border-gray-300 hover:border-defaultcolor">
              <Image
                className="w-12 h-12 sm:w-16 sm:h-16"
                src="/images/import_contacts.svg"
                width={62}
                height={62}
                alt="Lesson"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2 sm:mt-3">{lessonCount} Lesson</h3>
            
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
