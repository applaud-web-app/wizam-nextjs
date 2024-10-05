"use client"; // Indicate this is a client component

import { FaBook, FaVideo, FaPen } from 'react-icons/fa'; // React icons
import Link from 'next/link';

// Define interfaces for skills and lessons
interface Lesson {
  title: string;
  slug: string;
  category: string;
  difficulty: string;  
  readTime: string;   
}


interface Skill {
  name: string;
  lessons: Lesson[];
}

// Dynamic data for skills and lessons
const skillsData = [
  {
    name: 'Programming in C++',
    lessons: [
      { 
        title: 'Introduction to C++', 
        slug: 'intro-to-cpp', // Slug updated
        category: 'Programming', 
        difficulty: 'Beginner', 
        readTime: '10 min', 
        description: '<p>This lesson introduces the basics of C++ programming, including <strong>syntax</strong>, data types, and simple programs.</p>',
      },
      { 
        title: 'Object-Oriented Programming in C++', 
        slug: 'oop-in-cpp', // Slug updated
        category: 'Programming', 
        difficulty: 'Intermediate', 
        readTime: '15 min', 
        description: '<p>Learn about the principles of object-oriented programming (OOP) in C++ and how to implement classes, inheritance, and polymorphism.</p>',
      },
      { 
        title: 'C++ Standard Library', 
        slug: 'std-library', // Slug updated
        category: 'Programming', 
        difficulty: 'Advanced', 
        readTime: '20 min', 
        description: '<p>Dive into the powerful features of the C++ Standard Library, including containers, algorithms, and iterators.</p>',
      },
    ],
  },
  {
    name: 'Web Development',
    lessons: [
      { 
        title: 'HTML Basics', 
        slug: 'html-basics',
        category: 'Web Development', 
        difficulty: 'Beginner', 
        readTime: '8 min',
        description: '<p>Learn the fundamentals of HTML, the backbone of the web. This lesson covers elements, attributes, and creating basic web pages.</p>',
      },
      { 
        title: 'CSS for Beginners', 
        slug: 'css-basics',
        category: 'Web Development', 
        difficulty: 'Beginner', 
        readTime: '10 min',
        description: '<p>A beginner-friendly guide to CSS, including selectors, properties, and how to style your HTML content.</p>',
      },
      { 
        title: 'JavaScript Essentials', 
        slug: 'javascript-essentials',
        category: 'Web Development', 
        difficulty: 'Intermediate', 
        readTime: '12 min',
        description: '<p>Understand the basics of JavaScript, including variables, functions, loops, and DOM manipulation.</p>',
      },
    ],
  },
];


export default function LessonsPage() {
  return (
    <div className="dashboard-page">

      <div className="mb-3">
        {skillsData.map((skill) => (
          <div key={skill.name} className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{skill.name}</h2>
            <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skill.lessons.map((lesson) => (
                <Link key={lesson.slug} href={`/dashboard/lessons/${lesson.slug}`}>
                  <div className="card bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-shadow border border-white hover:border-primary">
                    <h3 className="text-lg font-semibold">{lesson.title}</h3>
                    <p className="text-gray-600">Category: {lesson.category}</p>
                    <p className="text-gray-600">Difficulty: {lesson.difficulty}</p> {/* Display difficulty */}
                    <p className="text-gray-600">Read time: {lesson.readTime}</p>     {/* Display read time */}
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

