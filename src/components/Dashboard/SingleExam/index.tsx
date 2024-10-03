"use client"; // Ensure this component is client-side rendered

import { FaClock, FaQuestionCircle, FaStar, FaListAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa"; // Icons for the details
import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";

// Define the type for exam details
interface ExamDetails {
  title: string;
  examType: string;
  syllabus: string;
  totalQuestions: number;
  duration: string;
  marks: number;
  description: string;
  instructions: string;
}

export default function SingleExam() {
  // State to hold exam details, initially null
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State for loading

  // Simulating fetching data for the specific exam with HTML content for description and instructions
  useEffect(() => {
    setTimeout(() => {
      setExamDetails({
        title: "Algebra Basics",
        examType: "Math Exam",
        syllabus: "Algebra I", // Only one syllabus item
        totalQuestions: 20,
        duration: "1 hr",
        marks: 100,
        description: `
          <h3 class="text-lg font-semibold mb-2">Exam Overview</h3>
          <p>This exam covers the <strong>fundamentals of Algebra</strong>, including equations, inequalities, and functions. You are expected to:</p>
          <ul class="list-disc list-inside">
            <li>Understand and solve linear equations</li>
            <li>Work with functions and graph them</li>
            <li>Solve inequalities with algebraic methods</li>
          </ul>
        `,
        instructions: `
          <h3 class="text-lg font-semibold mb-2">Instructions</h3>
          <p>Please follow these instructions carefully during the exam:</p>
          <ol class="list-decimal list-inside">
            <li>Ensure you have a stable internet connection before starting the exam.</li>
            <li>You <strong>cannot</strong> leave the exam window once it begins.</li>
            <li>All questions are mandatory, and skipping is not allowed.</li>
            <li>Keep a calculator ready if necessary.</li>
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
    <div className=" mx-auto p-5 shadow-sm bg-white rounded-lg ">
      {/* Exam Title and Type */}
      <div className="mb-8 ">
        <p className="bg-cyan-100 text-cyan-700 px-4 py-2 text-sm rounded-full inline-block mb-4">
          {examDetails?.syllabus}
        </p>
        <h1 className="text-3xl font-bold text-primary mb-2">{examDetails?.title}</h1>
        <h2 className="text-lg font-medium text-primary-600">{examDetails?.examType}</h2>
      </div>

      {/* Syllabus and Details in a Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3 border-y border-gray-300 mb-8">
        {/* Exam Details with Icons */}
        <div className="flex items-center space-x-2 text-gray-700">
          <FaQuestionCircle className="text-primary" />
          <span className="text-base font-semibold">
            Questions: {examDetails?.totalQuestions}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaClock className="text-primary" />
          <span className="text-base font-semibold">
            Duration: {examDetails?.duration}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <FaStar className="text-primary" />
          <span className="text-base font-semibold">
            Marks: {examDetails?.marks}
          </span>
        </div>
      </div>

      {/* Exam Instructions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
          <FaCheckCircle className="text-primary mr-2" /> Instructions
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: examDetails?.instructions || "" }}
          className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300"
        />
      </div>

      {/* Exam Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
          <FaInfoCircle className="text-primary mr-2" /> Exam Description
        </h3>
        <div
          dangerouslySetInnerHTML={{ __html: examDetails?.description || "" }}
          className="text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-300"
        />
      </div>

      {/* Start Exam Button */}
      <button
        onClick={() => alert(`Starting exam: ${examDetails?.title}`)}
        className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition-all duration-200"
      >
        Start Exam
      </button>
    </div>
  );
}
