"use client";

import ProgressTable from "@/components/Dashboard/Progress/ProgressTable";
import { useState, useEffect } from "react";
import { FaBook, FaListAlt, FaTasks } from "react-icons/fa"; // Importing icons

// Define the structure of the progress data
interface ProgressData {
  sno: number;
  title: string;
  completedDate: string;
  status: string;
  score: string;
  result: string;
}

// Mock data for each tab
const mockExamsData: ProgressData[] = [
  { sno: 1, title: "Math Exam", completedDate: "2024-10-01", status: "Completed", score: "85%", result: "Passed" },
  { sno: 2, title: "Science Exam", completedDate: "2024-09-20", status: "Completed", score: "90%", result: "Passed" },
];

const mockQuizzesData: ProgressData[] = [
  { sno: 1, title: "JavaScript Quiz", completedDate: "2024-09-15", status: "Completed", score: "75%", result: "Passed" },
  { sno: 2, title: "React Quiz", completedDate: "2024-09-10", status: "Completed", score: "80%", result: "Passed" },
];

const mockPracticeTestsData: ProgressData[] = [
  { sno: 1, title: "Java Practice Test", completedDate: "2024-09-25", status: "Completed", score: "88%", result: "Passed" },
  { sno: 2, title: "CSS Practice Test", completedDate: "2024-09-22", status: "Completed", score: "70%", result: "Passed" },
];

const tabs = [
  { name: "Exams", icon: <FaBook /> },
  { name: "Quizzes", icon: <FaListAlt /> },
  { name: "Practice Tests", icon: <FaTasks /> },
];

const MyProgressPage: React.FC = () => {
  // Use the explicit type ProgressData[] for the state
  const [activeTab, setActiveTab] = useState<string>("Exams");
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  useEffect(() => {
    // Fetch the correct data based on the active tab
    switch (activeTab) {
      case "Exams":
        setProgressData(mockExamsData);
        break;
      case "Quizzes":
        setProgressData(mockQuizzesData);
        break;
      case "Practice Tests":
        setProgressData(mockPracticeTestsData);
        break;
      default:
        setProgressData([]);
    }
  }, [activeTab]);

  return (
    <div className="dashboard-page">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-5 sm:mb-6">My Progress</h1>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-3 bg-white p-3 rounded-lg shadow-sm mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`w-full sm:w-auto flex items-center justify-center sm:justify-start px-6 py-2 text-lg font-semibold transition-colors duration-300 rounded-lg ${
              activeTab === tab.name
                ? "bg-primary text-white" // Active Tab Style
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-primary" // Inactive Tab Style with hover effect
            }`}
          >
            <span className="mr-2">{tab.icon}</span> {/* Add Icon */}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Render the table based on active tab */}
      <div className="bg-white p-1 sm:p-3 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <ProgressTable data={progressData} />
        </div>
      </div>
    </div>
  );
};

export default MyProgressPage;
