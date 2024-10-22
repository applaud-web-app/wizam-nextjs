"use client";
import React, { useState, useEffect } from "react";
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
import Cookies from "js-cookie";
import axios from "axios";

const colors = {
  primary: "#2A3B61",
  secondary: "#A6DCEF",
  gray: "#e5f3ff",
  black: "#333333",
  white: "#fff",
  green: "#28A745",
  red: "#FF4D4D",
};

// Create styles for your PDF
const styles = StyleSheet.create({
 
  page: {
    padding: 15,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
    lineHeight: 1.2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    display: "flex",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    display: "flex",
  },
  logo: {
    width: 110,
    height: "auto",
    marginBottom: 7,
  },
  schoolInfo: {
    fontSize: 12,
    color: colors.black,
    textAlign: "center",
    marginBottom: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.black,
  },
  finalResult: {
    fontSize: 16,
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
    backgroundColor: colors.primary,
    color: colors.white,
    textAlign: "center",
    borderRadius: 5,
    padding: 6,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBlock: {
    width: "49%",
    backgroundColor: colors.gray,
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: 900,
    marginBottom: 3,
    color: colors.black,
    fontSize: 12,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 6,
    color: colors.black,
  },
  resultSection: {
    backgroundColor: colors.gray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    borderBottom: "1px dashed gray",
    paddingBottom: 6,
  },
  resultText: {
    fontSize: 12,
    color: colors.black,
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 10,
    color: colors.black,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginBottom: 10,
    marginTop: 10,
  },
  remarksSection: {
    backgroundColor: colors.gray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
});

// Create the PDF document structure
const ExamReportPDF: React.FC<{ examData: any }> = ({ examData }) => {
  if (!examData) {
    return <Text>No Data</Text>;
  }

  const { user_info, exam_info, result_info } = examData;

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="/images/logo/wizam-logo.png" />
          <Image style={{width: 160, height: "auto"}} src="/images/logo/school-of-dental-nursing-logo.png" />
        
        </View>

        <View style={styles.divider}></View>

        <View style={styles.row}>
          <Text style={styles.title}>Final Result: </Text>
          <Text style={styles.finalResult}>
            {result_info.final_score === "PASS" ? (
              <Text style={styles.resultPass}>Pass</Text>
            ) : (
              <Text style={styles.resultFail}>Fail</Text>
            )}
          </Text>
        </View>

        <View style={styles.divider}></View>

        <Text style={styles.sectionTitle}>Exams Details</Text>
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={[styles.label, { textDecoration: "underline" }]}>
              Exam Name
            </Text>
            <Text style={styles.infoText}>{exam_info.name}</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>
              Completed on
            </Text>
            <Text style={styles.infoText}>{exam_info.completed_on}</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>
              Session ID
            </Text>
            <Text style={styles.infoText}>{exam_info.session_id}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={[styles.label, { textDecoration: "underline" }]}>
              Test Taker
            </Text>
            <Text style={styles.infoText}>{user_info.name}</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>
              Email
            </Text>
            <Text style={styles.infoText}>{user_info.email}</Text>
            <Text style={[styles.label, { textDecoration: "underline" }]}>
              Mobile Number
            </Text>
            <Text style={styles.infoText}>{user_info.number}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Test Results</Text>
        <View style={styles.resultSection}>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Total Questions</Text>
            <Text style={styles.resultText}>{result_info.total_question}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Answered</Text>
            <Text style={styles.resultText}>{result_info.answered}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Correct</Text>
            <Text style={styles.resultText}>{result_info.correct}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Wrong</Text>
            <Text style={styles.resultText}>{result_info.wrong}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Pass Percentage</Text>
            <Text style={styles.resultText}>{result_info.pass_percentage}%</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Final Percentage</Text>
            <Text style={styles.resultText}>{result_info.final_percentage}%</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.label}>Time Taken</Text>
            <Text style={styles.resultText}>{Math.round(result_info.time_taken)} mins</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Remarks</Text>
        <View style={styles.remarksSection}>
          <Text style={styles.infoText}>
            The candidate has demonstrated a solid understanding of core
            concepts.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>The Knowledge Academy | Empowering learners worldwide</Text>
        </View>
      </Page>
    </Document>
  );
};

const ExamReportGenerator: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/download-exam-report/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );
        if (response.data.status) {
          setExamData(response.data);
        } else {
          setError("Failed to load exam data.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exam report:", err);
        setError("Error fetching exam report.");
        setLoading(false);
      }
    };

    fetchExamData();
  }, [uuid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!examData) {
    return <div>Error loading exam report</div>;
  }

  return (
    <div>
      <BlobProvider document={<ExamReportPDF examData={examData} />}>
        {({ url, error }) => {
          if (error) return <span>Error generating PDF</span>;
          return (
            <div>
              <Link
                href={url || "#"}
                download="exam-report.pdf"
                className="px-5 py-2 inline-block cursor-pointer bg-secondary rounded-full text-white hover:bg-secondary-dark" >
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
