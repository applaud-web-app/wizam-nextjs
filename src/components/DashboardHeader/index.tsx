import { FiMenu, FiChevronDown, FiLogOut, FiSettings, FiGlobe, FiUser  } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios"; // Axios for API calls
import { toast } from "react-toastify"; // Import toast from react-toastify
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface HeaderProps {
  toggleSidebar: () => void;
}

interface UserProfile {
  id: number;
  title: string | null;
  name: string;
  email: string;
  phone_number: string;
  // Add more fields if necessary
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();


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
      // Handle any errors (optional: show a notification to the user)
    }
  };


  // Function to fetch profile data
  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === true) {
        // Profile data successfully retrieved
        setUserProfile(response.data.user);
        console.log(userProfile);
      } else if (response.data.status === false && response.data.message === "Unauthorized") {
        // If the user is unauthorized, remove the token and log out
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // In case of an error (e.g., network issues or unauthorized), log the user out
      handleLogout();
    }
  };
  useEffect(() => {
    fetchProfileData(); // Call the function to fetch profile data
  }, []); // Empty dependency array means it runs once on mount


  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 fixed top-0 left-0 w-full lg-50 lg:z-[64] flex justify-between items-center h-[70px]">
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
        <Link href="/"><FiGlobe size={24} className="text-primary dark:text-gray-300" aria-label="Website" /></Link>

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
            <span className="text-gray-900 dark:text-gray-200 font-semibold"> {userProfile ?.name || 'Guest'}</span>
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
              <button onClick={handleLogout} type="button" className="block text-start px-4 py-2 w-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"><FiLogOut className="inline-block mr-2"/>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
