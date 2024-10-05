"use client"; // Indicate this is a client component

import { FaVideo, FaClock, FaPlayCircle } from 'react-icons/fa'; // React icons for videos
import Link from 'next/link';

// Define interfaces for skills and videos
interface Video {
  title: string;
  slug: string;
  syllabus: string; // Updated from category to syllabus
  difficulty: string;  
  watchTime: string;   // Updated from videoLength to watchTime
  description: string;
}

interface Skill {
  name: string;
  videos: Video[];
}

// Dynamic data for skills and videos
const skillsData: Skill[] = [
  {
    name: 'Programming in C++',
    videos: [
      { 
        title: 'Introduction to C++', 
        slug: 'intro-to-cpp',
        syllabus: 'Programming Basics', // Updated label
        difficulty: 'Beginner', 
        watchTime: '10 min', // Updated label
        description: '<p>This video introduces the basics of C++ programming, including <strong>syntax</strong>, data types, and simple programs.</p>',
      },
      { 
        title: 'Object-Oriented Programming in C++', 
        slug: 'oop-in-cpp',
        syllabus: 'OOP Concepts', 
        difficulty: 'Intermediate', 
        watchTime: '15 min',
        description: '<p>Learn about the principles of object-oriented programming (OOP) in C++ and how to implement classes, inheritance, and polymorphism.</p>',
      },
      { 
        title: 'C++ Standard Library', 
        slug: 'std-library',
        syllabus: 'Standard Library Features', 
        difficulty: 'Advanced', 
        watchTime: '20 min',
        description: '<p>Dive into the powerful features of the C++ Standard Library, including containers, algorithms, and iterators.</p>',
      },
    ],
  },
  {
    name: 'Web Development',
    videos: [
      { 
        title: 'HTML Basics', 
        slug: 'html-basics',
        syllabus: 'HTML Structure', 
        difficulty: 'Beginner', 
        watchTime: '8 min',
        description: '<p>Learn the fundamentals of HTML, the backbone of the web. This video covers elements, attributes, and creating basic web pages.</p>',
      },
      { 
        title: 'CSS for Beginners', 
        slug: 'css-basics',
        syllabus: 'CSS Styling', 
        difficulty: 'Beginner', 
        watchTime: '10 min',
        description: '<p>A beginner-friendly guide to CSS, including selectors, properties, and how to style your HTML content.</p>',
      },
      { 
        title: 'JavaScript Essentials', 
        slug: 'javascript-essentials',
        syllabus: 'JavaScript Fundamentals', 
        difficulty: 'Intermediate', 
        watchTime: '12 min',
        description: '<p>Understand the basics of JavaScript, including variables, functions, loops, and DOM manipulation.</p>',
      },
    ],
  },
];

export default function VideosPage() {
  return (
    <div className="dashboard-page">
      <div className="mb-3">
        {skillsData.map((skill) => (
          <div key={skill.name} className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{skill.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skill.videos.map((video) => (
                <Link key={video.slug} href={`/dashboard/videos/${video.slug}`}>
                  <div className="card bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-shadow border border-white hover:border-primary">
                    <div className="flex items-center mb-3">
                      <FaPlayCircle className="text-primary mr-2" /> {/* Video play icon */}
                      <h3 className="text-lg font-semibold">{video.title}</h3>
                    </div>
                    <p className="text-gray-600">Syllabus: {video.syllabus}</p> {/* Updated to Syllabus */}
                    <p className="text-gray-600">Difficulty: {video.difficulty}</p>
                    <p className="text-gray-600">Watch Time: {video.watchTime}</p> {/* Updated to Watch Time */}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
