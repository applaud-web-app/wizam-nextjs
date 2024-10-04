import Link from "next/link";
import { useEffect, useState } from 'react';
import { FiHome, FiEdit, FiBookOpen, FiList, FiCheckSquare, FiBook, FiBarChart } from "react-icons/fi";
import { TfiIdBadge } from "react-icons/tfi";
import { MdOutlinePayment } from "react-icons/md";
import Cookies from 'js-cookie'; // Import js-cookie

interface SidebarProps {
  isSyllabusEnabled: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSyllabusEnabled, isOpen, toggleSidebar }: SidebarProps) {
  const [categoryName, setCategoryName] = useState("No syllabus selected");

  useEffect(() => {
    const categoryId = Cookies.get("category_id");
    const categoryNameCookie = Cookies.get("category_name");

    if (categoryId && categoryNameCookie) {
      setCategoryName(categoryNameCookie);
    } else {
      setCategoryName("No syllabus selected");
    }
  }, [isSyllabusEnabled]); // React to syllabus status change

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 dark:bg-gray-800 text-white transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-white lg:hidden mb-5">Dashboard</h2>
          
          {/* Syllabus Section at the top */}
          <div className="mt-3 p-3 bg-gray-800 border-l-4 border-primary rounded-md">
            <div className="flex items-center">
              <FiBookOpen className="text-primary mr-2" />
              <p className="text-white font-semibold">{categoryName}</p>
            </div>
          
            <Link href="/dashboard/change-syllabus" className="flex items-center mt-2 px-4 py-2 text-sm bg-gray-600 font-medium text-gray-200 hover:bg-gray-700 rounded-md transition">
              <FiEdit className="mr-3" /> Change Syllabus
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-400">Main</h3>
            <nav className="mt-4 space-y-2">
              <Link
                href={isSyllabusEnabled ? "/dashboard" : ""}
                className={`flex items-center px-4 py-2 rounded-md transition ${isSyllabusEnabled ? "hover:bg-gray-700" : "cursor-not-allowed"}`}
              >
                <FiHome className="mr-3" /> Dashboard
              </Link>
              <Link
                href={isSyllabusEnabled ? "/dashboard/exams" : ""}
                className={`flex items-center px-4 py-2 rounded-md transition ${isSyllabusEnabled ? "hover:bg-gray-700" : "cursor-not-allowed"}`}
              >
                <FiList className="mr-3" /> Exams
              </Link>
              <Link
                href={isSyllabusEnabled ? "/dashboard/quizzes" : ""}
                className={`flex items-center px-4 py-2 rounded-md transition ${isSyllabusEnabled ? "hover:bg-gray-700" : "cursor-not-allowed"}`}
              >
                <FiCheckSquare className="mr-3" /> Quizzes
              </Link>
              <Link
                href={isSyllabusEnabled ? "/dashboard/learn-practice" : ""}
                className={`flex items-center px-4 py-2 rounded-md transition ${isSyllabusEnabled ? "hover:bg-gray-700" : "cursor-not-allowed"}`}
              >
                <FiBook className="mr-3" /> Learn & Practice
              </Link>
              <Link
                href="/dashboard/my-progress"
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition"
              >
                <FiBarChart className="mr-3" /> My Progress
              </Link>
            </nav>
          </div>

          {/* Settings */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-400">Settings</h3>
            <nav className="mt-4 space-y-2">
              <Link href="/dashboard/settings" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition">
                <TfiIdBadge className="mr-3" />My Subscriptions
              </Link>
              <Link href="/dashboard/settings" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition">
                <MdOutlinePayment className="mr-3" />My Payments
              </Link>
              <Link href="/logout" className="flex items-center px-4 py-2 hover:bg-red-600 rounded-md transition">
                Logout
              </Link>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
