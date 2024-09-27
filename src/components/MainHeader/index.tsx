"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import menuData from "./menuData";

const Header = () => {
  const { data: session } = useSession();
  const pathUrl = usePathname();

  // Navbar state
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  // Search overlay state
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle sticky navbar on scroll
  useEffect(() => {
    const handleStickyNavbar = () => {
      setSticky(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  // Handle search input visibility
  const handleSearchToggle = () => setSearchOpen(!searchOpen);

  // Close the search overlay if Escape is pressed
  useEffect(() => {
    const closeSearchOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", closeSearchOnEscape);
    return () => window.removeEventListener("keydown", closeSearchOnEscape);
  }, []);

  // Toggle the mobile navbar
  const handleNavbarToggle = () => setNavbarOpen(!navbarOpen);

  return (
    <>
      {/* Header Component */}
      <header
        className={` z-40 w-full top-0 flex items-center justify-between ${
          sticky
            ? " fixed bg-white/80 dark:bg-dark/10 backdrop-blur-lg shadow-lg border-b border-stroke dark:border-dark-3/20"
            : "relative bg-white dark:bg-dark"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo (Left-aligned) */}
          <div className="w-60 max-w-full">
            <Link href="/">
              <Image
                src="/images/logo/wizam-logo.png"
                alt="logo"
                width={sticky ? 120 : 150}
                height={30}
                className="dark:hidden"
              />
              <Image
                src="/images/logo/wizam-logo.png"
                alt="logo"
                width={sticky ? 120 : 150}
                height={30}
                className="hidden dark:block"
              />
            </Link>
          </div>

          {/* Desktop Navigation and Authentication (Right-aligned) */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Navigation */}
            <nav>
              <ul className="flex gap-8 items-center">
                {menuData.map((menuItem, index) => (
                  <li key={index} className="group relative">
                    <Link
                      href={menuItem.path || "#"}
                      className={`block text-base text-dark dark:text-white hover:text-primary dark:hover:text-primary ${
                        pathUrl === menuItem.path ? "text-primary" : ""
                      }`}
                    >
                      {menuItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Search and Authentication */}
            <button
              className="text-xl text-dark dark:text-white"
              onClick={handleSearchToggle}
            >
              <IoSearchSharp />
            </button>

            {session?.user ? (
              <>
                <span className="text-base font-medium text-dark dark:text-white">
                  {session?.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-primary text-white py-2 px-6 rounded-full hover:bg-secondary transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="bg-primary/10 border border-primary text-primary py-2 px-6 rounded-full hover:bg-primary hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="border border-secondary bg-secondary/10 text-secondary py-2 px-6 rounded-full hover:bg-secondary hover:text-white transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={handleNavbarToggle}
            className="lg:hidden focus:outline-none"
          >
            <span
              className={`block h-0.5 w-6 bg-dark dark:bg-white transition-transform ${
                navbarOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-dark dark:bg-white my-1 transition-opacity ${
                navbarOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-dark dark:bg-white transition-transform ${
                navbarOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>

          {/* Mobile Navigation */}
          <nav
            className={`${
              navbarOpen
                ? "absolute right-0 top-full mt-2 w-full bg-white shadow-lg dark:bg-dark-2 transition-all duration-300 ease-in-out"
                : "hidden"
            } lg:hidden`}
          >
            <ul className="flex flex-col items-start space-y-4 py-6 px-4">
              {menuData.map((menuItem, index) => (
                <li key={index} className="group relative w-full">
                  <Link
                    href={menuItem.path || "#"}
                    className={`block w-full text-base text-dark dark:text-white py-2 px-6 hover:bg-primary hover:text-white transition rounded-md ${
                      pathUrl === menuItem.path ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => setNavbarOpen(false)}
                  >
                    {menuItem.title}
                  </Link>
                </li>
              ))}

              {/* Mobile Authentication */}
              {session?.user ? (
                <>
                  <span className="text-base font-medium text-dark dark:text-white px-4">
                    {session?.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="bg-primary text-white py-2 px-6 mx-4 rounded-full hover:bg-secondary transition w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="bg-primary/10 border border-primary text-primary text-center py-2 px-6  rounded-full hover:bg-primary hover:text-white transition w-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="border border-secondary bg-secondary/10 text-secondary text-center py-2 px-6  rounded-full hover:bg-secondary hover:text-white transition w-full"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
         {/* Modal Box */}
         <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-lg">
           {/* Close Button */}
           <button
             className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white text-2xl"
             onClick={handleSearchToggle}
           >
             <AiOutlineClose />
           </button>
 
           {/* Search Input Field */}
           <div className="flex items-center space-x-3 mb-4">
             <IoSearchSharp className="text-gray-500 text-2xl dark:text-gray-400" />
             <input
               type="text"
               placeholder="Search for courses, articles, or resources..."
               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
           </div>
 
           {/* Search Prompt Text */}
           <p className="text-sm text-gray-500 dark:text-gray-400">
             Start typing to search across our platform.
           </p>
         </div>
       </div>
      )}
    </>
  );
};

export default Header;
