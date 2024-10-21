"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSearchSharp } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import menuData from "./menuData";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSiteSettings } from "@/context/SiteContext"; // Import the hook to use site settings
import axios from "axios"; // Axios for API calls
import { toast } from "react-toastify"; // Import toast from react-toastify
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { BsChevronDown } from "react-icons/bs"; // For dropdown arrow icon

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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [suggestions, setSuggestions] = useState<any[]>([]); // State for exam suggestions

  // Ref for search box to handle outside click
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Dropdown state for login
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for login dropdown

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

  const handleLoginDropdownToggle = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;

      // Check if the clicked element has the class or identifier of the dropdown or button
      if (
        !targetElement.closest('.login-dropdown') && // Ensure the click is outside dropdown
        !targetElement.closest('.login-dropdown-toggle') // Ensure the click is outside toggle button
      ) {
        setLoginDropdownOpen(false); // Close the dropdown
      }
    };

    if (loginDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loginDropdownOpen]);
  

  // Close search with escape key
  useEffect(() => {
    const closeSearchOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", closeSearchOnEscape);
    return () => window.removeEventListener("keydown", closeSearchOnEscape);
  }, []);

  // Close search box when clicking outside of it
  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setSearchOpen(false); // Close search if clicking outside the search box
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutsideSearch);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, [searchOpen]);

  // Check for JWT in cookies
  useEffect(() => {
    const token = Cookies.get("jwt");
    setIsLoggedIn(!!token);
  }, []);

  // LOGOUT
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
        setIsLoggedIn(false);

        toast.success("Logout successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Toggle the mobile navbar
  const handleNavbarToggle = () => setNavbarOpen(!navbarOpen);

  // Fetch exam and resource suggestions based on search query
 // Fetch exam and resource suggestions based on search query
useEffect(() => {
  const fetchExamsAndResources = async () => {
    if (searchQuery) {
      try {
        const [examResponse, resourceResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resource`),
        ]);

        const filteredExams = examResponse.data.data.filter((exam: any) =>
          exam.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const filteredResources = resourceResponse.data.data.filter(
          (resource: any) =>
            resource.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const combinedSuggestions = [
          ...filteredExams.map((exam: any) => ({ ...exam, type: "exam" })),
          ...filteredResources.map((resource: any) => ({
            ...resource,
            type: "resource",
          })),
        ];

        setSuggestions(combinedSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  fetchExamsAndResources();
}, [searchQuery]);


  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length === 1) {
      const suggestion = suggestions[0];
      handleSuggestionClick(suggestion);
    }
  };

  // Handle clicking a suggestion and navigating to the page
  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.title);
    
    if (suggestion.type === "exam") {
      router.push(`/exams/${suggestion.slug}`);
    } else if (suggestion.type === "resource") {
      router.push(`/blogs/${suggestion.slug}`);
    }

    // Clear search state
    setSearchQuery("");
    setSuggestions([]);
    setSearchOpen(false); // Close the search overlay
  };

  if (loading) {
    return null;
  }

  if (error || !siteSettings) {
    return <p>Error loading site settings...</p>;
  }

  return (
    <>
      <header
        className={`z-50 w-full top-0 flex items-center justify-between ${
          sticky
            ? "fixed bg-white/90 dark:bg-dark/80 backdrop-blur-lg shadow-lg border-b border-stroke dark:border-dark-3/20"
            : "relative bg-white dark:bg-dark"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
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

          <div className="hidden lg:flex items-center relative space-x-6">
            <nav>
              <ul className="flex gap-5 items-center">
                {menuData.map((menuItem, index) => (
                  <li key={index} className="group relative">
                    <Link
                      href={menuItem.path || "#"}
                      className={`block text-base text-dark dark:text-white hover:text-primary dark:hover:text-secondary px-5 py-2 rounded-full ${
                        pathUrl === menuItem.path ? "bg-primary/15 text-dark" : ""
                      }`}
                    >
                      {menuItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              className="text-xl text-dark dark:text-white"
              onClick={handleSearchToggle}
              aria-label="Search"
            >
              <IoSearchSharp />
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-secondary font-semibold text-white py-2 px-6 rounded-full hover:bg-secondary-dark transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary font-semibold text-secondary py-2 px-6 rounded-full hover:bg-primary-dark transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="flex items-center border border-primary bg-primary font-semibold text-secondary py-2 px-6 rounded-full hover:bg-secondary hover:border-secondary hover:text-primary transition"
                >
                  Register <MdOutlineArrowForwardIos className="ms-1" />
                </Link>
                <div className="relative" >
                  <button
                    onClick={handleLoginDropdownToggle}
                    className="flex items-center login-dropdown-toggle border border-primary font-semibold text-secondary py-2 px-6 rounded-full hover:bg-primary hover:text-secondary transition"
                  >
                    Login <BsChevronDown className="ml-1" />
                  </button>

                  {loginDropdownOpen && (
                    <div className="login-dropdown absolute right-0 mt-2 w-48 bg-white dark:bg-dark shadow-lg border rounded-lg py-2 z-50" tabIndex={-1}>
                        <Link
                        href="/signin"
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setLoginDropdownOpen(false)}
                      >
                        Student Login
                      </Link>

                      <Link
                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}`}
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setLoginDropdownOpen(false)}
                      >
                        Teacher Login
                      </Link>
                    
                    </div>
                  )}
                </div>
              </>
            )}

            {searchOpen && (
              <div ref={searchBoxRef} className="absolute left-0 z-40 bg-white/70 w-full" style={{ marginLeft: "0 " }}>

                <div className="relative bg-white rounded-lg p-3 w-full">

                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <div className="p-3 text-gray-400 absolute left-0 flex items-center">
                        <IoSearchSharp className="text-xl" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for exams or resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pr-10 text-gray-800 bg-white border-0 focus:outline-none pl-12"
                      />
                      {searchQuery && (
                        <button
                          className="absolute right-0 p-3 text-gray-400"
                          onClick={() => setSearchQuery("")} // Clears the search query
                        >
                          <AiOutlineClose className="text-xl" />
                        </button>
                      )}
                    </div>

                    {suggestions.length > 0 ? (
                      <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
                        {suggestions.map((suggestion: any, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 transition duration-200"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      searchQuery && (
                        <p className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 py-2 px-4 text-red-500 z-50">
                          No exam or Resource Available.
                        </p>
                      )
                    )}

                  </form>
                </div>
              </div>
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

              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-secondary text-white py-2 px-6 rounded-full hover:bg-secondary-dark transition text-center"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-primary text-white py-2 px-6 mx-4 rounded-full hover:bg-primary-dark transition w-full text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center border border-primary bg-primary font-semibold text-secondary py-2 px-6 rounded-full hover:bg-secondary hover:border-secondary hover:text-primary transition w-full"
                  >
                    Register <MdOutlineArrowForwardIos className="ms-1" />
                  </Link>
                  <div className="relative w-full" ref={dropdownRef}>
                    <button
                      onClick={handleLoginDropdownToggle}
                      className="flex items-center justify-center border border-primary font-semibold text-secondary py-2 px-6 rounded-full hover:bg-primary hover:text-secondary transition w-full"
                    >
                      Login <BsChevronDown className="ml-1" />
                    </button>

                    {loginDropdownOpen && (
                      <div className="absolute w-full bg-white dark:bg-dark shadow-lg border rounded-lg py-2 z-50" tabIndex={-1}>
                         <Link
                          href="/signin"
                          className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setLoginDropdownOpen(false)}
                        >
                          Student Login
                        </Link>
                        
                        <Link
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}`}
                          className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setLoginDropdownOpen(false)}
                        >
                          Teacher Login
                        </Link>
                       
                      </div>
                    )}
                  </div>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
