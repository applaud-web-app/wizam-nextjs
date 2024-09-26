"use client";

import { useState } from "react";
import Header from "@/components/DashboardHeader";
import Sidebar from "@/components/DashboardSidebar";
import Footer from "@/components/DashboardFooter";


import { Jost } from 'next/font/google';

const jost = Jost({
  subsets: ['latin'],
  weight: '400',  // Only load weight 400
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <html lang="en" className={jost.className}> 
      <body className="bg-gray-50 flex flex-col min-h-screen">
        {/* Full page layout with flexbox */}
        <div className="flex flex-col flex-1">
          {/* Dashboard Header */}
          <Header toggleSidebar={toggleSidebar} />

          <div className="flex flex-1">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8">
              {children}
            </main>
          </div>

          {/* Footer outside the flex-1 div */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
