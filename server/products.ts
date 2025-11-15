/**
 * Stripe Products and Prices Configuration
 * This file defines all course products and their pricing
 */

export interface CourseProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in GBP (pounds)
  stripePriceId?: string; // Will be created in Stripe
}

export const COURSE_PRODUCTS: Record<string, CourseProduct> = {
  beginner: {
    id: "beginner",
    name: "Edo Beginner Course",
    description: "8-week beginner level Edo language course with live classes, materials, and certificate",
    price: 19.99,
  },
  intermediary: {
    id: "intermediary",
    name: "Edo Intermediary Course",
    description: "8-week intermediary level Edo language course with live classes, materials, and certificate",
    price: 24.99,
  },
  proficient: {
    id: "proficient",
    name: "Edo Proficient Course",
    description: "8-week proficient level Edo language course with live classes, materials, and certificate",
    price: 29.99,
  },
  bundle: {
    id: "bundle",
    name: "Complete Edo Language Bundle",
    description: "All three levels (Beginner, Intermediary, Proficient) - Save £9.97!",
    price: 65.00,
  },
  private: {
    id: "private",
    name: "Private 1-to-1 Tutoring",
    description: "One-on-one Edo language tutoring session",
    price: 39.99,
  },
};

export const AGE_GROUPS = {
  kids: "Kids (5-12 years)",
  teens: "Teens (13-17 years)",
  adults: "Adults (18+ years)",
} as const;

export type AgeGroup = keyof typeof AGE_GROUPS;
export type CourseLevel = keyof typeof COURSE_PRODUCTS;
