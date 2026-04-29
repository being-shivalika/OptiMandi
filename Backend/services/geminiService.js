import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ================= RATE CONTROL =================
let lastCallTime = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const waitIfNeeded = async () => {
  const now = Date.now();
  const diff = now - lastCallTime;

  if (diff < 5000) {
    await sleep(5000 - diff);
  }

  lastCallTime = Date.now();
};

// ================= CACHE =================
const cache = new Map();

// ================= RETRY =================
const callWithRetry = async (fn, retries = 3) => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (err?.status === 503 || err?.status === 429) {
        await sleep(1000 * (i + 1));
        continue;
      }

      throw err;
    }
  }

  throw lastError;
};

// ================= ENUM ENFORCEMENT =================
const enforceEnums = (data) => {
  const trends = ["Increasing", "Decreasing", "Stable"];
  const risks = ["Low", "Medium", "High"];

  if (!trends.includes(data?.report?.trend)) {
    data.report.trend = "Stable";
  }

  if (!risks.includes(data?.report?.risk)) {
    data.report.risk = "Medium";
  }

  if (data?.prediction?.confidence < 0.6) {
    data.prediction.confidence = 0.65;
  }

  return data;
};

// ================= MAIN ANALYSIS =================
export const generateInsights = async (input) => {
  try {
    await waitIfNeeded();

    // ✅ FIX 1: SUPPORT BOTH INPUT TYPES
    let rawData = [];

    if (Array.isArray(input)) {
      rawData = input;
    } else if (input?.cleanedData) {
      rawData = input.cleanedData;
    } else {
      throw new Error("Invalid dataset format");
    }

    // ================= CLEAN DATA =================
    const cleanData = rawData
      .map((row) => ({
        date: row.date || "unknown",
        commodity: row.commodity || "Unknown",
        mandi: row.market || row.mandi || "default",
        arrival: Number(row.arrival) || 0,
        price: Number(row.price) || 0,
      }))
      .filter((row) => row.price !== 0)
      .slice(0, 100);

    if (cleanData.length === 0) {
      return {
        report: {
          trend: "Stable",
          risk: "High",
          summary: "No usable market data found",
        },
        prediction: {
          direction: "STABLE",
          confidence: 0.65,
        },
        tasks: ["Upload valid mandi data"],
        farmer_advisory: ["Verify dataset before relying"],
      };
    }

    // ================= CACHE =================
    const cacheKey = JSON.stringify(cleanData).slice(0, 300);
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    // ================= BASIC STATS =================
    const prices = cleanData.map((r) => r.price);
    const arrivals = cleanData.map((r) => r.arrival);

    const avgPrice =
      prices.reduce((a, b) => a + b, 0) / prices.length;

    const avgArrival =
      arrivals.reduce((a, b) => a + b, 0) / arrivals.length;

    const latest = cleanData.at(-1);

    const arrivalChange =
      (latest.arrival - avgArrival) / (avgArrival || 1);

    const priceChange =
      (latest.price - avgPrice) / (avgPrice || 1);

    let direction = "STABLE";

    if (arrivalChange > 0.25 && priceChange < -0.1) direction = "DOWN";
    else if (arrivalChange < -0.25 && priceChange > 0.1) direction = "UP";

    // ================= BASE RESPONSE =================
    let baseResponse = {
      report: {
        trend: "Stable",
        risk: "Medium",
        summary: `Avg price ₹${avgPrice.toFixed(2)}, current ₹${latest.price}.`,
      },
      prediction: {
        direction,
        confidence: 0.7,
      },
      tasks: ["Monitor price trend closely"], // ✅ fallback always present
      farmer_advisory: ["Avoid sudden large trades"],
    };

    // ================= AI CALL =================
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
Analyze mandi dataset:
${JSON.stringify(cleanData)}

Return STRICT JSON ONLY:

{
  "trend": "Increasing | Decreasing | Stable",
  "risk": "Low | Medium | High",
  "summary": "short insight",
  "recommendations": ["actions"],
  "advisory": ["farmer advice"]
}
`;

      const result = await callWithRetry(() =>
        model.generateContent(prompt)
      );

      let text = result.response.text();

      // ✅ FIX 2: CLEAN BAD JSON (Gemini often wraps in ```json)
      text = text.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = null;
      }

      if (parsed) {
        baseResponse = {
          report: {
            trend: parsed.trend || "Stable",
            risk: parsed.risk || "Medium",
            summary: parsed.summary || baseResponse.report.summary,
          },
          prediction: {
            direction,
            confidence: 0.75, // ✅ never zero
          },
          tasks:
            parsed.recommendations?.length > 0
              ? parsed.recommendations
              : baseResponse.tasks,
          farmer_advisory:
            parsed.advisory?.length > 0
              ? parsed.advisory
              : baseResponse.farmer_advisory,
        };
      }
    } catch (err) {
      console.warn("AI failed:", err.message);
    }

    // ================= FINAL =================
    const finalResponse = enforceEnums(baseResponse);

    cache.set(cacheKey, finalResponse);

    return finalResponse;

  } catch (error) {
    console.error("Gemini Service Error:", error.message);

    return {
      report: {
        trend: "Stable",
        risk: "Medium",
        summary: "Fallback used due to system issue",
      },
      prediction: {
        direction: "STABLE",
        confidence: 0.65,
      },
      tasks: ["Retry upload"],
      farmer_advisory: ["Check dataset quality"],
    };
  }
};

export const generateChatResponse = async (data, question) => {
  try {
    await waitIfNeeded();

    const cleanData = (data || [])
      .map((row) => ({
        price: Number(row.price) || 0,
        arrival: Number(row.arrival) || 0,
      }))
      .filter((r) => r.price > 0)
      .slice(0, 50);

    if (cleanData.length === 0) {
      return "No usable data available.";
    }

    const avgPrice =
      cleanData.reduce((sum, r) => sum + r.price, 0) /
      cleanData.length;

    const latest = cleanData.at(-1);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Market snapshot:
- Avg Price: ${avgPrice.toFixed(2)}
- Latest Price: ${latest.price}

User question:
${question}

Answer in 2–3 short lines with actionable insight.
`;

    const result = await callWithRetry(() =>
      model.generateContent(prompt)
    );

    return result.response.text();

  } catch {
    return "Unable to process request right now.";
  }
};