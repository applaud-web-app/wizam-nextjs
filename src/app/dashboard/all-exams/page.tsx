"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import NoData from "@/components/Common/NoData";
import Loader from "@/components/Common/Loader";
import ExamList from "@/components/Dashboard/ExamList";
import ExamPacks from "@/components/Dashboard/ExamPacks";

interface ExamType {
  title: string;
  slug: string;
  totalExams: number;       // Total number of exams in the pack
  totalFreeExams: number;   // Total number of free exams in the pack
  totalPaidExams: number;   // Total number of paid exams in the pack
}

export default function AllExamPage() {
  const [examType, setExamType] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exam-type`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // Access JWT token from cookies
          },
        });

        if (response.data.status) {
          const fetchedSyllabuses = response.data.data.map((type: any) => ({
            title: type.name,
            slug: type.slug,
            totalExams: type.total_exams || 0,
            totalFreeExams: type.unpaid_exams || 0,
            totalPaidExams: type.paid_exams || 0,
          }));
          setExamType(fetchedSyllabuses);
        } else {
          console.error("Failed to fetch syllabus data");
        }
      } catch (error) {
        console.error("Error fetching syllabus data:", error);
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
      <h1 className="text-3xl lg:text-4xl font-bold mb-6">Exams</h1>
      <h3 className="text-lg lg:text-2xl font-bold mb-3">Available Exam Packs</h3>
     
      {examType.length > 0 ? (
        <div
          className="grid gap-5 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
        >
          {examType.map((type) => (
            <ExamPacks
              key={type.slug} // Use slug as the unique key
              title={type.title}
              imagePath="/images/teeth.png" // Replace with the correct image path
              slug={type.slug}
              totalExams={type.totalExams} // Pass the total number of exams
              totalFreeExams={type.totalFreeExams} // Pass the total number of free exams
              totalPaidExams={type.totalPaidExams} // Pass the total number of paid exams
            />
          ))}
        </div>
      ) : (
        <NoData message="No exam packs available." />
      )}

      <ExamList />
    </div>
  );
}
