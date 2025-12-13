import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { enrollments } from "../../drizzle/schema";
import { COURSE_PRODUCTS } from "../products";
import Stripe from "stripe";
import { ENV } from "../_core/env";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export const enrollmentRouter = router({
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        learnerName: z.string().min(1),
        parentName: z.string().optional(),
        email: z.string().email(),
        phone: z.string().min(1),
        whatsappNumber: z.string().optional(),
        courseLevel: z.enum(["beginner", "intermediary", "proficient", "bundle"]),
        timeSlot: z.enum(["11AM_GMT", "11AM_CST", "5PM_GMT", "6PM_GMT", "7PM_GMT"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const product = COURSE_PRODUCTS[input.courseLevel];
      if (!product) {
        throw new Error("Invalid course level");
      }

      // Create enrollment record with pending status
      const [enrollment] = await db.insert(enrollments).values({
        userId: ctx.user?.id || 0, // 0 for guest users
        learnerName: input.learnerName,
        parentName: input.parentName || null,
        email: input.email,
        phone: input.phone,
        whatsappNumber: input.whatsappNumber || null,
        courseLevel: input.courseLevel,
        timeSlot: input.timeSlot,
        status: "pending",
      });

      const enrollmentId = enrollment.insertId;

      // Create Stripe checkout session
      const origin = ctx.req.headers.origin || "http://localhost:3000";
      
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: product.stripePriceId, // Use the actual Stripe Price ID
            quantity: 1,
          },
        ],
        customer_email: input.email,
        client_reference_id: enrollmentId.toString(),
        metadata: {
          enrollment_id: enrollmentId.toString(),
          user_id: ctx.user?.id?.toString() || "guest",
          course_level: input.courseLevel,
          time_slot: input.timeSlot,
          learner_name: input.learnerName,
          customer_email: input.email,
        },
        success_url: `${origin}/enrollment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/register?cancelled=true`,
        allow_promotion_codes: true,
      });

      // Update enrollment with checkout session ID
      await db.update(enrollments)
        .set({ stripeCheckoutSessionId: session.id })
        .where(eq(enrollments.id, enrollmentId));

      return {
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

  getEnrollmentStatus: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);

      // Get enrollment details to fetch WhatsApp group link
      const [enrollment] = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.stripeCheckoutSessionId, input.sessionId))
        .limit(1);

      let whatsappGroupLink = null;
      if (enrollment) {
        // Import whatsappGroups from schema
        const { whatsappGroups } = await import("../../drizzle/schema");
        const { and } = await import("drizzle-orm");
        
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

        if (whatsappGroup) {
          whatsappGroupLink = {
            groupName: whatsappGroup.groupName,
            groupLink: whatsappGroup.groupLink,
          };
        }
      }

      return {
        status: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total ? session.amount_total / 100 : 0,
        whatsappGroup: whatsappGroupLink,
        courseLevel: enrollment?.courseLevel,
        timeSlot: enrollment?.timeSlot,
      };
    }),
});
