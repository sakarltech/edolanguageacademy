import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/adminProcedure";
import { getDb } from "../db";
import { whatsappGroups } from "../../drizzle/schema";

export const whatsappRouter = router({
  // Get all WhatsApp groups
  getAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const groups = await db.select().from(whatsappGroups);
    return groups;
  }),

  // Get WhatsApp group link for a specific course and time slot
  getGroupLink: adminProcedure
    .input(
      z.object({
        courseLevel: z.enum(["beginner", "intermediary", "proficient"]),
        timeSlot: z.enum(["11AM_GMT", "11AM_CST"]),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return null;
      }

      const [group] = await db
        .select()
        .from(whatsappGroups)
        .where(
          and(
            eq(whatsappGroups.courseLevel, input.courseLevel),
            eq(whatsappGroups.timeSlot, input.timeSlot),
            eq(whatsappGroups.isActive, 1)
          )
        )
        .limit(1);

      return group || null;
    }),

  // Create or update WhatsApp group link
  upsert: adminProcedure
    .input(
      z.object({
        id: z.number().optional(),
        courseLevel: z.enum(["beginner", "intermediary", "proficient"]),
        timeSlot: z.enum(["11AM_GMT", "11AM_CST"]),
        groupLink: z.string().url(),
        groupName: z.string().min(1),
        isActive: z.number().min(0).max(1).default(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      if (input.id) {
        // Update existing group
        await db
          .update(whatsappGroups)
          .set({
            groupLink: input.groupLink,
            groupName: input.groupName,
            isActive: input.isActive,
            updatedAt: new Date(),
          })
          .where(eq(whatsappGroups.id, input.id));

        return { success: true, id: input.id };
      } else {
        // Check if group already exists for this course/timeslot
        const [existing] = await db
          .select()
          .from(whatsappGroups)
          .where(
            and(
              eq(whatsappGroups.courseLevel, input.courseLevel),
              eq(whatsappGroups.timeSlot, input.timeSlot)
            )
          )
          .limit(1);

        if (existing) {
          // Update existing
          await db
            .update(whatsappGroups)
            .set({
              groupLink: input.groupLink,
              groupName: input.groupName,
              isActive: input.isActive,
              updatedAt: new Date(),
            })
            .where(eq(whatsappGroups.id, existing.id));

          return { success: true, id: existing.id };
        } else {
          // Create new
          const [result] = await db.insert(whatsappGroups).values({
            courseLevel: input.courseLevel,
            timeSlot: input.timeSlot,
            groupLink: input.groupLink,
            groupName: input.groupName,
            isActive: input.isActive,
          });

          return { success: true, id: result.insertId };
        }
      }
    }),

  // Delete WhatsApp group
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db.delete(whatsappGroups).where(eq(whatsappGroups.id, input.id));

      return { success: true };
    }),
});
