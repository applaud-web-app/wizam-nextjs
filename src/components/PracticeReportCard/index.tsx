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

// Define colors for styling
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

// practice Report PDF Component
const PracticeReportPDF: React.FC<{ practiceData: any }> = ({ practiceData }) => {
  if (!practiceData) {
    return <Text>No Data</Text>;
  }

  const { user_info, practice_info, result_info } = practiceData;

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
              <Text style={[styles.title, { fontSize: 20 }]}>practice Report: </Text>
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

              <Text style={styles.sectionTitle}>Test Details</Text>

    
              <Text style={styles.label}>
                practice Name
              </Text>
              <Text style={styles.infoText}>{practice_info.name}</Text>
              <Text style={styles.label}>
                Completed on
              </Text>
              <Text style={styles.infoText}>{practice_info.completed_on}</Text>
              <Text style={styles.label}>
                Session ID
              </Text>
              <Text style={styles.infoText}>{practice_info.session_id}</Text>
            </View>
            <View style={{borderRight: "1px solid #d2d2d2", width: "1px", height: "100%"}}><Text></Text></View>
            <View style={styles.infoBlock}>

              <Text style={styles.sectionTitle}>Test Details</Text>

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

// practice Report Generator Component
const PracticeReportCard: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [practiceData, setpracticeData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchpracticeData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/download-practice-report/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
          }
        );
        if (response.data.status) {
          setpracticeData(response.data);
        } else {
          setError("Failed to load practice data.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching practice report:", err);
        setError("Error fetching practice report.");
        setLoading(false);
      }
    };

    fetchpracticeData();
  }, [uuid]);

  const downloadPdf = async () => {
    if (practiceData) {
      const doc = <PracticeReportPDF practiceData={practiceData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "practice-report.pdf";
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!practiceData) {
    return <div>Error loading practice report</div>;
  }

  return (
    <div>
      {/* Generate and download PDF on click */}
      <button
        onClick={downloadPdf}
        className="px-5 py-2 text-center bg-defaultcolor text-white w-full hover:bg-defaultcolor-dark cursor-pointer"
      >
       Download Report
      </button>
    </div>
  );
};

export default PracticeReportCard;
