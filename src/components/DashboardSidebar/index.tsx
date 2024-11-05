"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiEdit, FiBookOpen, FiList, FiCheckSquare, FiBook, FiBarChart } from "react-icons/fi";
import { TfiIdBadge } from "react-icons/tfi";
import { MdOutlinePayment, MdLogout } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

interface SidebarProps {
  isSyllabusEnabled: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSyllabusEnabled, isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => (pathname === href ? "bg-defaultcolor text-white" : "");

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      if (response.status === 200) {
        Cookies.remove("jwt");
        toast.success("Logout successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.push("/signin");
      } else if (response.data.status === false && response.data.message === "Unauthorized") {
        Cookies.remove("jwt");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white text-gray-900 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static shadow-lg`}
      >
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 lg:hidden mb-5">Dashboard</h2>

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
              onClick={toggleSidebar}
            >
              <FiEdit className="mr-3" /> Change Syllabus
            </Link>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-500">Main</h3>
            <nav className="mt-4 space-y-2">
              <Link href="/dashboard" onClick={toggleSidebar}>
                <span
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    isSyllabusEnabled ? `${isActive("/dashboard")} hover:bg-gray-200` : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <FiHome className="mr-3" /> Dashboard
                </span>
              </Link>
              <Link href="/dashboard/all-exams" onClick={toggleSidebar}>
                <span
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    isSyllabusEnabled ? `${isActive("/dashboard/all-exams")} hover:bg-gray-200` : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <FiList className="mr-3" /> Exams
                </span>
              </Link>
              <Link href="/dashboard/quizzes" onClick={toggleSidebar}>
                <span
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    isSyllabusEnabled ? `${isActive("/dashboard/quizzes")} hover:bg-gray-200` : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <FiCheckSquare className="mr-3" /> Quizzes
                </span>
              </Link>
              <Link href="/dashboard/learn-and-practice" onClick={toggleSidebar}>
                <span
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    isSyllabusEnabled ? `${isActive("/dashboard/learn-and-practice")} hover:bg-gray-200` : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <FiBook className="mr-3" /> Learn & Practice
                </span>
              </Link>
              <Link href="/dashboard/my-progress" onClick={toggleSidebar}>
                <span
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    isSyllabusEnabled ? `${isActive("/dashboard/my-progress")} hover:bg-gray-200` : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <FiBarChart className="mr-3" /> My Progress
                </span>
              </Link>
            </nav>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase text-gray-500">Settings</h3>
            <nav className="mt-4 space-y-2">
              <Link href="/dashboard/my-subscription" onClick={toggleSidebar}>
                <span className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-md transition ${isActive("/dashboard/my-subscription")}`}>
                  <TfiIdBadge className="mr-3" /> My Subscriptions
                </span>
              </Link>
              <Link href="/dashboard/my-payments" onClick={toggleSidebar}>
                <span className={`flex items-center px-4 py-2 hover:bg-gray-200 rounded-md transition ${isActive("/dashboard/my-payments")}`}>
                  <MdOutlinePayment className="mr-3" /> My Payments
                </span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className="flex items-center px-4 py-2 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition w-full text-start"
              >
                <MdLogout className="mr-3" /> Logout
              </button>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
