"use client";

import React, { useEffect, useState } from "react";
import { pdf, Document, Page, Text, View, Font, StyleSheet, Image } from "@react-pdf/renderer";
import Cookies from "js-cookie";
import axios from "axios";
import { format } from 'date-fns';

interface InvoiceGeneratorProps {
  invoiceId: string;
  onDownloadComplete: () => void;
}

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
    padding: 10,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: colors.white,
    lineHeight: 1.4,
  },
  container: {
    padding: 20,
    borderRadius: 6,
    border: "1px solid #ddd",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2px solid #A6DCEF",
    paddingBottom: 15,
  },
  logo: {
    width: 90,
    height: "auto",
  },
  siteInfo: {
    textAlign: "right",
    fontSize: 12,
    color: colors.black,
  },
  siteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    marginTop: 20,
    borderBottom: "2px solid #A6DCEF",
    paddingBottom: 6,
    textTransform: "uppercase",
    backgroundColor: colors.gray,
    padding: 5,
    borderRadius: 4,
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
    padding: 12,
    borderRadius: 4,
    backgroundColor: colors.gray,
    border: "1px solid #ddd",
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
    lineHeight: 1.3,
  },
  paymentDetails: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ddd",
    backgroundColor: colors.gray,
  },
  tableContainer: {
    border: "1px solid #ddd",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    color: colors.white,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    whiteSpace: "pre", 
    lineHeight: 1.2,      
  },
  totalContainer: {
    padding: 15,
    borderRadius: 4,
    border: "1px solid #ddd",
    marginBottom: 20,
    backgroundColor: colors.gray,
  },
  totalText: {
    fontSize: 16,
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
    opacity: 0.8,
  },
});

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ invoiceId, onDownloadComplete }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateInvoicePdf = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwt") || "";
        const [invoiceRes, userRes, siteRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoice-detail/${invoiceId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/site-setting`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const invoiceData = invoiceRes.data.data;
        const userData = userRes.data.user;
        const siteSettings = siteRes.data.data;

        const doc = (
          <Document>
            <Page style={styles.page}>
              <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                  <Image style={styles.logo} src="/images/logo/wizam-logo.png" />
                  <View style={styles.siteInfo}>
                    <Text style={styles.siteTitle}>{siteSettings.site_name}</Text>
                    <Text>{siteSettings.address}</Text>
                    <Text>Email: {siteSettings.email}</Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Invoice</Text>

                {/* Billing and Customer Information */}
                <View style={styles.infoSection}>
                  <View style={styles.billingInfo}>
                    <Text style={styles.subTitle}>Billing Information</Text>
                    <Text style={styles.infoText}>Vendor Name: {invoiceData.billing.vendor_name || "Not available"}</Text>
                    <Text style={styles.infoText}>Address: {invoiceData.billing.address || "Not available"}</Text>
                    <Text style={styles.infoText}>City: {invoiceData.billing.city_name || "Not available"}</Text>
                    <Text style={styles.infoText}>State: {invoiceData.billing.state_name || "Not available"}</Text>
                    <Text style={styles.infoText}>Country: {invoiceData.billing.country_name || "Not available"}</Text>
                    <Text style={styles.infoText}>ZIP: {invoiceData.billing.zip || "Not available"}</Text>
                    <Text style={styles.infoText}>Phone Number: {invoiceData.billing.phone_number || "Not available"}</Text>
                    <Text style={styles.infoText}>VAT Number: {invoiceData.billing.vat_number || "Not available"}</Text>
                  </View>

                  <View style={styles.customerInfo}>
                    <Text style={styles.subTitle}>Customer Information</Text>
                    <Text style={styles.infoText}>Name: {userData.name || "Not available"}</Text>
                    <Text style={styles.infoText}>Email: {userData.email || "Not available"}</Text>
                  </View>
                </View>

                {/* Product Table */}
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Transaction ID</Text>
                    <Text style={styles.tableHeaderCell}></Text>
                    <Text style={styles.tableHeaderCell}>Price</Text>
                    <Text style={styles.tableHeaderCell}>Purchase Date</Text>
                    <Text style={styles.tableHeaderCell}>Status</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{invoiceData.payment.stripe_payment_id || "Not available"}</Text>
                    <Text style={styles.tableCell}></Text>
                    <Text style={styles.tableCell}>
                      {siteSettings.currency_symbol}{invoiceData.payment.amount || "Not available"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {invoiceData.payment.created_at
                        ? format(new Date(invoiceData.payment.created_at), 'dd/MM/yyyy')
                        : "Not applicable"}
                    </Text>
                    <Text style={styles.tableCell}>{invoiceData.payment.status || "Not available"}</Text>
                  </View>
                </View>

                {/* Total Amount */}
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>
                    Total: {siteSettings.currency_symbol}{invoiceData.payment.amount || "Not available"}
                  </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text>Thank you for your business!</Text>
                  <Text>If you have any questions, feel free to contact us.</Text>
                </View>
              </View>
            </Page>
          </Document>
        );

        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${invoiceId}.pdf`;
        link.click();
        onDownloadComplete();
      } catch (error) {
        console.error("Error generating invoice PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    generateInvoicePdf();
  }, [invoiceId, onDownloadComplete]);

  return loading ? <p>Generating Invoice...</p> : null;
};

export default InvoiceGenerator;
