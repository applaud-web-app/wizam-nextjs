import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer>
      {/* Contact Information Section */}
      <div className="bg-white dark:bg-gray-900 px-4 lg:px-7 py-4">
        <h5 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-1">
          Need help or advice?
        </h5>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
          Please contact us by telephone – <b>0208 993 4500</b> or email- <b>dental@schoolofdentalnursing.com</b> to our friendly administrative team.
        </p>
      </div>

      {/* Footer Links and Social Media Section */}
      <div className="bg-defaultcolor dark:bg-defaultcolor text-white px-4 lg:px-7 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Footer Copyright Text */}
          <p className="text-sm text-gray-100 mb-3 md:mb-0">© 2024 Wizam. All rights reserved.</p>

          {/* Social Media Links */}
          <div className="flex space-x-4 mb-3 md:mb-0">
            <a
              href="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-100 hover:text-white"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-100 hover:text-white"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-100 hover:text-white"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-100 hover:text-white"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>

          {/* Footer Internal Links */}
          <div className="flex space-x-4">
            <Link href="/terms-and-conditions">
              <span className="text-gray-100 hover:text-white">Terms & Conditions</span>
            </Link>
            <Link href="/privacy-policy">
              <span className="text-gray-100 hover:text-white">Privacy Policy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
