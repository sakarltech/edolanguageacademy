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

// Phone validation regex - supports international formats
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/;

export const enrollmentRouter = router({
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        learnerName: z.string().min(1, "Learner name is required"),
        parentName: z.string().optional(),
        email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
        countryCode: z.string().regex(/^\+\d{1,4}$/, "Please select a valid country code"),
        phone: z.string().min(8).max(15, "Phone number must be 8-15 digits"),
        phoneVerified: z.boolean().refine(val => val === true, "Please verify your phone number before proceeding"),
        whatsappNumber: z.string().optional(),
        courseLevel: z.enum(["beginner", "intermediary", "proficient", "bundle", "private"]),
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
        countryCode: input.countryCode,
        phone: input.phone,
        phoneVerified: input.phoneVerified ? 1 : 0,
        phoneVerifiedAt: input.phoneVerified ? new Date() : null,
        whatsappNumber: input.whatsappNumber || null,
        courseLevel: input.courseLevel,
        timeSlot: input.timeSlot,
        status: "pending",
      });

      const enrollmentId = enrollment.insertId;

      // Create Stripe checkout session
      const origin = ctx.req.headers.origin || "http://localhost:3000";
      
      // Automatically apply 20% New Year discount (OLWIQASA)
      // Users can then enter BOXSALES25 for an additional 20% off (total 40%)
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: product.stripePriceId, // Use the actual Stripe Price ID
            quantity: 1,
          },
        ],
        discounts: [
          {
            coupon: (() => {
              // Date-based coupon switching
              const now = new Date();
              const month = now.getMonth(); // 0-11
              const day = now.getDate();
              
              // Boxing Day period (Dec 26-31): 40% discount
              const isBoxingDayPeriod = month === 11 && day >= 26 && day <= 31;
              
              if (isBoxingDayPeriod) {
                return "3ZrAd7nP"; // 40% Boxing Day coupon
              } else {
                return "q2wFKZQ1"; // 20% New Year coupon
              }
            })(),
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
        // Note: Cannot use allow_promotion_codes when discounts parameter is set
        // The auto-applied OLWIQASA discount provides the 20% off
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
