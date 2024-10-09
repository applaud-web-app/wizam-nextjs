// pages/MyProgressPage.tsx

import Progress from "@/components/Dashboard/Progress";


const MyProgressPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-5 sm:mb-6">My Progress</h1>
      <Progress />
    </div>
  );
};

export default MyProgressPage;
