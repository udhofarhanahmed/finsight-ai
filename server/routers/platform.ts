import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  providerCatalog,
  supportedDocumentTypes,
} from "../_core/providerCatalog";

function calculateStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const count = values.length;
  const sum = values.reduce((acc, value) => acc + value, 0);
  const mean = count > 0 ? sum / count : 0;
  const median =
    count === 0
      ? 0
      : count % 2 === 0
        ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
        : sorted[Math.floor(count / 2)];
  const variance =
    count > 1
      ? values.reduce((acc, value) => acc + (value - mean) ** 2, 0) /
        (count - 1)
      : 0;

  return {
    count,
    min: count ? sorted[0] : 0,
    max: count ? sorted[count - 1] : 0,
    mean,
    median,
    standardDeviation: Math.sqrt(variance),
  };
}

export const platformRouter = router({
  capabilities: publicProcedure.query(() => ({
    purpose:
      "FinSight AI is an AI-first financial intelligence workspace for document ingestion, extraction, KPI analytics, and automated executive insight generation.",
    ingestion: {
      acceptedTypes: supportedDocumentTypes,
      recommendedSingleUploadLimitMb: 200,
      scalableBatchProcessing:
        "Asynchronous queue-based processing supports multi-GB batches via chunked uploads.",
    },
    exports: ["CSV", "JSON", "XLSX", "PDF report", "Python notebook template"],
    visualization: [
      "trend lines",
      "cohort views",
      "profitability waterfall",
      "variance charts",
      "correlation heatmap",
    ],
  })),

  providers: publicProcedure.query(() => providerCatalog),

  generateStatistics: publicProcedure
    .input(
      z.object({
        rows: z.array(
          z.record(z.string(), z.number().or(z.string()).or(z.null())),
        ),
        numericColumns: z.array(z.string()).min(1),
      }),
    )
    .mutation(({ input }) => {
      const statistics = input.numericColumns.map((column) => {
        const values = input.rows
          .map((row) => {
            const raw = row[column];
            if (typeof raw === "number") return raw;
            if (typeof raw === "string") {
              const parsed = Number(raw);
              return Number.isFinite(parsed) ? parsed : null;
            }
            return null;
          })
          .filter((value): value is number => value !== null);

        return {
          column,
          ...calculateStats(values),
        };
      });

      return {
        statistics,
        suggestedVisuals: [
          "Line chart for period-over-period performance",
          "Bar chart for metric comparison",
          "Box plot for outlier detection",
        ],
      };
    }),
});
