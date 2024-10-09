// components/dashboard/ProgressTable.tsx
import React from "react";
import Link from 'next/link'; // Assuming you're using Next.js

// Define the structure of the props expected by the component
interface ProgressTableProps {
  data: {
    sno: number;
    title: string;
    completedDate: string;
    status: string;
    score: string;
    result: string;
    resultLink?: string; // Optionally add a link to result if available
  }[];
}

const ProgressTable: React.FC<ProgressTableProps> = ({ data }) => {
  // Helper function to return status badge
  const getStatusBadge = (status: string) => {
    const statusClasses =
      status === "Completed"
        ? "text-green-600 bg-green-100"
        : "text-red-600 bg-red-100";
    return (
      <span className={`px-2 py-1 rounded-lg text-sm font-medium ${statusClasses}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto whitespace-nowrap">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-3 text-left rounded-tl-lg">S.No</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Completed Date</th>
            <th className="p-3 text-left">Score</th>
            <th className="p-3 text-left">Result</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left rounded-tr-lg">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4">{item.sno}</td>
              <td className="p-4">{item.title}</td>
              <td className="p-4">{item.completedDate}</td>
              <td className="p-4">{item.score}</td>
              <td className="p-4">{item.result}</td>
              <td className="p-4">{getStatusBadge(item.status)}</td>
              <td className="p-4">
                {item.resultLink ? (
                  <Link href={item.resultLink}>
                    <span className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-600 transition">
                      Go to Result
                    </span>
                  </Link>
                ) : (
                  <button
                    className="bg-gray-300 text-gray-500 px-3 py-1 text-sm rounded-lg cursor-not-allowed"
                    disabled
                  >
                    No Result
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressTable;
