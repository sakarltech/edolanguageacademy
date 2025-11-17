import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { CertificateTemplate } from "./template";
import { storagePut } from "../storage";
import { randomBytes } from "crypto";

interface GenerateCertificateParams {
  studentName: string;
  courseLevel: "Beginner" | "Intermediary" | "Proficient";
  completionDate: Date;
  assessmentScore?: number;
  enrollmentId: number;
}

interface CertificateResult {
  certificateUrl: string;
  certificateId: string;
}

/**
 * Generate a unique certificate ID
 */
function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString("hex");
  return `EDO-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate a PDF certificate and upload to S3
 */
export async function generateCertificate(
  params: GenerateCertificateParams
): Promise<CertificateResult> {
  const { studentName, courseLevel, completionDate, assessmentScore, enrollmentId } = params;

  // Generate unique certificate ID
  const certificateId = generateCertificateId();

  // Format completion date
  const formattedDate = completionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Render PDF to buffer
  const pdfBuffer = await renderToBuffer(
    <CertificateTemplate
      studentName={studentName}
      courseLevel={courseLevel}
      completionDate={formattedDate}
      assessmentScore={assessmentScore}
      certificateId={certificateId}
    />
  );

  // Upload to S3
  const fileName = `certificates/${enrollmentId}-${certificateId}.pdf`;
  const { url } = await storagePut(fileName, pdfBuffer, "application/pdf");

  return {
    certificateUrl: url,
    certificateId,
  };
}
