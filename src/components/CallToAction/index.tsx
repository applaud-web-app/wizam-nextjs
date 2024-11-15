"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "../Common/Loader";
import NoData from "../Common/NoData";

// Define the structure of the API response
interface CallToActionData {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
}

const CallToAction = () => {
  const [data, setData] = useState<CallToActionData | null>(null); // State to store API data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the Call to Action data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-started`);
        if (response.data.status && response.data.data) {
          setData(response.data.data);
        } else {
          setError("Failed to load call-to-action data.");
        }
      } catch (error) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />; // Loader while data is being fetched
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>; // Show error message
  }

  if (!data) {
    return <NoData message="No call-to-action data available" />; // NoData component when no data is returned
  }

  return (
    <section className="relative z-10 overflow-hidden bg-[#2179DE] py-20">
      <div className="container mx-auto">
        <div className="text-center">
          {/* Dynamic Heading */}
          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            {data.title}
          </h2>

          {/* Dynamic Description */}
          <p className="mb-8 max-w-xl mx-auto text-lg leading-relaxed text-gray-100">
            {data.description}
          </p>

          {/* Dynamic Button */}
          <Link
            href={data.button_link || "/"} // Fallback to "/" if button_link is empty
            className="primary-button"
          >
            {data.button_text || "Get Started"}
          </Link>
        </div>
      </div>

      {/* Background SVG Decorations */}
    </section>
  );
};

export default CallToAction;
