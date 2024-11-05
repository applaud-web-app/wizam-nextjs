"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Pagination } from "flowbite-react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import Loader from "../Common/Loader";
import NoData from "../Common/NoData";
import { useSiteSettings } from "@/context/SiteContext";

interface Exam {
  img_url: string;
  title: string;
  description: string;
  price: number | null;
  is_free: boolean;
  slug: string;
  exam_duration: string;
  exam_type_id: number;
  subcategory_id: number;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  questions_count: number;
  total_marks: number;
}

interface Course {
  id: number;
  name: string;
}

interface ExamPack {
  id: number;
  name: string;
}

const cache = new Map<string, any>(); // Global cache for storing API responses

const Exams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [examPacks, setExamPacks] = useState<ExamPack[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedExamPack, setSelectedExamPack] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filtering, setFiltering] = useState<boolean>(false);
  const itemsPerPage = 6;

  const { siteSettings } = useSiteSettings();

  // Fetch data and cache responses
  const fetchData = async (url: string, key: string) => {
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const response = await axios.get(url);
      if (response.data.status) {
        cache.set(key, response.data.data);
        return response.data.data;
      } else {
        throw new Error("Failed to fetch data.");
      }
    }
  };

  useEffect(() => {
    const fetchExamsAndCourses = async () => {
      try {
        // Fetch server time
        const timeResponse = await fetchData(`/api/time`, "serverTime");
        const currentTime = new Date(timeResponse.serverTime);

        // Fetch all required data with caching
        const [examsData, coursesData, examPacksData] = await Promise.all([
          fetchData(`${process.env.NEXT_PUBLIC_API_URL}/exams`, "exams"),
          fetchData(`${process.env.NEXT_PUBLIC_API_URL}/course`, "courses"),
          fetchData(`${process.env.NEXT_PUBLIC_API_URL}/course-exam-type`, "examPacks"),
        ]);

        // Filter exams based on the current time  
        const validExams = examsData.filter((exam: Exam) => {
          const examEndDate = exam.end_date ? new Date(`${exam.end_date}T${exam.end_time}`) : null;
          return !examEndDate || examEndDate >= currentTime;
        });

        setExams(validExams);
        setFilteredExams(validExams);
        setCourses(coursesData);
        setExamPacks(examPacksData);
      } catch (error) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamsAndCourses();
  }, []);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedExamPack("");
  };

  const handleFilterSubmit = () => {
    setFiltering(true);

    setTimeout(() => {
      let filtered = exams;

      if (selectedCourse) {
        filtered = filtered.filter(
          (exam: Exam) => exam.subcategory_id === parseInt(selectedCourse)
        );
      }

      if (selectedExamPack) {
        filtered = filtered.filter(
          (exam: Exam) => exam.exam_type_id === parseInt(selectedExamPack)
        );
      }

      setFilteredExams(filtered);
      setCurrentPage(1);
      setFiltering(false);
    }, 500);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const currentExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredExams.length);

  const calculateStrikePrice = (price: number): number => price * 1.2;

  return (
    <section className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="mb-8 grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          <h2 className="text-lg font-bold text-gray-700 md:col-span-1 md:text-xl lg:text-2xl">
            Search for Exams
          </h2>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <select
              id="selectCourse"
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
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
              {examPacks.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleFilterSubmit}
            disabled={filtering}
            className={`w-full rounded-lg ${
              filtering ? "bg-primary cursor-not-allowed" : "bg-primary cursor-pointer"
            } px-6 py-3 font-semibold text-secondary transition duration-300 ease-in-out ${
              filtering ? "" : "hover:bg-secondary hover:text-primary"
            }`}
          >
            {filtering ? "Filtering..." : "Filter"}
          </button>
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : currentExams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {currentExams.map((exam) => (
              <Link href={`/exams/${exam.slug}`} key={exam.slug}>
                <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg cursor-pointer h-full">
                  <Image
                    src={exam.img_url}
                    width={500}
                    height={300}
                    alt={`Exam Image for ${exam.title}`}
                    className="h-[200px] w-full object-cover"
                  />
                  <div className="flex flex-col justify-between flex-grow p-6">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {truncateText(exam.title, 40)}
                    </h3>
                    <p
                      className="mb-4 text-gray-600 flex-grow"
                      dangerouslySetInnerHTML={{
                        __html: truncateText(exam.description, 180),
                      }}
                    />
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {exam.is_free ? (
                          <span className="text-xl font-bold text-dark">Free</span>
                        ) : (
                          <>
                            <span className="text-2xl font-semibold text-dark">
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
                      <div className="flex items-center text-defaultcolor font-semibold">
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
        {filteredExams.length > itemsPerPage && (
          <>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-bold">{startItem}-{endItem}</span> of <span className="font-bold">{filteredExams.length}</span>
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
