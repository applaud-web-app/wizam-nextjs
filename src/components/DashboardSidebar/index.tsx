"use client"; // Ensures this runs on the client-side

import Link from "next/link";
import { FiHome, FiEdit, FiBookOpen, FiList, FiCheckSquare, FiBook, FiBarChart } from "react-icons/fi";
import { TfiIdBadge } from "react-icons/tfi";
import { MdOutlinePayment, MdLogout } from "react-icons/md";
import Cookies from "js-cookie";

interface SidebarProps {
  isSyllabusEnabled: boolean; // Whether the syllabus is enabled
  isOpen: boolean; // Whether the sidebar is open
  toggleSidebar: () => void; // Function to toggle the sidebar open/close
}

export default function Sidebar({ isSyllabusEnabled, isOpen, toggleSidebar }: SidebarProps) {
  return (
    <>
      {/* Sidebar overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white text-gray-900 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static shadow-lg`}
      >
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 lg:hidden mb-5">Dashboard</h2>

          {/* Syllabus Section */}
          <div className="mt-3 p-3 bg-gray-100 border-l-4 border-defaultcolor rounded-md">
           
            <div className="flex items-center">
              <FiBookOpen className="text-defaultcolor mr-2" />
              <p className="text-gray-900 font-semibold">
                {isSyllabusEnabled ? Cookies.get("category_name") : "No syllabus selected"}
              </p>
            </div>

            <Link
              href="/dashboard/change-syllabus"
              className="flex items-center mt-2 px-4 py-2 text-sm bg-gray-200 font-medium text-gray-700 hover:bg-gray-300 rounded-md transition"
            >
              <FiEdit className="mr-3" /> Change Syllabus
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-500">Main</h3>
            <nav className="mt-4 space-y-2">
              <Link
                href={isSyllabusEnabled ? "/dashboard" : "#"}
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  isSyllabusEnabled ? "hover:bg-gray-200" : "cursor-not-allowed opacity-50"
                }`}
              >
                <FiHome className="mr-3" /> Dashboard
              </Link>
              <Link
                href={isSyllabusEnabled ? "/dashboard/all-exams" : "#"}
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  isSyllabusEnabled ? "hover:bg-gray-200" : "cursor-not-allowed opacity-50"
                }`}
              >
                <FiList className="mr-3" /> Exams
              </Link>
              <Link
                href={isSyllabusEnabled ? "/dashboard/quizzes" : "#"}
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  isSyllabusEnabled ? "hover:bg-gray-200" : "cursor-not-allowed opacity-50"
                }`}
              >
                <FiCheckSquare className="mr-3" /> Quizzes
              </Link>
              <Link
                href={isSyllabusEnabled ? "/dashboard/learn-and-practice" : "#"}
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  isSyllabusEnabled ? "hover:bg-gray-200" : "cursor-not-allowed opacity-50"
                }`}
              >
                <FiBook className="mr-3" /> Learn & Practice
              </Link>
              <Link
                href={isSyllabusEnabled ? "/dashboard/my-progress" : "#"}
                className={`flex items-center px-4 py-2 rounded-md transition ${
                  isSyllabusEnabled ? "hover:bg-gray-200" : "cursor-not-allowed opacity-50"
                }`}
              >
                <FiBarChart className="mr-3" /> My Progress
              </Link>
            </nav>
          </div>

          {/* Settings */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-500">Settings</h3>
            <nav className="mt-4 space-y-2">
              <Link
                href="/dashboard/my-subscription"
                className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-md transition"
              >
                <TfiIdBadge className="mr-3" /> My Subscriptions
              </Link>
              <Link
                href="/dashboard/my-payments"
                className="flex items-center px-4 py-2 hover:bg-gray-200 rounded-md transition"
              >
                <MdOutlinePayment className="mr-3" /> My Payments
              </Link>
              <Link
                href="/logout"
                className="flex items-center px-4 py-2 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition"
              >
                <MdLogout className="mr-3" /> Logout
              </Link>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
