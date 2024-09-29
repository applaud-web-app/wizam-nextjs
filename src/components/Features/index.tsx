"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import SingleFeature from "./SingleFeature";
import SectionTitle from "../Common/SectionTitle";
import { FiBookOpen, FiActivity, FiUserCheck } from "react-icons/fi"; // Import your icons

// Define the Feature type
interface Feature {
  title: string;
  description: string;
}

// Define the API response structure
interface ApiResponse {
  status: boolean;
  data: {
    title: string;
    data: Feature[];
  };
}

// Define icons array to assign to each feature
const icons = [
  <FiBookOpen size={35} className="text-white" />, // Icon for the first feature
  <FiActivity size={35} className="text-white" />, // Icon for the second feature
  <FiUserCheck size={35} className="text-white" />, // Icon for the third feature
];

const Features = () => {
  const [featuresData, setFeaturesData] = useState<Feature[]>([]);
  const [title, setTitle] = useState<string>("How Can I Help You Pass the Exam");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch features data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/help-data`
        );
        if (response.data.status) {
          setTitle(response.data.data.title);
          setFeaturesData(response.data.data.data);
        } else {
          setError("Failed to load features data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="pb-12 pt-20 bg-[#faf9e7] dark:bg-dark lg:pb-[180px] lg:pt-[120px] relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <SectionTitle title={title} align="center" />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, i) => (
            <SingleFeature
              key={i}
              feature={{
                title: feature.title,
                paragraph: feature.description,
                icon: icons[i % icons.length], // Assign icons cyclically based on index
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative Image */}
      <div className="absolute -bottom-8 left-0 right-0 w-full z-10">
        <Image
          src="/images/vector.png"
          alt="decorative vector"
          className="mx-auto w-full"
          width={1920}
          height={300}
        />
      </div>
    </section>
  );
};

export default Features;
