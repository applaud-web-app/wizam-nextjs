"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname hook from next/navigation
import Header from "@/components/DashboardHeader";
import Sidebar from "@/components/DashboardSidebar";
import Footer from "@/components/DashboardFooter";
import { Poppins } from "next/font/google";
import { useSyllabus } from "@/context/SyllabusContext"; // Use Syllabus Context

// Importing the Google font
const poppins = Poppins({
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
  const pathname = usePathname(); // Get the current pathname

  // Function to toggle sidebar open/close state
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Define the base routes where you don't want the sidebar to appear, simulating wildcard paths
  const noSidebarBaseRoutes = ["/dashboard/exam-play", "/dashboard/quiz-play"];
  
  // Check if the current route starts with any of the base routes
  const showSidebar = !noSidebarBaseRoutes.some(route => pathname.startsWith(route));

  return (
    <div className={poppins.className}>
      {/* Outer container with overflow-hidden to prevent unintended overflow */}
      <div className="bg-[#f3f4f6] text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-500 min-h-screen flex flex-col overflow-hidden">
        
        {/* Fixed Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Main Container */}
        <div className="flex flex-1 pt-[70px] overflow-hidden">
          
          {/* Conditionally render Sidebar */}
          {showSidebar && (
            <Sidebar
              isSyllabusEnabled={syllabusStatus} // Dynamically check if the syllabus is enabled from context
              isOpen={sidebarOpen} // Pass the sidebar open/close state
              toggleSidebar={toggleSidebar} // Pass the function to toggle sidebar state
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable area for tables or large content */}
            <main className="flex-1 lg:p-8 p-3">
              <div>
                {children}
              </div>
            </main>

            {/* Footer is pushed to the bottom */}
            <Footer />
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
