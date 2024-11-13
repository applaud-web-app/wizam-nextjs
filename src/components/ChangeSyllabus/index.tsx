"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSyllabus } from '@/context/SyllabusContext';
import Loader from '@/Components/Common/Loader'; // Import Loader component
import NoData from '@/Components/Common/NoData'; // Import NoData component

interface Syllabus {
  id: number;
  name: string;
}

export default function ChangeSyllabus() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSyllabus, setActiveSyllabus] = useState<string | null>(null); // To track the active syllabus
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
          // Retrieve the active syllabus from cookies
          const activeCategoryName = Cookies.get("category_name");
          setActiveSyllabus(activeCategoryName || null);
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
    updateSyllabusStatus();

    // Redirect to the dashboard
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
    <div className='bg-white p-3 lg:p-6 rounded-lg'>
  <div className="grid grid-cols-1 gap-5">
    {syllabuses.map((syllabus) => (
      <button
        key={syllabus.id}
        onClick={() => handleSyllabusClick(syllabus.name, syllabus.id)}
        className={`group block p-6 rounded-lg border cursor-pointer transition 
          ${
            activeSyllabus === syllabus.name
              ? 'bg-defaultcolor text-white border-defaultcolor'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-defaultcolor hover:border-defaultcolor'
          }`}
      >
        <h3
          className={`text-2xl lg:text-4xl font-semibold mb-2 transition 
            ${activeSyllabus === syllabus.name ? 'text-white' : 'text-gray-500'} 
            group-hover:text-white`}
        >
          {syllabus.name}
        </h3>
      </button>
    ))}
  </div>
</div>


  
  );
}
