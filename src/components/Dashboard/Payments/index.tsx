"use client"; // This makes the component run on the client side for fetching data

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

interface PaymentData {
  payment_id: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
}

const Payment: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) throw new Error("Authorization token not found.");

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/my-payment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setPayments(response.data.payments);
        } else {
          throw new Error("Failed to fetch payments.");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleViewInvoice = (paymentId: string) => {
    router.push(`/invoice/${paymentId}`); // Navigate to invoice page with paymentId
  };

  const getStatusBadge = (status: string) => {
    let badgeClass = "";
    switch (status.toLowerCase()) {
      case "paid":
      case "succeeded":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "failed":
        badgeClass = "bg-red-100 text-red-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
        break;
    }
    return <span className={`px-5 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{status}</span>;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (payments.length === 0) {
    return <NoData message="No payments found." />;
  }

  return (
    <div className="w-full">
      <div className="bg-white shadow-sm rounded-lg p-1">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto whitespace-nowrap">
            <thead className="bg-defaultcolor text-white">
              <tr>
                <th className="p-3 text-left">Payment ID</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Payment Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left rounded-tr-lg">Invoice</th> {/* Column for Invoice button */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4">{payment.payment_id}</td>
                    <td className="p-4">
                      ${parseFloat(payment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">{payment.currency.toUpperCase()}</td>
                    <td className="p-4">{new Date(payment.created_at).toLocaleString()}</td>
                    <td className="p-4">{getStatusBadge(payment.status)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewInvoice(payment.payment_id)}
                        className="bg-blue-500 text-white px-5 py-1 text-sm rounded-full hover:bg-blue-700 transition"
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4" colSpan={6}>
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payment;
