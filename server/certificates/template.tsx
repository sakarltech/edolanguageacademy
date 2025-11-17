import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register fonts (using system fonts)
Font.register({
  family: "Times-Roman",
  src: "Times-Roman",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 60,
    position: "relative",
  },
  border: {
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    border: "8px solid #B8860B", // Warm gold border
    borderRadius: 10,
  },
  innerBorder: {
    position: "absolute",
    top: 40,
    left: 40,
    right: 40,
    bottom: 40,
    border: "2px solid #8B0000", // Deep red inner border
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontFamily: "Times-Roman",
    color: "#8B0000", // Deep red
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#B8860B", // Warm gold
    marginBottom: 5,
  },
  divider: {
    width: 200,
    height: 2,
    backgroundColor: "#B8860B",
    marginVertical: 20,
  },
  body: {
    alignItems: "center",
    marginVertical: 20,
  },
  presentedTo: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 15,
    letterSpacing: 2,
  },
  studentName: {
    fontSize: 36,
    fontFamily: "Times-Roman",
    color: "#000000",
    marginBottom: 20,
    fontWeight: "bold",
    borderBottom: "2px solid #B8860B",
    paddingBottom: 10,
    paddingHorizontal: 30,
  },
  description: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 1.6,
    maxWidth: 450,
  },
  courseLevel: {
    fontSize: 20,
    fontFamily: "Times-Roman",
    color: "#8B0000",
    marginVertical: 15,
    fontWeight: "bold",
  },
  details: {
    marginTop: 30,
    alignItems: "center",
  },
  detailRow: {
    flexDirection: "row",
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666666",
    marginRight: 10,
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 12,
    color: "#333333",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  signature: {
    fontSize: 12,
    color: "#333333",
    marginTop: 5,
  },
  signatureLine: {
    width: 200,
    height: 1,
    backgroundColor: "#333333",
    marginBottom: 5,
  },
  greeting: {
    fontSize: 16,
    color: "#B8860B",
    fontStyle: "italic",
    marginTop: 20,
  },
});

interface CertificateProps {
  studentName: string;
  courseLevel: "Beginner" | "Intermediary" | "Proficient";
  completionDate: string;
  assessmentScore?: number;
  certificateId: string;
}

export const CertificateTemplate: React.FC<CertificateProps> = ({
  studentName,
  courseLevel,
  completionDate,
  assessmentScore,
  certificateId,
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Decorative borders */}
      <View style={styles.border} />
      <View style={styles.innerBorder} />

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Certificate of Completion</Text>
          <Text style={styles.subtitle}>Edo Language Academy</Text>
          <Text style={styles.greeting}>Ób'ókhían!</Text>
        </View>

        <View style={styles.divider} />

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.presentedTo}>THIS CERTIFICATE IS PROUDLY PRESENTED TO</Text>
          <Text style={styles.studentName}>{studentName}</Text>

          <Text style={styles.description}>
            For successfully completing the comprehensive curriculum and demonstrating
            proficiency in the Edo language through dedicated study and practice.
          </Text>

          <Text style={styles.courseLevel}>Edo {courseLevel} Course</Text>

          <Text style={styles.description}>
            This achievement represents mastery of essential vocabulary, grammar structures,
            and cultural understanding necessary for effective communication in Edo.
          </Text>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Completion Date:</Text>
            <Text style={styles.detailValue}>{completionDate}</Text>
          </View>
          {assessmentScore && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assessment Score:</Text>
              <Text style={styles.detailValue}>{assessmentScore}%</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Certificate ID:</Text>
            <Text style={styles.detailValue}>{certificateId}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signatureLine} />
          <Text style={styles.signature}>Edo Language Academy</Text>
          <Text style={styles.signature}>Founder & Lead Instructor</Text>
        </View>
      </View>
    </Page>
  </Document>
);
