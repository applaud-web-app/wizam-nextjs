// components/Dashboard/Progress/Progress.tsx
"use client";
import { useState } from "react";
import { FaBook, FaListAlt, FaTasks } from "react-icons/fa";
import ExamsTable from "./ExamsTable";
import QuizzesTable from "./QuizzesTable";
import PracticeTestsTable from "./PracticeTestsTable";

const tabs = [
  { name: "Exam Attempt", icon: <FaBook /> },
  { name: "Quiz Attempt", icon: <FaListAlt /> },
  { name: "Practice Session", icon: <FaTasks /> },
];

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Exam Attempt");

  return (
    <div className="dashboard-page">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-3 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full sm:w-1/3 px-6 py-2 text-lg font-semibold bg-white transition-colors border-b-2 duration-300 flex items-center justify-center
              ${
                activeTab === tab.name
                  ? "border-quaternary text-quaternary "
                  : "text-gray-600 border-transparent hover:bg-quaternary hover:text-white"
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Render the table based on active tab */}
      <div className="bg-white p-1 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {activeTab === "Exam Attempt" && <ExamsTable />}
          {activeTab === "Quiz Attempt" && <QuizzesTable />}
          {activeTab === "Practice Session" && <PracticeTestsTable />}
        </div>
      </div>
    </div>
  );
};

export default Progress;
