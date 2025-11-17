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
  parentName: varchar("parentName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 50 }),
  
  // Course details
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(), // beginner, intermediary, proficient, bundle
  timeSlot: varchar("timeSlot", { length: 20 }).notNull(), // "11AM_GMT" or "11AM_CST"
  
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

/**
 * Forum threads for student discussions
 */
export const forumThreads = mysqlTable("forumThreads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseLevel: varchar("courseLevel", { length: 50 }), // Optional: filter by course
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isPinned: int("isPinned").default(0).notNull(),
  isLocked: int("isLocked").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  replyCount: int("replyCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumThread = typeof forumThreads.$inferSelect;
export type InsertForumThread = typeof forumThreads.$inferInsert;

/**
 * Forum replies to threads
 */
export const forumReplies = mysqlTable("forumReplies", {
  id: int("id").autoincrement().primaryKey(),
  threadId: int("threadId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  isInstructorReply: int("isInstructorReply").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;
/**
 * WhatsApp group links for each course level and time slot
 */
export const whatsappGroups = mysqlTable("whatsappGroups", {
  id: int("id").autoincrement().primaryKey(),
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(), // beginner, intermediary, proficient
  timeSlot: varchar("timeSlot", { length: 20 }).notNull(), // 11AM_GMT or 11AM_CST
  groupLink: varchar("groupLink", { length: 500 }).notNull(),
  groupName: varchar("groupName", { length: 255 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhatsAppGroup = typeof whatsappGroups.$inferSelect;
export type InsertWhatsAppGroup = typeof whatsappGroups.$inferInsert;
