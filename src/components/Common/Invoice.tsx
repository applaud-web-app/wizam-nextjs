"use client";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSiteSettings } from "@/context/SiteContext"; // Import the site settings context
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

  // Access site settings from context
  const { siteSettings, loading: siteLoading, error: siteError } = useSiteSettings();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) throw new Error("Authorization token not found.");

        const invoiceResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoice-detail`, {
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
  }, []);

  const downloadInvoice = () => {
    const invoiceElement = document.getElementById("invoice-section");

    if (!invoiceElement) return;

    html2canvas(invoiceElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate the dimensions for the PDF
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to the PDF
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // If the content is longer than one page, add extra pages
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
    return <Loader />; // Show Loader when data is being fetched
  }

  if (!invoiceData || !userData) {
    return <NoData message="No invoice data available." />; // Show NoData when no data is available
  }

  // Extracting invoice data
  const {
    billing: { vendor_name, address, city_name, state_name, country_name, zip },
    subscription: { purchase_date, ends_date, plan_name, plan_price },
  } = invoiceData.data;

  const companyName = vendor_name;
  const companyAddress = `${address}, ${city_name}, ${state_name}, ${country_name}, ${zip}`;
  const productName = plan_name;
  const price = plan_price;
  const subscriptionPeriod = "3 Months";
  const nextBillingDate = ends_date;
  const date = purchase_date;
  const billingAddress = `${address}, ${city_name}, ${state_name}, ${country_name}, ${zip}`;

  // Extracting user data from profile API response
  const customerName = userData.name;
  const email = userData.email;
  const phoneNumber = userData.phone_number;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div id="invoice-section" className="bg-white p-8 rounded-xl border border-gray-200 max-w-4xl mx-auto">
          {/* Header with Company Information */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-secondary mb-2">Invoice</h1>
              {/* Display site logo and site name from the context */}
              <p className="text-sm text-gray-600">{siteSettings.site_name}</p>
              <p className="text-sm text-gray-600">{siteSettings.address}</p>
              <p className="text-sm text-gray-600">{siteSettings.email}</p>
            </div>

            <Image src={siteSettings.site_logo} alt="Logo" className="w-auto h-10" width={100} height={100} />
          </div>

          {/* Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Customer Information */}
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Customer Information</h2>
              <div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Name:</strong> {customerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Billing Address:</strong> {billingAddress}
                  </p>
                  <p>
                    <strong>Phone:</strong> {phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Invoice Details</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Invoice Date:</strong> {date}
                </p>
                <p>
                  <strong>Transaction ID:</strong> 123456789
                </p>
                <p>
                  <strong>Payment Method:</strong> Credit Card
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Summary */}
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

          {/* Payment Summary */}
          <div className="mb-6">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-800 mt-2">Total:</h3>
              <p className="text-lg font-bold text-gray-800">{siteSettings.currency_symbol}{price}</p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Owner Information</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Company:</strong> {siteSettings.site_name}
              </p>
              <p>
                <strong>Email:</strong> {siteSettings.email}
              </p>
              <p>
                <strong>Address:</strong> {siteSettings.address}
              </p>
            </div>
          </div>

          {/* Footer */}
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
