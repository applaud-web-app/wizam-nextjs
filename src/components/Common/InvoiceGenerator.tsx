import React, { useEffect, useState } from "react";
import { pdf, Document, Page, Text, View, Font, StyleSheet, Image } from "@react-pdf/renderer";
import Cookies from "js-cookie";
import axios from "axios";
import { format } from 'date-fns';

interface InvoiceGeneratorProps {
  invoiceId: string;
  onDownloadComplete: () => void;
}

interface Features {
  exams: string[];
  quizzes: string[];
  practices: string[];
  lessons: string[];
  videos: string[];
}

interface InvoiceData {
  billing: {
    vendor_name: string;
    address: string;
    city_name: string;
    state_name: string;
    country_name: string;
    zip: string;
    phone_number: string;
    vat_number: string;
  };
  payment: {
    stripe_payment_id: string;
    amount: string;
    created_at: string;
    status: string;
  };
  features: Features;
}

const colors = {
  primary: "#004c97",    // Dark blue for headings
  secondary: "#70a7d9",  // Lighter blue for accents
  gray: "#f4f6f9",       // Light gray for backgrounds
  black: "#333",         // Dark text color for readability
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
    padding: 15,  // Increased padding for a more spacious look
    fontSize: 12, // Slightly larger font size
    fontFamily: "Roboto",
    backgroundColor: colors.white,
    lineHeight: 1.4,
  },
  container: {
    
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: colors.white,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
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
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    textTransform: "uppercase",
    borderBottom: `2px solid ${colors.secondary}`,
    paddingBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 15,
  
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
    fontSize: 11,
    color: colors.black,
    marginBottom: 5,
  },
  paymentDetails: {
    marginBottom: 20,
    padding: 15,
  
    border: `1px solid ${colors.secondary}`,
    backgroundColor: colors.gray,
  },
  tableContainer: {
    border: `1px solid ${colors.secondary}`,
  
    marginBottom: 20,
    overflow: "hidden",
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
    borderBottom: `1px solid ${colors.gray}`,
    padding: 8,
    backgroundColor: "#fafafa",
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 1.4,
  },
  totalContainer: {
    marginBottom: 30,
    padding: 15,
   
    border: `1px solid ${colors.secondary}`,
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
    marginTop: 30,
    borderTop: `1px solid ${colors.secondary}`,
    paddingTop: 10,
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

        const invoiceData: InvoiceData = invoiceRes.data.data;
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
                    <Text style={styles.infoText}>Phone: {invoiceData.billing.phone_number || "Not available"}</Text>
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
                    <Text style={styles.tableHeaderCell}>Amount</Text>
                    <Text style={styles.tableHeaderCell}>Date</Text>
                    <Text style={styles.tableHeaderCell}>Status</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{invoiceData.payment.stripe_payment_id || "Not available"}</Text>
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

                {/* Features Table */}
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Exams</Text>
                    <Text style={styles.tableHeaderCell}>Lessons</Text>
                    <Text style={styles.tableHeaderCell}>Videos</Text>
                    <Text style={styles.tableHeaderCell}>Quizzes</Text>
                    <Text style={styles.tableHeaderCell}>Practices</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {invoiceData.features.exams.join(", ") || "Not available"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {invoiceData.features.lessons.join(", ") || "Not available"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {invoiceData.features.videos.join(", ") || "Not available"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {invoiceData.features.quizzes.join(", ") || "Not available"}
                    </Text>
                    <Text style={styles.tableCell}>
                      {invoiceData.features.practices.join(", ") || "Not available"}
                    </Text>
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
