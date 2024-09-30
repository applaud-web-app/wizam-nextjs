"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const HomeFilterBox = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [loadingExams, setLoadingExams] = useState<boolean>(false);

  // Fetch courses from the first API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/course`
        );
        if (response.data.status) {
          setCourses(response.data.data);
        } else {
          console.error("Failed to fetch courses.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch exams based on selected course from the second API
  const fetchExams = async (courseId: string) => {
    setLoadingExams(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/course-pack/${courseId}`
      );
      if (response.data.status) {
        setExams(response.data.data);
      } else {
        console.error("Failed to fetch exams.");
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  // Handle course selection and fetch exams
  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    if (courseId) {
      fetchExams(courseId); // Fetch exams based on the selected course
    } else {
      setExams([]); // Reset exams if no course is selected
    }
  };

  return (
    <section className="-mt-[120px] md:-mt-[200px] z-20 relative">
      <div className="container mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 lg:p-8">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Start Exam Preparation from Here
            </h2>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-center">
            {/* Select Course */}
            <div className="w-full">
              <select
                id="selectCourse"
                value={selectedCourse}
                onChange={handleCourseChange}
                className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary transition text-gray-700"
                disabled={loadingCourses}
              >
                {loadingCourses ? (
                  <option>Loading courses...</option>
                ) : (
                  <>
                    <option value="">Select  Course</option>
                    {courses.map((course: any) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Select Exam */}
            <div className="w-full">
              <select
                id="selectExam"
                className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary transition text-gray-700"
                disabled={loadingExams || !selectedCourse}
              >
                {loadingExams ? (
                  <option>Loading exams...</option>
                ) : (
                  <>
                    <option value="">Select  Course Plan</option>
                    {exams.length > 0 ? (
                      exams.map((exam: any) => (
                        <option key={exam.id} value={exam.id}>
                          {exam.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No exams available</option>
                    )}
                  </>
                )}
              </select>
            </div>

            {/* Submit Button */}
            <div className="w-full">
              <button className="w-full rounded-md bg-secondary py-3 px-4 text-white font-medium transition duration-300 ease-in-out hover:bg-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFilterBox;
