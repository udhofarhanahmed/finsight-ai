import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, documents, analyses, financialMetrics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Document Management Queries
 */

export async function createDocument(
  userId: number,
  fileName: string,
  fileKey: string,
  fileUrl: string,
  fileSize: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(documents).values({
    userId,
    fileName,
    fileKey,
    fileUrl,
    fileSize,
    status: "pending",
  });

  return result;
}

export async function getDocumentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.uploadedAt));
}

export async function getDocumentById(documentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
    .limit(1);

  return result[0];
}

export async function updateDocumentStatus(
  documentId: number,
  status: "pending" | "processing" | "completed" | "failed",
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(documents)
    .set({
      status,
      errorMessage: errorMessage || null,
    })
    .where(eq(documents.id, documentId));
}

/**
 * Analysis Queries
 */

export async function createAnalysis(documentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(analyses).values({
    documentId,
    userId,
    analysisStatus: "pending",
  });

  return result;
}

export async function getAnalysisByDocumentId(documentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(analyses)
    .where(eq(analyses.documentId, documentId))
    .limit(1);

  return result[0];
}

export async function updateAnalysis(
  analysisId: number,
  data: {
    extractedText?: string;
    executiveSummary?: string;
    analysisStatus?: "pending" | "completed" | "failed";
    analysisError?: string;
    analyzedAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(analyses).set(data).where(eq(analyses.id, analysisId));
}

/**
 * Financial Metrics Queries
 */

export async function createFinancialMetric(
  analysisId: number,
  documentId: number,
  userId: number,
  metricName: string,
  metricValue: string,
  metricUnit?: string,
  metricYear?: string,
  confidence?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(financialMetrics).values({
    analysisId,
    documentId,
    userId,
    metricName,
    metricValue,
    metricUnit,
    metricYear,
    confidence,
  });
}

export async function getMetricsByAnalysisId(analysisId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(financialMetrics).where(eq(financialMetrics.analysisId, analysisId));
}

export async function getMetricsByDocumentId(documentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(financialMetrics).where(eq(financialMetrics.documentId, documentId));
}

// TODO: add more feature queries here as your schema grows.
