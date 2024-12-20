"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Pagination } from "flowbite-react";
import Link from "next/link";
import { FaArrowRight, FaRedo } from "react-icons/fa"; // Add FaRedo for reset icon
import axios from "axios";
import Loader from "../Common/Loader"; // Import Loader component
import NoData from "../Common/NoData"; // Import NoData component
import { useSiteSettings } from "@/context/SiteContext"; // Import the SiteContext to use site settings

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pricingData, setPricingData] = useState([]); // Pricing data for filtering
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPricingPlan, setSelectedPricingPlan] = useState(""); // Selected pricing plan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtering, setFiltering] = useState(false); // State to manage the button loading state
  const itemsPerPage = 9;

  const { siteSettings } = useSiteSettings(); // Use site settings from SiteContext

  // Fetch exams and courses data from the API
  useEffect(() => {
    const fetchExamsAndCourses = async () => {
      try {
        // Fetch all exams
        const examResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams`);
        const courseResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course`);

        if (examResponse.data.status && courseResponse.data.status) {
          const exams = examResponse.data.data;
          setExams(exams);
          setFilteredExams(exams); // Show all exams by default
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

  // Fetch pricing data when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      const fetchPricingData = async () => {
        try {
          const pricingResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/pricing/${selectedCourse}`
          );

          if (pricingResponse.data.status) {
            setPricingData(pricingResponse.data.data);
            setSelectedPricingPlan(""); // Reset pricing plan when a new course is selected
          } else {
            setPricingData([]); // Reset pricing data if the API fails
          }
        } catch (error) {
          setError("An error occurred while fetching pricing data.");
        }
      };

      fetchPricingData();
    }
  }, [selectedCourse]);

  // Handle course change
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedPricingPlan(""); // Reset pricing plan when course changes
  };

  // Handle pricing plan change
  const handlePricingPlanChange = (pricingPlan: string) => {
    setSelectedPricingPlan(pricingPlan);
  };

  // Handle submit to filter exams
  const handleFilterSubmit = () => {
    setFiltering(true); // Show "Filtering..." and disable the button

    setTimeout(async () => {
      try {
        // Ensure both course and pricing plan are selected
        if (selectedCourse && selectedPricingPlan) {
          // Fetch filtered exams from the /exam-filter/{category}/{plan} API
          const filterResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/exam-filter/${selectedCourse}/${selectedPricingPlan}`
          );

          if (filterResponse.data.status) {
            setFilteredExams(filterResponse.data.data);
          } else {
            setFilteredExams([]); // No exams found after applying filter
          }
        } else {
          // If either course or pricing plan is missing, show all exams
          setFilteredExams(exams);
        }
      } catch (error) {
        setError("An error occurred while fetching filtered exams.");
      } finally {
        setFiltering(false); // Re-enable the button after filtering
      }
    }, 500); // Simulate a delay to show the filtering process
  };

  // Reset all filters and fetch all exams again
  const handleReset = async () => {
    setSelectedCourse(""); // Reset course filter
    setSelectedPricingPlan(""); // Reset pricing plan filter
    setPricingData([]); // Clear pricing data
    setFilteredExams(exams); // Reset exams to the full list
    setCurrentPage(1); // Reset to the first page
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
              id="selectPricingPlan"
              value={selectedPricingPlan}
              onChange={(e) => handlePricingPlanChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={pricingData.length === 0}
            >
              <option value="">Select Pricing Plan</option>
              {pricingData.map((plan: any) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}({plan.price})
                </option>
              ))}
            </select>
          </div>

          {/* Filter & Reset Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleFilterSubmit}
              disabled={filtering} // Disable the button while filtering
              className={`w-full rounded-lg ${
                filtering
                  ? "bg-primary cursor-not-allowed" // Change color and cursor when disabled
                  : "bg-primary cursor-pointer"
              } px-6 py-3 font-semibold text-secondary transition duration-300 ease-in-out ${
                filtering ? "" : "hover:bg-secondary hover:text-primary"
              }`}
            >
              {filtering ? "Submitting..." : "Submit"}
            </button>

            <button
              onClick={handleReset}
              className=" rounded-lg bg-secondary cursor-pointer px-6 py-3 font-semibold text-white hover:bg-secondary-dark transition duration-300 ease-in-out flex items-center justify-center gap-2"
            >
              <FaRedo size={20} />
              Reset
            </button>
          </div>
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
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {exam.title} {/* Limit to 40 characters */}
                    </h3>

                    {/* Description */}
                    <p
                      className="mb-4 text-gray-600 flex-grow"
                      dangerouslySetInnerHTML={{
                        __html: truncateText(exam.description, 180),
                      }}
                    />

                    {/* Exam Details */}
                    <div className="flex justify-between divide-x-2 text-sm text-gray-700">
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

                    {/* <hr className="mb-4 h-px border-0 bg-gray-200" /> */}

                    {/* Price */}
                    {/* <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {exam.is_free ? (
                          <span className="text-xl font-bold text-dark">
                            Free
                          </span>
                        ) : (
                          <>
                            <span className="text-2xl font-semibold text-dark">
                              {siteSettings?.currency_symbol}
                              {Number(exam.price).toFixed(2)}
                            </span>
                            <span className="text-base text-gray-500 line-through">
                              {siteSettings?.currency_symbol}
                              {calculateStrikePrice(Number(exam.price)).toFixed(
                                2
                              )}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-defaultcolor font-semibold">
                        <FaArrowRight size={24} />
                      </div>
                    </div> */}
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
