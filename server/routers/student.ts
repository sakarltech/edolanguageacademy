import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { enrollments, studentProgress, courseMaterials } from "../../drizzle/schema";

export const studentRouter = router({
  // Get student's enrollments
  getMyEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, ctx.user.id));

    return userEnrollments;
  }),

  // Get student's progress for a specific enrollment
  getMyProgress: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify enrollment belongs to user
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.id, input.enrollmentId),
            eq(enrollments.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
      }

      // Get or create progress record
      let progress = await db
        .select()
        .from(studentProgress)
        .where(eq(studentProgress.enrollmentId, input.enrollmentId))
        .limit(1);

      if (progress.length === 0) {
        // Create initial progress record
        const [newProgress] = await db.insert(studentProgress).values({
          enrollmentId: input.enrollmentId,
          userId: ctx.user.id,
          currentWeek: 1,
          completedWeeks: "",
          attendanceCount: 0,
        });

        progress = await db
          .select()
          .from(studentProgress)
          .where(eq(studentProgress.id, newProgress.insertId))
          .limit(1);
      }

      return {
        enrollment: enrollment[0],
        progress: progress[0],
      };
    }),

  // Get course materials for enrolled course
  getCourseMaterials: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify enrollment belongs to user
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.id, input.enrollmentId),
            eq(enrollments.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
      }

      // Get materials for the course level
      const materials = await db
        .select()
        .from(courseMaterials)
        .where(
          and(
            eq(courseMaterials.courseLevel, enrollment[0].courseLevel),
            eq(courseMaterials.isPublished, 1)
          )
        );

      // Group materials by week
      const materialsByWeek: Record<number, typeof materials> = {};
      materials.forEach((material) => {
        if (!materialsByWeek[material.week]) {
          materialsByWeek[material.week] = [];
        }
        materialsByWeek[material.week].push(material);
      });

      return materialsByWeek;
    }),

  // Mark week as completed
  markWeekCompleted: protectedProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
        week: z.number().min(1).max(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify enrollment belongs to user
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.id, input.enrollmentId),
            eq(enrollments.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
      }

      // Get current progress
      const progress = await db
        .select()
        .from(studentProgress)
        .where(eq(studentProgress.enrollmentId, input.enrollmentId))
        .limit(1);

      if (progress.length === 0) {
        throw new Error("Progress record not found");
      }

      const completedWeeks = progress[0].completedWeeks
        ? progress[0].completedWeeks.split(",").map(Number)
        : [];

      if (!completedWeeks.includes(input.week)) {
        completedWeeks.push(input.week);
        completedWeeks.sort((a, b) => a - b);

        await db
          .update(studentProgress)
          .set({
            completedWeeks: completedWeeks.join(","),
            currentWeek: Math.max(...completedWeeks, progress[0].currentWeek),
          })
          .where(eq(studentProgress.id, progress[0].id));
      }

      return { success: true };
    }),

  // Update attendance
  recordAttendance: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const progress = await db
        .select()
        .from(studentProgress)
        .where(eq(studentProgress.enrollmentId, input.enrollmentId))
        .limit(1);

      if (progress.length === 0) {
        throw new Error("Progress record not found");
      }

      await db
        .update(studentProgress)
        .set({
          attendanceCount: progress[0].attendanceCount + 1,
        })
        .where(eq(studentProgress.id, progress[0].id));

      return { success: true };
    }),

  // Download certificate (only if course completed)
  getCertificate: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const progress = await db
        .select()
        .from(studentProgress)
        .where(
          and(
            eq(studentProgress.enrollmentId, input.enrollmentId),
            eq(studentProgress.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (progress.length === 0) {
        throw new Error("Progress record not found");
      }

      if (!progress[0].certificateIssued) {
        throw new Error("Certificate not yet issued");
      }

      return {
        certificateUrl: progress[0].certificateUrl,
        assessmentScore: progress[0].assessmentScore,
      };
    }),
});
