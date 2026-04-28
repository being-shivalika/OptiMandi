import { parseFile } from "./parserService.js";
import { normalizeData } from "./normalizeService.js";
import { calculateTrends } from "./trendService.js";
import { generateInsights } from "./geminiService.js";
import { formatReport } from "./reportFormatter.js";

/**
 * Main pipeline for processing mandi data
 * Flow:
 * File → Parse → Normalize → Trend Analysis → AI Insights → Format Output
 */
export const processMandiData = async (file) => {
  try {
    // 1. PARSE FILE
    const rawData = await parseFile(file);

    // SAFE FALLBACK (don’t crash pipeline)
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return {
        cleanedData: [],
        trends: [],
        aiInsights: {
          summary: "No valid data found in uploaded file",
        },
        report: null,
      };
    }

    // 2. NORMALIZE DATA
    const cleanedData = normalizeData(rawData);

    if (!Array.isArray(cleanedData) || cleanedData.length === 0) {
      return {
        cleanedData: [],
        trends: [],
        aiInsights: {
          summary: "Data could not be normalized properly",
        },
        report: null,
      };
    }

    // 3. CALCULATE TRENDS (safe execution)
    let trends = [];
    try {
      trends = calculateTrends(cleanedData) || [];
    } catch (err) {
      console.warn("Trend calculation failed:", err.message);
      trends = [];
    }

    // 4. AI INSIGHTS (never break pipeline if AI fails)
    let aiInsights = {
      summary: "AI insights unavailable",
    };

    try {
      aiInsights = await generateInsights({
        cleanedData,
        trends,
      }) || aiInsights;
    } catch (err) {
      console.warn("AI insight failure:", err.message);
    }

    // 5. FINAL REPORT
    let report = null;

    try {
      report = formatReport({
        cleanedData,
        trends,
        aiInsights,
      });
    } catch (err) {
      console.warn("Report formatting failed:", err.message);
    }

    // 6. FINAL RETURN (ALWAYS SAFE)
    return {
      cleanedData,
      trends,
      aiInsights,
      report,
    };

  } catch (error) {
    console.error("Data Processing Error:", error);

    // NEVER crash full pipeline
    return {
      cleanedData: [],
      trends: [],
      aiInsights: {
        summary: "Processing failed due to unexpected error",
      },
      report: null,
    };
  }
};