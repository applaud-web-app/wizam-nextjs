"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";
import { useSiteSettings } from "@/context/SiteContext"; // Import the SiteContext hook

interface SubscriptionData {
  id: string;
  plan_name: string;
  plan_price: number; // Assume plan_price is a number for formatting
  purchase_date: string;
  ends_date: string;
  status: string;
  type: string;
}

const Subscription: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Access site settings from the SiteContext
  const { siteSettings } = useSiteSettings();

  // Fallback currency symbol
  const currencySymbol = siteSettings?.currency_symbol || "$";

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) throw new Error("Authorization token not found.");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/my-subscription`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if subscriptions exist and is an array
        if (response.data.status && Array.isArray(response.data.subscriptions)) {
          setSubscriptions(response.data.subscriptions);
        } else {
          throw new Error("Failed to fetch subscriptions.");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const getStatusBadge = (status: string) => {
    let badgeClass = "";
    switch (status) {
      case "active":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "expiry":
        badgeClass = "bg-red-100 text-red-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
        break;
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
      >
        {status}
      </span>
    );
  };

  if (loading) return <Loader />;

  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (subscriptions.length === 0)
    return <NoData message="No subscriptions found." />;

  return (
    <div className="w-full">
      <div className="bg-white shadow-sm rounded-lg p-1">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto whitespace-nowrap">
            <thead className="bg-defaultcolor text-white">
              <tr>
                <th className="p-3 text-left rounded-tl-lg">S.No</th>
                <th className="p-3 text-left">Plan Name</th>
                <th className="p-3 text-left">Plan Price</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((subscription, index) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 capitalize">{subscription.plan_name}</td>
                  <td className="p-4">
                    {currencySymbol}
                    {subscription.plan_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-4 capitalize">
                    {subscription.type}
                  </td>
                  <td className="p-4">{`${subscription.purchase_date} to ${subscription.ends_date}`}</td>
                  <td className="p-4 capitalize">{getStatusBadge(subscription.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
