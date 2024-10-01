export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400">© 2024 Wizam. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="/terms-and-conditions" className="text-gray-400 hover:text-white">Terms & Conditions</a>
          <a href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
