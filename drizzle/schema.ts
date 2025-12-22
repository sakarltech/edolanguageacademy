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
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(), // beginner, intermediary, proficient, bundle, private
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
  followUpSentAt: timestamp("followUpSentAt"), // Track when follow-up email was sent for pending enrollments
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Course materials table for storing learning resources
 */
export const courseMaterials = mysqlTable("courseMaterials", {
  id: int("id").autoincrement().primaryKey(),
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(),
  moduleNumber: int("moduleNumber").notNull(), // 1-4
  week: int("week").notNull(), // 1-8 (for backward compatibility)
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["video", "pdf", "worksheet", "recording", "teaching_note"]).notNull(),
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
  currentModule: int("currentModule").default(1).notNull(), // 1-4
  completedModules: varchar("completedModules", { length: 255 }), // Comma-separated: "1,2,3,4"
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

/**
 * Announcements table for scrolling homepage banner
 */
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = inactive
  expiresAt: timestamp("expiresAt").notNull(), // When announcement should stop showing
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").notNull(), // User ID of admin who created it
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

/**
 * Assessment submissions table for student workbook/assessment uploads
 */
export const assessmentSubmissions = mysqlTable("assessmentSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  userId: int("userId").notNull(),
  courseLevel: varchar("courseLevel", { length: 50 }).notNull(),
  moduleNumber: int("moduleNumber").notNull(), // 1-4
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileType: varchar("fileType", { length: 50 }).notNull(), // pdf, doc, docx, jpg, png
  fileSize: int("fileSize").notNull(), // in bytes
  status: mysqlEnum("status", ["submitted", "reviewed", "graded"]).default("submitted").notNull(),
  score: int("score"), // Optional score out of 100
  feedback: text("feedback"), // Instructor feedback
  reviewedBy: int("reviewedBy"), // Admin/instructor user ID
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentSubmission = typeof assessmentSubmissions.$inferSelect;
export type InsertAssessmentSubmission = typeof assessmentSubmissions.$inferInsert;


/**
 * Marketing contacts for bulk email campaigns
 */
export const marketingContacts = mysqlTable("marketingContacts", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  tags: varchar("tags", { length: 500 }), // Comma-separated tags
  source: varchar("source", { length: 100 }), // Where contact came from (csv_import, manual, website)
  subscribed: int("subscribed").default(1).notNull(), // 1 = subscribed, 0 = unsubscribed
  unsubscribeToken: varchar("unsubscribeToken", { length: 64 }), // Secure token for unsubscribe links
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketingContact = typeof marketingContacts.$inferSelect;
export type InsertMarketingContact = typeof marketingContacts.$inferInsert;

/**
 * Email campaigns for bulk marketing
 */
export const emailCampaigns = mysqlTable("emailCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  audienceType: mysqlEnum("audienceType", ["all", "by_tag", "by_source"]).default("all").notNull(),
  audienceFilter: varchar("audienceFilter", { length: 255 }), // Tag or source value to filter by
  subject: varchar("subject", { length: 255 }),
  preheader: varchar("preheader", { length: 255 }),
  bodyHtml: text("bodyHtml"),
  bodyText: text("bodyText"),
  ctaText: varchar("ctaText", { length: 100 }),
  ctaLink: varchar("ctaLink", { length: 500 }),
  status: mysqlEnum("status", ["draft", "scheduled", "sending", "completed", "cancelled"]).default("draft").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  sentAt: timestamp("sentAt"),
  targetedCount: int("targetedCount").default(0),
  sentCount: int("sentCount").default(0),
  failedCount: int("failedCount").default(0),
  openedCount: int("openedCount").default(0),
  clickedCount: int("clickedCount").default(0),
  unsubscribedCount: int("unsubscribedCount").default(0),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = typeof emailCampaigns.$inferInsert;

/**
 * Individual email sends for tracking per-recipient status
 */
export const campaignSends = mysqlTable("campaignSends", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  contactId: int("contactId").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed", "bounced"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CampaignSend = typeof campaignSends.$inferSelect;
export type InsertCampaignSend = typeof campaignSends.$inferInsert;

/**
 * Suppression list for emails that should never be contacted
 */
export const suppressionList = mysqlTable("suppressionList", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  reason: mysqlEnum("reason", ["unsubscribed", "hard_bounce", "complaint", "manual"]).notNull(),
  campaignId: int("campaignId"), // Optional: which campaign caused the suppression
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SuppressionEntry = typeof suppressionList.$inferSelect;
export type InsertSuppressionEntry = typeof suppressionList.$inferInsert;

/**
 * Private class scheduling information
 */
export const privateClassScheduling = mysqlTable("privateClassScheduling", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull().unique(),
  schedulingStatus: mysqlEnum("schedulingStatus", ["pending", "coordinating", "scheduled", "completed"]).default("pending").notNull(),
  studentGoals: text("studentGoals"),
  preferredSchedule: text("preferredSchedule"),
  timezone: varchar("timezone", { length: 100 }),
  frequency: mysqlEnum("frequency", ["1x_per_week", "2x_per_week", "custom"]),
  coordinationNotes: text("coordinationNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PrivateClassScheduling = typeof privateClassScheduling.$inferSelect;
export type InsertPrivateClassScheduling = typeof privateClassScheduling.$inferInsert;

/**
 * Individual private class sessions
 */
export const privateClassSessions = mysqlTable("privateClassSessions", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  sessionNumber: int("sessionNumber").notNull(), // 1-8
  scheduledDate: timestamp("scheduledDate"),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "rescheduled"]).default("scheduled").notNull(),
  duration: int("duration").default(60), // minutes
  instructorNotes: text("instructorNotes"),
  materialsUrl: text("materialsUrl"),
  recordingUrl: text("recordingUrl"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PrivateClassSession = typeof privateClassSessions.$inferSelect;
export type InsertPrivateClassSession = typeof privateClassSessions.$inferInsert;
