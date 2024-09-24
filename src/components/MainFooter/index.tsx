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


const Footer = () => {
  return (
    <footer className="bg-[#0b1e22] text-white py-16">
      <div className="container mx-auto px-4">
        {/* Grid Layout for footer */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Description */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/">
              <Image
                src="/images/logo/logo-white.svg"
                alt="Wizam Logo"
                width={140}
                height={30}
              />
            </Link>
            {/* <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              The Knowledge Academy
            </p> */}
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
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">Company</h4>
            <ul>
            <li className="mb-2">
              <Link href="/terms-and-conditions" className="hover:text-green-400">
                Terms & Conditions
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/privacy-policy" className="hover:text-green-400">
                Privacy Policy
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/cookie-policy" className="hover:text-green-400">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-green-400">
                Refund Policy
              </Link>
            </li>

            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-xl leading-snug">Contact</h4>
            <ul className="text-sm text-white">
              <li className="mb-2">3 The Mount, Acton, London, W3 9NW</li>
              <li className="mb-2">
                <Link href="tel:02089934500" className="hover:text-green-400">
                  02089934500
                </Link>
              </li>
              <li>
                <Link href="mailto:info@wizam.com" className="hover:text-green-400">
                  info@wizam.com
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
                className="w-full px-4 py-2 text-base  bg-[#76B51B]/10 border-none rounded-none focus:outline-none rounded-l-md text-gray-200"
              />
              <button className=" px-3 py-2 rounded-r-md absolute right-0">
              <MdOutlineArrowOutward className="text-2xl text-[#76B51B]" /> 
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom with Social Icons */}
        <div className="mt-12 flex flex-wrap items-center justify-between border-t border-gray-600 pt-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            © 2024. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/" aria-label="Facebook" className="text-gray-400 hover:text-green-400">
              <FaFacebookF />
            </Link>
            <Link href="/" aria-label="LinkedIn" className="text-gray-400 hover:text-green-400">
              <FaLinkedinIn />
            </Link>
            <Link href="/" aria-label="Instagram" className="text-gray-400 hover:text-green-400">
              <FaInstagram />
            </Link>
            <Link href="/" aria-label="YouTube" className="text-gray-400 hover:text-green-400">
              <FaYoutube />
            </Link>
            <Link href="/" aria-label="Twitter" className="text-gray-400 hover:text-green-400">
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
