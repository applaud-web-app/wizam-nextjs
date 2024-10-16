// pages/MyPaymentsPage.tsx

import Payments from "@/components/Dashboard/Payments";


const MyPaymentsPage: React.FC = () => {
  return (
    <div className="dashboard-page">
       <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-5 sm:mb-6">My Payments</h1>
      <Payments />
    </div>
  );
};

export default MyPaymentsPage;
