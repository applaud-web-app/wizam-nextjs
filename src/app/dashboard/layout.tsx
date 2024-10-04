"use client";

import { useEffect,useState } from "react";
import Header from "@/components/DashboardHeader";
import Sidebar from "@/components/DashboardSidebar";
import Footer from "@/components/DashboardFooter";
import { Jost } from "next/font/google";
import Cookies from 'js-cookie'; // Import js-cookie

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syllabusStatus, setSyllabusStatus] = useState<boolean>(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Function to update syllabus status based on cookies
  const updateSyllabusStatus = () => {
    const categoryId = Cookies.get("category_id");
    const categoryName = Cookies.get("category_name");
    setSyllabusStatus(!!(categoryId && categoryName));
  };

  useEffect(() => {
    updateSyllabusStatus();
  }, []);

  return (
    <div className={`${jost.className} light-mode`}>
      <div className="bg-slate-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-500">
        {/* Adjust body padding to account for fixed header */}
        <div className="flex flex-col min-h-screen">
          {/* Header with fixed position */}
          <Header toggleSidebar={toggleSidebar} />

          {/* Main container with header height consideration */}
          <div className="flex flex-1 pt-[70px] overflow-hidden">
            {/* Sidebar navigation */}
            <Sidebar isSyllabusEnabled={syllabusStatus} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            {/* Main content area */}
            <main className="flex-1 lg:p-6 p-3 overflow-auto mt-1">
              {children}
            </main>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
