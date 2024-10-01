"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSearchSharp } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import menuData from "./menuData";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSiteSettings } from "@/context/SiteContext"; // Import the hook to use site settings
import { toast } from "react-toastify"; // Import toast from react-toastify

const Header = () => {
  const { siteSettings, loading, error } = useSiteSettings(); // Access site settings from the context
  const pathUrl = usePathname();
  const router = useRouter();  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // Toggle Search Overlay
  const handleSearchToggle = () => setSearchOpen(!searchOpen);

  // Close search with escape key
  useEffect(() => {
    const closeSearchOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", closeSearchOnEscape);
    return () => window.removeEventListener("keydown", closeSearchOnEscape);
  }, []);

  // Check for JWT in cookies
  useEffect(() => {
    const token = Cookies.get("jwt");
    setIsLoggedIn(!!token);
  }, []);

  // const handleLogout = () => {
  //   Cookies.remove("jwt");
  //   setIsLoggedIn(false);

  //    // Show success toast notification
  //    toast.success("Logout successful!", {
  //     position: "top-right",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //   });

  //   setTimeout(() => {
  //     router.push("/"); 
  //   }, 1000);
  // };
  const handleLogout = async () => {
    try {
        const token = Cookies.get("jwt");

        // Check if token exists before making the logout request
        if (token) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token if needed
                },
            });

            // Check if the response is okay
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }
        }

        // Remove token from client-side storage (localStorage/cookies)
        Cookies.remove('jwt'); // or localStorage.removeItem('jwt');

        toast.success("Logout successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          router.push("/"); 
        }, 1000);
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };


  // Toggle the mobile navbar
  const handleNavbarToggle = () => setNavbarOpen(!navbarOpen);

  if (loading) {
    return null; // You can return a loader or null while the settings are loading
  }

  if (error || !siteSettings) {
    return <p>Error loading site settings...</p>; // Handle the case where settings couldn't be fetched
  }

  return (
    <>
      {/* Header Component */}
      <header
        className={`z-40 w-full top-0 flex items-center justify-between ${
          sticky
            ? "fixed bg-white/90 dark:bg-dark/80 backdrop-blur-lg shadow-lg border-b border-stroke dark:border-dark-3/20"
            : "relative bg-white dark:bg-dark"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo (Left-aligned) */}
          <div className="w-40 lg:w-60">
            <Link href="/">
              {siteSettings.site_logo && (
                <Image
                  src={siteSettings.site_logo}
                  alt={`${siteSettings.site_name} logo`}
                  width={150}
                  height={30}
                  className="dark:hidden"
                />
              )}
              {siteSettings.light_site_logo && (
                <Image
                  src={siteSettings.light_site_logo}
                  alt={`${siteSettings.site_name} logo`}
                  width={150}
                  height={30}
                  className="hidden dark:block"
                />
              )}
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
              aria-label="Search"
            >
              <IoSearchSharp />
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-primary text-white py-2 px-6 rounded-full hover:bg-secondary transition"
              >
                Sign Out
              </button>
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
            className="lg:hidden flex flex-col space-y-1.5 focus:outline-none"
            aria-label="Toggle Menu"
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
                ? "absolute right-0 top-full w-full bg-white dark:bg-dark shadow-lg z-50 transition-all duration-300 ease-in-out"
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
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white py-2 px-6 mx-4 rounded-full hover:bg-secondary transition w-full"
                >
                  Sign Out
                </button>
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
              aria-label="Close Search"
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
