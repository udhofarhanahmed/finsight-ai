import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ENV } from "./_core/env";
import { createPatchedFetch } from "./_core/patchedFetch";

// Use global fetch
declare const fetch: typeof globalThis.fetch;

// Initialize OpenAI client with Forge API
const openai = createOpenAI({
  apiKey: ENV.forgeApiKey,
  baseURL: `${ENV.forgeApiUrl}/v1`,
  fetch: createPatchedFetch(fetch),
});

/**
 * Extract text from a PDF using Claude AI
 * This function uses the Forge API to process PDFs and extract text
 */
export async function extractTextFromPDF(pdfUrl: string): Promise<string> {
  try {
    const response = await generateText({
      model: openai.chat("gpt-4-vision"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all text from this PDF document. Preserve the structure and formatting as much as possible.",
            },
            {
              type: "image",
              image: pdfUrl,
            },
          ],
        },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Generate an executive summary from extracted text
 */
export async function generateExecutiveSummary(extractedText: string): Promise<string> {
  try {
    const response = await generateText({
      model: openai.chat("gpt-4"),
      messages: [
        {
          role: "user",
          content: `You are a financial analyst. Please analyze the following financial document text and provide a concise executive summary (2-3 paragraphs) highlighting the key findings, financial performance, and important metrics.\n\nDocument Text:\n${extractedText}`,
        },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Error generating executive summary:", error);
    throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Extract financial metrics from text using structured prompting
 */
export async function extractFinancialMetrics(
  extractedText: string
): Promise<Array<{ name: string; value: string; unit?: string; year?: string; confidence: number }>> {
  try {
    const response = await generateText({
      model: openai.chat("gpt-4"),
      messages: [
        {
          role: "user",
          content: `You are a financial data extraction expert. Extract all financial metrics from the following document text. Return a JSON array with objects containing: name, value, unit, year, and confidence (0-100).

Focus on metrics like: Revenue, Net Income, Gross Profit, Operating Income, EBITDA, Profit Margin, ROE, ROA, Debt-to-Equity, Current Ratio, and any other KPIs mentioned.

Document Text:
${extractedText}

Return ONLY valid JSON array, no other text.`,
        },
      ],
    });

    try {
      const metrics = JSON.parse(response.text);
      return Array.isArray(metrics) ? metrics : [];
    } catch {
      console.warn("Failed to parse metrics JSON, returning empty array");
      return [];
    }
  } catch (error) {
    console.error("Error extracting financial metrics:", error);
    throw new Error(`Failed to extract metrics: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Analyze trends from extracted text
 */
export async function analyzeTrends(extractedText: string): Promise<string> {
  try {
    const response = await generateText({
      model: openai.chat("gpt-4"),
      messages: [
        {
          role: "user",
          content: `You are a financial trend analyst. Analyze the following financial document and identify key trends, patterns, and year-over-year changes. Provide insights on growth trajectories, profitability trends, and any concerning patterns.

Document Text:
${extractedText}`,
        },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing trends:", error);
    throw new Error(`Failed to analyze trends: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
