"use client";

import axios from 'axios';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdOutlineArrowOutward } from "react-icons/md";
import { useSiteSettings } from "@/context/SiteContext";

interface Page {
  title: string;
  slug: string;
}

const Footer = () => {
  const { siteSettings, loading, error } = useSiteSettings();
  const [pages, setPages] = useState<Page[]>([]);
  const [email, setEmail] = useState<string>("");  
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // Cache pages to prevent unnecessary API calls
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`);
        const data = await response.json();
        if (data.status) {
          setPages(data.data);
        }
      } catch (error) {
        console.error("Error fetching dynamic pages:", error);
      }
    };

    if (!pages.length) {
      fetchPages();
    }
  }, [pages]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await axios.post('/api/subscribe', { email });

      if (response.status === 201) {
        setSubscribed(true);
        setSubscriptionError(null);
        setEmail('');
      } else {
        setSubscriptionError(response.data.message || 'Subscription error. Please try again later.');
      }
    } catch (error: any) {
      setSubscriptionError(error.response?.data?.message || 'Subscription error. Please try again later.');
    }
  };

  function updateCopyrightText(copyrightText: string) {
    const currentYear = new Date().getFullYear();
    return copyrightText.replace("['Y']", currentYear.toString());
  }

  // Fallback loading and error states
  if (loading) return <p>Loading footer...</p>;
  if (error || !siteSettings) return <p>Error loading site settings</p>;

  return (
    <footer className="bg-tertiary text-white pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/">
              <Image
                src={siteSettings.light_site_logo}
                alt={`${siteSettings.site_name} Logo`}
                width={140}
                height={30}
                priority // Ensure the logo loads quickly for SEO
              />
            </Link>
            <p className="mt-4 text-gray-400">{siteSettings.tag_line}</p>
          </div>

          <div className="col-span-1 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">Wizam</h4>
            <ul>
              <li className="mb-2"><Link href="/" className="hover:text-green-400">Home</Link></li>
              <li className="mb-2"><Link href="/exams" className="hover:text-green-400">Exams</Link></li>
              <li className="mb-2"><Link href="/pricing" className="hover:text-green-400">Pricing</Link></li>
              <li className="mb-2"><Link href="/knowledge-hub" className="hover:text-green-400">Knowledge Hub</Link></li>
              <li className="mb-2"><Link href="/faq" className="hover:text-green-400">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">About Us</h4>
            <ul>
              <li className="mb-2"><Link href="/about-us" className="hover:text-green-400">About Us</Link></li>
              {pages.map((page, index) => (
                <li key={index} className="mb-2">
                  <Link href={`/${page.slug}`} className="hover:text-green-400">{page.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">Contact Us</h4>
            <ul className="text-sm text-white">
              <li className="mb-2 w-[90%]">{siteSettings.address}</li>
              <li className="mb-2">
                <Link href={`tel:${siteSettings.number}`} className="hover:text-green-400">{siteSettings.number}</Link>
              </li>
              <li className="mb-2">
                <Link href={`mailto:${siteSettings.email}`} className="hover:text-green-400">{siteSettings.email}</Link>
              </li>
              <li><Link href="/contact-us" className="hover:text-green-400">Contact Us</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1 col-span-2">
            <h4 className="mb-4 font-semibold leading-snug">Subscribe to Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get valuable insights straight to your inbox.
            </p>
            {subscribed ? (
              <p className="text-green-400">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex relative overflow-hidden border-b-2 border-[#76B51B]">
                <input
                  type="email"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 text-base bg-[#76B51B]/10 border-none rounded-none focus:outline-none text-gray-200"
                  required
                />
                <button type="submit" className="px-3 py-2 rounded-r-md absolute right-0">
                  <MdOutlineArrowOutward className="text-2xl text-[#76B51B]" />
                </button>
              </form>
            )}
            {subscriptionError && <p className="text-red-400 mt-2">{subscriptionError}</p>}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between border-t border-gray-600 pt-4">
          <p className="text-sm text-gray-400 leading-relaxed">{updateCopyrightText(siteSettings.copyright)}</p>
          <div className="flex space-x-4">
            {/* Lazy loading social icons to reduce initial page load */}
            {siteSettings.facebook && (
              <Link href={siteSettings.facebook} aria-label="Facebook" className="text-gray-400 hover:text-green-400" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </Link>
            )}
            {siteSettings.linkedin && (
              <Link href={siteSettings.linkedin} aria-label="LinkedIn" className="text-gray-400 hover:text-green-400" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </Link>
            )}
            {siteSettings.instagram && (
              <Link href={siteSettings.instagram} aria-label="Instagram" className="text-gray-400 hover:text-green-400" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </Link>
            )}
            {siteSettings.youtube && (
              <Link href={siteSettings.youtube} aria-label="YouTube" className="text-gray-400 hover:text-green-400" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </Link>
            )}
            {siteSettings.twitter && (
              <Link href={siteSettings.twitter} aria-label="Twitter" className="text-gray-400 hover:text-green-400" target="_blank" rel="noopener noreferrer">
                <FaSquareXTwitter />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
