"use client"; // Add this line to mark the component as a Client Component

import { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { toast } from 'react-toastify'; // Optional: For notifications
import Cookies from 'js-cookie'; // Access cookies
import Loader from '@/components/Common/Loader';
import NoData from '@/components/Common/NoData';
import { useRouter } from "next/navigation"; // Use router to redirect

interface Syllabus {
  id: number;
  name: string;
  description: string;
}

interface ChangeSyllabusProps {
  updateSyllabusStatus: () => void; // Prop to handle syllabus change
}

export default function ChangeSyllabus({ updateSyllabusStatus }: ChangeSyllabusProps) {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // For redirecting to other pages
  
  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/syllabus`, {
          headers: {
            // Pass the JWT token in the Authorization header
            Authorization: `Bearer ${Cookies.get("jwt")}`, // Access the JWT token from cookies
          },
        });
        if (response.data.status) {
          const fetchedSyllabuses = response.data.data.map((syllabus: any) => ({
            id: syllabus.id,
            name: syllabus.name,
            description: syllabus.description
          }));
          setSyllabuses(fetchedSyllabuses);
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

  const handleSyllabusClick = (name: string, id: number) => {
    Cookies.set("category_name", name);
    Cookies.set("category_id", String(id));
    updateSyllabusStatus(); // Call the function to update syllabus status
    router.push("/dashboard");
  };

  return (
    <div className="dashboard-page">
      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {syllabuses.length > 0 ? (
          syllabuses.map((syllabus) => (
            <button onClick={() => handleSyllabusClick(syllabus.name, syllabus.id)} key={syllabus.id}>
              <div className="block text-start bg-white shadow-sm rounded-lg p-6 hover:shadow-lg border border-gray-50 hover:border-primary transition-shadow duration-300 cursor-pointer">
                <h3 className="text-xl font-semibold mb-2">{syllabus.name}</h3>
                <p className="text-gray-600">{syllabus.description}</p>
              </div>
            </button>
          ))
        ) : (
          <NoData message="No syllabuses available." />
        )}
      </div>
    </div>
  );
}
