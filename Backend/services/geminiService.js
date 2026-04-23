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

// ================= MAIN ANALYSIS =================
export const generateInsights = async (data) => {
  try {
    await waitIfNeeded();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid dataset");
    }

    // ✅ CLEAN DATA (SAFE)
    const cleanData = data
      .map((row) => ({
        date: row.date || "unknown",
        commodity: row.commodity || "unknown",
        mandi: row.mandi || "default", // ✅ FIXED
        arrival: Number(row.arrival) || 0,
        price: Number(row.price) || 0,
      }))
      .filter((row) => row.arrival !== 0 || row.price !== 0)
      .slice(0, 100);

    console.log("CLEAN DATA LENGTH:", cleanData.length);

    // 🚨 HARD FALLBACK
    if (cleanData.length === 0) {
      return {
        report: {
          trend: "unknown",
          risk: "HIGH",
          summary: "No usable market data found",
        },
        prediction: {
          direction: "STABLE",
          confidence: 0,
        },
        tasks: ["Upload valid mandi data"],
        farmer_advisory: ["Verify dataset before relying"],
      };
    }

    // ================= CACHE =================
    const cacheKey = JSON.stringify(cleanData).slice(0, 300);

    if (cache.has(cacheKey)) {
      console.log("⚡ Using cached AI response");
      return cache.get(cacheKey);
    }

    // ================= MANDI ANALYSIS =================
    const mandiStats = {};

    cleanData.forEach((row) => {
      const mandiKey = row.mandi || "default";

      if (!mandiStats[mandiKey]) {
        mandiStats[mandiKey] = {
          totalArrival: 0,
          totalPrice: 0,
          count: 0,
        };
      }

      mandiStats[mandiKey].totalArrival += row.arrival;
      mandiStats[mandiKey].totalPrice += row.price;
      mandiStats[mandiKey].count++;
    });

    Object.keys(mandiStats).forEach((m) => {
      mandiStats[m].avgPrice =
        mandiStats[m].totalPrice / mandiStats[m].count;
    });

    const mandiList = Object.entries(mandiStats);

    const sorted = mandiList.sort(
      (a, b) => a[1].avgPrice - b[1].avgPrice
    );

    const oversupplyMarket = sorted[0];
    const highDemandMarket = sorted[sorted.length - 1];

    // ✅ FIXED (was const reassignment bug)
    let redistributionHint = `
Oversupply Market: ${oversupplyMarket?.[0] || "N/A"}
High Demand Market: ${highDemandMarket?.[0] || "N/A"}
`;

    // ================= BASIC LOGIC =================
    const prices = cleanData.map((r) => r.price);
    const arrivals = cleanData.map((r) => r.arrival);

    const avgPrice =
      prices.reduce((a, b) => a + b, 0) / prices.length;

    const avgArrival =
      arrivals.reduce((a, b) => a + b, 0) / arrivals.length;

    const latest = cleanData.at(-1) || {
      price: avgPrice,
      arrival: avgArrival,
      commodity: "commodity",
    };

    // ✅ SAFE DIVISION
    const safeAvgArrival = avgArrival || 1;
    const safeAvgPrice = avgPrice || 1;

    const arrivalChange =
      (latest.arrival - safeAvgArrival) / safeAvgArrival;

    const priceChange =
      (latest.price - safeAvgPrice) / safeAvgPrice;

    let trend = "stable";
    let risk = "MEDIUM";
    let direction = "STABLE";

    if (arrivalChange > 0.25 && priceChange < -0.1) {
      trend = "decreasing";
      risk = "HIGH";
      direction = "DOWN";
    } else if (arrivalChange < -0.25 && priceChange > 0.1) {
      trend = "increasing";
      risk = "LOW";
      direction = "UP";
    } else if (
      Math.abs(arrivalChange) > 0.2 ||
      Math.abs(priceChange) > 0.2
    ) {
      trend = "mixed";
      risk = "MEDIUM";
      direction = "MIXED";
    }

    const systemInsight =
      direction === "DOWN"
        ? `High supply of ${latest.commodity} — redistribute to better markets`
        : direction === "UP"
        ? `Low supply — strong selling opportunity`
        : `Market unstable — wait before large decisions`;

    const baseResponse = {
      report: {
        trend,
        risk,
        summary: `Avg price ₹${avgPrice.toFixed(
          2
        )}, current ₹${latest.price}.
Avg arrivals ${avgArrival}, current ${latest.arrival}.
${systemInsight}`,
      },
      prediction: {
        direction,
        confidence: 0.6,
      },
      tasks: [
        direction === "UP"
          ? `Sell ${latest.commodity} in ${
              highDemandMarket?.[0] || "high-demand markets"
            }`
          : direction === "DOWN"
          ? `Avoid selling ${latest.commodity} locally — move to better markets`
          : `Wait and monitor ${latest.commodity} for 2-3 days`,
      ],
      farmer_advisory: [
        "Track arrivals daily before making decisions",
      ],
    };

    // ================= AI IMPROVEMENT =================
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
Refine this agricultural market analysis.
Keep it realistic, practical, and short.

${JSON.stringify(baseResponse)}

Context:
${redistributionHint}

Return only improved summary text.
`;

      const result = await callWithRetry(() =>
        model.generateContent(prompt)
      );

      const text = result.response.text();

      const finalResponse = {
        ...baseResponse,
        report: {
          ...baseResponse.report,
          summary: text
            ? text.split(".").slice(0, 2).join(".") + "."
            : baseResponse.report.summary,
        },
      };

      cache.set(cacheKey, finalResponse);

      return finalResponse;
    } catch {
      cache.set(cacheKey, baseResponse);
      return baseResponse;
    }

  } catch (error) {
    console.error("Gemini Service Error:", error.message);

    return {
      report: {
        trend: "unknown",
        risk: "MEDIUM",
        summary:
          "Basic statistical analysis used due to system fallback",
      },
      prediction: {
        direction: "STABLE",
        confidence: 0,
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

    const avgPrice =
      cleanData.reduce((a, b) => a + b.price, 0) /
      cleanData.length;

    const avgArrival =
      cleanData.reduce((a, b) => a + b.arrival, 0) /
      cleanData.length;

    const latest = cleanData.at(-1);

    let answer = "";

    if (latest.arrival > avgArrival && latest.price < avgPrice) {
      answer =
        "Oversupply detected. Prices may drop. Avoid selling now.";
    } else if (
      latest.arrival < avgArrival &&
      latest.price > avgPrice
    ) {
      answer =
        "Demand is strong. This is a good time to sell.";
    } else {
      answer =
        "Market is stable. Wait and observe for clearer signals.";
    }

    return answer;

  } catch (error) {
    console.error("Chat AI Error:", error.message);

    return "System fallback: basic market insight only.";
  }
};