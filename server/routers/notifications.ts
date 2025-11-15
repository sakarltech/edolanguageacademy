import { z } from "zod";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { getDb } from "../db";
import { enrollments, studentProgress } from "../../drizzle/schema";
import {
  sendClassReminder,
  sendWeeklyProgressSummary,
  sendIncompleteWeekAlert,
  sendMilestoneCongratulations,
} from "../_core/emailNotifications";
import { eq } from "drizzle-orm";

export const notificationsRouter = router({
  // Send class reminder to all active students
  sendClassReminders: adminProcedure
    .input(
      z.object({
        classDate: z.string(), // ISO date string
        classTime: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const activeEnrollments = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.status, "active"));

      const results = await Promise.allSettled(
        activeEnrollments.map((enrollment) =>
          sendClassReminder({
            email: enrollment.email,
            studentName: enrollment.learnerName,
            courseLevel: enrollment.courseLevel,
            classDate: new Date(input.classDate),
            classTime: input.classTime,
          })
        )
      );

      const successCount = results.filter((r) => r.status === "fulfilled").length;

      return {
        success: true,
        sent: successCount,
        total: activeEnrollments.length,
      };
    }),

  // Send weekly progress summaries to all active students
  sendWeeklyProgressSummaries: adminProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const activeEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.status, "active"));

    const results = await Promise.allSettled(
      activeEnrollments.map(async (enrollment) => {
        const progress = await db
          .select()
          .from(studentProgress)
          .where(eq(studentProgress.enrollmentId, enrollment.id))
          .limit(1);

        if (progress.length === 0) return;

        const completedWeeks = progress[0].completedWeeks
          ? progress[0].completedWeeks.split(",").filter(Boolean).length
          : 0;

        return sendWeeklyProgressSummary({
          email: enrollment.email,
          studentName: enrollment.learnerName,
          courseLevel: enrollment.courseLevel,
          currentWeek: progress[0].currentWeek,
          completedWeeks,
          attendanceCount: progress[0].attendanceCount,
        });
      })
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    return {
      success: true,
      sent: successCount,
      total: activeEnrollments.length,
    };
  }),

  // Send incomplete week alerts to students who are behind
  sendIncompleteWeekAlerts: adminProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const activeEnrollments = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.status, "active"));

    const results = await Promise.allSettled(
      activeEnrollments.map(async (enrollment) => {
        const progress = await db
          .select()
          .from(studentProgress)
          .where(eq(studentProgress.enrollmentId, enrollment.id))
          .limit(1);

        if (progress.length === 0) return;

        const completedWeeks = progress[0].completedWeeks
          ? progress[0].completedWeeks.split(",").map(Number).filter(Boolean)
          : [];

        const currentWeek = progress[0].currentWeek;
        const incompleteWeeks: number[] = [];

        for (let week = 1; week < currentWeek; week++) {
          if (!completedWeeks.includes(week)) {
            incompleteWeeks.push(week);
          }
        }

        if (incompleteWeeks.length === 0) return;

        return sendIncompleteWeekAlert({
          email: enrollment.email,
          studentName: enrollment.learnerName,
          courseLevel: enrollment.courseLevel,
          incompleteWeeks,
        });
      })
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    return {
      success: true,
      sent: successCount,
    };
  }),

  // Send milestone congratulations
  sendMilestoneCongratulations: adminProcedure
    .input(
      z.object({
        enrollmentId: z.number(),
        milestone: z.enum(["halfway", "completed", "certificate"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const enrollment = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.id, input.enrollmentId))
        .limit(1);

      if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
      }

      const progress = await db
        .select()
        .from(studentProgress)
        .where(eq(studentProgress.enrollmentId, input.enrollmentId))
        .limit(1);

      await sendMilestoneCongratulations({
        email: enrollment[0].email,
        studentName: enrollment[0].learnerName,
        courseLevel: enrollment[0].courseLevel,
        milestone: input.milestone,
        assessmentScore: progress[0]?.assessmentScore || undefined,
      });

      return { success: true };
    }),
});
