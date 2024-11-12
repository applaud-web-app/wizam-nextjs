"use client";
import { FC, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname from next/navigation
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSiteSettings } from "@/context/SiteContext";
import NoData from "./NoData";
import Loader from "./Loader";

interface InvoiceProps {
  productName: string;
  price: string;
  transactionId: string;
  date: string;
  email: string;
  customerName?: string;
  billingAddress: string;
  subscriptionPeriod: string;
  nextBillingDate: string;
  subscriptionPrice: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  ownerName: string;
}

const Invoice: FC<Partial<InvoiceProps>> = () => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { siteSettings, loading: siteLoading, error: siteError } = useSiteSettings();
  const router = useRouter();
  const pathname = usePathname();

  // Extract subscriptionId from pathname
  const subscriptionId = pathname.split("/").pop();

  useEffect(() => {
    if (!subscriptionId) return; // Wait until subscriptionId is available

    const fetchInvoiceData = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) throw new Error("Authorization token not found.");

        const invoiceResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoice-detail/${subscriptionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoiceData(invoiceResponse.data);

        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(userResponse.data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load invoice or user details. Please try again.");
      }
    };

    fetchInvoiceData();
  }, [subscriptionId]); // Refetch data if subscriptionId changes

  const downloadInvoice = () => {
    const invoiceElement = document.getElementById("invoice-section");

    if (!invoiceElement) return;

    html2canvas(invoiceElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("invoice.pdf");
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (siteError) {
    return <div>{siteError}</div>;
  }

  if (siteLoading || !siteSettings) {
    return <Loader />;
  }

  if (!invoiceData || !invoiceData.data || !userData) {
    return <NoData message="No invoice data available." />;
  }

  // Safely access nested properties with optional chaining and fallback values
  const companyName = invoiceData?.data?.billing?.vendor_name || "Not available";
  const companyAddress = invoiceData?.data?.billing
    ? `${invoiceData.data.billing.address || ""}, ${invoiceData.data.billing.city_name || ""}, ${invoiceData.data.billing.state_name || ""}, ${invoiceData.data.billing.country_name || ""}, ${invoiceData.data.billing.zip || ""}`
    : "Not available";
  const productName = invoiceData?.data?.subscription?.plan_name || "Not available";
  const price = invoiceData?.data?.subscription?.plan_price || "Not available";
  const subscriptionPeriod = "3 Months"; // Assume static period, adjust as necessary
  const nextBillingDate = invoiceData?.data?.subscription?.ends_date || "Not available";
  const date = invoiceData?.data?.subscription?.created_at || "Not available";
  const billingAddress = invoiceData?.data?.billing
    ? `${invoiceData.data.billing.address || ""}, ${invoiceData.data.billing.city_name || ""}, ${invoiceData.data.billing.state_name || ""}, ${invoiceData.data.billing.country_name || ""}, ${invoiceData.data.billing.zip || ""}`
    : "Not available";
  const transactionId = invoiceData?.data?.subscription?.transaction_id || "Not available";

  // Extracting user data safely
  const customerName = userData?.name || "Not available";
  const email = userData?.email || "Not available";
  const phoneNumber = userData?.phone_number || "Not available";

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div id="invoice-section" className="bg-white p-8 rounded-xl border border-gray-200 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-secondary mb-2">Invoice</h1>
              <p className="text-sm text-gray-600">{siteSettings.site_name}</p>
              <p className="text-sm text-gray-600">{siteSettings.address}</p>
              <p className="text-sm text-gray-600">{siteSettings.email}</p>
            </div>
            <Image src={siteSettings.site_logo} alt="Logo" className="w-auto h-10" width={100} height={100} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Customer Information</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Name:</strong> {customerName}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Billing Address:</strong> {billingAddress}</p>
                <p><strong>Phone:</strong> {phoneNumber}</p>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Invoice Details</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Invoice Date:</strong> {date}</p>
                <p><strong>Transaction ID:</strong> {transactionId}</p>
                <p><strong>Payment Method:</strong> Credit Card</p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-2">Subscription Summary</h2>
            <table className="w-full text-left">
              <thead className="bg-gray-200 text-sm">
                <tr>
                  <th className="py-3 px-4 text-gray-700">Product</th>
                  <th className="py-3 px-4 text-gray-700">Subscription Period</th>
                  <th className="py-3 px-4 text-gray-700">Price</th>
                  <th className="py-3 px-4 text-gray-700">Next Billing Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 text-gray-600">{productName}</td>
                  <td className="py-4 px-4 text-gray-600">{subscriptionPeriod}</td>
                  <td className="py-4 px-4 text-gray-600">{siteSettings.currency_symbol}{price}</td>
                  <td className="py-4 px-4 text-gray-600">{nextBillingDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-800 mt-2">Total:</h3>
              <p className="text-lg font-bold text-gray-800">{siteSettings.currency_symbol}{price}</p>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Owner Information</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Company:</strong> {siteSettings.site_name}</p>
              <p><strong>Email:</strong> {siteSettings.email}</p>
              <p><strong>Address:</strong> {siteSettings.address}</p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-10 mb-3">{siteSettings.copyright}</p>
        </div>
        <div className="text-center max-w-4xl mx-auto mt-3">
          <button
            onClick={downloadInvoice}
            className="bg-secondary hover:bg-secondary-dark text-white px-3 py-2 w-full rounded-lg text-center"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </section>
  );
};

export default Invoice;
