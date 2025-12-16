/**
 * Public tracking endpoints for email opens and clicks
 * These endpoints are called from emails and don't require authentication
 */

import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { campaignSends, emailCampaigns } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const trackingRouter = router({
  // Track email open (called via tracking pixel)
  trackOpen: publicProcedure
    .input(z.object({ sendId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      try {
        // Get the send record
        const [sendRecord] = await db
          .select()
          .from(campaignSends)
          .where(eq(campaignSends.id, input.sendId))
          .limit(1);

        if (!sendRecord) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Send record not found" });
        }

        // Update send record
        const now = new Date();
        await db
          .update(campaignSends)
          .set({
            openedAt: sendRecord.openedAt || now, // Only set if not already opened
            openCount: sql`${campaignSends.openCount} + 1`,
          })
          .where(eq(campaignSends.id, input.sendId));

        // If this is the first open, increment campaign's opened count
        if (!sendRecord.openedAt) {
          await db
            .update(emailCampaigns)
            .set({
              openedCount: sql`${emailCampaigns.openedCount} + 1`,
            })
            .where(eq(emailCampaigns.id, sendRecord.campaignId));
        }

        // Return 1x1 transparent GIF
        return {
          success: true,
          type: "image/gif",
          data: "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", // Base64 1x1 transparent GIF
        };
      } catch (error: any) {
        console.error("[Tracking] Error tracking open:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to track open" });
      }
    }),

  // Track email click (called via link wrapper)
  trackClick: publicProcedure
    .input(
      z.object({
        sendId: z.number(),
        url: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      try {
        // Get the send record
        const [sendRecord] = await db
          .select()
          .from(campaignSends)
          .where(eq(campaignSends.id, input.sendId))
          .limit(1);

        if (!sendRecord) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Send record not found" });
        }

        // Update send record
        const now = new Date();
        await db
          .update(campaignSends)
          .set({
            clickedAt: sendRecord.clickedAt || now, // Only set if not already clicked
            clickCount: sql`${campaignSends.clickCount} + 1`,
          })
          .where(eq(campaignSends.id, input.sendId));

        // If this is the first click, increment campaign's clicked count
        if (!sendRecord.clickedAt) {
          await db
            .update(emailCampaigns)
            .set({
              clickedCount: sql`${emailCampaigns.clickedCount} + 1`,
            })
            .where(eq(emailCampaigns.id, sendRecord.campaignId));
        }

        // Return redirect URL
        return {
          success: true,
          redirectUrl: input.url,
        };
      } catch (error: any) {
        console.error("[Tracking] Error tracking click:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to track click" });
      }
    }),
});
