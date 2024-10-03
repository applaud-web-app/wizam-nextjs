"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from "react";
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa"; // Icons for the card

// Define the Quiz type
interface Quiz {
  title: string;
  questions: number;
  time: string;
  marks: number;
}

// Define the QuizData type, where each slug corresponds to an array of quizzes
type QuizData = {
  [slug: string]: Quiz[];
};

// Dummy data for quizzes based on slug
const quizData: QuizData = {
  "general-knowledge": [
    { title: "General Knowledge Quiz 1", questions: 15, time: "30 mins", marks: 50 },
    { title: "General Knowledge Quiz 2", questions: 20, time: "45 mins", marks: 70 },
  ],
  "science-quiz": [
    { title: "Physics Quiz", questions: 20, time: "1 hr", marks: 80 },
    { title: "Chemistry Quiz", questions: 25, time: "1.5 hrs", marks: 100 },
  ],
  "literature-quiz": [
    { title: "Shakespeare Quiz", questions: 30, time: "1.5 hrs", marks: 120 },
    { title: "Modern Literature Quiz", questions: 25, time: "1 hr", marks: 100 },
  ],
  "history-quiz": [
    { title: "World History Quiz", questions: 35, time: "2 hrs", marks: 150 },
    { title: "Ancient Civilizations Quiz", questions: 30, time: "1.5 hrs", marks: 120 },
  ],
};

export default function QuizTypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Fetch the quizzes based on the slug from params
  useEffect(() => {
    const { slug } = params;
    setSlug(slug);

    // Fetch the quizzes based on the slug
    const fetchedQuizzes = quizData[slug];
    if (fetchedQuizzes) {
      setQuizzes(fetchedQuizzes);
    } else {
      setQuizzes([]); // Set empty if no data is found
    }
  }, [params]);

  // Handle case where slug is not a string
  const formattedSlug = slug ? slug.replace(/-/g, " ") : "";

  // If no quizzes are found for the current slug
  if (!slug || quizzes.length === 0) {
    return (
      <div className="p-5 bg-white shadow-sm rounded-lg text-center"><h2 className="text-xl font-semibold text-red-500 mb-2">No quizzes found</h2>
      <p className="text-gray-700">
        Sorry, we couldn't find any quizzes for this category. Try exploring other quiz topics or check back later.
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
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-5 rounded-lg  transition duration-300"
          >
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
              {quiz.title}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaQuestionCircle className="text-secondary" />
                <span className="text-sm md:text-base">
                  <strong>Questions:</strong> {quiz.questions}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaClock className="text-secondary" />
                <span className="text-sm md:text-base">
                  <strong>Time:</strong> {quiz.time}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaStar className="text-secondary" />
                <span className="text-sm md:text-base">
                  <strong>Marks:</strong> {quiz.marks}
                </span>
              </div>
              <div className="text-sm md:text-base text-gray-700">
                <strong>Quiz Type:</strong> {formattedSlug}
              </div>
            </div>
            <button
              onClick={() => alert(`Start Quiz for: ${quiz.title}`)}
              className="mt-4 w-full bg-secondary text-white font-semibold py-2 px-4 rounded hover:bg-secondary-dark transition-colors"
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
