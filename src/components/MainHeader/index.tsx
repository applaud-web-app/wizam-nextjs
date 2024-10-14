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
import axios from "axios"; // Axios for API calls
import { toast } from "react-toastify"; // Import toast from react-toastify
import { MdOutlineArrowForwardIos } from "react-icons/md";

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

  // LOGOUT
  const handleLogout = async () => {
    try {
      // Make the API request to log out
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {}, // No data is required in the request body
        {
          headers: {
            // Pass the JWT token in the Authorization header
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      // If the logout is successful
      if (response.status === 200) {
        // Remove the JWT from cookies
        Cookies.remove("jwt");

        // Update the login state to false
        setIsLoggedIn(false);

        // Show success toast notification
        toast.success("Logout successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to another page after a brief delay to let the toast show
        setTimeout(() => {
          router.push("/signin"); // Redirect to the /about page after login
        }, 1000);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Toggle the mobile navbar
  const handleNavbarToggle = () => setNavbarOpen(!navbarOpen);

  // Fetch exam and resource suggestions based on search query
  useEffect(() => {
    const fetchExamsAndResources = async () => {
      if (searchQuery) {
        try {
          // Fetch both exams and resources
          const [examResponse, resourceResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resource`), // Assuming /resources endpoint exists
          ]);

          // Filter exams based on search query
          const filteredExams = examResponse.data.data.filter((exam: any) =>
            exam.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // Filter resources based on search query
          const filteredResources = resourceResponse.data.data.filter((resource: any) =>
            resource.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // Combine exams and resources for the suggestions list
          const combinedSuggestions = [
            ...filteredExams.map((exam: any) => ({ ...exam, type: "exam" })), // Label as exam
            ...filteredResources.map((resource: any) => ({ ...resource, type: "resource" })), // Label as resource
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

  // Handle form submit
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length === 1) {
      // If there is exactly one suggestion, redirect to its detail page
      const suggestion = suggestions[0];
      handleSuggestionClick(suggestion);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.title); // Populate the input with the clicked suggestion
    if (suggestion.type === "exam") {
      router.push(`/exams/${suggestion.slug}`); // Redirect to exam detail page
    } else if (suggestion.type === "resource") {
      router.push(`/blogs/${suggestion.slug}`); // Redirect to resource detail page
    }
    setSuggestions([]); // Clear suggestions
    setSearchOpen(false); // Close search overlay
  };

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

            {/* Search and Authentication */}
            <button
              className="text-xl text-dark dark:text-white"
              onClick={handleSearchToggle}
              aria-label="Search"
            >
              <IoSearchSharp />
            </button>

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="bg-secondary text-white py-2 px-6 rounded-full hover:bg-secondary-dark transition">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-dark transition">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="flex items-center border border-primary bg-primary font-semibold text-secondary py-2 px-6 rounded-full hover:bg-secondary hover:border-secondary hover:text-primary transition"
                >
                  Login <MdOutlineArrowForwardIos className="ms-1" /> 
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center border border-primary  font-semibold text-secondary py-2 px-6 rounded-full hover:bg-primary hover:text-secondary transition"
                >
                  Register <MdOutlineArrowForwardIos className="ms-1" />  
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
                <>
                  <Link href="/dashboard" className="bg-secondary text-white py-2 px-6 rounded-full hover:bg-secondary-dark transition">Dashboard</Link>
                  <button onClick={handleLogout} className="bg-primary text-white py-2 px-6 mx-4 rounded-full hover:bg-primary-dark transition w-full">Sign Out</button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="flex items-center border border-primary bg-primary font-semibold text-secondary py-2 px-6 rounded-full hover:bg-secondary hover:border-secondary hover:text-primary transition w-full"
                  >
                    Login <MdOutlineArrowForwardIos className="ms-1" /> 
                  </Link>
                  <Link
                    href="/signup"
                    className=" flex items-center border border-primary  font-semibold text-secondary py-2 px-6 rounded-full hover:bg-primary hover:text-secondary transition w-full"
                  >
                    Register <MdOutlineArrowForwardIos className="ms-1" /> 
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
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-3 w-full max-w-lg shadow-xl">
            {/* Header: Title and Close Button */}
            <div className="flex items-center justify-between mb-3">
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Search</h2>

              {/* Close Button */}
              <button
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white text-2xl transition duration-200"
                onClick={handleSearchToggle}
                aria-label="Close Search"
              >
                <AiOutlineClose />
              </button>
            </div>

            {/* Search Form with Icon Button */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                  className="w-full h-12 px-4 text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-0 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary text-white h-12 px-3 flex items-center justify-center hover:bg-primary-dark transition duration-200 focus:outline-none"
                  aria-label="Submit Search"
                >
                  <IoSearchSharp className="text-xl" />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
                  {suggestions.map((suggestion: any, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-white transition duration-200"
                      onClick={() => handleSuggestionClick(suggestion)} // Single click handler
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              )}
            </form>

            {/* Search Prompt Text */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start typing to search across exams.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
