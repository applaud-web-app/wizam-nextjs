"use client"; // Use client-side features

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "../Common/SectionTitle";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link"; // Import Next.js Link component
import NoData from "../Common/NoData";

// Define the PopularExam type for the API data
type PopularExam = {
  img_url: string;
  title: string;
  description: string;
  price: string | null;
  is_free: number;
  slug: string;
};

const trimDescription = (description: string, maxLength: number): string => {
  // Strip HTML tags using a regular expression
  const plainText = description.replace(/(<([^>]+)>)/gi, "");
  if (plainText.length > maxLength) {
    return `${plainText.substring(0, maxLength)}...`;
  }
  return plainText;
};

const PopularExams = () => {
  const [exams, setExams] = useState<PopularExam[]>([]); // State to store exams
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the popular exams from the API using Axios
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("https://wizam.awmtab.in/api/popular-exams");
        if (response.data.status && response.data.data) {
          setExams(response.data.data);
        } else {
          setError("Failed to fetch popular exams.");
        }
      } catch (error) {
        setError("An error occurred while fetching the popular exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <section className="pb-12 pt-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container mx-auto">
        {/* Section Title */}
        <SectionTitle title="Most Popular Exams" align="center" />

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center w-full text-lg text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center w-full text-lg text-red-600">{error}</p>
          ) : exams.length > 0 ? (
            exams.map((exam, i) => (
              <Link href={`/exams/${exam.slug}`} key={i} passHref className="block bg-white shadow-md rounded-lg overflow-hidden transition hover:shadow-lg">
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
                    <div className="flex items-center gap-3">
                      {exam.is_free ? (
                        <span className="text-2xl font-semibold text-gray-900">Free</span>
                      ) : (
                        <span className="text-2xl font-semibold text-gray-900">
                          £{exam.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-primary font-semibold">
                      <FaArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoData message="No popular exams available" />
          )}
        </div>

        {/* More Exams Button */}
        {exams.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/exams">
              <span className="px-6 py-3 rounded-full bg-primary text-white font-medium transition hover:bg-primary-dark">
                More Exams
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularExams;
