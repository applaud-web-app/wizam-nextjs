// pages/MyProgressPage.tsx

import Progress from "@/components/Dashboard/Progress";


const MyProgressPage: React.FC = () => {
  return (
    <div className="dashboard-page">
    <h1 className="text-3xl lg:text-4xl font-bold mb-6">
        Progress
      </h1>
      <Progress />
    </div>
  );
};

export default MyProgressPage;
