import { z } from "zod";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { getDb } from "../db";
import { enrollments, studentProgress } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { generateCertificate } from "../certificates/generator.tsx";
import { notifyOwner } from "../_core/notification";

export const certificatesRouter = router({
  /**
   * Generate and issue a certificate for a student
   * Only admins can trigger this
   */
  issueCertificate: adminProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get enrollment details
      const [enrollment] = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.id, input.enrollmentId))
        .limit(1);

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      // Get student progress
      const [progress] = await db
        .select()
        .from(studentProgress)
        .where(eq(studentProgress.enrollmentId, input.enrollmentId))
        .limit(1);

      if (!progress) {
        throw new Error("Student progress not found");
      }

      // Check if all 4 modules are completed
      const completedModules = progress.completedModules?.split(",").filter(Boolean).map(Number) || [];
      if (completedModules.length < 4) {
        throw new Error("Student must complete all 4 modules before receiving a certificate");
      }

      // Check if certificate already issued
      if (progress.certificateIssued === 1) {
        return {
          success: false,
          message: "Certificate already issued for this student",
          certificateUrl: progress.certificateUrl,
        };
      }

      // Generate certificate
      const { certificateUrl, certificateId } = await generateCertificate({
        studentName: enrollment.learnerName,
        courseLevel: enrollment.courseLevel.charAt(0).toUpperCase() + enrollment.courseLevel.slice(1) as "Beginner" | "Intermediary" | "Proficient",
        completionDate: new Date(),
        assessmentScore: progress.assessmentScore || undefined,
        enrollmentId: enrollment.id,
      });

      // Update student progress with certificate info
      await db
        .update(studentProgress)
        .set({
          certificateIssued: 1,
          certificateUrl,
        })
        .where(eq(studentProgress.enrollmentId, input.enrollmentId));

      // Notify owner
      await notifyOwner({
        title: "Certificate Issued",
        content: `Certificate issued to ${enrollment.learnerName} for ${enrollment.courseLevel} course. Certificate ID: ${certificateId}`,
      });

      // TODO: Send email to student with certificate
      // This would require email service integration

      return {
        success: true,
        message: "Certificate generated and issued successfully",
        certificateUrl,
        certificateId,
      };
    }),

  /**
   * Get all issued certificates (admin only)
   */
  getIssuedCertificates: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

      const results = await db
      .select({
        enrollmentId: enrollments.id,
        learnerName: enrollments.learnerName,
        courseLevel: enrollments.courseLevel,
        certificateUrl: studentProgress.certificateUrl,
        updatedAt: studentProgress.updatedAt,
      })
      .from(studentProgress)
      .innerJoin(enrollments, eq(studentProgress.enrollmentId, enrollments.id))
      .where(eq(studentProgress.certificateIssued, 1));

    return results;
  }),
});
