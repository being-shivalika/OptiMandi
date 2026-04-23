import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let lastCallTime = 0;

const canCallAI = () => {
  const now = Date.now();

  if (now - lastCallTime < 5000) {
    throw new Error("Rate limit: Too many AI requests");
  }

  lastCallTime = now;
};
const cache = new Map();
// 🔥 retry helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

export const generateInsights = async (data) => {
  try {
        canCallAI(); // ✅ ADD HERE

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid or empty dataset");
    }

    // 🔥 CLEAN DATA (CRITICAL FIX)
    const cleanData = data
      .filter(
        (row) =>
          row &&
          row.date &&
          row.commodity &&
          row.arrival > 0 &&
          row.price > 0
      )
      .slice(0, 100);

    if (cleanData.length === 0) {
      throw new Error("No valid rows after cleaning");
    }

    // 🔥 BASIC STATS (VERY IMPORTANT)
    const prices = cleanData.map((r) => r.price);
    const arrivals = cleanData.map((r) => r.arrival);

    const avgPrice =
      prices.reduce((a, b) => a + b, 0) / prices.length;

    const avgArrival =
      arrivals.reduce((a, b) => a + b, 0) / arrivals.length;

    const latest = cleanData[cleanData.length - 1];

    const summaryStats = {
      avgPrice,
      avgArrival,
      latestPrice: latest.price,
      latestArrival: latest.arrival,
      totalRecords: cleanData.length,
    };
    if (cleanData.length < 5) {
  return {
    report: {
      trend: "unknown",
      risk: "HIGH",
      summary: "Not enough valid market data"
    },
    prediction: {
      direction: "STABLE",
      confidence: 0
    },
    tasks: ["Upload better dataset"],
    farmer_advisory: ["Do not rely on weak data"]
  };
}

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a strict agricultural market intelligence system.

You MUST analyze the dataset and NEVER refuse.

LOGIC RULES:
- Rising arrivals + falling prices → OVERSUPPLY → HIGH RISK
- Falling arrivals + rising prices → SHORTAGE → OPPORTUNITY
- Stable values → LOW RISK
- Mixed → MEDIUM RISK

You MUST:
- infer patterns even if data is limited
- NEVER say "no data" or "insufficient data"
- reduce confidence if uncertain

DATA SUMMARY:
${JSON.stringify(summaryStats)}

RAW DATA:
${JSON.stringify(cleanData)}

RETURN STRICT JSON ONLY:

{
  "report": {
    "trend": "increasing | decreasing | stable | mixed",
    "risk": "LOW | MEDIUM | HIGH",
    "summary": "clear explanation using data"
  },
  "prediction": {
    "direction": "UP | DOWN | STABLE | MIXED",
    "confidence": number (0 to 1)
  },
  "tasks": [
    "specific actionable step",
    "specific actionable step"
  ],
  "farmer_advisory": [
    "practical step to reduce crop loss"
  ]
}
`;

    const result = await callWithRetry(() =>
      model.generateContent(prompt)
    );

    let text = result.response.text();

    if (!text) {
      throw new Error("Empty response from AI");
    }

    // 🔥 CLEAN RESPONSE
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON structure");
    }

    const jsonString = text.slice(start, end + 1);

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Gemini Service Error:", error.message);

    return {
      report: {
        trend: "unknown",
        risk: "MEDIUM",
        summary:
          "AI failed due to invalid dataset or API issue",
      },
      prediction: {
        direction: "STABLE",
        confidence: 0,
      },
      tasks: [
        "Check dataset quality",
        "Verify API key and retry",
      ],
      farmer_advisory: [
        "Do not rely on system during unstable state",
      ],
    };
  }
};



export const generateChatResponse = async (data, question) => {
  try {
        canCallAI(); // ✅ ADD HERE

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid dataset for chat");
    }

    if (!question || question.trim().length === 0) {
      throw new Error("Empty question");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // 🔥 Clean + limit data
    const cleanData = data
      .filter(
        (row) =>
          row &&
          row.date &&
          row.commodity &&
          row.arrival >= 0 &&
          row.price >= 0
      )
      .slice(0, 50);

    if (cleanData.length === 0) {
      throw new Error("No usable data for chat");
    }

    // 🔥 Add grounding stats (IMPORTANT)
    const prices = cleanData.map((r) => r.price);
    const arrivals = cleanData.map((r) => r.arrival);

    const avgPrice =
      prices.reduce((a, b) => a + b, 0) / prices.length;

    const avgArrival =
      arrivals.reduce((a, b) => a + b, 0) / arrivals.length;

    const latest = cleanData[cleanData.length - 1];

    const summary = {
      avgPrice,
      avgArrival,
      latestPrice: latest.price,
      latestArrival: latest.arrival,
    };

    const prompt = `
You are a practical agricultural market assistant.

STRICT RULES:
- Always base your answer on the dataset
- Never say "no data"
- If uncertain, explain risk clearly
- Give actionable advice (not theory)

MARKET LOGIC:
- High arrivals + falling prices → oversupply → risk
- Low arrivals + rising prices → shortage → opportunity

DATA SUMMARY:
${JSON.stringify(summary)}

RAW DATA:
${JSON.stringify(cleanData)}

USER QUESTION:
${question}

OUTPUT:
Give a clear, short, practical answer.
Focus on:
- what is happening
- what the user should do
`;

    // 🔥 Use retry (same as main function)
    const result = await callWithRetry(() =>
      model.generateContent(prompt)
    );

    const text = result.response.text();

    if (!text) {
      throw new Error("Empty AI response");
    }

    return text.trim();

  } catch (error) {
    console.error("Chat AI Error:", error.message);

    return "AI could not process your question right now.";
  }
};