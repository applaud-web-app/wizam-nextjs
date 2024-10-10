"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSyllabus } from '@/context/SyllabusContext';
import Loader from '@/components/Common/Loader'; // Import Loader component
import NoData from '@/components/Common/NoData'; // Import NoData component

interface Syllabus {
  id: number;
  name: string;
  description: string;
}

export default function ChangeSyllabus() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { updateSyllabusStatus } = useSyllabus(); // Use context to update syllabus status

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get("jwt");
        if (!token) throw new Error("Authorization token not found.");

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/syllabus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setSyllabuses(response.data.data);
        } else {
          throw new Error("Failed to fetch syllabus data");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred while fetching data";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabuses();
  }, []);

  function handleSyllabusClick(name: string, id: number) {
    // Set cookies when the user selects a new syllabus
    Cookies.set("category_name", name);
    Cookies.set("category_id", String(id));
  
    // Update the syllabus status in the context
    updateSyllabusStatus(); // This is now correctly called from the hook
  
    // Redirect to the dashboard or anywhere else
    router.push("/dashboard");
  }

  if (loading) {
    return <Loader />; // Show Loader while data is loading
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (syllabuses.length === 0) {
    return <NoData message="No syllabus available." />; // Show NoData component if no syllabuses
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {syllabuses.map((syllabus) => (
        <button
          key={syllabus.id}
          onClick={() => handleSyllabusClick(syllabus.name, syllabus.id)}
          className="block bg-white shadow p-6 rounded-lg hover:shadow-lg border border-gray-50 hover:border-primary transition-all duration-300 cursor-pointer"
        >
          <h3 className="text-xl font-semibold mb-2">{syllabus.name}</h3>
          <p className="text-gray-600">{syllabus.description}</p>
        </button>
      ))}
    </div>
  );
}
