"use client"; // Indicate this is a client component

import { useRouter } from 'next/router';
import { FC } from 'react';

// Define the lesson content type
interface LessonContent {
  [key: string]: string;
}

// Dynamic data for lesson content
const lessonContent: LessonContent = {
  'dashboard/cpp/intro-to-cpp': 'This lesson introduces the basics of C++ including syntax, variables, and data types.',
  'dashboard/cpp/oop-in-cpp': 'Learn about object-oriented programming concepts in C++, including classes and inheritance.',
  'dashboard/cpp/std-library': 'Overview of the C++ Standard Library and its most commonly used components.',
  'dashboard/web/html-basics': 'An introduction to HTML and how to structure a webpage using HTML elements.',
  'dashboard/web/css-basics': 'Learn the fundamentals of CSS for styling your web pages.',
  'dashboard/web/javascript-essentials': 'Cover the essentials of JavaScript, including variables, functions, and events.',
  'dashboard/data-science/intro': 'Introduction to the field of data science, its applications, and methodologies.',
  'dashboard/data-science/data-analysis': 'Learn data analysis techniques using Python and relevant libraries.',
  'dashboard/data-science/machine-learning': 'Explore the basics of machine learning and its algorithms.',
};

const LessonDetailPage: FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Ensure slug is a string
  const slugString = Array.isArray(slug) ? slug.join('/') : slug;

  // Ensure slugString is defined
  if (!slugString) {
    return <div>Lesson not found.</div>;
  }

  const content = lessonContent[slugString];

  if (!content) {
    return <div>Lesson not found.</div>;
  }

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl font-bold mb-5">{slugString.replace(/-/g, ' ')}</h1>
      <p className="text-lg">{content}</p>
    </div>
  );
}

export default LessonDetailPage;
