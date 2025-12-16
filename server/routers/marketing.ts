import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { eq, desc, asc, like, and, inArray, sql } from "drizzle-orm";
import {
  marketingContacts,
  emailCampaigns,
  campaignSends,
  suppressionList,
} from "../../drizzle/schema";
import { sendEmail } from "../_core/email";
import { invokeLLM } from "../_core/llm";
import { ENV } from "../_core/env";
import crypto from "crypto";

// Generate secure unsubscribe token
function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const marketingRouter = router({
  // ============== CONTACTS MANAGEMENT ==============

  // Get all contacts with search and filters
  getContacts: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        tag: z.string().optional(),
        source: z.string().optional(),
        subscribed: z.enum(["all", "subscribed", "unsubscribed"]).optional(),
        sortBy: z.enum(["created", "name_asc", "name_desc", "email_asc", "email_desc"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(50),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const page = input?.page || 1;
      const limit = input?.limit || 50;
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions = [];
      
      if (input?.search) {
        conditions.push(
          sql`(${marketingContacts.email} LIKE ${`%${input.search}%`} OR 
               ${marketingContacts.firstName} LIKE ${`%${input.search}%`} OR 
               ${marketingContacts.lastName} LIKE ${`%${input.search}%`})`
        );
      }
      
      if (input?.tag) {
        conditions.push(like(marketingContacts.tags, `%${input.tag}%`));
      }
      
      if (input?.source) {
        conditions.push(eq(marketingContacts.source, input.source));
      }
      
      if (input?.subscribed === "subscribed") {
        conditions.push(eq(marketingContacts.subscribed, 1));
      } else if (input?.subscribed === "unsubscribed") {
        conditions.push(eq(marketingContacts.subscribed, 0));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Determine sort order
      let orderByClause;
      switch (input?.sortBy) {
        case "name_asc":
          orderByClause = asc(marketingContacts.firstName);
          break;
        case "name_desc":
          orderByClause = desc(marketingContacts.firstName);
          break;
        case "email_asc":
          orderByClause = asc(marketingContacts.email);
          break;
        case "email_desc":
          orderByClause = desc(marketingContacts.email);
          break;
        case "created":
        default:
          orderByClause = desc(marketingContacts.createdAt);
          break;
      }

      const [contacts, countResult] = await Promise.all([
        db
          .select()
          .from(marketingContacts)
          .where(whereClause)
          .orderBy(orderByClause)
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`COUNT(*)` })
          .from(marketingContacts)
          .where(whereClause),
      ]);

      return {
        contacts,
        total: countResult[0]?.count || 0,
        page,
        limit,
        totalPages: Math.ceil((countResult[0]?.count || 0) / limit),
      };
    }),

  // Get unique tags and sources for filters
  getContactFilters: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const contacts = await db.select({
      tags: marketingContacts.tags,
      source: marketingContacts.source,
    }).from(marketingContacts);

    const tagsSet = new Set<string>();
    const sourcesSet = new Set<string>();

    contacts.forEach((c) => {
      if (c.tags) {
        c.tags.split(",").forEach((t) => tagsSet.add(t.trim()));
      }
      if (c.source) {
        sourcesSet.add(c.source);
      }
    });

    return {
      tags: Array.from(tagsSet).sort(),
      sources: Array.from(sourcesSet).sort(),
    };
  }),

  // Add single contact
  addContact: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        tags: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const email = input.email.toLowerCase().trim();
      
      // Check if email is suppressed
      const suppressed = await db
        .select()
        .from(suppressionList)
        .where(eq(suppressionList.email, email))
        .limit(1);
      
      if (suppressed.length > 0) {
        throw new Error("This email is on the suppression list and cannot be added");
      }

      await db.insert(marketingContacts).values({
        email,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        tags: input.tags || null,
        source: input.source || "manual",
        unsubscribeToken: generateUnsubscribeToken(),
      });

      return { success: true };
    }),

  // Update contact
  updateContact: adminProcedure
    .input(
      z.object({
        id: z.number(),
        email: z.string().email().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        tags: z.string().optional(),
        source: z.string().optional(),
        subscribed: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updateData } = input;
      const updates: Record<string, any> = {};

      if (updateData.email !== undefined) updates.email = updateData.email.toLowerCase().trim();
      if (updateData.firstName !== undefined) updates.firstName = updateData.firstName;
      if (updateData.lastName !== undefined) updates.lastName = updateData.lastName;
      if (updateData.tags !== undefined) updates.tags = updateData.tags;
      if (updateData.source !== undefined) updates.source = updateData.source;
      if (updateData.subscribed !== undefined) updates.subscribed = updateData.subscribed ? 1 : 0;

      await db.update(marketingContacts).set(updates).where(eq(marketingContacts.id, id));

      return { success: true };
    }),

  // Delete contact
  deleteContact: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(marketingContacts).where(eq(marketingContacts.id, input.id));
      return { success: true };
    }),

  // Bulk delete contacts
  bulkDeleteContacts: adminProcedure
    .input(z.object({ ids: z.array(z.number()).min(1) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(marketingContacts).where(inArray(marketingContacts.id, input.ids));
      return { success: true, deletedCount: input.ids.length };
    }),

  // Import contacts from CSV data
  importContacts: adminProcedure
    .input(
      z.object({
        contacts: z.array(
          z.object({
            email: z.string(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            tags: z.string().optional(),
            source: z.string().optional(),
          })
        ),
        replaceAll: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get suppression list
      const suppressedEmails = await db.select({ email: suppressionList.email }).from(suppressionList);
      const suppressedSet = new Set(suppressedEmails.map((s) => s.email.toLowerCase()));

      // Validate and deduplicate
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const seenEmails = new Set<string>();
      const validContacts: Array<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        tags: string | null;
        source: string | null;
        unsubscribeToken: string;
      }> = [];
      const invalidEmails: string[] = [];
      const duplicateEmails: string[] = [];
      const suppressedContacts: string[] = [];

      for (const contact of input.contacts) {
        const email = contact.email.toLowerCase().trim();
        
        if (!emailRegex.test(email)) {
          invalidEmails.push(contact.email);
          continue;
        }
        
        if (seenEmails.has(email)) {
          duplicateEmails.push(email);
          continue;
        }
        
        if (suppressedSet.has(email)) {
          suppressedContacts.push(email);
          continue;
        }
        
        seenEmails.add(email);
        validContacts.push({
          email,
          firstName: contact.firstName || null,
          lastName: contact.lastName || null,
          tags: contact.tags || null,
          source: contact.source || "csv_import",
          unsubscribeToken: generateUnsubscribeToken(),
        });
      }

      if (input.replaceAll) {
        // Delete all existing contacts (dangerous action)
        await db.delete(marketingContacts);
      }

      // Upsert contacts
      let insertedCount = 0;
      let updatedCount = 0;

      for (const contact of validContacts) {
        try {
          const existing = await db
            .select()
            .from(marketingContacts)
            .where(eq(marketingContacts.email, contact.email))
            .limit(1);

          if (existing.length > 0) {
            // Update existing
            await db
              .update(marketingContacts)
              .set({
                firstName: contact.firstName || existing[0].firstName,
                lastName: contact.lastName || existing[0].lastName,
                tags: contact.tags || existing[0].tags,
                source: contact.source || existing[0].source,
              })
              .where(eq(marketingContacts.email, contact.email));
            updatedCount++;
          } else {
            // Insert new
            await db.insert(marketingContacts).values(contact);
            insertedCount++;
          }
        } catch (error) {
          console.error(`Failed to import contact ${contact.email}:`, error);
        }
      }

      return {
        success: true,
        summary: {
          total: input.contacts.length,
          valid: validContacts.length,
          invalid: invalidEmails.length,
          duplicates: duplicateEmails.length,
          suppressed: suppressedContacts.length,
          inserted: insertedCount,
          updated: updatedCount,
        },
        invalidEmails,
        duplicateEmails,
        suppressedContacts,
      };
    }),

  // Export contacts to CSV format
  exportContacts: adminProcedure
    .input(
      z.object({
        tag: z.string().optional(),
        source: z.string().optional(),
        subscribed: z.enum(["all", "subscribed", "unsubscribed"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions = [];
      
      if (input?.tag) {
        conditions.push(like(marketingContacts.tags, `%${input.tag}%`));
      }
      
      if (input?.source) {
        conditions.push(eq(marketingContacts.source, input.source));
      }
      
      if (input?.subscribed === "subscribed") {
        conditions.push(eq(marketingContacts.subscribed, 1));
      } else if (input?.subscribed === "unsubscribed") {
        conditions.push(eq(marketingContacts.subscribed, 0));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const contacts = await db
        .select()
        .from(marketingContacts)
        .where(whereClause)
        .orderBy(desc(marketingContacts.createdAt));

      return contacts;
    }),

  // ============== CAMPAIGNS MANAGEMENT ==============

  // Get all campaigns
  getCampaigns: adminProcedure
    .input(
      z.object({
        status: z.enum(["all", "draft", "scheduled", "sending", "completed", "cancelled"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions = [];
      if (input?.status && input.status !== "all") {
        conditions.push(eq(emailCampaigns.status, input.status));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db
        .select()
        .from(emailCampaigns)
        .where(whereClause)
        .orderBy(desc(emailCampaigns.createdAt));
    }),

  // Get single campaign with details
  getCampaign: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const campaign = await db
        .select()
        .from(emailCampaigns)
        .where(eq(emailCampaigns.id, input.id))
        .limit(1);

      if (campaign.length === 0) {
        throw new Error("Campaign not found");
      }

      // Get send statistics
      const sends = await db
        .select({
          status: campaignSends.status,
          count: sql<number>`COUNT(*)`,
        })
        .from(campaignSends)
        .where(eq(campaignSends.campaignId, input.id))
        .groupBy(campaignSends.status);

      const stats = {
        pending: 0,
        sent: 0,
        failed: 0,
        bounced: 0,
      };

      sends.forEach((s) => {
        stats[s.status as keyof typeof stats] = s.count;
      });

      return {
        ...campaign[0],
        stats,
      };
    }),

  // Create campaign
  createCampaign: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        audienceType: z.enum(["all", "by_tag", "by_source"]),
        audienceFilter: z.string().optional(),
        subject: z.string().optional(),
        preheader: z.string().optional(),
        bodyHtml: z.string().optional(),
        bodyText: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional(),
        scheduledAt: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(emailCampaigns).values({
        name: input.name,
        audienceType: input.audienceType,
        audienceFilter: input.audienceFilter || null,
        subject: input.subject || null,
        preheader: input.preheader || null,
        bodyHtml: input.bodyHtml || null,
        bodyText: input.bodyText || null,
        ctaText: input.ctaText || null,
        ctaLink: input.ctaLink || null,
        status: "draft",
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        createdBy: ctx.user.id,
      });

      return { success: true, campaignId: result[0].insertId };
    }),

  // Update campaign
  updateCampaign: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        audienceType: z.enum(["all", "by_tag", "by_source"]).optional(),
        audienceFilter: z.string().optional(),
        subject: z.string().optional(),
        preheader: z.string().optional(),
        bodyHtml: z.string().optional(),
        bodyText: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional(),
        scheduledAt: z.string().nullable().optional(),
        status: z.enum(["draft", "scheduled", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updateData } = input;
      const updates: Record<string, any> = {};

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "scheduledAt" && value) {
            updates[key] = new Date(value);
          } else {
            updates[key] = value;
          }
        }
      });

      await db.update(emailCampaigns).set(updates).where(eq(emailCampaigns.id, id));

      return { success: true };
    }),

  // Delete campaign
  deleteCampaign: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete related sends first
      await db.delete(campaignSends).where(eq(campaignSends.campaignId, input.id));
      // Delete campaign
      await db.delete(emailCampaigns).where(eq(emailCampaigns.id, input.id));

      return { success: true };
    }),

  // Generate email content using AI
  generateEmailContent: adminProcedure
    .input(
      z.object({
        brief: z.string().min(10),
        tone: z.enum(["professional", "friendly", "casual", "urgent"]).default("friendly"),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `You are an email marketing expert for Edo Language Academy, an online school teaching the Edo language (spoken by the Bini people of Nigeria). 
Generate marketing email content based on the user's brief.

Return a JSON object with:
{
  "subjectLines": ["Subject 1", "Subject 2", "Subject 3"],
  "preheader": "A short preview text (max 100 chars)",
  "bodyHtml": "Full HTML email body with inline styles. Include {{first_name}} placeholder for personalization. Use the academy's brand colors: #8B2500 (dark red) and #C17817 (gold).",
  "bodyText": "Plain text version of the email",
  "ctaText": "Call to action button text",
  "ctaLink": "https://www.edolanguageacademy.com"
}

Important:
- Always include {{first_name}} in the greeting with fallback text "there" (e.g., "Hello {{first_name}}")
- Make content engaging and culturally relevant
- Include Edo phrases where appropriate (e.g., "Òb'okhian!" for welcome, "Urhuese!" for thank you)
- Keep subject lines under 60 characters
- CTA should drive action (register, learn more, etc.)`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.brief },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "email_content",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  subjectLines: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 subject line options",
                  },
                  preheader: { type: "string", description: "Email preheader text" },
                  bodyHtml: { type: "string", description: "HTML email body" },
                  bodyText: { type: "string", description: "Plain text email body" },
                  ctaText: { type: "string", description: "CTA button text" },
                  ctaLink: { type: "string", description: "CTA link URL" },
                },
                required: ["subjectLines", "preheader", "bodyHtml", "bodyText", "ctaText", "ctaLink"],
                additionalProperties: false,
              },
            },
          },
        });

        const messageContent = response.choices[0].message.content;
        const content = JSON.parse(typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent) || "{}");
        return { success: true, content };
      } catch (error) {
        console.error("AI generation failed:", error);
        throw new Error("Failed to generate email content. Please try again.");
      }
    }),

  // Send test email
  sendTestEmail: adminProcedure
    .input(
      z.object({
        campaignId: z.number(),
        testEmail: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const campaign = await db
        .select()
        .from(emailCampaigns)
        .where(eq(emailCampaigns.id, input.campaignId))
        .limit(1);

      if (campaign.length === 0) {
        throw new Error("Campaign not found");
      }

      const c = campaign[0];
      
      if (!c.subject || !c.bodyHtml) {
        throw new Error("Campaign must have subject and body before sending test");
      }

      // Replace personalization tokens with test values
      const personalizedHtml = c.bodyHtml
        .replace(/\{\{first_name\}\}/g, "Test User")
        .replace(/\{\{email\}\}/g, input.testEmail);

      const personalizedText = c.bodyText
        ? c.bodyText
            .replace(/\{\{first_name\}\}/g, "Test User")
            .replace(/\{\{email\}\}/g, input.testEmail)
        : undefined;

      const success = await sendEmail({
        to: input.testEmail,
        subject: `[TEST] ${c.subject}`,
        html: personalizedHtml,
        text: personalizedText,
      });

      return { success };
    }),

  // Get audience count for campaign
  getAudienceCount: adminProcedure
    .input(
      z.object({
        audienceType: z.enum(["all", "by_tag", "by_source"]),
        audienceFilter: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get suppressed emails
      const suppressedEmails = await db.select({ email: suppressionList.email }).from(suppressionList);
      const suppressedSet = new Set(suppressedEmails.map((s) => s.email.toLowerCase()));

      // Build query conditions
      const conditions = [eq(marketingContacts.subscribed, 1)];
      
      if (input.audienceType === "by_tag" && input.audienceFilter) {
        conditions.push(like(marketingContacts.tags, `%${input.audienceFilter}%`));
      } else if (input.audienceType === "by_source" && input.audienceFilter) {
        conditions.push(eq(marketingContacts.source, input.audienceFilter));
      }

      const contacts = await db
        .select({ email: marketingContacts.email })
        .from(marketingContacts)
        .where(and(...conditions));

      // Filter out suppressed
      const eligibleCount = contacts.filter((c) => !suppressedSet.has(c.email.toLowerCase())).length;

      return {
        total: contacts.length,
        eligible: eligibleCount,
        suppressed: contacts.length - eligibleCount,
      };
    }),

  // Send campaign (bulk send)
  sendCampaign: adminProcedure
    .input(
      z.object({
        campaignId: z.number(),
        confirmLargeSend: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const campaign = await db
        .select()
        .from(emailCampaigns)
        .where(eq(emailCampaigns.id, input.campaignId))
        .limit(1);

      if (campaign.length === 0) {
        throw new Error("Campaign not found");
      }

      const c = campaign[0];

      if (c.status !== "draft" && c.status !== "scheduled") {
        throw new Error("Campaign cannot be sent in current status");
      }

      if (!c.subject || !c.bodyHtml) {
        throw new Error("Campaign must have subject and body before sending");
      }

      // Get suppressed emails
      const suppressedEmails = await db.select({ email: suppressionList.email }).from(suppressionList);
      const suppressedSet = new Set(suppressedEmails.map((s) => s.email.toLowerCase()));

      // Get eligible contacts
      const conditions = [eq(marketingContacts.subscribed, 1)];
      
      if (c.audienceType === "by_tag" && c.audienceFilter) {
        conditions.push(like(marketingContacts.tags, `%${c.audienceFilter}%`));
      } else if (c.audienceType === "by_source" && c.audienceFilter) {
        conditions.push(eq(marketingContacts.source, c.audienceFilter));
      }

      const allContacts = await db
        .select()
        .from(marketingContacts)
        .where(and(...conditions));

      const eligibleContacts = allContacts.filter(
        (contact) => !suppressedSet.has(contact.email.toLowerCase())
      );

      // Safety check for large sends
      if (eligibleContacts.length > 500 && !input.confirmLargeSend) {
        return {
          success: false,
          requiresConfirmation: true,
          recipientCount: eligibleContacts.length,
          message: `This will send to ${eligibleContacts.length} recipients. Please confirm.`,
        };
      }

      // Update campaign status
      await db
        .update(emailCampaigns)
        .set({
          status: "sending",
          targetedCount: eligibleContacts.length,
          sentAt: new Date(),
        })
        .where(eq(emailCampaigns.id, input.campaignId));

      // Create send records
      for (const contact of eligibleContacts) {
        await db.insert(campaignSends).values({
          campaignId: input.campaignId,
          contactId: contact.id,
          status: "pending",
        });
      }

      // Process sends in batches (background-like, but synchronous for simplicity)
      const BATCH_SIZE = 100;
      const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds
      
      let sentCount = 0;
      let failedCount = 0;

      const baseUrl = "https://www.edolanguageacademy.com";

      for (let i = 0; i < eligibleContacts.length; i += BATCH_SIZE) {
        const batch = eligibleContacts.slice(i, i + BATCH_SIZE);

        for (const contact of batch) {
          try {
            // Get the send record for tracking
            const [sendRecord] = await db
              .select()
              .from(campaignSends)
              .where(
                and(
                  eq(campaignSends.campaignId, input.campaignId),
                  eq(campaignSends.contactId, contact.id)
                )
              )
              .limit(1);

            if (!sendRecord) continue;

            // Personalize email
            const firstName = contact.firstName || "there";
            const unsubscribeUrl = `${baseUrl}/unsubscribe/${contact.unsubscribeToken}`;
            
            let personalizedHtml = c.bodyHtml!
              .replace(/\{\{first_name\}\}/g, firstName)
              .replace(/\{\{email\}\}/g, contact.email);

            // Add click tracking to CTA if present
            if (c.ctaLink) {
              const trackedCtaUrl = `${baseUrl}/api/track/click/${sendRecord.id}?url=${encodeURIComponent(c.ctaLink)}`;
              personalizedHtml = personalizedHtml.replace(
                new RegExp(c.ctaLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                trackedCtaUrl
              );
            }

            // Add tracking pixel for open tracking
            const trackingPixel = `<img src="${baseUrl}/api/track/open/${sendRecord.id}" width="1" height="1" style="display:none" alt="" />`;

            // Add unsubscribe link
            personalizedHtml += `
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666;">
                <p>You're receiving this email because you subscribed to Edo Language Academy updates.</p>
                <p><a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a></p>
              </div>
              ${trackingPixel}
            `;

            const personalizedText = c.bodyText
              ? c.bodyText
                  .replace(/\{\{first_name\}\}/g, firstName)
                  .replace(/\{\{email\}\}/g, contact.email) +
                `\n\nUnsubscribe: ${unsubscribeUrl}`
              : undefined;

            const success = await sendEmail({
              to: contact.email,
              subject: c.subject!,
              html: personalizedHtml,
              text: personalizedText,
            });

            if (success) {
              sentCount++;
              await db
                .update(campaignSends)
                .set({ status: "sent", sentAt: new Date() })
                .where(
                  and(
                    eq(campaignSends.campaignId, input.campaignId),
                    eq(campaignSends.contactId, contact.id)
                  )
                );
            } else {
              failedCount++;
              await db
                .update(campaignSends)
                .set({ status: "failed", errorMessage: "Send failed" })
                .where(
                  and(
                    eq(campaignSends.campaignId, input.campaignId),
                    eq(campaignSends.contactId, contact.id)
                  )
                );
            }
          } catch (error: any) {
            failedCount++;
            await db
              .update(campaignSends)
              .set({ status: "failed", errorMessage: error.message || "Unknown error" })
              .where(
                and(
                  eq(campaignSends.campaignId, input.campaignId),
                  eq(campaignSends.contactId, contact.id)
                )
              );
          }
        }

        // Delay between batches
        if (i + BATCH_SIZE < eligibleContacts.length) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      // Update campaign with final counts
      await db
        .update(emailCampaigns)
        .set({
          status: "completed",
          sentCount,
          failedCount,
        })
        .where(eq(emailCampaigns.id, input.campaignId));

      return {
        success: true,
        sentCount,
        failedCount,
        totalTargeted: eligibleContacts.length,
      };
    }),

  // ============== SUPPRESSION LIST ==============

  // Get suppression list
  getSuppressionList: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    return db.select().from(suppressionList).orderBy(desc(suppressionList.createdAt));
  }),

  // Add to suppression list
  addToSuppressionList: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        reason: z.enum(["unsubscribed", "hard_bounce", "complaint", "manual"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const email = input.email.toLowerCase().trim();

      // Check if already exists
      const existing = await db
        .select()
        .from(suppressionList)
        .where(eq(suppressionList.email, email))
        .limit(1);

      if (existing.length > 0) {
        return { success: true, message: "Email already on suppression list" };
      }

      await db.insert(suppressionList).values({
        email,
        reason: input.reason,
      });

      // Also update contact if exists
      await db
        .update(marketingContacts)
        .set({ subscribed: 0 })
        .where(eq(marketingContacts.email, email));

      return { success: true };
    }),

  // Remove from suppression list
  removeFromSuppressionList: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(suppressionList).where(eq(suppressionList.id, input.id));
      return { success: true };
    }),

  // ============== UNSUBSCRIBE (PUBLIC) ==============

  // Handle unsubscribe
  unsubscribe: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const contact = await db
        .select()
        .from(marketingContacts)
        .where(eq(marketingContacts.unsubscribeToken, input.token))
        .limit(1);

      if (contact.length === 0) {
        throw new Error("Invalid unsubscribe link");
      }

      const email = contact[0].email;

      // Update contact
      await db
        .update(marketingContacts)
        .set({ subscribed: 0 })
        .where(eq(marketingContacts.id, contact[0].id));

      // Add to suppression list
      const existing = await db
        .select()
        .from(suppressionList)
        .where(eq(suppressionList.email, email))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(suppressionList).values({
          email,
          reason: "unsubscribed",
        });
      }

      return { success: true, email };
    }),

  // Verify unsubscribe token (for showing confirmation page)
  verifyUnsubscribeToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const contact = await db
        .select({ email: marketingContacts.email, subscribed: marketingContacts.subscribed })
        .from(marketingContacts)
        .where(eq(marketingContacts.unsubscribeToken, input.token))
        .limit(1);

      if (contact.length === 0) {
        return { valid: false };
      }

      return {
        valid: true,
        email: contact[0].email,
        alreadyUnsubscribed: contact[0].subscribed === 0,
      };
    }),
});
