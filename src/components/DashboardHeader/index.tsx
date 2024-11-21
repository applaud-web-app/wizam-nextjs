import { FiMenu, FiChevronDown, FiLogOut, FiSettings, FiGlobe, FiUser, FiBook, FiCreditCard } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSiteSettings } from "@/context/SiteContext"; 

interface HeaderProps {
  toggleSidebar: () => void;
}

interface UserProfile {
  id: number;
  title: string | null;
  image: string;
  email: string;
  name: string;
  phone_number: string;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const { siteSettings, loading } = useSiteSettings();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

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
        toast.success("Logout successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.push("/");
      } else if (response.data.status === false && response.data.message === "Unauthorized") {
        Cookies.remove("jwt");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchProfileData = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === true) {
        setUserProfile(response.data.user);
      } else if (response.data.status === false && response.data.message === "Unauthorized") {
        Cookies.remove("jwt");
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      Cookies.remove("jwt");
      handleLogout();
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const getFirstName = (name: string) => {
    return name.split(" ")[0];
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 fixed top-0 left-0 w-full lg:z-[64] z-10 flex justify-between items-center h-[70px]">
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-800 dark:text-gray-300 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <FiMenu size={24} />
        </button>
        <div className="flex items-center">
          {loading ? null : (
            <Link href="/">
              <Image
                src={siteSettings?.site_logo || "/images/logo/default-logo.png"}
                width={120}
                height={40}
                alt={siteSettings?.site_name || "Logo"}
                className="object-contain"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Center Section: Navigation */}
      <nav className="hidden lg:flex space-x-8">
        <Link href="/" className="text-gray-800 dark:text-gray-300 hover:text-defaultcolor">
          Home
        </Link>
        <Link href="/about-us" className="text-gray-800 dark:text-gray-300 hover:text-defaultcolor">
          About Us
        </Link>
        <Link href="/pricing" className="text-gray-800 dark:text-gray-300 hover:text-defaultcolor">
          Pricing
        </Link>
      </nav>

      {/* Right Section: Website Icon and Profile Dropdown */}
      <div className="flex items-center space-x-6">
        <Link href="/">
          <FiGlobe size={24} className="text-defaultcolor dark:text-gray-300" aria-label="Website" />
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
            aria-expanded={isDropdownOpen}
            aria-label="Profile options"
          >
            <Image
              src={userProfile?.image || '/images/user.png'}
              width={32}
              height={32}
              alt="Profile"
              className="rounded-full w-8 h-8"
            />
            <span className="text-gray-900 dark:text-gray-200 font-semibold">
              {userProfile ? getFirstName(userProfile.name) : 'Guest'}
            </span>
            <FiChevronDown className="text-gray-800 dark:text-gray-300" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 divide-y mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 z-50">
              <Link href="/dashboard/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiUser className="inline-block mr-2" /> My Profile
              </Link>
              <Link href="/dashboard/my-subscription" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiBook className="inline-block mr-2" /> My Subscription
              </Link>
              <Link href="/dashboard/my-payments" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiCreditCard className="inline-block mr-2" /> My Payments
              </Link>

              <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} type="button" className="block text-start px-4 py-2 w-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600">
                <FiLogOut className="inline-block mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
