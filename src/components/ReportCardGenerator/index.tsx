"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  BlobProvider,
} from "@react-pdf/renderer";
import Link from "next/link";

// Define the color palette
const colors = {
  primary: "#2A3B61", // Dark Blue for headers and titles
  secondary: "#A6DCEF", // Light Teal for accents
  gray: "#e5f3ff", // Light Gray for table borders and backgrounds
  black: "#333333", // Dark Gray for text instead of black
  white: "#fff", // White for text
  green: "#28A745", // Soft green for pass status
  red: "#FF4D4D", // Soft red for fail status
};

// Create styles for your PDF
const styles = StyleSheet.create({
  page: {
    padding: 12, // Slightly increased padding
    fontSize: 12, // Slightly increased font size
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
    lineHeight: 1.2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7, // Slightly increased margin
    display: "flex",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    display: "flex",
  },

  logo: {
    width: 110, // Slightly increased width of the logo
    height: 'auto',
    marginBottom: 7, // Slightly increased margin
  },
  schoolInfo: {
    fontSize: 12, // Increased font size
    color: colors.black,
    textAlign: "center",
    marginBottom: 7, // Increased margin
  },
  title: {
    fontSize: 14, // Increased font size
    fontWeight: "bold",
    color: colors.black,
  },
  finalResult: {
    fontSize: 16, // Increased font size
    fontWeight: "bold",
    textAlign: "right",
  },
  resultPass: {
    color: colors.green,
  },
  resultFail: {
    color: colors.red,
  },
  sectionTitle: {
    backgroundColor: colors.primary, // Dark Blue
    color: colors.white,
    textAlign: "center",
    borderRadius: 5,
    padding: 6, // Slightly increased padding
    marginBottom: 10, // Increased margin
    fontSize: 14, // Increased font size
    fontWeight: "bold",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10, // Increased margin
  },
  infoBlock: {
    width: "49%",
    backgroundColor: colors.gray, // Light Gray background
    padding: 10, // Slightly increased padding
    borderRadius: 5,
  },
  label: {
    fontWeight: 900, // Bold 900
    marginBottom: 3, // Increased margin between label and text
    color: colors.black,
    fontSize: 12, // Increased label font size
  },
  infoText: {
    fontSize: 12, // Increased font size for info text
    marginBottom: 6, // Increased margin
    color: colors.black,
  },
  resultSection: {
    backgroundColor: colors.gray, // Light Gray background for result section
    padding: 10, // Slightly increased padding
    borderRadius: 5,
    marginBottom: 10, // Increased margin
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6, // Increased margin between rows
    borderBottom: "1px dashed gray",
    paddingBottom: 6, // Increased padding
  },
  resultText: {
    fontSize: 12, // Increased font size for result text
    color: colors.black,
  },
  footer: {
    marginTop: 10, // Increased margin
    textAlign: "center",
    fontSize: 10, // Slightly increased font size
    color: colors.black,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray, // Light Gray divider
    marginBottom: 10, // Increased margin
    marginTop: 10, // Increased margin
  },
  remarksSection: {
    backgroundColor: colors.gray, // Light Gray background
    padding: 10, // Slightly increased padding
    borderRadius: 5,
    marginBottom: 5, // Increased margin
  },
  
});

// Create the PDF document structure
const ExamReportPDF: React.FC = () => {


  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Add school logo */}
          <Image
            style={styles.logo}
            src="/images/logo/wizam-logo.png" // Ensure the image URL is correct
          />
          <View style={styles.schoolInfo}>
            <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 5 }}>The School of Dental Nursing</Text>
            <Text>123 Main St, Hometown, Country</Text>
            <Text>Email: info@abcschool.com | Phone: +123-456-7890</Text>
            <Text>Website: www.abcschool.com</Text>
          </View>
        </View>

        <View style={styles.divider}></View>

        <View style={styles.row}>
            <Text style={styles.title}>Final Result: </Text>
            <Text style={styles.finalResult}> <Text style={styles.resultPass}>Pass</Text></Text>
        </View>

        <View style={styles.divider}></View>

        <Text style={styles.sectionTitle}>Exams Details</Text>
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
          <Text style={[styles.label, { textDecoration: "underline" }]}>Exam Name</Text>
            <Text style={styles.infoText}>National Diploma in Dental Nursing - Mock Test One</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>Completed on</Text>
            <Text style={styles.infoText}>Mon, Feb 26, 2024, 9:09 AM</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>Session ID</Text>
            <Text style={styles.infoText}>ff4d1754-5cdd-415b-84cf-63e05d9af238</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={[styles.label, { textDecoration: "underline" }]}>Test Taker</Text>
            <Text style={styles.infoText}>Krishna Bhatta</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>Email</Text>
            <Text style={styles.infoText}>kpbhatta@gmail.com</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>IP & Device</Text>
            <Text style={styles.infoText}>127.0.0.1, Desktop, Windows 10.0, Chrome</Text>
          </View>
        </View>

        {/* Test Results Section */}
        <Text style={styles.sectionTitle}>Test Results</Text>
        <View style={styles.resultSection}>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Total Questions</Text>
            <Text style={styles.resultText}>100Q</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Answered</Text>
            <Text style={styles.resultText}>98Q</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Correct</Text>
            <Text style={styles.resultText}>61Q</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Wrong</Text>
            <Text style={styles.resultText}>39Q</Text>
          </View>
     
          <View style={styles.resultRow}>
            <Text style={styles.label}>Final Score</Text>
            <Text style={styles.resultText}>61</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Pass Percentage</Text>
            <Text style={styles.resultText}>60%</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Final Percentage</Text>
            <Text style={styles.resultText}>61%</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Time Taken</Text>
            <Text style={styles.resultText}>7 Min 26 Sec</Text>
          </View>
          
        </View>

        {/* Remarks Section */}
        <Text style={styles.sectionTitle}>Remarks</Text>
        <View style={styles.remarksSection}>
          <Text style={styles.infoText}>
            The candidate has demonstrated a solid understanding of core concepts and has shown competency in handling multiple-choice questions effectively. Key areas for improvement include refining technical accuracy and attention to detail. Overall, the performance meets expectations, and the candidate is encouraged to continue progressing in their learning journey.
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text>The Knowledge Academy | Empowering learners worldwide</Text>
        </View>
      </Page>
    </Document>
  );
};

const ExamReportGenerator: React.FC = () => {
  return (
    <div>
     
      <BlobProvider document={<ExamReportPDF />}>
        {({ url,  error }) => {
         
          if (error) return <span>Error generating PDF</span>;
          return (
            <div>
              <Link href={url || "#"} download="exam-report.pdf" className="px-5 py-2 inline-block cursor-pointer bg-secondary rounded-full text-white hover:bg-secondary-dark ">
                <span style={{ marginTop: "10px" }}>Download PDF</span>
              </Link>
            </div>
          );
        }}
      </BlobProvider>
    </div>
  );
};

export default ExamReportGenerator;
