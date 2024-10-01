import Link from "next/link";
import { FiHome, FiSettings, FiUsers, FiLogOut, FiFileText, FiPieChart } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 dark:bg-gray-800 text-white transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="px-4 py-8">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <nav className="mt-8 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition">
              <FiHome className="mr-3" /> Home
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition">
              <FiPieChart className="mr-3" /> Analytics
            </Link>
            <Link href="/dashboard/users" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition">
              <FiUsers className="mr-3" /> Users
            </Link>
            <Link href="/dashboard/reports" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition">
              <FiFileText className="mr-3" /> Reports
            </Link>
            <Link href="/dashboard/settings" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md transition">
              <FiSettings className="mr-3" /> Settings
            </Link>
            <Link href="/logout" className="flex items-center px-4 py-2 hover:bg-red-600 rounded-md transition mt-6">
              <FiLogOut className="mr-3" /> Logout
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
