import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 fixed top-0 left-0 w-full z-50 flex justify-between items-center h-[70px]">
      <div className="flex items-center space-x-4">
        {/* Sidebar toggle button for mobile */}
        <button onClick={toggleSidebar} className="text-gray-800 dark:text-gray-300 lg:hidden">
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

      {/* Notifications & Profile */}
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-800 dark:text-gray-300">
          <FiBell size={24} />
          <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <Image src="/images/user.png" width={32} height={32} alt="Profile" className="rounded-full" />
          <span className="text-gray-900 dark:text-gray-200 font-semibold">John Doe</span>
          <FiChevronDown className="text-gray-800 dark:text-gray-300" />
        </div>
      </div>
    </header>
  );
}
