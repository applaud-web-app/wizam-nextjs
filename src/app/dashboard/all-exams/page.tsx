"use client"; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import Cookies from 'js-cookie'; // Access cookies
import NoData from '@/components/Common/NoData';
import Loader from '@/components/Common/Loader';
import ExamList from "@/components/Dashboard/ExamList";
import ExamPacks from "@/components/Dashboard/ExamPacks";

interface ExamType {
  title: string;
  slug: string;
}

export default function AllExamPage() {
  const [examType, setExamType] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exam-type`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // Access the JWT token from cookies
          },
        });

        if (response.data.status) {
          const fetchedSyllabuses = response.data.data.map((type: any) => ({
            title: type.name,
            slug: type.slug,
          }));
          setExamType(fetchedSyllabuses);
        } else {
          console.error('Failed to fetch syllabus data');
        }
      } catch (error) {
        console.error('Error fetching syllabus data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabuses();
  }, []);

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <div className="dashboard-page">
       <h1 className="text-3xl lg:text-4xl font-bold mb-6">
        Exams
      </h1>
      <h3 className="text-lg lg:text-2xl font-bold mb-3">Available Exam Packs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {examType.length > 0 ? (
          examType.map((type, index) => (
            <ExamPacks
              key={index} // Use index as the key
              title={type.title}
              imagePath="/images/teeth.png" // Replace with the path to your image
              slug={type.slug}
            />
          ))
        ) : (
          <NoData message="No syllabuses available." />
        )}
      </div>

      <ExamList />
    </div>
  );
}
