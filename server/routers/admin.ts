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
} from "../../drizzle/schema";

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
});
