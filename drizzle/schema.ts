import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Stripe customer ID for payment processing */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Enrollments table to track course registrations
 * Stores only essential Stripe identifiers and business-specific data
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Learner information
  learnerName: varchar("learnerName", { length: 255 }).notNull(),
  learnerAge: int("learnerAge").notNull(),
  parentName: varchar("parentName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  
  // Course details
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(), // beginner, intermediary, proficient, bundle
  ageGroup: varchar("ageGroup", { length: 50 }).notNull(), // kids, teens, adults
  
  // Payment information (Stripe IDs only)
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }),
  
  // Enrollment status
  status: mysqlEnum("status", ["pending", "paid", "active", "completed", "cancelled"]).default("pending").notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  paidAt: timestamp("paidAt"),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Course materials table for storing learning resources
 */
export const courseMaterials = mysqlTable("courseMaterials", {
  id: int("id").autoincrement().primaryKey(),
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(),
  week: int("week").notNull(), // 1-8
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["video", "pdf", "worksheet", "recording"]).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }),
  isPublished: int("isPublished").default(1).notNull(), // 1 = published, 0 = draft
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseMaterial = typeof courseMaterials.$inferSelect;
export type InsertCourseMaterial = typeof courseMaterials.$inferInsert;

/**
 * Student progress tracking
 */
export const studentProgress = mysqlTable("studentProgress", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  userId: int("userId").notNull(),
  currentWeek: int("currentWeek").default(1).notNull(),
  completedWeeks: varchar("completedWeeks", { length: 255 }), // Comma-separated: "1,2,3"
  attendanceCount: int("attendanceCount").default(0).notNull(),
  assessmentScore: int("assessmentScore"), // Percentage 0-100
  assessmentPassed: int("assessmentPassed").default(0), // 1 = passed, 0 = not passed
  certificateIssued: int("certificateIssued").default(0), // 1 = issued, 0 = not issued
  certificateUrl: varchar("certificateUrl", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = typeof studentProgress.$inferInsert;