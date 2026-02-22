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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Financial documents uploaded by users for analysis
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 key for secure storage
  fileUrl: text("fileUrl").notNull(), // Public URL to the file in S3
  fileSize: int("fileSize").notNull(), // File size in bytes
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"), // Error details if processing failed
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Analysis results from financial documents
 */
export const analyses = mysqlTable("analyses", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull().references(() => documents.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  extractedText: text("extractedText"), // Raw extracted text from PDF
  executiveSummary: text("executiveSummary"), // AI-generated executive summary
  analysisStatus: mysqlEnum("analysisStatus", ["pending", "completed", "failed"]).default("pending").notNull(),
  analysisError: text("analysisError"), // Error details if analysis failed
  analyzedAt: timestamp("analyzedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;

/**
 * Extracted financial metrics from documents
 */
export const financialMetrics = mysqlTable("financialMetrics", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull().references(() => analyses.id, { onDelete: "cascade" }),
  documentId: int("documentId").notNull().references(() => documents.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  metricName: varchar("metricName", { length: 255 }).notNull(), // e.g., "Revenue", "Net Income"
  metricValue: varchar("metricValue", { length: 255 }), // The extracted value
  metricUnit: varchar("metricUnit", { length: 50 }), // e.g., "USD", "Percentage"
  metricYear: varchar("metricYear", { length: 20 }), // Year or period
  confidence: int("confidence"), // Confidence score 0-100
  extractedAt: timestamp("extractedAt").defaultNow().notNull(),
});

export type FinancialMetric = typeof financialMetrics.$inferSelect;
export type InsertFinancialMetric = typeof financialMetrics.$inferInsert;