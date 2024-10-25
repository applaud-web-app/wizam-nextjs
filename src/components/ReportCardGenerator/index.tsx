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
  BlobProvider,
} from "@react-pdf/renderer";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";

const colors = {
  primary: "#2A3B61",
  secondary: "#A6DCEF",
  gray: "#e5f3ff",
  black: "#000",
  white: "#fff",
  green: "#28A745",
  red: "#FF4D4D",
};

Font.register({
  family: 'Roboto',
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf", fontWeight: 400 }, // Regular
    { src: "https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf", fontWeight: 700 }, // Bold
    { src: "https://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBic6CsE.ttf", fontWeight: 900 }, // Extra Bold
  ]
});

// Create styles for your PDF
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: colors.white,
    lineHeight: 1.2,
    position: 'relative',  // Ensure positioning context for watermark
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: 300,
    height: 'auto',
    opacity: 0.2,  // Make the watermark faint
   
    zIndex: 1,  // Ensure it's behind other content
  },

  contentWrapper: {
    padding: 15, 
    border: '5px double #e5e7eb', 
    
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
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  resultFail: {
    color: colors.red,
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,

  },
  sectionTitle: {
    backgroundColor: "#989898",
    color: colors.white,
    textAlign: "center",
    
    padding: 8,
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
    width: "46%",
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 3,
    color: colors.black,
    fontSize: 12,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 10,
    color: colors.black,
  },

  resultsectionTitle: {
    backgroundColor: "#3394c6",
    color: colors.white,
    textAlign: "center",
    
    padding: 6,
    
    fontSize: 14,
    fontWeight: "bold",
  },


  resultSection: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  resultRow: {
    flexDirection: 'row',  // Align items horizontally
    justifyContent: 'space-between',  // Spread items equally
    marginBottom: 8,
    borderBottom: '1px dashed gray',
    paddingBottom: 8,
  },
  resultlabel: {
    flex: 1,  // Make label take equal space
    fontWeight: 'bold',
    textAlign: 'left',  // Align label to the left
    fontSize: 12,
  },
  colon: {
    flex: 0.2,  // Small space for colon
    textAlign: 'center',  // Center colon
    fontWeight: 'bold',
    fontSize: 12,
  },
  resultText: {
    flex: 1,  // Make result text take equal space
    textAlign: 'right',  // Align result to the right
    fontSize: 12,
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 10,
    color: colors.black,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#d2d2d2",
    marginBottom: 10,
    marginTop: 10,
  },
  remarksSection: {
    backgroundColor: colors.gray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  authorizedSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',  // Align to the right
    marginTop: 10,  
    marginBottom:30,
  },
  authorizedByText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: 'right',
    marginBottom: 5,
  },
  signature: {
    fontFamily: 'DancingScript',  // Use the custom signature font
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'right',
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
         {/* Watermark image with absolute positioning */}
         <Image
          src="/images/logo/wizam-logo.png"
          style={styles.watermark}
        />
        <View style={styles.contentWrapper}>

       
            <View style={styles.header}>
              <Image style={styles.logo} src="/images/logo/wizam-logo.png" />
              <Image style={{ width: 160, height: "auto" }} src="/images/logo/school-of-dental-nursing-logo.png" />
            </View>

            <View style={styles.divider}></View>

            <View style={styles.row}>
              <View>
                <Text style={[styles.title, { fontSize: 20 }]}>Exam Report: </Text>
                <Text style={{fontSize: 16}}>Dental Nursing </Text>
              </View>
              <View>
              <Text style={{fontSize: 16}}>Final Result </Text>
                  <Text style={styles.finalResult}>
                    {result_info.final_score === "PASS" ? (
                      <Text style={styles.resultPass}>Pass</Text>
                    ) : (
                      <Text style={styles.resultFail}>Fail</Text>
                    )}
                  </Text>
                </View>
              
             
            </View>

            <View style={styles.divider}></View>

           
            <View style={styles.infoSection}>
              
              <View style={styles.infoBlock}>

                <Text style={styles.sectionTitle}>Exams Details</Text>

      
                <Text style={styles.label}>
                  Exam Name
                </Text>
                <Text style={styles.infoText}>{exam_info.name}</Text>
                <Text style={styles.label}>
                  Completed on
                </Text>
                <Text style={styles.infoText}>{exam_info.completed_on}</Text>
                <Text style={styles.label}>
                  Session ID
                </Text>
                <Text style={styles.infoText}>{exam_info.session_id}</Text>
              </View>
              <View style={{borderRight: "1px solid #d2d2d2", width: "1px", height: "100%"}}><Text></Text></View>
              <View style={styles.infoBlock}>

                <Text style={styles.sectionTitle}>Exams Details</Text>

                <Text style={styles.label}>
                  Test Taker
                </Text>
                <Text style={styles.infoText}>{user_info.name}</Text>
                <Text style={styles.label}>
                  Email
                </Text>
                <Text style={styles.infoText}>{user_info.email}</Text>
                <Text style={styles.label}>
                  Mobile Number
                </Text>
                <Text style={styles.infoText}>{user_info.number}</Text>
              </View>
            </View>

            <Text style={styles.resultsectionTitle}>Test Results</Text>
            <View style={styles.resultSection}>
              <View style={styles.resultRow}>
                <Text style={styles.resultlabel}>Total Questions</Text>
                 <Text style={styles.colon}>:</Text>
                <Text style={styles.resultText}>{result_info.total_question}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultlabel}>Answered</Text>
                 <Text style={styles.colon}>:</Text>
                <Text style={styles.resultText}>{result_info.answered}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultlabel}>Correct</Text>
                 <Text style={styles.colon}>:</Text>
                <Text style={styles.resultText}>{result_info.correct}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultlabel}>Wrong</Text>
                 <Text style={styles.colon}>:</Text>
                <Text style={styles.resultText}>{result_info.wrong}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultlabel}>Pass Percentage</Text>
                 <Text style={styles.colon}>:</Text>
                <Text style={styles.resultText}>{result_info.pass_percentage}%</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultlabel}>Final Percentage</Text>
                 <Text style={styles.colon}>:</Text>
                <Text style={styles.resultText}>{result_info.final_percentage}%</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultlabel}>Time Taken</Text>
                 <Text style={styles.colon}>:</Text>
                <Text style={styles.resultText}>{Math.round(result_info.time_taken)} mins</Text>
              </View>
            </View>

            <View style={styles.divider}></View>

            {/* Authorized by section */}
            <View style={styles.authorizedSection}>
              <Text style={styles.authorizedByText}>Authorized by</Text>
              <Image src="/images/sign.png" style={{ width: "auto", height: 20 }} />
            </View>

          
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
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null); 

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
      {/* PDF BlobProvider to generate and provide the PDF URL */}
      <BlobProvider document={<ExamReportPDF examData={examData} />}>
        {({ url, error }) => {
          if (error) return <span>Error generating PDF</span>;

          // if (url) {
          //   setPdfUrl(url); 
          // }

          return (
            <div>
              <Link
                href={url || "#"}
                download="exam-report.pdf"
                className="px-5 py-2 text-center block cursor-pointer bg-defaultcolor w-full text-white hover:bg-defaultcolor-dark"
              >
                <span style={{ marginTop: "10px" }}>Download PDF</span>
              </Link>
            </div>
          );
        }}
      </BlobProvider>

      {/* Display the PDF in an iframe */}
      {/* {pdfUrl && (
        <iframe className="mb-8"
          src={pdfUrl}
          width="100%"
          height="900px"
          style={{ border: "none", marginTop: "20px" }}
        ></iframe>
      )} */}
    </div>
  );
};

export default ExamReportGenerator;
