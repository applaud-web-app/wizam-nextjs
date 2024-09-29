"use client"; // Using client-side rendering

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios"; // Import axios for API calls
import Loader from "../Common/Loader"; // Custom Loader component
import NoData from "../Common/NoData"; // Custom NoData component

// Define the structure of the API response
interface WhyChooseData {
  title: string;
  data: string[];
}

const WhyChoose = () => {
  const [whyChooseData, setWhyChooseData] = useState<WhyChooseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/whyus-data`);
        if (response.data.status) {
          setWhyChooseData(response.data.data);
        } else {
          setError("Failed to load data.");
        }
      } catch (err) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />; // Show custom Loader component while fetching data
  }

  if (error) {
    return <NoData message="Sorry, we couldn't load the data. Please try again later." />; // Custom error message
  }

  if (!whyChooseData || !whyChooseData.data.length) {
    return <NoData message="No reasons found to choose us at the moment. Please check back later!" />; // Custom no-data message
  }

  return (
    <section className="pb-20 pt-20">
      <div className="container mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-[50px] mb-4 drop-shadow-xl">
            {whyChooseData?.title || "Why Choose"}
          </h2>
          <div className="flex justify-center items-center">
            <Image
              src="/images/logo/choose-logo.png"
              alt="wizam logo"
              width={348}
              height={80}
            />
          </div>
        </div>

        {/* Grid Layout for Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {whyChooseData?.data.map((item, index) => (
            <div
              key={index}
              className="bg-slate-100 border border-slate-300 rounded-[20px] p-6 flex items-center"
            >
              <Image
                src="/images/check-mark.png"
                alt="check mark"
                className="mr-4"
                width={40}
                height={40}
              />
              <span className="text-lg font-semibold text-gray-800">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
