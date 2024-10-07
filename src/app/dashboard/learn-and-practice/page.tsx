import { FaBook, FaVideo, FaPen } from 'react-icons/fa'; // React icons
import Link from 'next/link';

export default function LearnAndPractice() {
  return (
    <div className="dashboard-page">
       <h1 className="text-2xl font-bold mb-5">Learn and Practice</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {/* Practice Set Card */}
        <Link href="/dashboard/practice-test">
          <div className="card flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-transform  border border-white hover:shadow-none hover:border-blue-500 ">
            <FaPen className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Practice Set</h3>
          </div>
        </Link>

        {/* Videos Card */}
        <Link href="/dashboard/videos">
          <div className="card flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-transform  border border-white hover:shadow-none hover:border-green-500 ">
            <FaVideo className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Videos</h3>
          </div>
        </Link>

        {/* Lesson Card */}
        <Link href="/dashboard/lessons">
          <div className="card flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-transform  border border-white hover:shadow-none hover:border-yellow-500 ">
            <FaBook className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Lesson</h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
