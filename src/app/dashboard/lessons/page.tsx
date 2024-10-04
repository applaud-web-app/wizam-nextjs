"use client"; // Indicate this is a client component

import { FaBook, FaVideo, FaPen } from 'react-icons/fa'; // React icons
import Link from 'next/link';

// Define interfaces for skills and lessons
interface Lesson {
  title: string;
  slug: string;
  category: string;
}

interface Skill {
  name: string;
  lessons: Lesson[];
}

// Dynamic data for skills and lessons
const skillsData: Skill[] = [
  {
    name: 'Programming in C++',
    lessons: [
      { title: 'Introduction to C++', slug: 'dashboard/cpp/intro-to-cpp', category: 'Programming' },
      { title: 'Object-Oriented Programming in C++', slug: 'dashboard/cpp/oop-in-cpp', category: 'Programming' },
      { title: 'C++ Standard Library', slug: 'dashboard/cpp/std-library', category: 'Programming' },
    ],
  },
  {
    name: 'Web Development',
    lessons: [
      { title: 'HTML Basics', slug: 'dashboard/web/html-basics', category: 'Web Development' },
      { title: 'CSS for Beginners', slug: 'dashboard/web/css-basics', category: 'Web Development' },
      { title: 'JavaScript Essentials', slug: 'dashboard/web/javascript-essentials', category: 'Web Development' },
    ],
  },
  {
    name: 'Data Science',
    lessons: [
      { title: 'Introduction to Data Science', slug: 'dashboard/data-science/intro', category: 'Data Science' },
      { title: 'Data Analysis with Python', slug: 'dashboard/data-science/data-analysis', category: 'Data Science' },
      { title: 'Machine Learning Basics', slug: 'dashboard/data-science/machine-learning', category: 'Data Science' },
    ],
  },
];

export default function LessonsPage() {
  return (
    <div className="dashboard-page">

      <div className="mb-3">
        {skillsData.map((skill) => (
          <div key={skill.name} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{skill.name}</h2>
            <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skill.lessons.map((lesson) => (
                <Link key={lesson.slug} href={`/lessons/${lesson.slug}`}>
                  <div className="card bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-shadow ">
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    <p className="text-gray-600">Category: {lesson.category}</p>
                  
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
