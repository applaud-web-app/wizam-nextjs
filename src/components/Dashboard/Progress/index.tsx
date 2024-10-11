// components/Dashboard/Progress/Progress.tsx
"use client";
import { useState } from "react";
import { FaBook, FaListAlt, FaTasks } from "react-icons/fa";
import ExamsTable from "./ExamsTable";
import QuizzesTable from "./QuizzesTable";
import PracticeTestsTable from "./PracticeTestsTable";


const tabs = [
  { name: "Exams", icon: <FaBook /> },
  { name: "Quizzes", icon: <FaListAlt /> },
  { name: "Practice Tests", icon: <FaTasks /> },
];

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Exams");

  return (
    <div className="dashboard-page">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-3 bg-white p-3 rounded-lg shadow-sm mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full sm:w-auto flex items-center justify-center sm:justify-start px-6 py-2 text-lg font-semibold transition-colors duration-300 rounded-lg ${
              activeTab === tab.name
                ? "bg-primary text-dark font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-primary"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Render the table based on active tab */}
      <div className="bg-white p-1 sm:p-3 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {activeTab === "Exams" && <ExamsTable   />}
          {activeTab === "Quizzes" && <QuizzesTable  />}
          {activeTab === "Practice Tests" && <PracticeTestsTable  />}
        </div>
      </div>
    </div>
  );
};

export default Progress;
