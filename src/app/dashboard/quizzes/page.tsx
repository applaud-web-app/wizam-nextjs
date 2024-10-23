"use client"; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Access cookies
import NoData from '@/components/Common/NoData';
import Loader from '@/components/Common/Loader';
import QuizList from '@/components/Dashboard/QuizList';
import QuizPacks from '@/components/Dashboard/QuizPacks';

interface QuizType {
  title: string;
  slug: string;
}

export default function AllQuizPage() {
  const [quizType, setQuizType] = useState<QuizType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz-type`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`, // Access the JWT token from cookies
          },
        });

        if (response.data.status) {
          const fetchedSyllabuses = response.data.data.map((type: any) => ({
            title: type.name,
            slug: type.slug,
          }));
          setQuizType(fetchedSyllabuses);
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
        Quizzes
      </h1>

      <h2 className="text-lg lg:text-2xl font-bold mb-3">Browse Quiz Pack</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {quizType.length > 0 ? (
          quizType.map((type, index) => (
            <QuizPacks
              key={index}
              title={type.title}
              slug={type.slug}
              imagePath="/images/teeth.png" // Replace with the correct image path
            />
          ))
        ) : (
          <NoData message="No syllabuses available." />
        )}
      </div>
      <QuizList />
    </div>
  );
}
