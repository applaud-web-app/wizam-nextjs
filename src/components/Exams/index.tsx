"use client";

import { useState } from "react";
import Image from "next/image";
import { Pagination } from "flowbite-react";
import Link from "next/link"; 

const Exams = () => {
  // Array of exam data
  const exams = [
    {
      id: 1,
      slug: "dental-nursing-preparation-exam-2024-nebdn",
      title: "Dental Nursing Preparation Exam 2024 NEBDN",
      description:
        "Comprehensive questions and answers crafted by dental professionals to help you pass the NEBDN 2024 exam with confidence.",
      price: "£14.90",
      oldPrice: "£18.90",
      duration: "1.5 Hrs",
      questions: 20,
      totalMarks: 40,
      image: "/images/exam/exam-1.jpg",
    },
    {
      id: 2,
      slug: "pharmacy-technician-certification-exam-2024",
      title: "Pharmacy Technician Certification Exam 2024",
      description:
        "Prepare for the 2024 Pharmacy Technician certification with detailed practice exams and solutions from industry experts.",
      price: "£15.50",
      oldPrice: "£20.00",
      duration: "2 Hrs",
      questions: 30,
      totalMarks: 60,
      image: "/images/exam/exam-1.jpg",
    },
  ];
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Updated to 20 items per page

  // Calculate total pages
  const totalPages = Math.ceil(exams.length / itemsPerPage);

  // Get the exams to display on the current page
  const currentExams = exams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, exams.length);

  return (
    <section className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="mb-8 grid grid-cols-1 items-center gap-4 md:grid-cols-4">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-700 md:col-span-1 md:text-xl lg:text-2xl">
            Search for Exams
          </h2>

          {/* Select Inputs */}
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <select
              id="selectExamPack"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select an Exam Pack</option>
              <option value="pack1">Exam Pack 1</option>
              <option value="pack2">Exam Pack 2</option>
            </select>

            <select
              id="selectExam"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select an Exam</option>
              <option value="exam1">Exam 1</option>
              <option value="exam2">Exam 2</option>
            </select>
          </div>

          {/* Filter Button */}
          <button className="w-full rounded-lg bg-[#63C132] px-6 py-3 font-medium text-white transition duration-300 ease-in-out hover:bg-[#57a628]">
            Filter
          </button>
        </div>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        {/* Exam Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {currentExams.map((exam) => (
            <div
              key={exam.id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg"
            >
              {/* Image */}
              <Image
                src={exam.image}
                width={500}
                height={300}
                alt={`Exam Image for ${exam.title}`}
                className="h-[200px] w-full object-cover"
              />
              <div className="p-6">
                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {exam.title}
                </h3>

                {/* Description */}
                <p className="mb-4 text-gray-600">{exam.description}</p>

                {/* Exam Details */}
                <div className="mb-4 flex justify-between divide-x-2 text-sm text-gray-700">
                  <div>
                    <span className="block font-bold">Duration</span>
                    <span>{exam.duration}</span>
                  </div>
                  <div className="pl-3">
                    <span className="block font-bold">Questions</span>
                    <span>{exam.questions}</span>
                  </div>
                  <div className="pl-3">
                    <span className="block font-bold">Total Marks</span>
                    <span>{exam.totalMarks}</span>
                  </div>
                </div>

                <hr className="mb-4 h-px border-0 bg-gray-200" />

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <span className="text-xl font-semibold text-dark">
                      {exam.price}
                    </span>
                    <span className="text-gray-400 line-through">
                      {exam.oldPrice}
                    </span>
                  </div>

                  <Link href={`/exams/${exam.slug}`}>
                    <span className="flex items-center font-semibold text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        {/* Pagination */}
        <div className="flex justify-between items-center">
          {/* Showing text */}
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-semibold">
              {startItem}-{endItem}
            </span>{" "}
            of <span className="font-semibold">{exams.length}</span>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
};

export default Exams;
