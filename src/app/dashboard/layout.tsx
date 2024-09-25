"use client";

import { useState } from "react";
import Header from "@/components/DashboardHeader";
import Footer from "@/components/DashboardFooter";
import Sidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        {/* Full page layout with flexbox */}
        <div className="flex flex-col flex-1 min-h-screen">
          {/* Dashboard Header */}
          <Header toggleSidebar={toggleSidebar} />

          <div className="flex flex-1">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8 ">
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
