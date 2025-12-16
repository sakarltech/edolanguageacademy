/**
 * Scheduled job to process and send scheduled email campaigns
 * Run this via cron every 5-15 minutes
 */

import { getDb } from "../db";
import { emailCampaigns, campaignSends, marketingContacts, suppressionList } from "../../drizzle/schema";
import { eq, and, lte, sql } from "drizzle-orm";
import { sendEmail } from "../_core/email";
import { ENV } from "../_core/env";

export async function processScheduledCampaigns() {
  const db = await getDb();
  if (!db) {
    console.error("[ScheduledCampaigns] Database not available");
    return;
  }

  const now = new Date();

  // Find campaigns that are scheduled and due to be sent
  const dueCampaigns = await db
    .select()
    .from(emailCampaigns)
    .where(
      and(
        eq(emailCampaigns.status, "scheduled"),
        lte(emailCampaigns.scheduledAt, now)
      )
    );

  console.log(`[ScheduledCampaigns] Found ${dueCampaigns.length} campaigns due for sending`);

  for (const campaign of dueCampaigns) {
    try {
      console.log(`[ScheduledCampaigns] Processing campaign: ${campaign.name} (ID: ${campaign.id})`);

      // Update status to sending
      await db
        .update(emailCampaigns)
        .set({ status: "sending" })
        .where(eq(emailCampaigns.id, campaign.id));

      // Get target contacts based on audience filter
      let targetContacts: typeof marketingContacts.$inferSelect[] = [];

      if (campaign.audienceType === "all") {
        targetContacts = await db
          .select()
          .from(marketingContacts)
          .where(eq(marketingContacts.subscribed, 1));
      } else if (campaign.audienceType === "by_tag" && campaign.audienceFilter) {
        const allContacts = await db
          .select()
          .from(marketingContacts)
          .where(eq(marketingContacts.subscribed, 1));
        
        targetContacts = allContacts.filter(contact => 
          contact.tags?.includes(campaign.audienceFilter!)
        );
      } else if (campaign.audienceType === "by_source" && campaign.audienceFilter) {
        targetContacts = await db
          .select()
          .from(marketingContacts)
          .where(
            and(
              eq(marketingContacts.subscribed, 1),
              eq(marketingContacts.source, campaign.audienceFilter)
            )
          );
      }

      // Filter out suppressed emails
      const suppressedEmails = await db.select().from(suppressionList);
      const suppressedSet = new Set(suppressedEmails.map(s => s.email));
      const filteredContacts = targetContacts.filter(c => !suppressedSet.has(c.email));

      console.log(`[ScheduledCampaigns] Targeting ${filteredContacts.length} contacts (${targetContacts.length - filteredContacts.length} suppressed)`);

      // Update targeted count
      await db
        .update(emailCampaigns)
        .set({ targetedCount: filteredContacts.length })
        .where(eq(emailCampaigns.id, campaign.id));

      // Create campaign_sends records
      for (const contact of filteredContacts) {
        await db.insert(campaignSends).values({
          campaignId: campaign.id,
          contactId: contact.id,
          status: "pending",
        });
      }

      // Send emails in batches
      const BATCH_SIZE = 100;
      let sentCount = 0;
      let failedCount = 0;

      for (let i = 0; i < filteredContacts.length; i += BATCH_SIZE) {
        const batch = filteredContacts.slice(i, i + BATCH_SIZE);

        for (const contact of batch) {
          try {
            // Get the campaign_send record
            const [sendRecord] = await db
              .select()
              .from(campaignSends)
              .where(
                and(
                  eq(campaignSends.campaignId, campaign.id),
                  eq(campaignSends.contactId, contact.id)
                )
              )
              .limit(1);

            if (!sendRecord) continue;

            // Personalize email
            const firstName = contact.firstName || "Friend";
            const personalizedBody = campaign.bodyHtml
              ?.replace(/{{first_name}}/g, firstName)
              ?.replace(/{{email}}/g, contact.email);

            // Add tracking pixel and click tracking
            const baseUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:3000';
            const trackingPixel = `<img src="${baseUrl}/api/track/open/${sendRecord.id}" width="1" height="1" style="display:none" alt="" />`;
            
            let trackedCta = campaign.ctaLink;
            if (campaign.ctaLink) {
              trackedCta = `${baseUrl}/api/track/click/${sendRecord.id}?url=${encodeURIComponent(campaign.ctaLink)}`;
            }

            const finalBody = personalizedBody + trackingPixel;

            // Send email
            await sendEmail({
              to: contact.email,
              subject: campaign.subject || "Update from Edo Language Academy",
              html: finalBody,
            });

            // Update send record
            await db
              .update(campaignSends)
              .set({
                status: "sent",
                sentAt: new Date(),
              })
              .where(eq(campaignSends.id, sendRecord.id));

            sentCount++;
          } catch (error: any) {
            console.error(`[ScheduledCampaigns] Failed to send to ${contact.email}:`, error.message);
            
            // Update send record with error
            const [sendRecord] = await db
              .select()
              .from(campaignSends)
              .where(
                and(
                  eq(campaignSends.campaignId, campaign.id),
                  eq(campaignSends.contactId, contact.id)
                )
              )
              .limit(1);

            if (sendRecord) {
              await db
                .update(campaignSends)
                .set({
                  status: "failed",
                  errorMessage: error.message,
                })
                .where(eq(campaignSends.id, sendRecord.id));
            }

            failedCount++;
          }
        }

        // Rate limiting: wait 1 second between batches
        if (i + BATCH_SIZE < filteredContacts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Update campaign with final counts
      await db
        .update(emailCampaigns)
        .set({
          status: "completed",
          sentAt: new Date(),
          sentCount,
          failedCount,
        })
        .where(eq(emailCampaigns.id, campaign.id));

      console.log(`[ScheduledCampaigns] Campaign completed: ${sentCount} sent, ${failedCount} failed`);
    } catch (error: any) {
      console.error(`[ScheduledCampaigns] Error processing campaign ${campaign.id}:`, error.message);
      
      // Mark campaign as failed
      await db
        .update(emailCampaigns)
        .set({ status: "cancelled" })
        .where(eq(emailCampaigns.id, campaign.id));
    }
  }

  console.log("[ScheduledCampaigns] Processing complete");
}

// Allow running directly for testing
if (require.main === module) {
  processScheduledCampaigns()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}
