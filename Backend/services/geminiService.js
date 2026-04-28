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
export const generateInsights = async (data) => {
  try {
    await waitIfNeeded();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid dataset");
    }

    // ================= CLEAN DATA =================
    const cleanData = data
      .map((row) => ({
        date: row.date || "unknown",
        commodity: row.commodity || "Wheat",
        mandi: row.mandi || "default",
        arrival: Number(row.arrival) || 0,
        price: Number(row.price) || 0,
      }))
      .filter((row) => row.arrival !== 0 || row.price !== 0)
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

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // ================= BASIC STATS =================
    const prices = cleanData.map((r) => r.price);
    const arrivals = cleanData.map((r) => r.arrival);

    const avgPrice =
      prices.reduce((a, b) => a + b, 0) / prices.length;

    const avgArrival =
      arrivals.reduce((a, b) => a + b, 0) / arrivals.length;

    const latest = cleanData.at(-1);

    const safeAvgArrival = avgArrival || 1;
    const safeAvgPrice = avgPrice || 1;

    const arrivalChange =
      (latest.arrival - safeAvgArrival) / safeAvgArrival;

    const priceChange =
      (latest.price - safeAvgPrice) / safeAvgPrice;

    let direction = "STABLE";

    if (arrivalChange > 0.25 && priceChange < -0.1) {
      direction = "DOWN";
    } else if (arrivalChange < -0.25 && priceChange > 0.1) {
      direction = "UP";
    }

    // ================= BASE RESPONSE =================
    let baseResponse = {
      report: {
        trend: "Stable",
        risk: "Medium",
        summary: `Avg price ₹${avgPrice.toFixed(
          2
        )}, current ₹${latest.price}.`,
      },
      prediction: {
        direction,
        confidence: 0.7,
      },
      tasks: [],
      farmer_advisory: [],
    };

    // ================= AI STRUCTURED ANALYSIS =================
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
You are an agricultural market intelligence system.

Analyze this mandi dataset:
${JSON.stringify(cleanData)}

Return ONLY valid JSON:

{
  "trend": "Increasing | Decreasing | Stable",
  "risk": "Low | Medium | High",
  "summary": "2 sentence market insight",
  "recommendations": ["actionable step"],
  "advisory": ["farmer advice"]
}

Rules:
- Keep it realistic
- Use logical reasoning
- No generic outputs
- Confidence implied via clarity
`;

      const result = await callWithRetry(() =>
        model.generateContent(prompt)
      );

      let text = result.response.text();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = null;
      }

      if (parsed) {
        baseResponse = {
          report: {
            trend: parsed.trend,
            risk: parsed.risk,
            summary: parsed.summary,
          },
          prediction: {
            direction,
            confidence: 0.72,
          },
          tasks: parsed.recommendations || [],
          farmer_advisory: parsed.advisory || [],
        };
      }
    } catch {
      // fallback silently
    }

    // ================= FINAL ENFORCEMENT =================
    const finalResponse = enforceEnums(baseResponse);

    cache.set(cacheKey, finalResponse);

    return finalResponse;

  } catch (error) {
    console.error("Gemini Service Error:", error.message);

    return {
      report: {
        trend: "Stable",
        risk: "Medium",
        summary:
          "Basic statistical fallback used due to system issue",
      },
      prediction: {
        direction: "STABLE",
        confidence: 0.65,
      },
      tasks: ["Retry with better dataset"],
      farmer_advisory: ["Do not rely on unstable output"],
    };
  }
};

// ================= CHAT =================
export const generateChatResponse = async (data, question) => {
  try {
    await waitIfNeeded();

    const cleanData = data
      .map((row) => ({
        arrival: Number(row.arrival) || 0,
        price: Number(row.price) || 0,
      }))
      .filter((r) => r.arrival !== 0 || r.price !== 0)
      .slice(0, 50);

    if (cleanData.length === 0) {
      return "No usable data found. Upload better dataset.";
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Data:
${JSON.stringify(cleanData)}

User Question:
${question}

Answer in 2-3 lines with clear actionable insight.
`;

    const result = await callWithRetry(() =>
      model.generateContent(prompt)
    );

    return result.response.text();

  } catch (error) {
    return "System fallback: basic market insight only.";
  }
};