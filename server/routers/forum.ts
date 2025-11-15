import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { forumThreads, forumReplies, users } from "../../drizzle/schema";

export const forumRouter = router({
  // Get all threads
  getThreads: protectedProcedure
    .input(
      z
        .object({
          courseLevel: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const threads = await db
        .select({
          thread: forumThreads,
          user: users,
        })
        .from(forumThreads)
        .leftJoin(users, eq(forumThreads.userId, users.id))
        .orderBy(desc(forumThreads.isPinned), desc(forumThreads.createdAt));

      if (input?.courseLevel) {
        return threads.filter(
          (t) => !t.thread.courseLevel || t.thread.courseLevel === input.courseLevel
        );
      }

      return threads;
    }),

  // Get single thread with replies
  getThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get thread
      const thread = await db
        .select({
          thread: forumThreads,
          user: users,
        })
        .from(forumThreads)
        .leftJoin(users, eq(forumThreads.userId, users.id))
        .where(eq(forumThreads.id, input.threadId))
        .limit(1);

      if (thread.length === 0) {
        throw new Error("Thread not found");
      }

      // Increment view count
      await db
        .update(forumThreads)
        .set({ viewCount: thread[0].thread.viewCount + 1 })
        .where(eq(forumThreads.id, input.threadId));

      // Get replies
      const replies = await db
        .select({
          reply: forumReplies,
          user: users,
        })
        .from(forumReplies)
        .leftJoin(users, eq(forumReplies.userId, users.id))
        .where(eq(forumReplies.threadId, input.threadId))
        .orderBy(forumReplies.createdAt);

      return {
        thread: thread[0],
        replies,
      };
    }),

  // Create new thread
  createThread: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(255),
        content: z.string().min(10),
        courseLevel: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(forumThreads).values({
        userId: ctx.user.id,
        title: input.title,
        content: input.content,
        courseLevel: input.courseLevel || null,
      });

      return { success: true, threadId: result.insertId };
    }),

  // Reply to thread
  replyToThread: protectedProcedure
    .input(
      z.object({
        threadId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if user is admin (instructor)
      const isInstructor = ctx.user.role === "admin" ? 1 : 0;

      await db.insert(forumReplies).values({
        threadId: input.threadId,
        userId: ctx.user.id,
        content: input.content,
        isInstructorReply: isInstructor,
      });

      // Update reply count
      const thread = await db
        .select()
        .from(forumThreads)
        .where(eq(forumThreads.id, input.threadId))
        .limit(1);

      if (thread.length > 0) {
        await db
          .update(forumThreads)
          .set({ replyCount: thread[0].replyCount + 1 })
          .where(eq(forumThreads.id, input.threadId));
      }

      return { success: true };
    }),

  // Delete thread (admin or owner only)
  deleteThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const thread = await db
        .select()
        .from(forumThreads)
        .where(eq(forumThreads.id, input.threadId))
        .limit(1);

      if (thread.length === 0) {
        throw new Error("Thread not found");
      }

      // Only allow deletion by thread owner or admin
      if (thread[0].userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      // Delete replies first
      await db.delete(forumReplies).where(eq(forumReplies.threadId, input.threadId));

      // Delete thread
      await db.delete(forumThreads).where(eq(forumThreads.id, input.threadId));

      return { success: true };
    }),
});
