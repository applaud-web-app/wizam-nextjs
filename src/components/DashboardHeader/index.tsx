import { FiMenu } from "react-icons/fi";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between lg:justify-end">
      <button
        onClick={toggleSidebar}
        className="text-gray-800 focus:outline-none lg:hidden"
      >
        <FiMenu size={24} />
      </button>
      <div className="text-xl font-semibold text-gray-800">
        Dashboard Header
      </div>
    </header>
  );
}
