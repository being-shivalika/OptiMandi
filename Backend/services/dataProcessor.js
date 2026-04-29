import { parseFile } from "./parserService.js";
import { normalizeData } from "./normalizeService.js";
import { calculateTrends } from "./trendService.js";
import { generateInsights } from "./geminiService.js";

/**
 * Main pipeline for processing mandi data
 */
export const processMandiData = async (file) => {
  try {
    // 1. PARSE
    const rawData = await parseFile(file);

    if (!Array.isArray(rawData) || rawData.length === 0) {
      return emptyResponse("No valid data found in uploaded file");
    }

    // 2. NORMALIZE
    const cleanedData = normalizeData(rawData);

    if (!Array.isArray(cleanedData) || cleanedData.length === 0) {
      return emptyResponse("Data normalization failed");
    }

    // 3. TRENDS (optional, not critical for frontend)
    let trends = [];
    try {
      trends = calculateTrends(cleanedData) || [];
    } catch {
      trends = [];
    }

    // 4. AI (🔥 FIXED CALL)
    let ai = fallbackAI();

    try {
      ai = await generateInsights(cleanedData);
    } catch (err) {
      console.warn("AI failed:", err.message);
    }

    // 5. FINAL RETURN (🔥 FLAT STRUCTURE)
    return {
      cleanedData,
      trends,

      report: ai.report,
      prediction: ai.prediction,
      tasks: ai.tasks,
      farmer_advisory: ai.farmer_advisory,
    };

  } catch (error) {
    console.error("Data Processing Error:", error);
    return emptyResponse("Processing failed");
  }
};

// ================= HELPERS =================

const fallbackAI = () => ({
  report: {
    trend: "Stable",
    risk: "Medium",
    summary: "Fallback analysis used",
  },
  prediction: {
    direction: "STABLE",
    confidence: 0.65,
  },
  tasks: ["Upload better dataset"],
  farmer_advisory: ["Verify data before decisions"],
});

const emptyResponse = (msg) => ({
  cleanedData: [],
  trends: [],
  report: {
    trend: "Stable",
    risk: "High",
    summary: msg,
  },
  prediction: {
    direction: "STABLE",
    confidence: 0.5,
  },
  tasks: [],
  farmer_advisory: [],
});