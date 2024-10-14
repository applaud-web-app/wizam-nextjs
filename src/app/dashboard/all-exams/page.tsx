"use client"; // Add this line to mark the component as a Client Component

import { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { toast } from 'react-toastify'; // Optional: For notifications
import Cookies from 'js-cookie'; // Access cookies
import NoData from '@/components/Common/NoData';
import Loader from '@/components/Common/Loader';
import ExamList from "@/components/Dashboard/ExamList";
import ExamPacks from "@/components/Dashboard/ExamPacks";
import { FaBook, FaPencilAlt, FaGraduationCap, FaFlask, FaGlobe, FaCalculator } from 'react-icons/fa';

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
          toast.error('Failed to fetch syllabus data');
        }
      } catch (error) {
        console.error('Error fetching syllabus data:', error);
        toast.error('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabuses();
  }, []);

  if (loading) {
    return <Loader />; // Loading state
  }

  const icons = [
    <FaBook key="book" />, 
    <FaPencilAlt key="pencil" />, 
    <FaGraduationCap key="graduation" />, 
    <FaFlask key="flask" />, 
    <FaGlobe key="globe" />, 
    <FaCalculator key="calculator" />
  ];

  const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl font-bold mb-5">Available Exam Packs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {examType.length > 0 ? (
          examType.map((type, index) => (
            <ExamPacks
              key={index} // Pass index as the key
              title={type.title}
              icon={getRandomIcon()} // Random icon function
              iconColor="text-defaultcolor"
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
