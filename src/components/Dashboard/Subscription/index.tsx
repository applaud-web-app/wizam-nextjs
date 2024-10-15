"use client"; // This makes the component run on the client side for fetching data

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/Common/Loader"; // Ensure this path is correct
import NoData from "@/components/Common/NoData";

interface SubscriptionData {
  plan_name: string;
  plan_price: string;
  purchase_date: string;
  ends_date: string;
  status: string;
}

const Subscription: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) throw new Error("Authorization token not found.");

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/my-subscription`, {
          headers: {
            Authorization: `Bearer ${token}`,// Sample token
          },
        });

        if (response.data.status) {
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
      case "Active":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "Ended":
        badgeClass = "bg-red-100 text-red-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
        break;
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{status}</span>;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (subscriptions.length === 0) {
    return <NoData message="No subscriptions found." />;
  }

  return (
    <div className="subscription-details bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Subscription Details</h2>
      {subscriptions.map((subscription, index) => (
        <div
          key={index}
          className={`mb-4 p-4 rounded-lg ${subscription.status === "Active" ? "border-2 border-green-500 bg-green-50" : "border border-gray-300"}`}
        >
          <div className="mb-2">
            <span className="font-semibold">Plan Name: </span>
            <span>{subscription.plan_name}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Plan Price: </span>
            <span>{subscription.plan_price}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Purchase Date: </span>
            <span>{subscription.purchase_date}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Ends Date: </span>
            <span>{subscription.ends_date}</span>
          </div>
          <div className="mb-2 flex items-center">
            <span className="font-semibold mr-2">Status: </span>
            {getStatusBadge(subscription.status)}
          </div>
         
        </div>
      ))}
    </div>
  );
};

export default Subscription;
