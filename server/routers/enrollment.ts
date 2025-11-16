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
        learnerAge: z.number().min(5).max(120),
        parentName: z.string().optional(),
        email: z.string().email(),
        phone: z.string().min(1),
        courseLevel: z.enum(["beginner", "intermediary", "proficient", "bundle", "private"]),
        ageGroup: z.enum(["kids", "teens", "adults"]),
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
        learnerAge: input.learnerAge,
        parentName: input.parentName || null,
        email: input.email,
        phone: input.phone,
        courseLevel: input.courseLevel,
        ageGroup: input.ageGroup,
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
          age_group: input.ageGroup,
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

      return {
        status: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      };
    }),
});
