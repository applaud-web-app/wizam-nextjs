"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa"; // Import React Icons
import { MdOutlineArrowOutward } from "react-icons/md";
import { useSiteSettings } from "@/context/SiteContext"; // Import the useSiteSettings hook

// Type for Dynamic Pages fetched from the API
interface Page {
  title: string;
  slug: string;
}

const Footer = () => {
  const { siteSettings, loading, error } = useSiteSettings(); // Access site settings from context
  const [pages, setPages] = useState<Page[]>([]); // State to store dynamic pages

  // Fetch dynamic pages from the API
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
        const data = await response.json();
        if (data.status) {
          setPages(data.data); // Set the fetched pages in state
        }
      } catch (error) {
        console.error("Error fetching dynamic pages:", error);
      }
    };

    fetchPages();
  }, []);

  if (loading) {
    return <p>Loading footer...</p>;
  }

  if (error || !siteSettings) {
    return <p>Error loading site settings</p>;
  }

  return (
    <footer className="bg-[#0b1e22] text-white pt-16 pb-12">
      <div className="container mx-auto px-4">
        {/* Grid Layout for footer */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Description */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/">
              <Image
                src={siteSettings.light_site_logo}
                alt={`${siteSettings.site_name} Logo`}
                width={140}
                height={30}
              />
            </Link>
            <p className="mt-4 text-gray-400">{siteSettings.tag_line}</p>
          </div>

          {/* Content Links */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">Content</h4>
            <ul>
              <li className="mb-2">
                <Link href="/" className="hover:text-green-400">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="hover:text-green-400">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/exams" className="hover:text-green-400">
                  Exams
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/resources" className="hover:text-green-400">
                  Resources
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/faq" className="hover:text-green-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Pages Links */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">Company</h4>
            <ul>
           
              {pages.map((page, index) => (
                <li key={index} className="mb-2">
                  <Link href={`/${page.slug}`} className="hover:text-green-400">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">Contact</h4>
            <ul className="text-sm text-white">
              <li className="mb-2">{siteSettings.address}</li>
              <li className="mb-2">
                <Link href={`tel:${siteSettings.number}`} className="hover:text-green-400">
                  {siteSettings.number}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${siteSettings.email}`} className="hover:text-green-400">
                  {siteSettings.email}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <h4 className="mb-4 font-semibold leading-snug">
              Subscribe to Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get valuable strategy, culture and brand insights straight to your
              inbox.
            </p>
            <form className="flex relative overflow-hidden border-b-2 border-[#76B51B]">
              <input
                type="email"
                placeholder="Enter your email here"
                className="w-full px-4 py-2 text-base bg-[#76B51B]/10 border-none rounded-none focus:outline-none rounded-l-md text-gray-200"
              />
              <button className="px-3 py-2 rounded-r-md absolute right-0">
                <MdOutlineArrowOutward className="text-2xl text-[#76B51B]" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom with Social Icons */}
        <div className="mt-12 flex flex-wrap items-center justify-between border-t border-gray-600 pt-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            {siteSettings.copyright}
          </p>
          <div className="flex space-x-4">
            {siteSettings.facebook && (
              <Link href={siteSettings.facebook} aria-label="Facebook" className="text-gray-400 hover:text-green-400">
                <FaFacebookF />
              </Link>
            )}
            {siteSettings.linkedin && (
              <Link href={siteSettings.linkedin} aria-label="LinkedIn" className="text-gray-400 hover:text-green-400">
                <FaLinkedinIn />
              </Link>
            )}
            {siteSettings.instagram && (
              <Link href={siteSettings.instagram} aria-label="Instagram" className="text-gray-400 hover:text-green-400">
                <FaInstagram />
              </Link>
            )}
            {siteSettings.youtube && (
              <Link href={siteSettings.youtube} aria-label="YouTube" className="text-gray-400 hover:text-green-400">
                <FaYoutube />
              </Link>
            )}
            {siteSettings.twitter && (
              <Link href={siteSettings.twitter} aria-label="Twitter" className="text-gray-400 hover:text-green-400">
                <FaTwitter />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
