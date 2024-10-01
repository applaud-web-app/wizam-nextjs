import { FiMenu, FiChevronDown, FiLogOut, FiSettings, FiGlobe, FiUser  } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 fixed top-0 left-0 w-full z-50 flex justify-between items-center h-[70px]">
      <div className="flex items-center space-x-4">
        {/* Sidebar toggle button for mobile */}
        <button
          onClick={toggleSidebar}
          className="text-gray-800 dark:text-gray-300 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={24} />
        </button>

        {/* Logo with responsive behavior */}
        <div className="flex items-center">
          <Image
            src="/images/logo/wizam-logo.png"
            width={120}
            height={40}
            alt="Logo"
            className="object-contain"
          />
        </div>
      </div>

      {/* Website Icon & Profile */}
      <div className="flex items-center space-x-6">
        {/* Website Icon (using React Icons) */}
        <FiGlobe size={24} className="text-primary dark:text-gray-300" aria-label="Website" />

        {/* Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
            aria-expanded={isDropdownOpen}
            aria-label="Profile options"
          >
            <Image
              src="/images/user.png"
              width={32}
              height={32}
              alt="Profile"
              className="rounded-full"
            />
            <span className="text-gray-900 dark:text-gray-200 font-semibold">John Doe</span>
            <FiChevronDown className="text-gray-800 dark:text-gray-300" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 z-50 transition-opacity duration-300 ease-in-out">
              <Link href="/profile" className="block px-4 py-2  text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiUser  className="inline-block mr-2" /> Profile
              </Link>
              <Link href="/settings" className="block px-4 py-2  text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiSettings className="inline-block mr-2" /> Settings
              </Link>
              <Link href="/logout" className="block px-4 py-2  text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiLogOut className="inline-block mr-2" /> Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
