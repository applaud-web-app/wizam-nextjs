import { FiMenu, FiChevronDown, FiBell } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Left Side: Sidebar Toggle & Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 focus:outline-none lg:hidden"
        >
          <FiMenu size={24} />
        </button>
        <Link href="/dashboard">
          <span className="flex items-center">
            <Image
              src="/images/logo/wizam-logo.png"  // Ensure this is a high-resolution image
              width={100}  // Adjust to the actual dimensions of your logo
              height={40}  // Adjust to the actual dimensions of your logo
              alt="Wizam Logo w-auto h-[64px]"
              className="object-contain"  // Ensures the image scales properly
            />
          </span>
        </Link>
      </div>

      {/* Right Side: Notifications and Profile */}
      <div className="flex items-center space-x-6">
        <button className="relative focus:outline-none">
          <FiBell size={24} className="text-primary" />
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <Image
              src="/images/user.png" // Updated user image
              width={32}  // Adjusted width for a balanced look
              height={32} // Adjusted height for a balanced look
              alt="User Profile"
              className="rounded-full"
            />
            <span className="text-gray-800 font-semibold hidden md:inline">
              John Doe
            </span>
            <FiChevronDown className="text-primary" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
              <Link href="/dashboard/profile">
                <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </span>
              </Link>
              <Link href="/dashboard/settings">
                <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Settings
                </span>
              </Link>
              <Link href="/logout">
                <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Logout
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
