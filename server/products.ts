/**
 * Stripe Products and Prices Configuration
 * 
 * Stripe Price IDs are now configured via environment variables:
 * - STRIPE_PRICE_BEGINNER
 * - STRIPE_PRICE_INTERMEDIARY
 * - STRIPE_PRICE_PROFICIENT
 * - STRIPE_PRICE_BUNDLE
 * 
 * To use your own Stripe account:
 * 1. Create products in your Stripe Dashboard (https://dashboard.stripe.com/products)
 * 2. Copy the Price IDs from each product
 * 3. Set them as environment variables in your deployment settings
 * 
 * Current values are defaults from the original Stripe account and will be
 * overridden by environment variables if provided.
 */

import { ENV } from "./_core/env";

export interface CourseProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in GBP (pounds)
  stripePriceId: string; // Stripe Price ID (from environment variables)
}

export const COURSE_PRODUCTS: Record<string, CourseProduct> = {
  beginner: {
    id: "beginner",
    name: "Edo Beginner Course",
    description: "8-week beginner level Edo language course with live classes, materials, and certificate",
    price: 19.99,
    stripePriceId: ENV.stripePriceBeginner,
  },
  intermediary: {
    id: "intermediary",
    name: "Edo Intermediary Course",
    description: "8-week intermediary level Edo language course with live classes, materials, and certificate",
    price: 24.99,
    stripePriceId: ENV.stripePriceIntermediary,
  },
  proficient: {
    id: "proficient",
    name: "Edo Proficient Course",
    description: "8-week proficient level Edo language course with live classes, materials, and certificate",
    price: 29.99,
    stripePriceId: ENV.stripePriceProficient,
  },
  bundle: {
    id: "bundle",
    name: "Complete Edo Language Bundle",
    description: "All three levels (Beginner, Intermediary, Proficient) - Save £9.97!",
    price: 65.00,
    stripePriceId: ENV.stripePriceBundle,
  },
};

export const AGE_GROUPS = {
  kids: "Kids (5-12 years)",
  teens: "Teens (13-17 years)",
  adults: "Adults (18+ years)",
} as const;

export type AgeGroup = keyof typeof AGE_GROUPS;
export type CourseLevel = keyof typeof COURSE_PRODUCTS;
