"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from "react";
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa"; // Icons for the card

// Define the Exam type
interface Exam {
  title: string;
  questions: number;
  time: string;
  marks: number;
}

// Define the ExamData type, where each slug corresponds to an array of exams
type ExamData = {
  [slug: string]: Exam[];
};

// Dummy data for exams based on slug
const examData: ExamData = {
  "math-exams": [
    { title: "Algebra Basics", questions: 20, time: "1 hr", marks: 100 },
    { title: "Advanced Geometry", questions: 25, time: "1.5 hrs", marks: 150 },
    {
      title: "Calculus Introduction",
      questions: 30,
      time: "2 hrs",
      marks: 200,
    },
    {
      title: "Probability & Statistics",
      questions: 35,
      time: "1.5 hrs",
      marks: 180,
    },
  ],
  "science-exams": [
    { title: "Physics Basics", questions: 30, time: "1 hr", marks: 120 },
    { title: "Chemistry Essentials", questions: 20, time: "1 hr", marks: 100 },
    { title: "Biology Fundamentals", questions: 40, time: "2 hrs", marks: 220 },
    { title: "Environmental Science", questions: 25, time: "1 hr", marks: 130 },
  ],
  "literature-exams": [
    { title: "Shakespeare Studies", questions: 40, time: "2 hrs", marks: 200 },
    { title: "Modern Literature", questions: 30, time: "1.5 hrs", marks: 150 },
    { title: "Romantic Poetry", questions: 25, time: "1 hr", marks: 120 },
    {
      title: "American Literature",
      questions: 35,
      time: "1.5 hrs",
      marks: 180,
    },
  ],
  "history-exams": [
    { title: "World History", questions: 50, time: "3 hrs", marks: 300 },
    {
      title: "Ancient Civilizations",
      questions: 30,
      time: "1.5 hrs",
      marks: 150,
    },
  ],
};

export default function ExamTypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);

  // Fetch the exams based on the slug from params
  useEffect(() => {
    const { slug } = params;
    setSlug(slug);

    // Fetch the exams based on the slug
    const fetchedExams = examData[slug];
    if (fetchedExams) {
      setExams(fetchedExams);
    } else {
      setExams([]); // Set empty if no data is found
    }
  }, [params]);

  // Handle case where slug is not a string
  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

  // If no exams are found for the current slug
  if (!slug || exams.length === 0) {
    return (
      <div className="p-5 bg-white shadow-sm rounded-lg text-center"><h2 className="text-xl font-semibold text-red-500 mb-2">No Exams found</h2>
      <p className="text-gray-700">
        Sorry, we couldn't find any exam for this category. Try exploring other quiz topics or check back later.
      </p></div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="text-3xl font-bold mb-6 text-black capitalize">
        {formattedSlug}
      </h1>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
        {exams.map((exam, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-5 rounded-lg  transition duration-300"
          >
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
              {exam.title}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaQuestionCircle className="text-primary" />
                <span className="text-sm md:text-base">
                  <strong>Questions:</strong> {exam.questions}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaClock className="text-primary" />
                <span className="text-sm md:text-base">
                  <strong>Time:</strong> {exam.time}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaStar className="text-primary" />
                <span className="text-sm md:text-base">
                  <strong>Marks:</strong> {exam.marks}
                </span>
              </div>
              <div className="text-sm md:text-base text-gray-700">
                <strong>Exam Type:</strong> {formattedSlug}
              </div>
            </div>
            <button
              onClick={() => alert(`Start Exam for: ${exam.title}`)}
              className="mt-4 w-full bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-primary-dark transition-colors"
            >
              Start Exam
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
