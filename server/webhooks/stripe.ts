import { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { enrollments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";
import { sendEnrollmentConfirmationEmail } from "../_core/email";
import { whatsappGroups } from "../../drizzle/schema";
import { and } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] No signature found");
    return res.status(400).send("No signature found");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log("[Webhook] Processing event:", event.type, event.id);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return;
  }

  const enrollmentId = session.metadata?.enrollment_id;
  if (!enrollmentId) {
    console.error("[Webhook] No enrollment_id in session metadata");
    return;
  }

  console.log("[Webhook] Updating enrollment:", enrollmentId);

  // Update enrollment status to paid
  await db
    .update(enrollments)
    .set({
      status: "paid",
      paidAt: new Date(),
      stripePaymentIntentId: session.payment_intent as string,
    })
    .where(eq(enrollments.id, parseInt(enrollmentId)));

  // Notify owner of new enrollment
  const learnerName = session.metadata?.learner_name || "Unknown";
  const courseLevel = session.metadata?.course_level || "Unknown";
  const ageGroup = session.metadata?.age_group || "Unknown";
  const customerEmail = session.metadata?.customer_email || session.customer_email || "Unknown";

  await notifyOwner({
    title: "New Course Enrollment",
    content: `
New student enrolled in Edo Language Academy!

Student: ${learnerName}
Course: ${courseLevel}
Age Group: ${ageGroup}
Email: ${customerEmail}
Amount Paid: £${((session.amount_total || 0) / 100).toFixed(2)}
Payment ID: ${session.payment_intent}

Please add them to the appropriate WhatsApp group within 24 hours.
    `,
  });

  console.log("[Webhook] Enrollment updated successfully:", enrollmentId);

  // Get enrollment details for email
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, parseInt(enrollmentId)))
    .limit(1);

  if (enrollment) {
    // Get WhatsApp group link
    const [whatsappGroup] = await db
      .select()
      .from(whatsappGroups)
      .where(
        and(
          eq(whatsappGroups.courseLevel, enrollment.courseLevel),
          eq(whatsappGroups.timeSlot, enrollment.timeSlot),
          eq(whatsappGroups.isActive, 1)
        )
      )
      .limit(1);

    // Send enrollment confirmation email
    await sendEnrollmentConfirmationEmail({
      to: enrollment.email,
      learnerName: enrollment.learnerName,
      courseLevel: enrollment.courseLevel,
      timeSlot: enrollment.timeSlot,
      whatsappGroupLink: whatsappGroup?.groupLink || undefined,
      whatsappGroupName: whatsappGroup?.groupName || undefined,
    });
  }
}
