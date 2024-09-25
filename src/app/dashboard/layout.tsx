"use client";

import { useState } from "react";
import Header from "@/components/DashboardHeader";
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
            <main className="flex-1 p-6 lg:p-8">
              {children}
            </main>
          </div>

          {/* Fixed Footer */}
          <footer className="bg-gray-800 text-white py-4 px-3 fixed bottom-0 inset-x-0">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Company Name and Copyright */}
              <div className="text-sm text-gray-400">
                <p>© 2024 Wizam. All rights reserved.</p>
              </div>

              {/* Links */}
              <div className="space-x-6 text-sm">
                <a href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">Terms and Conditions</a>
                <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
