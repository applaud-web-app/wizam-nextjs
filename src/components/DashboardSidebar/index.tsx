import Link from "next/link";
import Image from "next/image";
import { FiHome, FiSettings, FiLogOut, FiUsers, FiFileText, FiPieChart } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <>
      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white lg:translate-x-0 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:w-64`}
        aria-expanded={isOpen}
      >
        <div className="px-4 py-6">
          {/* Dashboard Title */}
          <h2 className="text-2xl font-bold text-white mb-8">Dashboard</h2>

          {/* Profile Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-3">
              <Image
                src="/images/user.png"
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">John Doe</h3>
                <p className="text-sm text-gray-400">Admin</p>
              </div>
            </div>
            <p className="text-sm text-gray-300">Syllabus</p>
            <p className="text-sm text-gray-100">English Coaching</p>
            <Link href="/" className="text-primary underline block mt-1">
              Change Syllabus
            </Link>
          </div>

          {/* Navigation Links */}
          <nav>
            {/* Main Section */}
            <h3 className="text-sm text-gray-400 uppercase tracking-wide">Main</h3>
            <Link href="/dashboard" className="block py-2.5 px-4 text-white hover:bg-gray-800 rounded-md transition">
              <FiHome className="inline mr-2 text-primary" /> Home
            </Link>
            <Link href="/dashboard/analytics" className="block py-2.5 px-4 text-white hover:bg-gray-800 rounded-md transition">
              <FiPieChart className="inline mr-2 text-primary" /> Analytics
            </Link>

            {/* Manage Section */}
            <h3 className="text-sm text-gray-400 mt-6 uppercase tracking-wide">Manage</h3>
            <Link href="/dashboard/users" className="block py-2.5 px-4 text-white hover:bg-gray-800 rounded-md transition">
              <FiUsers className="inline mr-2 text-primary" /> Users
            </Link>
            <Link href="/dashboard/reports" className="block py-2.5 px-4 text-white hover:bg-gray-800 rounded-md transition">
              <FiFileText className="inline mr-2 text-primary" /> Reports
            </Link>

            {/* Settings Section */}
            <h3 className="text-sm text-gray-400 mt-6 uppercase tracking-wide">Settings</h3>
            <Link href="/dashboard/settings" className="block py-2.5 px-4 text-white hover:bg-gray-800 rounded-md transition">
              <FiSettings className="inline mr-2 text-primary" /> Settings
            </Link>
          </nav>

          {/* Logout */}
          <Link href="/logout" className="block mt-8 py-2.5 px-4 text-white hover:bg-gray-800 rounded-md transition">
            <FiLogOut className="inline mr-2 text-primary" /> Logout
          </Link>
        </div>
      </aside>
    </>
  );
}
