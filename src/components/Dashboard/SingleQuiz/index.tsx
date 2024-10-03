"use client"; // Ensure this component is client-side rendered

import { FaClock, FaQuestionCircle, FaStar, FaListAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa"; // Icons for the details
import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";

// Define the type for quiz details
interface QuizDetails {
  title: string;
  quizType: string;
  topic: string; // Adjusted to 'topic' for quiz
  totalQuestions: number;
  duration: string;
  totalPoints: number; // Adjusted for quiz points instead of marks
  description: string;
  instructions: string;
}

export default function SingleQuiz() {
  // State to hold quiz details, initially null
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State for loading

  // Simulating fetching data for the specific quiz with HTML content for description and instructions
  useEffect(() => {
    setTimeout(() => {
      setQuizDetails({
        title: "Math Basics Quiz",
        quizType: "General Knowledge Quiz",
        topic: "Math Fundamentals", // Adjusted for quiz topic
        totalQuestions: 15,
        duration: "30 mins",
        totalPoints: 100, // Adjusted to points for quizzes
        description: `
          <h3 class="text-lg font-semibold mb-2">Quiz Overview</h3>
          <p>This quiz tests your knowledge on <strong>basic math concepts</strong>, including arithmetic, simple equations, and problem-solving. You are expected to:</p>
          <ul class="list-disc list-inside">
            <li>Apply basic math operations such as addition, subtraction, multiplication, and division</li>
            <li>Solve simple linear equations</li>
            <li>Demonstrate an understanding of fundamental math principles</li>
          </ul>
        `,
        instructions: `
          <h3 class="text-lg font-semibold mb-2">Instructions</h3>
          <p>Please follow these instructions carefully during the quiz:</p>
          <ol class="list-decimal list-inside">
            <li>Ensure you have a stable internet connection before starting the quiz.</li>
            <li>You <strong>cannot</strong> leave the quiz window once it begins.</li>
            <li>All questions are mandatory, and skipping is not allowed.</li>
            <li>No calculators are allowed; use mental math where possible.</li>
          </ol>
        `,
      });
      setLoading(false); // Set loading to false after fetching data
    }, 2000); // Simulate a 2 second fetch delay
  }, []);

  // Show loader while loading
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto p-5 shadow-sm bg-white rounded-lg">
      {/* Quiz Title and Type */}
      <div className="mb-8">
        <p className="bg-cyan-100 text-cyan-700 px-4 py-2 text-sm rounded-full inline-block mb-4">
          {quizDetails?.topic} {/* Adjusted to show quiz topic */}
        </p>
        <h1 className="text-3xl font-bold text-secondary mb-2">{quizDetails?.title}</h1>
        <h2 className="text-lg font-medium text-secondary-600">{quizDetails?.quizType}</h2>
      </div>

      {/* Syllabus and Details in a Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3 border-y border-gray-300 mb-8">
        {/* Quiz Details with Icons */}
        <div className="flex items-center space-x-2 text-gray-700">
          <FaQuestionCircle className="text-secondary" />
          <span className="text-base font-semibold">
            Questions: {quizDetails?.totalQuestions}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaClock className="text-secondary" />
          <span className="text-base font-semibold">
            Duration: {quizDetails?.duration}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaStar className="text-secondary" />
          <span className="text-base font-semibold">
            Points: {quizDetails?.totalPoints} {/* Adjusted to points for quizzes */}
          </span>
        </div>
      </div>

      {/* Quiz Instructions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
          <FaCheckCircle className="text-secondary mr-2" /> Instructions
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: quizDetails?.instructions || "" }}
          className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300"
        />
      </div>

      {/* Quiz Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
          <FaInfoCircle className="text-secondary mr-2" /> Quiz Description
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: quizDetails?.description || "" }}
          className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300"
        />
      </div>

      {/* Start Quiz Button */}
      <button
        onClick={() => alert(`Starting quiz: ${quizDetails?.title}`)}
        className="w-full bg-secondary text-white font-semibold py-2 rounded-lg hover:bg-secondary-dark transition-all duration-200"
      >
        Start Quiz
      </button>
    </div>
  );
}
