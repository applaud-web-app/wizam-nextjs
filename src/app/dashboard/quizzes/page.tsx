"use client"; // Add this line to mark the component as a Client Component

import { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { toast } from 'react-toastify'; // Optional: For notifications
import Cookies from 'js-cookie'; // Access cookies
import NoData from '@/components/Common/NoData';
import Loader from '@/components/Common/Loader';
import QuizList from '@/components/Dashboard/QuizList';
import QuizPacks from '@/components/Dashboard/QuizPacks';
import { FaQuestion, FaLightbulb, FaBrain, FaPuzzlePiece, FaKeyboard, FaCode } from 'react-icons/fa';


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


  const quizPacksData = [
    { title: 'General Knowledge Quiz', slug: 'general-knowledge-quiz' },
    { title: 'Science Quiz', slug: 'science-quiz' },
    { title: 'Math Quiz', slug: 'math-quiz' },
    { title: 'History Quiz', slug: 'history-quiz' },
    { title: 'Geography Quiz', slug: 'geography-quiz' },
    { title: 'Programming Quiz', slug: 'programming-quiz' },
  ];

  const icons = [
    <FaQuestion />, <FaLightbulb />, <FaBrain />, <FaPuzzlePiece />, <FaKeyboard />, <FaCode />
  ];

  const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl font-bold mb-5">Available Quiz Packs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
      {quizType.length > 0 ? (
          quizType.map((type, index) => (
          <QuizPacks
            key={index}
            title={type.title}
            icon={getRandomIcon()}
            iconColor="text-secondary"
            slug={type.slug}
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
