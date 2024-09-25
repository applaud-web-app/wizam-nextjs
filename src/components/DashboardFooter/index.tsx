import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Company Name and Copyright */}
        <div className="mb-1 md:mb-0 text-sm"> {/* Adjusted font size */}
          <p>© 2024 Wizam. All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="space-x-6">
          <Link href="/terms-and-conditions">
            <span className="text-gray-400 text-sm hover:text-primary transition-colors">
              Terms and Conditions
            </span>
          </Link>
          <Link href="/privacy-policy">
            <span className="text-gray-400 text-sm hover:text-primary transition-colors">
              Privacy Policy
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
