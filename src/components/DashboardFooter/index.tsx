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
          <a href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">Terms and Conditions</a>
          <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
