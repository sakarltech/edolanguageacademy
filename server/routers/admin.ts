import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { getDb } from "../db";
import {
  enrollments,
  studentProgress,
  courseMaterials,
  users,
  assessmentSubmissions,
} from "../../drizzle/schema";
import { sendEmail } from "../_core/email";

export const adminRouter = router({
  // Get all enrollments with student info
  getAllEnrollments: adminProcedure
    .input(
      z.object({
        status: z.enum(["all", "pending", "paid", "active", "completed", "cancelled"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db
        .select({
          enrollment: enrollments,
          user: users,
        })
        .from(enrollments)
        .leftJoin(users, eq(enrollments.userId, users.id))
        .orderBy(desc(enrollments.createdAt));

      const results = await query;

      if (input?.status && input.status !== "all") {
        return results.filter((r) => r.enrollment.status === input.status);
      }

      return results;
    }),

  // Get enrollment analytics
  getAnalytics: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allEnrollments = await db.select().from(enrollments);
    const allProgress = await db.select().from(studentProgress);

    const totalEnrollments = allEnrollments.length;
    const activeEnrollments = allEnrollments.filter((e) => e.status === "active").length;
    const completedEnrollments = allEnrollments.filter((e) => e.status === "completed").length;
    const totalRevenue = allEnrollments
      .filter((e) => e.status === "paid" || e.status === "active" || e.status === "completed")
      .length; // This is count, you'd calculate actual revenue from Stripe

    const certificatesIssued = allProgress.filter((p) => p.certificateIssued === 1).length;
    const averageCompletion =
      allProgress.length > 0
        ? allProgress.reduce((sum, p) => {
            const completed = p.completedWeeks ? p.completedWeeks.split(",").length : 0;
            return sum + (completed / 8) * 100;
          }, 0) / allProgress.length
        : 0;

    // Enrollment by course level
    const enrollmentsByLevel: Record<string, number> = {};
    allEnrollments.forEach((e) => {
      enrollmentsByLevel[e.courseLevel] = (enrollmentsByLevel[e.courseLevel] || 0) + 1;
    });

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalRevenue, // In real app, calculate from payment amounts
      certificatesIssued,
      averageCompletion: Math.round(averageCompletion),
      enrollmentsByLevel,
    };
  }),

  // Update student progress
  updateStudentProgress: adminProcedure
    .input(
      z.object({
        progressId: z.number(),
        currentWeek: z.number().min(1).max(8).optional(),
        attendanceCount: z.number().min(0).max(8).optional(),
        assessmentScore: z.number().min(0).max(100).optional(),
        assessmentPassed: z.boolean().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.currentWeek !== undefined) updateData.currentWeek = input.currentWeek;
      if (input.attendanceCount !== undefined) updateData.attendanceCount = input.attendanceCount;
      if (input.assessmentScore !== undefined) updateData.assessmentScore = input.assessmentScore;
      if (input.assessmentPassed !== undefined)
        updateData.assessmentPassed = input.assessmentPassed ? 1 : 0;
      if (input.notes !== undefined) updateData.notes = input.notes;

      await db.update(studentProgress).set(updateData).where(eq(studentProgress.id, input.progressId));

      return { success: true };
    }),

  // Issue certificate
  issueCertificate: adminProcedure
    .input(
      z.object({
        progressId: z.number(),
        certificateUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(studentProgress)
        .set({
          certificateIssued: 1,
          certificateUrl: input.certificateUrl,
        })
        .where(eq(studentProgress.id, input.progressId));

      return { success: true };
    }),

  // Upload course material
  uploadCourseMaterial: adminProcedure
    .input(
      z.object({
        courseLevel: z.enum(["beginner", "intermediary", "proficient"]),
        moduleNumber: z.number().min(1).max(4),
        week: z.number().min(1).max(8),
        title: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["video", "pdf", "worksheet", "recording", "teaching_note"]),
        fileUrl: z.string().url().optional(),
        isPublished: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(courseMaterials).values({
        courseLevel: input.courseLevel,
        moduleNumber: input.moduleNumber,
        week: input.week,
        title: input.title,
        description: input.description || null,
        type: input.type,
        fileUrl: input.fileUrl || null,
        isPublished: input.isPublished ? 1 : 0,
      });

      return { success: true };
    }),

  // Get all course materials (for management)
  getAllCourseMaterials: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const materials = await db.select().from(courseMaterials).orderBy(
      courseMaterials.courseLevel,
      courseMaterials.week
    );

    return materials;
  }),

  // Delete course material
  deleteCourseMaterial: adminProcedure
    .input(z.object({ materialId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(courseMaterials).where(eq(courseMaterials.id, input.materialId));

      return { success: true };
    }),

  // Update enrollment status
  updateEnrollmentStatus: adminProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
        status: z.enum(["pending", "paid", "active", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(enrollments)
        .set({ status: input.status })
        .where(eq(enrollments.id, input.enrollmentId));

      return { success: true };
    }),

  // Delete enrollment
  deleteEnrollment: adminProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // First delete related student progress records
      await db.delete(studentProgress).where(eq(studentProgress.enrollmentId, input.enrollmentId));
      
      // Delete related assessment submissions
      await db.delete(assessmentSubmissions).where(eq(assessmentSubmissions.enrollmentId, input.enrollmentId));
      
      // Finally delete the enrollment
      await db.delete(enrollments).where(eq(enrollments.id, input.enrollmentId));

      return { success: true };
    }),

  // Get all assessment submissions
  getAllAssessments: adminProcedure
    .input(
      z.object({
        status: z.enum(["all", "submitted", "reviewed", "graded"]).optional(),
        courseLevel: z.enum(["all", "beginner", "intermediary", "proficient"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db
        .select({
          submission: assessmentSubmissions,
          user: users,
          enrollment: enrollments,
        })
        .from(assessmentSubmissions)
        .leftJoin(users, eq(assessmentSubmissions.userId, users.id))
        .leftJoin(enrollments, eq(assessmentSubmissions.enrollmentId, enrollments.id))
        .orderBy(desc(assessmentSubmissions.createdAt));

      const results = await query;

      let filtered = results;

      if (input?.status && input.status !== "all") {
        filtered = filtered.filter((r) => r.submission.status === input.status);
      }

      if (input?.courseLevel && input.courseLevel !== "all") {
        filtered = filtered.filter((r) => r.submission.courseLevel === input.courseLevel);
      }

      return filtered;
    }),

  // Grade assessment submission
  gradeAssessment: adminProcedure
    .input(
      z.object({
        submissionId: z.number(),
        score: z.number().min(0).max(100),
        feedback: z.string().optional(),
        status: z.enum(["reviewed", "graded"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get submission details for email
      const submission = await db
        .select({
          submission: assessmentSubmissions,
          user: users,
          enrollment: enrollments,
        })
        .from(assessmentSubmissions)
        .leftJoin(users, eq(assessmentSubmissions.userId, users.id))
        .leftJoin(enrollments, eq(assessmentSubmissions.enrollmentId, enrollments.id))
        .where(eq(assessmentSubmissions.id, input.submissionId))
        .limit(1);

      if (submission.length === 0) {
        throw new Error("Submission not found");
      }

      // Update assessment
      await db
        .update(assessmentSubmissions)
        .set({
          score: input.score,
          feedback: input.feedback || null,
          status: input.status,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
        })
        .where(eq(assessmentSubmissions.id, input.submissionId));

      // Send email notification
      const studentEmail = submission[0].user?.email;
      const studentName = submission[0].user?.name || submission[0].enrollment?.learnerName;
      const moduleNumber = submission[0].submission.moduleNumber;
      const courseLevel = submission[0].submission.courseLevel;

      if (studentEmail) {
        try {
          await sendEmail({
            to: studentEmail,
            subject: `Assessment Graded - Module ${moduleNumber}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d97706;">Assessment Graded</h2>
                <p>Dear ${studentName},</p>
                <p>Your assessment for <strong>Module ${moduleNumber}</strong> (${courseLevel.charAt(0).toUpperCase() + courseLevel.slice(1)} Level) has been reviewed and graded.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1f2937;">Assessment Results</h3>
                  <p style="font-size: 18px; margin: 10px 0;"><strong>Score:</strong> ${input.score}/100</p>
                  ${input.feedback ? `
                    <p style="margin: 10px 0;"><strong>Instructor Feedback:</strong></p>
                    <p style="font-style: italic; color: #4b5563;">${input.feedback}</p>
                  ` : ''}
                </div>

                <p>Keep up the great work! Continue to the next module in your dashboard.</p>
                
                <p style="margin-top: 30px;">
                  <a href="https://www.edolanguageacademy.com/dashboard" 
                     style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View Dashboard
                  </a>
                </p>

                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Òb'okhian,<br>
                  Edo Language Academy Team
                </p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Failed to send grading notification email:", error);
          // Don't throw - grading was successful even if email failed
        }
      }

      return { success: true };
    }),

  // Get assessment statistics
  getAssessmentStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allSubmissions = await db.select().from(assessmentSubmissions);

    const stats = {
      total: allSubmissions.length,
      submitted: allSubmissions.filter((s) => s.status === "submitted").length,
      reviewed: allSubmissions.filter((s) => s.status === "reviewed").length,
      graded: allSubmissions.filter((s) => s.status === "graded").length,
      averageScore:
        allSubmissions.filter((s) => s.score !== null).length > 0
          ? allSubmissions
              .filter((s) => s.score !== null)
              .reduce((sum, s) => sum + (s.score || 0), 0) /
            allSubmissions.filter((s) => s.score !== null).length
          : 0,
    };

    return stats;
  }),
});
