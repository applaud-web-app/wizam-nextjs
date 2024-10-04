"use client"; // Ensure this runs on the client-side

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";

// Define the context type
interface SyllabusContextType {
  syllabusStatus: boolean;
  updateSyllabusStatus: () => void;
}

// Create the context
const SyllabusContext = createContext<SyllabusContextType>({
  syllabusStatus: false,
  updateSyllabusStatus: () => {},
});

// Syllabus Provider to wrap your application and manage state
export function SyllabusProvider({ children }: { children: ReactNode }) {
  const [syllabusStatus, setSyllabusStatus] = useState<boolean>(false);

  // Function to check and update syllabus status based on cookies
  const updateSyllabusStatus = () => {
    const categoryId = Cookies.get("category_id");
    const categoryName = Cookies.get("category_name");

    // Set status to true if both category_id and category_name exist
    setSyllabusStatus(!!categoryId && !!categoryName);
  };

  // Check and set initial syllabus status when the component mounts
  useEffect(() => {
    updateSyllabusStatus();
  }, []); // Empty dependency array ensures it runs only on component mount

  return (
    <SyllabusContext.Provider value={{ syllabusStatus, updateSyllabusStatus }}>
      {children}
    </SyllabusContext.Provider>
  );
}

// Custom hook to use the Syllabus context in other components
export function useSyllabus() {
  return useContext(SyllabusContext);
}
