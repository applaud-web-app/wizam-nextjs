"use client";

import { useState } from "react";
import Header from "@/components/DashboardHeader";
import Sidebar from "@/components/DashboardSidebar";
import Footer from "@/components/DashboardFooter";
import { Jost } from "next/font/google";
import { SyllabusProvider, useSyllabus } from "@/context/SyllabusContext"; // Use Syllabus Context

// Importing the Google font
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// TypeScript interface for the children prop
interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // State to control sidebar open/close
  const { syllabusStatus } = useSyllabus(); // Get syllabus status from context (dynamically updated)

  // Function to toggle sidebar open/close state
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    
    <div className={jost.className}>
      <div className="bg-slate-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-500">
        <div className="flex flex-col min-h-screen">
          
          {/* Fixed Header */}
          <Header toggleSidebar={toggleSidebar} />

          {/* Main Container */}
          <div className="flex flex-1 pt-[70px] overflow-hidden">
            
            {/* Sidebar navigation */}
            <Sidebar
              isSyllabusEnabled={syllabusStatus} // Dynamically check if the syllabus is enabled from context
              isOpen={sidebarOpen} // Pass the sidebar open/close state
              toggleSidebar={toggleSidebar} // Pass the function to toggle sidebar state
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto mt-1">
              <main className="lg:p-6 p-3 ">
                {children}
              </main>

              {/* Footer */}
              <Footer />
              
            </div>
           
          </div>

        
        </div>
      </div>
    </div>
   
  );
}
