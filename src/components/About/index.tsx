"use client";

import { useEffect, useState } from "react";
import Mission from "./mission";
import Strategy from "./strategy";
import Values from "./values";
import Vision from "./vision";
import Loader from "../Common/Loader"; // Assuming you have a Loader component
import axios from "axios";
import Image from "next/image";


interface AboutData {
  mission: SectionData;
  vision: SectionData;
  values: SectionData;
  strategy: SectionData;
  operate: SectionData;
  bestData: SectionData;
}

interface SectionData {
  title: string;
  description: string;
  image?: string | null;
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch both about data and user profile data when the component mounts
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/about`);
        if (response.data.status) {
          setAboutData(response.data.data);
        } else {
          setError("Failed to fetch about data");
        }
      } catch (error) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };


    fetchAboutData();
  

  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!aboutData) {
    return <p className="text-center">No data available.</p>;
  }

  return (
    <>
      <Mission data={aboutData.mission} />
      <Vision data={aboutData.vision} />
      <Values data={aboutData.values} />
      <Strategy data={aboutData.strategy} operate={aboutData.operate} bestData={aboutData.bestData} />
      <Image className="w-full h-auto" src="/images/about/bottom-banner.png" width={1920} height={500} alt={""} />
    </>
  );
};

export default About;
