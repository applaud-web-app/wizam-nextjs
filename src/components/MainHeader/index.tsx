"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSearchSharp } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import menuData from "./menuData";
import { useRouter } from "next/navigation"; // To handle logout and redirect

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathUrl = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set login status based on token presence
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsLoggedIn(false);
    router.push('/signin'); // Redirect to sign-in page after logout
  };

  return (
    <>
      <header
        className={` z-40 w-full top-0 flex items-center justify-between ${
          sticky
            ? "fixed bg-white/80 dark:bg-dark/10 backdrop-blur-lg shadow-lg border-b border-stroke dark:border-dark-3/20"
            : "relative bg-white dark:bg-dark"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo */}
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

          {/* Desktop Navigation and Authentication */}
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

            {/* Authentication */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
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
          <button onClick={() => setNavbarOpen(!navbarOpen)} className="lg:hidden focus:outline-none">
            <span className={`block h-0.5 w-6 bg-dark dark:bg-white transition-transform ${navbarOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
            <span className={`block h-0.5 w-6 bg-dark dark:bg-white my-1 transition-opacity ${navbarOpen ? "opacity-0" : ""}`}></span>
            <span className={`block h-0.5 w-6 bg-dark dark:bg-white transition-transform ${navbarOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
