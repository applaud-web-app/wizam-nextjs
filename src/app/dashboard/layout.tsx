"use client";

import { useState } from "react";
import Header from "@/components/DashboardHeader";
import Sidebar from "@/components/DashboardSidebar";
import Footer from "@/components/DashboardFooter";
import { Jost } from "next/font/google";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <html lang="en" className={`${jost.className} light-mode`}>
      <body className="bg-slate-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-500">
        {/* Adjust body padding to account for fixed header */}
        <div className="flex flex-col min-h-screen">
          {/* Header with fixed position */}
          <Header toggleSidebar={toggleSidebar} />

          {/* Main container with header height consideration */}
          <div className="flex flex-1 pt-[70px] overflow-hidden">
            {/* Sidebar navigation */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <main className="flex-1 lg:p-6 p-3 overflow-auto mt-1">
              {children}
            </main>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
