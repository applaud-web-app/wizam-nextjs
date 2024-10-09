"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

// Define the TypeScript interface for the exam object
interface Exam {
  title: string | null;
  duration_mode: string | null;
  exam_duration: string | null;
  is_free: number | null;
  price: string | null;
  total_questions: number | null;
  total_marks: string | null;
  total_time: string | null;
}

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch exams when the component is mounted
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const jwt = Cookies.get("jwt");
        const category_id = Cookies.get("category_id");

        if (!jwt || !category_id) {
          setError("Authentication or category data is missing.");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exam-all`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            category: category_id,
          },
        });

        if (response.data && response.data.data) {
          setExams(response.data.data); // Set the exams data in state
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        setError("Failed to fetch exams from the server.");
      }
    };

    fetchExams();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-5 bg-white shadow-sm rounded-lg mb-8">
      {/* Flexbox container to align heading and "See All" link */}
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <h2 className="text-lg font-bold mb-2 md:mb-0">All Exams</h2>
        <a
          href="#"
          className="text-primary font-semibold flex items-center space-x-2 hover:underline transition duration-200"
        >
          <span>See All</span>
          <FiArrowRight /> {/* React Icon for arrow */}
        </a>
      </div>

      {/* Table container with horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 text-left rounded-tl-lg">S.No</th>
              <th className="p-3 text-left">Exam Title</th>
              <th className="p-3 text-left">Duration Mode</th>
              <th className="p-3 text-left">Is Free</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Total Questions</th>
              <th className="p-3 text-left">Total Marks</th>
              <th className="p-3 text-left">Total Time</th>
              <th className="p-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{exam.title || '-'}</td> 
                <td className="p-4">{exam.duration_mode || '-'}</td> 
                <td className="p-4">{exam.is_free !== null ? (exam.is_free === 1 ? 'Yes' : 'No') : '-'}</td> 
                <td className="p-4">{exam.is_free === 1 || !exam.price ? 'Free' : `$${exam.price}` || '-'}</td> 
                <td className="p-4">{exam.total_questions !== null ? exam.total_questions : '-'}</td> 
                <td className="p-4">{exam.total_marks || '-'}</td> 
                <td className="p-4">{exam.total_time || '-'}</td> 
                <td className="p-4">
                  <Link href={`/dashboard/exam/${exam.title?.toLowerCase().replace(/\s+/g, '-')}`} className="text-primary font-semibold hover:underline">View Exam</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
