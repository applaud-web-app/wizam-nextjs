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
      <div>
        <span className="absolute left-0 top-0">
          <svg
            width="495"
            height="470"
            viewBox="0 0 495 470"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="55"
              cy="442"
              r="138"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="50"
            />
            <circle
              cx="446"
              r="39"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="20"
            />
            <path
              d="M245.406 137.609L233.985 94.9852L276.609 106.406L245.406 137.609Z"
              stroke="white"
              strokeOpacity="0.08"
              strokeWidth="12"
            />
          </svg>
        </span>
        <span className="absolute bottom-0 right-0">
          <svg
            width="493"
            height="470"
            viewBox="0 0 493 470"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="462"
              cy="5"
              r="138"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="50"
            />
            <circle
              cx="49"
              cy="470"
              r="39"
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="20"
            />
            <path
              d="M222.393 226.701L272.808 213.192L259.299 263.607L222.393 226.701Z"
              stroke="white"
              strokeOpacity="0.06"
              strokeWidth="13"
            />
          </svg>
        </span>
      </div>
    </section>
  );
};

export default CallToAction;
