// pages/MySubscriptionPage.tsx

import Subscription from "@/components/Dashboard/Subscription";


const MySubscriptionPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-5 sm:mb-6">My Subscription</h1>
      <Subscription />
    </div>
  );
};

export default MySubscriptionPage;
