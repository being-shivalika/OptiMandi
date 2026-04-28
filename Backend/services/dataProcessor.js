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

    if (!rawData || rawData.length === 0) {
      throw new Error("No data extracted from file");
    }

    // 2. NORMALIZE DATA (critical for consistency)
    const cleanedData = normalizeData(rawData);

    if (!cleanedData.length) {
      throw new Error("Data normalization failed");
    }

    // 3. CALCULATE DETERMINISTIC TRENDS (NON-AI VALUE)
    const trends = calculateTrends(cleanedData);

    // 4. AI INSIGHTS (based on structured data, NOT raw junk)
    const aiInsights = await generateInsights({
      cleanedData,
      trends,
    });

    // 5. FINAL REPORT STRUCTURE
    const report = formatReport({
      cleanedData,
      trends,
      aiInsights,
    });

    return {
      cleanedData,
      trends,
      aiInsights,
      report,
    };

  } catch (error) {
    console.error("Data Processing Error:", error);
    throw error;
  }
};