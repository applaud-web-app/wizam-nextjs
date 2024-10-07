// "use client"; // Indicate this is a client component

// import { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios for server requests
// import { useRouter } from 'next/navigation'; // To handle redirection after countdown
// import { FaClock, FaBook, FaTag, FaDollarSign, FaCheckCircle } from 'react-icons/fa'; // Icons for lessons
// import Loader from '@/components/Common/Loader';
// import NoData from '@/components/Common/NoData';

// // Static data (example purposes)
// const skillsData = [
//   {
//     name: 'Programming in C++', // Skill Name
//     lessons: [
//       { 
//         title: 'Introduction to C++', 
//         slug: 'intro-to-cpp',
//         category: 'Programming', 
//         difficulty: 'Beginner', 
//         readTime: '10 min', 
//         description: `
//           <p>C++ is a versatile programming language, and in this introductory lesson, we will cover its fundamental concepts.</p>
//           <h2>What You Will Learn</h2>
//           <ul>
//             <li><strong>Syntax</strong>: Learn the basic structure of C++ programs.</li>
//             <li><strong>Data Types</strong>: Explore the various data types available in C++.</li>
//             <li><strong>Control Structures</strong>: Understand how to manage the flow of your programs using loops and conditions.</li>
//           </ul>
//         `, 
//         tags: ['C++', 'Programming', 'Syntax'], 
//         paid: false, // Free lesson
//       },
//       { 
//         title: 'Object-Oriented Programming in C++', 
//         slug: 'oop-in-cpp',
//         category: 'Programming', 
//         difficulty: 'Intermediate', 
//         readTime: '15 min', 
//         description: '<p>Learn about the principles of object-oriented programming (OOP) in C++ and how to implement classes, inheritance, and polymorphism.</p>',
//         tags: ['C++', 'OOP', 'Classes'], 
//         paid: true, // Paid lesson
//       },
//     ],
//   },
// ];

// // Helper function to find the lesson based on slug and return the associated skill name
// const findLessonBySlug = (slug: string) => {
//   for (const skill of skillsData) {
//     const lesson = skill.lessons.find((lesson) => lesson.slug === slug);
//     if (lesson) {
//       return { lesson, skillName: skill.name }; // Return both the lesson and the associated skill name
//     }
//   }
//   return null;
// };

// // Helper function to convert read time string (e.g., "10 min") to seconds
// const parseReadTime = (readTime: string): number => {
//   const [value, unit] = readTime.split(' ');
//   const minutes = unit === 'min' ? parseInt(value) : 0;
//   return minutes * 60; // Convert minutes to seconds
// };

// // Dynamic page component
// export default function LessonDetailPage({ params }: { params: { slug: string } }) {
//   const [lessonData, setLessonData] = useState<any>(null); // Update state to handle both lesson and skillName
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState<string | null>(null); // State to store current date
//   const [countdown, setCountdown] = useState<number>(0); // To store countdown time in seconds
//   const router = useRouter(); // To handle redirection

//   // Fetch lesson data and set current date
//   useEffect(() => {
//     const fetchData = async () => {
//       // Simulate lesson fetching
//       const foundLessonData = findLessonBySlug(params.slug);
//       if (foundLessonData) {
//         const { lesson } = foundLessonData;
//         const readTimeInSeconds = parseReadTime(lesson.readTime);
//         setLessonData(foundLessonData);
//         setCountdown(readTimeInSeconds); // Initialize countdown with read time

//         // Get the current date
//         const today = new Date();
//         const formattedDate = today.toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//         });
//         setCurrentDate(formattedDate); // Set current date
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [params.slug]);

//   // Countdown effect
//   useEffect(() => {
//     if (countdown > 0) {
//       const interval = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval); // Clear interval at 0
//             router.push('/dashboard/lessons'); // Redirect to lessons page
//           }
//           return prev - 1; // Decrease countdown
//         });
//       }, 1000);

//       return () => clearInterval(interval); // Cleanup interval on component unmount
//     }
//   }, [countdown, router]);

//   if (loading) {
//     return <Loader />; // Display Loader while fetching data
//   }

//   if (!lessonData) {
//     return <NoData message="No lesson data found." />; // Display NoData component if lesson not found
//   }

//   const { lesson, skillName } = lessonData; // Destructure the lesson and skill name

//   return (
//     <div className="dashboard-page">
//       <div className="relative card bg-white rounded-lg shadow-sm p-8 mb-6 border border-gray-200">

//         {/* Countdown Display in the top right corner */}
//         {countdown > 0 && (
//           <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-2 rounded-full text-sm  flex items-center">
//             <FaClock className="inline mr-1" />
//             <span>{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')} min</span> {/* Display countdown in mm:ss format */}
//           </div>
//         )}

//         {/* Skill Name at the top */}
//         <div className="mb-3">
//           <h2 className="text-lg text-primary underline">{skillName}</h2> {/* Skill name with primary color */}
//         </div>

//         {/* Title Section */}
//         <h1 className="text-3xl font-semibold text-gray-900 mb-6">{lesson.title}</h1>

//         {/* Current Date Display */}
//         {currentDate && (
//           <div className="mb-4 text-lg text-gray-600 flex items-center">
//             <FaClock className="inline mr-2" />
//             <strong>Date: </strong> {currentDate} {/* Display current date */}
//           </div>
//         )}

//         {/* Badge Section */}
//         <div className="flex justify-start space-x-4 mb-6">
//           {/* Paid or Free Badge */}
//           <span className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${
//             lesson.paid ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//           }`}>
//             {lesson.paid ? <FaDollarSign className="mr-2" /> : <FaCheckCircle className="mr-2" />}
//             {lesson.paid ? 'Paid' : 'Free'}
//           </span>

//           {/* Difficulty Badge */}
//           <span className="inline-flex items-center text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
//             <FaTag className="mr-2" />
//             {lesson.difficulty}
//           </span>

//           {/* Category Badge */}
//           <span className="inline-flex items-center text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
//             <FaBook className="mr-2" />
//             {lesson.category}
//           </span>

//           {/* Read Time */}
//           <span className="inline-flex items-center text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
//             <FaClock className="mr-2" />
//             {lesson.readTime}
//           </span>
//         </div>

//         {/* Render lengthy HTML description */}
//         <div 
//           className="text-gray-800 mt-4 space-y-6 leading-relaxed"
//           dangerouslySetInnerHTML={{ __html: lesson.description }} // Inject lengthy HTML safely
//         />

//         {/* Tags Section */}
//         <div className="mt-8">
//           <h3 className="text-lg font-medium text-gray-800 mb-2">Tags:</h3>
//           <div className="flex flex-wrap">
//             {lesson.tags.map((tag: string, index: number) => (
//               <span 
//                 key={index}
//                 className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mr-2 mb-2"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"; // Ensure this component is client-side rendered

import SinglePracticeSet from "@/components/Dashboard/SinglePracticeSet";

interface ExamDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { slug } = params; // Extract the slug from the params

  return (
    <div className="dashboard-page">
      <SinglePracticeSet slug={slug} />
    </div>
  );
}
