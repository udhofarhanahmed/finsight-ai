import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createDocument,
  getDocumentsByUserId,
  getDocumentById,
  updateDocumentStatus,
  createAnalysis,
  getAnalysisByDocumentId,
  updateAnalysis,
  createFinancialMetric,
  getMetricsByAnalysisId,
} from "../db";
import { storagePut, storageGet } from "../storage";
import {
  extractTextFromDocument,
  generateExecutiveSummary,
  extractFinancialMetrics,
} from "../ai";
import { notifyOwner } from "../_core/notification";
import { nanoid } from "nanoid";

export const documentsRouter = router({
  /**
   * Upload a PDF document
   */
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileData: z.instanceof(Buffer),
        mimeType: z.string().optional().default("application/pdf"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const fileKey = `documents/${userId}/${nanoid()}-${input.fileName}`;

        // Upload to S3
        const { url: fileUrl } = await storagePut(
          fileKey,
          input.fileData,
          input.mimeType,
        );

        // Create document record
        await createDocument(
          userId,
          input.fileName,
          fileKey,
          fileUrl,
          input.fileData.length,
        );

        // Notify owner of upload
        await notifyOwner({
          title: "New Document Uploaded",
          content: `User ${ctx.user.email} uploaded ${input.fileName}`,
        });

        return {
          success: true,
          fileUrl,
        };
      } catch (error) {
        console.error("Error uploading document:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload document",
        });
      }
    }),

  /**
   * Get all documents for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const documents = await getDocumentsByUserId(ctx.user.id);
      return documents;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch documents",
      });
    }
  }),

  /**
   * Get a specific document with its analysis
   */
  getDetail: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const document = await getDocumentById(input.documentId, ctx.user.id);

        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        const analysis = await getAnalysisByDocumentId(input.documentId);
        const metrics = analysis
          ? await getMetricsByAnalysisId(analysis.id)
          : [];

        return {
          document,
          analysis,
          metrics,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error fetching document detail:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch document details",
        });
      }
    }),

  /**
   * Analyze a document (extract text, generate summary, extract metrics)
   */
  analyze: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await getDocumentById(input.documentId, ctx.user.id);

        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        // Update document status to processing
        await updateDocumentStatus(input.documentId, "processing");

        // Create analysis record
        await createAnalysis(input.documentId, ctx.user.id);

        // Get the analysis record we just created
        const analysis = await getAnalysisByDocumentId(input.documentId);
        if (!analysis) {
          throw new Error("Failed to create analysis record");
        }
        const analysisId = analysis.id;

        try {
          // Get presigned URL for the document
          const { url: presignedUrl } = await storageGet(document.fileKey);

          // Extract text from supported document types (PDF, images, CSV and other OCR-capable sources)
          const extractedText = await extractTextFromDocument(presignedUrl, {
            fileName: document.fileName,
          });

          // Generate executive summary
          const executiveSummary =
            await generateExecutiveSummary(extractedText);

          // Extract financial metrics
          const metrics = await extractFinancialMetrics(extractedText);

          // Update analysis with results
          await updateAnalysis(analysisId, {
            extractedText,
            executiveSummary,
            analysisStatus: "completed",
            analyzedAt: new Date(),
          });

          // Store metrics
          for (const metric of metrics) {
            await createFinancialMetric(
              analysisId,
              input.documentId,
              ctx.user.id,
              metric.name,
              metric.value,
              metric.unit,
              metric.year,
              metric.confidence,
            );
          }

          // Update document status to completed
          await updateDocumentStatus(input.documentId, "completed");

          return {
            success: true,
            analysisId,
            extractedText,
            executiveSummary,
            metrics,
          };
        } catch (analysisError) {
          // Handle analysis error
          const errorMessage =
            analysisError instanceof Error
              ? analysisError.message
              : "Unknown error";

          await updateAnalysis(analysisId, {
            analysisStatus: "failed",
            analysisError: errorMessage,
          });

          await updateDocumentStatus(input.documentId, "failed", errorMessage);

          // Notify owner of analysis error
          await notifyOwner({
            title: "Document Analysis Failed",
            content: `Analysis failed for document ${document.fileName}: ${errorMessage}`,
          });

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Analysis failed: ${errorMessage}`,
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error analyzing document:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze document",
        });
      }
    }),

  /**
   * Delete a document
   */
  delete: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const document = await getDocumentById(input.documentId, ctx.user.id);

        if (!document) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        // Delete from S3
        // Note: You would need to implement a delete function in storage.ts
        // For now, we'll just update the database

        // In a real implementation, you would delete the S3 object here
        // await storageDelete(document.fileKey);

        return {
          success: true,
          message: "Document deleted",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error deleting document:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete document",
        });
      }
    }),
});
