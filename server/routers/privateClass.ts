import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { privateClassScheduling, privateClassSessions, enrollments } from "../../drizzle/schema";

export const privateClassRouter = router({
  // Get scheduling info for a private class enrollment
  getSchedulingInfo: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify enrollment belongs to user
      const enrollment = await db.select().from(enrollments)
        .where(and(
          eq(enrollments.id, input.enrollmentId),
          eq(enrollments.userId, ctx.user.id)
        ))
        .limit(1);

      if (!enrollment.length) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Enrollment not found" });
      }

      const scheduling = await db.select().from(privateClassScheduling)
        .where(eq(privateClassScheduling.enrollmentId, input.enrollmentId))
        .limit(1);

      return scheduling[0] || null;
    }),

  // Submit scheduling preferences
  submitSchedulingPreferences: protectedProcedure
    .input(z.object({
      enrollmentId: z.number(),
      studentGoals: z.string().min(10),
      preferredSchedule: z.string().min(10),
      timezone: z.string(),
      frequency: z.enum(["1x_per_week", "2x_per_week", "custom"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify enrollment belongs to user
      const enrollment = await db.select().from(enrollments)
        .where(and(
          eq(enrollments.id, input.enrollmentId),
          eq(enrollments.userId, ctx.user.id)
        ))
        .limit(1);

      if (!enrollment.length) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Enrollment not found" });
      }

      // Check if scheduling info already exists
      const existing = await db.select().from(privateClassScheduling)
        .where(eq(privateClassScheduling.enrollmentId, input.enrollmentId))
        .limit(1);

      if (existing.length) {
        // Update existing
        await db.update(privateClassScheduling)
          .set({
            studentGoals: input.studentGoals,
            preferredSchedule: input.preferredSchedule,
            timezone: input.timezone,
            frequency: input.frequency,
            schedulingStatus: "coordinating",
            updatedAt: new Date(),
          })
          .where(eq(privateClassScheduling.enrollmentId, input.enrollmentId));
      } else {
        // Create new
        await db.insert(privateClassScheduling).values({
          enrollmentId: input.enrollmentId,
          studentGoals: input.studentGoals,
          preferredSchedule: input.preferredSchedule,
          timezone: input.timezone,
          frequency: input.frequency,
          schedulingStatus: "coordinating",
        });
      }

      return { success: true };
    }),

  // Get all sessions for a private class enrollment
  getMySessions: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify enrollment belongs to user
      const enrollment = await db.select().from(enrollments)
        .where(and(
          eq(enrollments.id, input.enrollmentId),
          eq(enrollments.userId, ctx.user.id)
        ))
        .limit(1);

      if (!enrollment.length) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Enrollment not found" });
      }

      const sessions = await db.select().from(privateClassSessions)
        .where(eq(privateClassSessions.enrollmentId, input.enrollmentId))
        .orderBy(privateClassSessions.sessionNumber);

      return sessions;
    }),

  // Admin: Get all private class enrollments with scheduling info
  getAllPrivateEnrollments: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const privateEnrollments = await db.select().from(enrollments)
        .where(eq(enrollments.courseLevel, "private"))
        .orderBy(enrollments.createdAt);

      return privateEnrollments;
    }),

  // Admin: Get scheduling info for any enrollment
  getSchedulingInfoAdmin: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const scheduling = await db.select().from(privateClassScheduling)
        .where(eq(privateClassScheduling.enrollmentId, input.enrollmentId))
        .limit(1);

      return scheduling[0] || null;
    }),

  // Admin: Update scheduling status and notes
  updateSchedulingStatus: protectedProcedure
    .input(z.object({
      enrollmentId: z.number(),
      schedulingStatus: z.enum(["pending", "coordinating", "scheduled", "completed"]),
      coordinationNotes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.update(privateClassScheduling)
        .set({
          schedulingStatus: input.schedulingStatus,
          coordinationNotes: input.coordinationNotes,
          updatedAt: new Date(),
        })
        .where(eq(privateClassScheduling.enrollmentId, input.enrollmentId));

      return { success: true };
    }),

  // Admin: Create or update a session
  createOrUpdateSession: protectedProcedure
    .input(z.object({
      id: z.number().optional(),
      enrollmentId: z.number(),
      sessionNumber: z.number().min(1).max(8),
      scheduledDate: z.date().optional(),
      status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"]),
      duration: z.number().default(60),
      instructorNotes: z.string().optional(),
      materialsUrl: z.string().optional(),
      recordingUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      if (input.id) {
        // Update existing session
        await db.update(privateClassSessions)
          .set({
            scheduledDate: input.scheduledDate,
            status: input.status,
            duration: input.duration,
            instructorNotes: input.instructorNotes,
            materialsUrl: input.materialsUrl,
            recordingUrl: input.recordingUrl,
            completedAt: input.status === "completed" ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(privateClassSessions.id, input.id));
      } else {
        // Create new session
        await db.insert(privateClassSessions).values({
          enrollmentId: input.enrollmentId,
          sessionNumber: input.sessionNumber,
          scheduledDate: input.scheduledDate,
          status: input.status,
          duration: input.duration,
          instructorNotes: input.instructorNotes,
          materialsUrl: input.materialsUrl,
          recordingUrl: input.recordingUrl,
          completedAt: input.status === "completed" ? new Date() : null,
        });
      }

      return { success: true };
    }),

  // Admin: Get all sessions for an enrollment
  getSessionsAdmin: protectedProcedure
    .input(z.object({ enrollmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const sessions = await db.select().from(privateClassSessions)
        .where(eq(privateClassSessions.enrollmentId, input.enrollmentId))
        .orderBy(privateClassSessions.sessionNumber);

      return sessions;
    }),

  // Admin: Delete a session
  deleteSession: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.delete(privateClassSessions)
        .where(eq(privateClassSessions.id, input.id));

      return { success: true };
    }),
});
