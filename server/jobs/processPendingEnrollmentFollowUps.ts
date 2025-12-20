/**
 * Automated job to send follow-up emails for pending enrollments after 24 hours
 * 
 * Run this script via cron every hour:
 * 0 * * * * cd /home/ubuntu/edo-language-academy && node server/jobs/processPendingEnrollmentFollowUps.js
 */

import { eq, and, isNull, sql } from "drizzle-orm";
import { getDb } from "../db";
import { enrollments } from "../../drizzle/schema";
import { sendEmail } from "../_core/email";
import { generatePendingEnrollmentFollowUpEmail } from "../templates/pendingEnrollmentFollowUp";

async function processPendingEnrollmentFollowUps() {
  console.log("[Pending Enrollment Follow-ups] Starting job...");
  
  const db = await getDb();
  if (!db) {
    console.error("[Pending Enrollment Follow-ups] Database not available");
    return;
  }

  try {
    // Find pending enrollments older than 24 hours that haven't received a follow-up email yet
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const pendingEnrollments = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.status, "pending"),
          isNull(enrollments.followUpSentAt),
          sql`${enrollments.createdAt} < ${twentyFourHoursAgo}`
        )
      );

    console.log(`[Pending Enrollment Follow-ups] Found ${pendingEnrollments.length} pending enrollments to follow up`);

    if (pendingEnrollments.length === 0) {
      console.log("[Pending Enrollment Follow-ups] No pending enrollments to process");
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const enrollment of pendingEnrollments) {
      try {
        // Generate personalized email
        const emailContent = generatePendingEnrollmentFollowUpEmail({
          learnerName: enrollment.learnerName,
          courseLevel: enrollment.courseLevel,
          userEmail: enrollment.email,
        });

        // Send email
        const success = await sendEmail({
          to: enrollment.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        if (success) {
          // Mark follow-up as sent
          await db
            .update(enrollments)
            .set({ followUpSentAt: new Date() })
            .where(eq(enrollments.id, enrollment.id));
          
          successCount++;
          console.log(`[Pending Enrollment Follow-ups] Sent follow-up to ${enrollment.email} for ${enrollment.courseLevel} course`);
        } else {
          failureCount++;
          console.error(`[Pending Enrollment Follow-ups] Failed to send email to ${enrollment.email}`);
        }

        // Add delay between emails to avoid rate limiting (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        failureCount++;
        console.error(`[Pending Enrollment Follow-ups] Error processing enrollment ${enrollment.id}:`, error);
      }
    }

    console.log(`[Pending Enrollment Follow-ups] Job completed. Sent: ${successCount}, Failed: ${failureCount}`);

  } catch (error) {
    console.error("[Pending Enrollment Follow-ups] Job failed:", error);
  }
}

// Run the job
processPendingEnrollmentFollowUps()
  .then(() => {
    console.log("[Pending Enrollment Follow-ups] Job finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[Pending Enrollment Follow-ups] Job crashed:", error);
    process.exit(1);
  });
