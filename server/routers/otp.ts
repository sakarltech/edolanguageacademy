import { z } from "zod";
import { eq, and, gt } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { otpVerifications } from "../../drizzle/schema";
import { generateOTP, sendOTP, validatePhoneNumber } from "../_core/otp";

export const otpRouter = router({
  // Send OTP to phone number
  sendOTP: protectedProcedure
    .input(
      z.object({
        countryCode: z.string().regex(/^\+\d{1,4}$/), // e.g., "+234", "+44", "+1"
        phoneNumber: z.string().min(8).max(15),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Validate phone number format
      const validation = validatePhoneNumber(input.countryCode, input.phoneNumber);
      if (!validation.valid) {
        throw new Error(validation.error || "Invalid phone number");
      }

      // Check for recent OTP requests (rate limiting - max 1 per minute)
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recentOTP = await db
        .select()
        .from(otpVerifications)
        .where(
          and(
            eq(otpVerifications.userId, ctx.user.id),
            eq(otpVerifications.phoneNumber, input.phoneNumber),
            gt(otpVerifications.createdAt, oneMinuteAgo)
          )
        )
        .limit(1);

      if (recentOTP.length > 0) {
        throw new Error("Please wait 1 minute before requesting another code");
      }

      // Generate OTP code
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Send OTP via SMS
      const smsResult = await sendOTP(input.countryCode, input.phoneNumber, otpCode);
      
      if (!smsResult.success) {
        throw new Error(smsResult.error || "Failed to send verification code");
      }

      // Store OTP in database
      await db.insert(otpVerifications).values({
        userId: ctx.user.id,
        countryCode: input.countryCode,
        phoneNumber: input.phoneNumber,
        otpCode,
        expiresAt,
        verified: 0,
        attempts: 0,
      });

      return {
        success: true,
        message: "Verification code sent successfully",
        expiresIn: 600, // 10 minutes in seconds
      };
    }),

  // Verify OTP code
  verifyOTP: protectedProcedure
    .input(
      z.object({
        countryCode: z.string().regex(/^\+\d{1,4}$/),
        phoneNumber: z.string().min(8).max(15),
        otpCode: z.string().length(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Find the most recent OTP for this user and phone number
      const otpRecords = await db
        .select()
        .from(otpVerifications)
        .where(
          and(
            eq(otpVerifications.userId, ctx.user.id),
            eq(otpVerifications.countryCode, input.countryCode),
            eq(otpVerifications.phoneNumber, input.phoneNumber),
            eq(otpVerifications.verified, 0)
          )
        )
        .orderBy(otpVerifications.createdAt)
        .limit(1);

      if (otpRecords.length === 0) {
        throw new Error("No verification code found. Please request a new code.");
      }

      const otpRecord = otpRecords[0];

      // Check if OTP has expired
      if (new Date() > otpRecord.expiresAt) {
        throw new Error("Verification code has expired. Please request a new code.");
      }

      // Check if too many failed attempts (max 5)
      if (otpRecord.attempts >= 5) {
        throw new Error("Too many failed attempts. Please request a new code.");
      }

      // Verify OTP code
      if (otpRecord.otpCode !== input.otpCode) {
        // Increment failed attempts
        await db
          .update(otpVerifications)
          .set({ attempts: otpRecord.attempts + 1 })
          .where(eq(otpVerifications.id, otpRecord.id));

        throw new Error("Invalid verification code. Please try again.");
      }

      // Mark OTP as verified
      await db
        .update(otpVerifications)
        .set({
          verified: 1,
          verifiedAt: new Date(),
        })
        .where(eq(otpVerifications.id, otpRecord.id));

      return {
        success: true,
        message: "Phone number verified successfully",
        verifiedPhone: `${input.countryCode}${input.phoneNumber}`,
      };
    }),

  // Check if phone number is already verified for this user
  checkVerification: protectedProcedure
    .input(
      z.object({
        countryCode: z.string().regex(/^\+\d{1,4}$/),
        phoneNumber: z.string().min(8).max(15),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const verifiedOTP = await db
        .select()
        .from(otpVerifications)
        .where(
          and(
            eq(otpVerifications.userId, ctx.user.id),
            eq(otpVerifications.countryCode, input.countryCode),
            eq(otpVerifications.phoneNumber, input.phoneNumber),
            eq(otpVerifications.verified, 1)
          )
        )
        .limit(1);

      return {
        verified: verifiedOTP.length > 0,
        verifiedAt: verifiedOTP[0]?.verifiedAt || null,
      };
    }),
});
