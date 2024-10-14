"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";

interface ExamDetailProps {
  params: {
    slug: string;
  };
}

const ExamDetailPage = ({ params }: ExamDetailProps) => {
  const { slug } = params;
  const [exam, setExam] = useState<any>(null); // State to store the exam details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch exam details from API based on the slug
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exam/${slug}`
        );

        if (response.data.status && response.data.data) {
          setExam(response.data.data);
        } else {
          setError("Failed to fetch exam details.");
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
        setError("An error occurred while fetching the exam details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [slug]);

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader />
      </div>
    );
  }

  // If there's an error or no exam found, return 404 or error message
  if (error || !exam) {
    notFound();
    return <NoData message={error || "Exam not found."} />;
  }

  return (
    <main>
      <Breadcrumb pageName={exam.title} />
      <section className="container relative z-10 mx-auto -mt-12 pb-20">
        <div className="mb-3 rounded-lg bg-white shadow-lg">
        
   

          {/* Exam Header Section */}
          <div className="flex flex-col items-center space-y-4 p-6 sm:flex-row sm:justify-around sm:space-x-8 sm:space-y-0">
            <div className="text-center">
              <p className="text-lg text-gray-500">Available Between</p>
              <p className="text-xl font-bold text-blue-500">
                {exam.availableFrom || "N/A"} - {exam.availableTo || "N/A"}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

            <div className="text-center">
              <p className="text-lg text-gray-500">Duration</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.exam_duration || "N/A"}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

            <div className="text-center">
              <p className="text-lg text-gray-500">Questions</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.questions_count || "N/A"}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden h-12 w-px bg-gray-200 sm:block"></div>

            <div className="text-center">
              <p className="text-lg text-gray-500">Total Marks</p>
              <p className="text-xl font-bold text-gray-900">
                {exam.total_marks || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Exam Instructions Section */}
        <div className="mt-8 rounded-lg border bg-white p-6">
          <div
            className="exam-instructions"
            dangerouslySetInnerHTML={{ __html: exam.description }}
          ></div>

          {/* Checkbox and Start Exam Button */}
          <div className="mt-8">
            <div className="flex items-start">
              <input
                id="instruction-checkbox"
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-secondary transition duration-200 ease-in-out hover:cursor-pointer focus:ring-secondary"
              />
              <label
                htmlFor="instruction-checkbox"
                className="ml-3 text-sm font-medium text-gray-800 hover:cursor-pointer"
              >
                I have read all the instructions.
              </label>
            </div>

            <button className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-secondary  transition duration-300 ease-in-out hover:bg-secondary hover:text-secondary focus:ring-4 focus:ring-primary">
              Start Exam
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExamDetailPage;
