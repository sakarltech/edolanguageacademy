import { z } from "zod";
import { eq, and, gt } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { announcements } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const announcementRouter = router({
  // Public: Get active announcements (not expired)
  getActive: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const now = new Date();
    const activeAnnouncements = await db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.isActive, 1),
          gt(announcements.expiresAt, now)
        )
      )
      .orderBy(announcements.createdAt);

    return activeAnnouncements;
  }),

  // Admin: Get all announcements
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const allAnnouncements = await db
      .select()
      .from(announcements)
      .orderBy(announcements.createdAt);

    return allAnnouncements;
  }),

  // Admin: Create announcement
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        message: z.string().min(1),
        daysActive: z.number().min(1).max(365), // Number of days to keep announcement active
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + input.daysActive);

      const [result] = await db.insert(announcements).values({
        title: input.title,
        message: input.message,
        expiresAt,
        createdBy: ctx.user.id,
        isActive: 1,
      });

      return {
        success: true,
        id: result.insertId,
      };
    }),

  // Admin: Update announcement
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255),
        message: z.string().min(1),
        daysActive: z.number().min(1).max(365),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Calculate new expiration date from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + input.daysActive);

      await db
        .update(announcements)
        .set({
          title: input.title,
          message: input.message,
          expiresAt,
          isActive: input.isActive ? 1 : 0,
        })
        .where(eq(announcements.id, input.id));

      return {
        success: true,
      };
    }),

  // Admin: Delete announcement
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db.delete(announcements).where(eq(announcements.id, input.id));

      return {
        success: true,
      };
    }),

  // Admin: Toggle announcement active status
  toggleActive: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db
        .update(announcements)
        .set({
          isActive: input.isActive ? 1 : 0,
        })
        .where(eq(announcements.id, input.id));

      return {
        success: true,
      };
    }),
});
