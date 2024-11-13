"use client";

import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  Font,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import Cookies from "js-cookie";
import axios from "axios";
import { useSearchParams } from "next/navigation";

// Define colors and fonts
const colors = {
  primary: "#2A3B61",
  secondary: "#A6DCEF",
  gray: "#e5f3ff",
  black: "#000",
  white: "#fff",
};

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: colors.white,
    lineHeight: 1.2,
    border: "1px solid #A6DCEF",
    margin: 10,
    borderRadius: 8,
  },
  container: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "1px solid #A6DCEF",
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    height: "auto",
  },
  siteInfo: {
    textAlign: "right",
    fontSize: 12,
    color: colors.black,
  },
  siteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    marginTop: 20,
    borderBottom: "1px solid #A6DCEF",
    paddingBottom: 5,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 6,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    backgroundColor: colors.gray,
  },
  billingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  customerInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  infoText: {
    fontSize: 12,
    color: colors.black,
    marginBottom: 4,
  },
  paymentDetails: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ddd",
  },
  tableContainer: {
    border: "1px solid #ddd",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.gray,
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    padding: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
  },
  totalContainer: {
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ddd",
    marginBottom: 20,
    backgroundColor: colors.gray,
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "right",
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    color: colors.black,
    marginTop: 20,
    borderTop: "1px solid #A6DCEF",
    paddingTop: 10,
  },
});

const InvoicePDF: React.FC<{ invoiceData: any; userData: any; siteSettings: any }> = ({
  invoiceData,
  userData,
  siteSettings,
}) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image style={styles.logo} src={siteSettings?.site_logo || "/images/logo/wizam-logo.png"} />
          <View style={styles.siteInfo}>
            <Text style={styles.siteTitle}>{siteSettings?.site_name || "Company Name"}</Text>
            <Text>{siteSettings?.address || "Address not available"}</Text>
            <Text>Email: {siteSettings?.email || "Email not available"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Invoice</Text>

        {/* Billing and Customer Information */}
        <View style={styles.infoSection}>
          <View style={styles.billingInfo}>
            <Text style={styles.subTitle}>Billing Information</Text>
            <Text style={styles.infoText}>Vendor Name: {invoiceData?.billing?.vendor_name || "Not available"}</Text>
            <Text style={styles.infoText}>Address: {invoiceData?.billing?.address || "Not available"}</Text>
            <Text style={styles.infoText}>City: {invoiceData?.billing?.city_name || "Not available"}</Text>
            <Text style={styles.infoText}>State: {invoiceData?.billing?.state_name || "Not available"}</Text>
            <Text style={styles.infoText}>Country: {invoiceData?.billing?.country_name || "Not available"}</Text>
            <Text style={styles.infoText}>ZIP: {invoiceData?.billing?.zip || "Not available"}</Text>
            <Text style={styles.infoText}>Phone Number: {invoiceData?.billing?.phone_number || "Not available"}</Text>
            <Text style={styles.infoText}>VAT Number: {invoiceData?.billing?.vat_number || "Not available"}</Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.subTitle}>Customer Information</Text>
            <Text style={styles.infoText}>Name: {userData?.name || "Not available"}</Text>
            <Text style={styles.infoText}>Email: {userData?.email || "Not available"}</Text>
          </View>
        </View>

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.paymentDetails}>
          <Text style={styles.infoText}>Payment ID: {invoiceData?.payment?.id || "Not available"}</Text>
          <Text style={styles.infoText}>Subscription ID: {invoiceData?.payment?.subscription_id || "Not available"}</Text>
          <Text style={styles.infoText}>Transaction ID: {invoiceData?.payment?.stripe_payment_id || "Not available"}</Text>
          <Text style={styles.infoText}>
            Amount: {invoiceData?.payment?.amount || "Not available"} {invoiceData?.payment?.currency || ""}
          </Text>
          <Text style={styles.infoText}>Status: {invoiceData?.payment?.status || "Not available"}</Text>
          <Text style={styles.infoText}>Date: {invoiceData?.payment?.created_at || "Not available"}</Text>
        </View>

        {/* Product Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Product</Text>
            <Text style={styles.tableHeaderCell}>Price</Text>
            <Text style={styles.tableHeaderCell}>Subscription Period</Text>
            <Text style={styles.tableHeaderCell}>Next Billing Date</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{invoiceData?.payment?.subscription_id || "Not available"}</Text>
            <Text style={styles.tableCell}>
              {siteSettings?.currency_symbol}{invoiceData?.payment?.amount || "Not available"}
            </Text>
            <Text style={styles.tableCell}>One-Time</Text>
            <Text style={styles.tableCell}>{invoiceData?.subscription?.ends_date || "Not applicable"}</Text>
          </View>
        </View>

        {/* Total Amount */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total: {siteSettings?.currency_symbol}{invoiceData?.payment?.amount || "Not available"}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>If you have any questions, feel free to contact us at {siteSettings?.email || "Email not available"}.</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Component for generating and previewing the PDF
const InvoiceGenerator: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sid = searchParams.get("invoice");

  useEffect(() => {
    if (!sid) return;

    const fetchInvoiceData = async () => {
      try {
        const token = Cookies.get("jwt") || "";
        const [invoiceRes, userRes, siteRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoice-detail/${sid}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/site-setting`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setInvoiceData(invoiceRes.data.data);
        setUserData(userRes.data.user);
        setSiteSettings(siteRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching invoice data:", err);
        setError("Failed to load invoice data.");
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [sid]);

  const generatePdfPreview = async () => {
    if (invoiceData && userData && siteSettings) {
      const doc = <InvoicePDF invoiceData={invoiceData} userData={userData} siteSettings={siteSettings} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "invoice.pdf";
      link.click();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <button onClick={generatePdfPreview} className="px-5 py-2 bg-blue-500 text-white w-full hover:bg-blue-700 cursor-pointer mb-4">
        Generate Invoice Preview
      </button>

      {pdfUrl && (
        <div>
          <iframe src={pdfUrl} title="Invoice PDF Preview" width="100%" height="600px" style={{ border: "1px solid #ddd", marginBottom: "20px" }} />
          <button onClick={downloadPdf} className="px-5 py-2 bg-green-500 text-white w-full hover:bg-green-700 cursor-pointer">
            Download Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
