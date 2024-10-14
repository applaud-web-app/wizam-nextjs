"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Pagination } from "flowbite-react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import Loader from "../Common/Loader"; // Import Loader component
import NoData from "../Common/NoData"; // Import NoData component
import { useSiteSettings } from "@/context/SiteContext"; // Import the SiteContext to use site settings

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [examPacks, setExamPacks] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedExamPack, setSelectedExamPack] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { siteSettings } = useSiteSettings(); // Use site settings from SiteContext

  // Fetch exams and courses data from the API
  useEffect(() => {
    const fetchExamsAndCourses = async () => {
      try {
        // Fetch all exams
        const examResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/exams`
        );
        // Fetch all courses
        const courseResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/course`
        );

        if (examResponse.data.status && courseResponse.data.status) {
          setExams(examResponse.data.data);
          setFilteredExams(examResponse.data.data); // Show all exams by default
          setCourses(courseResponse.data.data);
        } else {
          setError("Failed to fetch data.");
        }
      } catch (error) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamsAndCourses();
  }, []);

  // Handle course change
  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedExamPack(""); // Reset exam pack on course change

    if (courseId) {
      try {
        // Fetch exam packs based on the selected course
        const examPackResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/course-pack/${courseId}`
        );
        if (examPackResponse.data.status) {
          setExamPacks(examPackResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching exam packs:", error);
      }
    } else {
      setExamPacks([]);
    }
  };

  // Handle submit to filter exams
  const handleFilterSubmit = () => {
    let filtered = exams;

    if (selectedCourse) {
      filtered = filtered.filter((exam: any) => exam.course_id === selectedCourse);
    }

    if (selectedExamPack) {
      filtered = filtered.filter(
        (exam: any) => exam.exam_pack_id === selectedExamPack
      );
    }

    setFilteredExams(filtered);
    setCurrentPage(1); // Reset pagination to the first page
  };

  // Truncate long strings for title or description
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  // Get the exams to display on the current page
  const currentExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredExams.length);

  // Function to calculate the strike price (20% increase)
  const calculateStrikePrice = (price: number): number => {
    return price * 1.2; // 20% increase
  };

  return (
    <section className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="mb-8 grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-700 md:col-span-1 md:text-xl lg:text-2xl">
            Search for Exams
          </h2>

          {/* Select Inputs */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <select
              id="selectCourse"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select Course</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              id="selectExamPack"
              value={selectedExamPack}
              onChange={(e) => setSelectedExamPack(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select Course Plan</option>
              {examPacks.map((pack: any) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <button
            onClick={handleFilterSubmit}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-secondary transition duration-300 ease-in-out hover:bg-secondary hover:text-primary"
          >
            Filter
          </button>
        </div>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        {/* Exam Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : currentExams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {currentExams.map((exam: any) => (
              <Link href={`/exams/${exam.slug}`} key={exam.slug}>
                <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg cursor-pointer h-full">
                  {/* Image */}
                  <Image
                    src={exam.img_url}
                    width={500}
                    height={300}
                    alt={`Exam Image for ${exam.title}`}
                    className="h-[200px] w-full object-cover"
                  />
                  <div className="flex flex-col justify-between flex-grow p-6">
                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {exam.title} {/* Limit to 40 characters */}
                    </h3>

                    {/* Description */}
                    <p
                      className="mb-4 text-gray-600 flex-grow"
                      dangerouslySetInnerHTML={{
                        __html: truncateText(exam.description, 230),
                      }}
                    />

                    {/* Exam Details */}
                    <div className="mb-4 flex justify-between divide-x-2 text-sm text-gray-700">
                      <div>
                        <span className="block font-bold">Duration</span>
                        <span>{exam.exam_duration || "N/A"}</span>
                      </div>
                      <div className="pl-3">
                        <span className="block font-bold">Questions</span>
                        <span>{exam.questions_count || "N/A"}</span>
                      </div>
                      <div className="pl-3">
                        <span className="block font-bold">Total Marks</span>
                        <span>{exam.total_marks || "N/A"}</span>
                      </div>
                    </div>

                    <hr className="mb-4 h-px border-0 bg-gray-200" />

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {exam.is_free ? (
                          <span className="text-xl font-bold text-dark">
                            Free
                          </span>
                        ) : (
                          <>
                            <span className="text-xl font-bold text-dark">
                              {siteSettings?.currency_symbol}
                              {Number(exam.price).toFixed(2)}
                            </span>
                            <span className="text-base text-gray-500 line-through">
                              {siteSettings?.currency_symbol}
                              {calculateStrikePrice(Number(exam.price)).toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-primary font-semibold">
                        <FaArrowRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[300px]">
            <NoData message="No exams available" />
          </div>
        )}

        {/* Pagination */}
        {filteredExams.length > itemsPerPage && (
          <>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

            <div className="flex justify-between items-center">
              {/* Showing text */}
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-bold">
                  {startItem}-{endItem}
                </span>{" "}
                of <span className="font-bold">{filteredExams.length}</span>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Exams;
