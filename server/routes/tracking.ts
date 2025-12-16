/**
 * Express routes for email tracking (non-tRPC for simplicity with email clients)
 */

import { Router } from "express";
import { getDb } from "../db";
import { campaignSends, emailCampaigns } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

const router = Router();

// Track email open via 1x1 pixel
router.get("/track/open/:sendId", async (req, res) => {
  const sendId = parseInt(req.params.sendId);
  
  if (isNaN(sendId)) {
    return res.status(400).send("Invalid send ID");
  }

  const db = await getDb();
  if (!db) {
    return res.status(500).send("Database not available");
  }

  try {
    // Get the send record
    const [sendRecord] = await db
      .select()
      .from(campaignSends)
      .where(eq(campaignSends.id, sendId))
      .limit(1);

    if (sendRecord) {
      // Update send record
      const now = new Date();
      await db
        .update(campaignSends)
        .set({
          openedAt: sendRecord.openedAt || now,
          openCount: sql`${campaignSends.openCount} + 1`,
        })
        .where(eq(campaignSends.id, sendId));

      // If first open, increment campaign count
      if (!sendRecord.openedAt) {
        await db
          .update(emailCampaigns)
          .set({
            openedCount: sql`${emailCampaigns.openedCount} + 1`,
          })
          .where(eq(emailCampaigns.id, sendRecord.campaignId));
      }
    }
  } catch (error) {
    console.error("[Tracking] Error tracking open:", error);
  }

  // Return 1x1 transparent GIF
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  
  res.set({
    "Content-Type": "image/gif",
    "Content-Length": pixel.length,
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
  });
  
  res.send(pixel);
});

// Track email click and redirect
router.get("/track/click/:sendId", async (req, res) => {
  const sendId = parseInt(req.params.sendId);
  const targetUrl = req.query.url as string;

  if (isNaN(sendId)) {
    return res.status(400).send("Invalid send ID");
  }

  if (!targetUrl) {
    return res.status(400).send("Missing target URL");
  }

  const db = await getDb();
  if (!db) {
    return res.status(500).send("Database not available");
  }

  try {
    // Get the send record
    const [sendRecord] = await db
      .select()
      .from(campaignSends)
      .where(eq(campaignSends.id, sendId))
      .limit(1);

    if (sendRecord) {
      // Update send record
      const now = new Date();
      await db
        .update(campaignSends)
        .set({
          clickedAt: sendRecord.clickedAt || now,
          clickCount: sql`${campaignSends.clickCount} + 1`,
        })
        .where(eq(campaignSends.id, sendId));

      // If first click, increment campaign count
      if (!sendRecord.clickedAt) {
        await db
          .update(emailCampaigns)
          .set({
            clickedCount: sql`${emailCampaigns.clickedCount} + 1`,
          })
          .where(eq(emailCampaigns.id, sendRecord.campaignId));
      }
    }
  } catch (error) {
    console.error("[Tracking] Error tracking click:", error);
  }

  // Redirect to target URL
  res.redirect(targetUrl);
});

export default router;
