// app/dashboard/all_exam/[slug]/page.tsx

"use client"; // Ensure this component is client-side rendered

import { useEffect, useState } from 'react';

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
  'math-exams': [
    { title: 'Algebra Basics', questions: 20, time: '1 hr', marks: 100 },
    { title: 'Advanced Geometry', questions: 25, time: '1.5 hrs', marks: 150 },
  ],
  'science-exams': [
    { title: 'Physics Basics', questions: 30, time: '1 hr', marks: 120 },
    { title: 'Chemistry Essentials', questions: 20, time: '1 hr', marks: 100 },
  ],
  'literature-exams': [
    { title: 'Shakespeare Studies', questions: 40, time: '2 hrs', marks: 200 },
    { title: 'Modern Literature', questions: 30, time: '1.5 hrs', marks: 150 },
  ],
  // Add more slug-based exam data here...
};

export default function ExamDetailPage({ params }: { params: { slug: string } }) {
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
  const formattedSlug = slug ? slug.replace(/-/g, ' ') : '';

  // If no exams are found for the current slug
  if (!slug || exams.length === 0) {
    return <div className="p-5">No exams found for this category.</div>;
  }

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl font-bold mb-6 capitalize">{formattedSlug}</h1>
      
      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold mb-3">{exam.title}</h2>
            <p><strong>Number of Questions:</strong> {exam.questions}</p>
            <p><strong>Time:</strong> {exam.time}</p>
            <p><strong>Marks:</strong> {exam.marks}</p>
            <p><strong>Exam Type:</strong> {formattedSlug}</p>
            <button
              onClick={() => alert(`Start Exam for: ${exam.title}`)}
              className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Start Exam
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
