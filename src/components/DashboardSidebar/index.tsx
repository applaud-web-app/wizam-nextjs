import Link from "next/link";
import { FiHome, FiSettings, FiLogOut } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-800 text-white lg:translate-x-0 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:static lg:w-64`}
    >
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <FiHome size={24} />
        </button>
      </div>
      <nav className="mt-10">
        <Link href="/dashboard">
          <span className="block py-2.5 px-4 text-white hover:bg-gray-700">
            <FiHome className="inline mr-2" /> Dashboard Home
          </span>
        </Link>
        <Link href="/dashboard/settings">
          <span className="block py-2.5 px-4 text-white hover:bg-gray-700">
            <FiSettings className="inline mr-2" /> Settings
          </span>
        </Link>
        <Link href="/logout">
          <span className="block py-2.5 px-4 text-white hover:bg-gray-700">
            <FiLogOut className="inline mr-2" /> Logout
          </span>
        </Link>
      </nav>
    </aside>
  );
}
