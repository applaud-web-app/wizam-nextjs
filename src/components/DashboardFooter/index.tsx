import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useSiteSettings } from "@/context/SiteContext"; // Import the SiteContext to access site settings

function updateCopyrightText(copyrightText:any) {
  const currentYear = new Date().getFullYear();
  return copyrightText.replace("['Y']", currentYear);
}

export default function Footer() {
  const { siteSettings, loading } = useSiteSettings(); // Access site settings and loading state

  return (
    <footer>
      {/* Contact Information Section */}
      <div className="bg-white dark:bg-gray-900 px-4 lg:px-7 py-4">
        <h5 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-1">
          Need help or advice?
        </h5>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
          Please contact us by telephone - <b>{siteSettings?.number || "0208 993 4500"}</b> or email - 
          <b>{siteSettings?.email || "dental@schoolofdentalnursing.com"}</b> to our friendly administrative team.
        </p>
      </div>

      {/* Footer Links and Social Media Section */}
      <div className="bg-defaultcolor dark:bg-defaultcolor text-white px-4 lg:px-7 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Footer Copyright Text */}
          <p className="text-sm text-gray-100 mb-3 md:mb-0">{updateCopyrightText(siteSettings?.copyright) || "All rights reserved"}</p>

          {/* Social Media Links */}
          {!loading && (
            <div className="flex space-x-4 mb-3 md:mb-0">
              {siteSettings?.facebook && (
                <a
                  href={siteSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:text-white"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.twitter && (
                <a
                  href={siteSettings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:text-white"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.linkedin && (
                <a
                  href={siteSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {siteSettings?.instagram && (
                <a
                  href={siteSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-100 hover:text-white"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              )}
            </div>
          )}

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
