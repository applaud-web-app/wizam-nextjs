import { FiUsers, FiFileText, FiBarChart2, FiCheckCircle, FiPercent, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import ResumeExamTable from "@/components/ResumeExamTable";
import UpcomingExamsTable from "@/components/UpcomingExamsTable";
import DashboardCard from "@/components/DashboardCards";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Cards with icons and unique colors */}
        <DashboardCard title="Users" content="1,200 Active Users" icon={<FiUsers />} iconColor="text-blue-500" />
        <DashboardCard title="Reports" content="150 Reports Generated" icon={<FiFileText />} iconColor="text-yellow-500" />
        <DashboardCard title="Analytics" content="5 New Analytics Reports" icon={<FiBarChart2 />} iconColor="text-purple-500" />
        <DashboardCard title="Completed Exams" content="300 Completed Exams" icon={<FiCheckCircle />} iconColor="text-green-500" />
        <DashboardCard title="Average Score" content="75%" icon={<FiPercent />} iconColor="text-indigo-500" />
        <DashboardCard title="Passed" content="240 Passed Exams" icon={<FiThumbsUp />} iconColor="text-green-500" />
        <DashboardCard title="Failed" content="60 Failed Exams" icon={<FiThumbsDown />} iconColor="text-red-500" />
      </div>

      <ResumeExamTable />
      {/* <UpcomingExamsTable /> */}
    </div>
  );
}
