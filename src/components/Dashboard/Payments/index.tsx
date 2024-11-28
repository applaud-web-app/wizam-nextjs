"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/Common/Loader";
import NoData from "@/components/Common/NoData";
import InvoiceGenerator from "@/components/Common/InvoiceGenerator";
import { useSiteSettings } from "@/context/SiteContext"; // Import SiteContext hook

interface PaymentData {
  id: string;
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
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Access site settings
  const { siteSettings } = useSiteSettings();

  // Use currency_symbol from SiteContext
  const currencySymbol = siteSettings?.currency_symbol || "$";

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

  const handleDownloadInvoice = (paymentId: string) => {
    setSelectedInvoiceId(paymentId);
    setDownloading(paymentId);
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
                <th className="p-3 text-left rounded-tr-lg">Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-gray-50">
                  <td className="p-4">{payment.payment_id}</td>
                  <td className="p-4">
                    {currencySymbol}
                    {parseFloat(payment.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-4">{payment.currency.toUpperCase()}</td>
                  <td className="p-4">{new Date(payment.created_at).toLocaleString()}</td>
                  <td className="p-4 capitalize">
                    {getStatusBadge(payment.status === "succeeded" ? "paid" : payment.status)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDownloadInvoice(payment.id)}
                      className="bg-defaultcolor text-white px-3 py-1 text-sm rounded-full hover:bg-defaultcolor-dark transition"
                    >
                      {downloading === payment.id ? "Downloading..." : "Download Invoice"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedInvoiceId && (
        <InvoiceGenerator
          invoiceId={selectedInvoiceId}
          onDownloadComplete={() => {
            setDownloading(null);
            setSelectedInvoiceId(null); // Clear selectedInvoiceId after download
          }}
        />
      )}
    </div>
  );
};

export default Payment;
