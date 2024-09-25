"use client";

import { useState } from "react";
import Header from "@/components/DashboardHeader";
import Footer from "@/components/DashboardFooter";
import Sidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <html lang="en">
      <body className="bg-gray-100 flex flex-col min-h-screen">
        {/* Dashboard Header */}
        <Header toggleSidebar={toggleSidebar} />

        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <main className="flex-1 p-6 ">
            {children}
          </main>
        </div>

        {/* Dashboard Footer */}
        <Footer />
      </body>
    </html>
  );
}
