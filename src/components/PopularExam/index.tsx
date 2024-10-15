"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "../Common/SectionTitle";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link"; // Import Next.js Link component
import NoData from "../Common/NoData";
import Loader from "../Common/Loader"; // Import the Loader component
import { useSiteSettings } from "@/context/SiteContext"; // Import the context

// Define the PopularExam type for the API data
type PopularExam = {
  img_url: string;
  title: string;
  description: string;
  price: string | null;
  is_free: number;
  slug: string;
};

// Define the SectionData type for the section title and button data
type SectionData = {
  title: string;
  button_text: string;
  button_link: string;
};

const trimDescription = (description: string, maxLength: number): string => {
  const plainText = description.replace(/(<([^>]+)>)/gi, "");
  if (plainText.length > maxLength) {
    return `${plainText.substring(0, maxLength)}...`;
  }
  return plainText;
};

// Function to calculate the strike price with a 20% increase
const calculateStrikePrice = (price: number): number => {
  return price * 1.2; // 20% increase
};

const PopularExams = () => {
  const [exams, setExams] = useState<PopularExam[]>([]); // State to store exams
  const [sectionData, setSectionData] = useState<SectionData | null>(null); // State to store section data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const { siteSettings } = useSiteSettings(); // Access site settings from SiteContext

  // Fetch the popular exams and section data from the API using Axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch exams
        const [examsResponse, sectionResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/popular-exams`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/popular-exam-data`),
        ]);

        if (examsResponse.data.status && examsResponse.data.data) {
          setExams(examsResponse.data.data);
        } else {
          setError("Failed to fetch popular exams.");
        }

        if (sectionResponse.data.status && sectionResponse.data.data) {
          setSectionData(sectionResponse.data.data);
        } else {
          setError("Failed to fetch section data.");
        }
      } catch (error) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container mx-auto">
        {/* Section Title */}
        {sectionData && (
          <SectionTitle title={sectionData.title} align="center" />
        )}

        {/* Content Area */}
        {loading ? (
          // Display skeleton loader while loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="animate-pulse bg-gray-200 h-[300px] w-full rounded-md"></div>
            <div className="animate-pulse bg-gray-200 h-[300px] w-full rounded-md"></div>
            <div className="animate-pulse bg-gray-200 h-[300px] w-full rounded-md"></div>
          </div>
        ) : error ? (
          // Display error message
          <p className="text-center w-full text-lg text-red-600">{error}</p>
        ) : exams.length > 0 ? (
          // Grid Layout for Cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam, i) => (
              <Link
                href={`/exams/${exam.slug}`}
                key={i}
                passHref
                className="block bg-white shadow-md rounded-lg overflow-hidden transition hover:shadow-lg"
              >
                {/* Image */}
                <Image
                  src={exam.img_url}
                  width={500}
                  height={500}
                  alt={`Exam Image for ${exam.title}`}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exam.title}
                  </h3>
                  {/* Description (trimmed to 100 characters) */}
                  <p className="text-gray-600 mb-4">
                    {trimDescription(exam.description, 150)}
                  </p>
                  <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {exam.is_free ? (
                        <span className="text-2xl font-semibold text-gray-900">
                          Free
                        </span>
                      ) : (
                        <>
                          {/* Display the original price */}
                          <span className="text-2xl font-semibold text-gray-900">
                            {siteSettings?.currency_symbol || "£"}
                            {Number(exam.price).toFixed(2)}
                          </span>

                          {/* Display the strike price with 20% increase */}
                          <span className="text-base text-gray-500 line-through">
                            {siteSettings?.currency_symbol || "£"}
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // NoData component centered outside the grid
          <div className="flex justify-center items-center py-8">
            <NoData message="No popular exams available" />
          </div>
        )}

        {/* More Exams Button */}
        {exams.length > 0 && sectionData && (
          <div className="text-center mt-8">
            <Link href={sectionData.button_link}>
              <span className="primary-button">
                {sectionData.button_text}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularExams;
