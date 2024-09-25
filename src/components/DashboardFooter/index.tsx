import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 px-3">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Company Name and Copyright */}
        <div className="text-sm text-gray-400">
          <p>© 2024 Wizam. All rights reserved.</p>
        </div>

        {/* Links */}
        <div className="space-x-6 text-sm">
          <Link href="/terms-and-conditions">
            <span className="text-gray-400 hover:text-white transition-colors">Terms and Conditions</span>
          </Link>
          <Link href="/privacy-policy">
            <span className="text-gray-400 hover:text-white transition-colors">Privacy Policy</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
