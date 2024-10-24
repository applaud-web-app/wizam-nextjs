"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
import Subscription from "@/components/Dashboard/Subscription";

const MySubscriptionPage: React.FC = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <div className="dashboard-page">
      <h1 className="text-3xl lg:text-4xl font-bold mb-6">
        My Subscription
      </h1>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <Link href="/dashboard/profile" className="w-full">
          <span
            className={`text-lg font-semibold cursor-pointer bg-white block text-center py-2 px-5 ${
              pathname === "/dashboard/profile"
                ? "text-defaultcolor border-b-2 border-defaultcolor"
                : "text-gray-500 hover:text-defaultcolor"
            }`}
          >
            Profile
          </span>
        </Link>
        <Link href="/dashboard/my-payments" className="w-full">
          <span
            className={`text-lg font-semibold cursor-pointer bg-white block text-center py-2 px-5 ${
              pathname === "/dashboard/my-payments"
                ? "text-defaultcolor border-b-2 border-defaultcolor"
                : "text-gray-500 hover:text-defaultcolor"
            }`}
          >
            My Payments
          </span>
        </Link>
        <Link href="/dashboard/my-subscription" className="w-full">
          <span
            className={`text-lg font-semibold cursor-pointer bg-white block text-center py-2 px-5 ${
              pathname === "/dashboard/my-subscription"
                ? "text-defaultcolor border-b-2 border-defaultcolor"
                : "text-gray-500 hover:text-defaultcolor"
            }`}
          >
            Subscriptions
          </span>
        </Link>
      </div>

      {/* Subscription Component */}
      <div>
        <Subscription />
      </div>
    </div>
  );
};

export default MySubscriptionPage;
