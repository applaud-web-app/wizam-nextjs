"use client";
import React, { useState, useEffect, FC } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
  BlobProvider,
} from "@react-pdf/renderer";
import Cookies from "js-cookie";
import axios from "axios";

// Types for data models
interface InvoiceData {
  subscription: {
    created_at: string;
    transaction_id: string;
    plan_name: string;
    plan_price: string;
    ends_date: string;
  };
  billing: {
    address: string;
  };
}

interface UserData {
  name: string;
  email: string;
}

interface SiteSettings {
  site_name: string;
  site_logo: string;
  address: string;
  email: string;
  currency_symbol: string;
}

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: "#f7f7fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottom: "1px solid #ccc",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: "auto",
  },
  siteName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  customerInfo: {
    width: "48%",
  },
  invoiceInfo: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#555",
  },
  text: {
    fontSize: 12,
    color: "#333",
    lineHeight: 1.5,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  tableContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    padding: 8,
  },
  totalSection: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
    textAlign: "right",
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    textAlign: "center",
    fontSize: 10,
    color: "#888",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  icon: {
    width: 12,
    height: 12,
    marginHorizontal: 5,
  },
});


// Invoice PDF structure component
const InvoicePDF: FC<{
  invoiceData: InvoiceData;
  userData: UserData;
  siteSettings: SiteSettings;
}> = ({ invoiceData, userData, siteSettings }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          src={siteSettings?.site_logo || "/images/logo/wizam-logo.png"}
        />
        <Text style={styles.siteName}>{siteSettings?.site_name}</Text>
      </View>

      {/* Customer Information */}
      <View>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <Text style={styles.text}>
          Name: {userData?.name || "Not available"}
        </Text>
        <Text style={styles.text}>
          Email: {userData?.email || "Not available"}
        </Text>
        <Text style={styles.text}>
          Billing Address: {invoiceData?.billing?.address || "Not available"}
        </Text>
      </View>

      {/* Invoice Details */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.sectionTitle}>Invoice Details</Text>
        <Text style={styles.text}>
          Date: {invoiceData?.subscription?.created_at || "Not available"}
        </Text>
        <Text style={styles.text}>
          Transaction ID:{" "}
          {invoiceData?.subscription?.transaction_id || "Not available"}
        </Text>
      </View>

      {/* Subscription Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Product</Text>
          <Text style={styles.tableHeaderCell}>Price</Text>
          <Text style={styles.tableHeaderCell}>Subscription Period</Text>
          <Text style={styles.tableHeaderCell}>Next Billing Date</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>
            {invoiceData?.subscription?.plan_name || "Not available"}
          </Text>
          <Text style={styles.tableCell}>
            {siteSettings?.currency_symbol}
            {invoiceData?.subscription?.plan_price || "Not available"}
          </Text>
          <Text style={styles.tableCell}>3 Months</Text>
          <Text style={styles.tableCell}>
            {invoiceData?.subscription?.ends_date || "Not available"}
          </Text>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <Text style={styles.text}>
          <Text style={styles.label}>Total: </Text>
          {siteSettings?.currency_symbol}
          {invoiceData?.subscription?.plan_price || "Not available"}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          {siteSettings?.site_name} | {siteSettings?.address}
        </Text>
        <Text>{siteSettings?.email}</Text>
      </View>
    </Page>
  </Document>
);


// Component to fetch data and display PDF in iframe
const InvoiceGenerator: FC<{ invoiceId: string }> = ({ invoiceId }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = Cookies.get("jwt") || "";
        const invoiceRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/invoice-detail/${invoiceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInvoiceData(invoiceRes.data);

        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(userRes.data.user);

        const siteRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/site-setting`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSiteSettings(siteRes.data);
      } catch (err) {
        setError("Failed to load invoice data.");
      }
    };
    fetchInvoiceData();
  }, [invoiceId]);

  if (error) return <div>{error}</div>;
  if (!invoiceData || !userData || !siteSettings) return <div>Loading...</div>;

  return (
    <BlobProvider
      document={
        <InvoicePDF
          invoiceData={invoiceData}
          userData={userData}
          siteSettings={siteSettings}
        />
      }
    >
      {({ url, loading, error }) => {
        if (loading) return <div>Loading PDF...</div>;
        if (error || !url) return <div>Error generating PDF</div>;

        return (
          <iframe
            src={url}
            title="Invoice PDF"
            width="100%"
            height="900px"
            style={{ border: "1px solid #ddd", marginTop: "20px" }}
          />
        );
      }}
    </BlobProvider>
  );
};

export default InvoiceGenerator;
