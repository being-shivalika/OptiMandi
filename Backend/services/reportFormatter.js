/**
 * Formats processed data into a clean, UI-ready report
 */

export const formatReport = ({ cleanedData, trends, aiInsights }) => {
  // 🔥 BASIC DERIVED VALUES
  const avgPrice =
    cleanedData.reduce((sum, item) => sum + item.price, 0) /
    (cleanedData.length || 1);

  const lastPrice = cleanedData[cleanedData.length - 1]?.price || 0;
  const firstPrice = cleanedData[0]?.price || 0;

  const priceChange = lastPrice - firstPrice;

  // 🔥 TREND LOGIC
  let trend = "STABLE";
  if (priceChange > 5) trend = "UP";
  else if (priceChange < -5) trend = "DOWN";

  // 🔥 RISK LOGIC
  let risk = "LOW";
  if (Math.abs(priceChange) > 15) risk = "HIGH";
  else if (Math.abs(priceChange) > 8) risk = "MEDIUM";

  // 🔥 PREDICTION (THIS WAS MISSING)
  const prediction = {
    direction: trend,
    confidence: Math.min(Math.abs(priceChange) / 20, 1), // normalize 0–1
  };

  // 🔥 TASKS (HARDCODED INTELLIGENCE — MVP LEVEL)
  let tasks = [];

  if (trend === "UP") {
    tasks.push({
      text: "Hold stock to sell at higher prices",
      priority: "HIGH",
    });
  } else if (trend === "DOWN") {
    tasks.push({
      text: "Sell inventory before further price drop",
      priority: "HIGH",
    });
  } else {
    tasks.push({
      text: "Monitor market for clearer signals",
      priority: "MEDIUM",
    });
  }

  // 🔥 FARMER ADVISORY
  let farmer_advisory = [];

  if (risk === "HIGH") {
    farmer_advisory.push(
      "Market is volatile. Avoid large stock decisions."
    );
  } else {
    farmer_advisory.push(
      "Stable conditions. Plan selling strategically."
    );
  }

  // 🔥 FINAL REPORT OBJECT
  return {
    summary:
      aiInsights?.summary ||
      `Market shows ${trend} trend with ${risk} risk levels.`,

    trend,
    risk,

    keyMetrics: {
      avgPrice: avgPrice.toFixed(2),
      change: priceChange.toFixed(2),
    },

    insights: [
      `Price moved from ${firstPrice} to ${lastPrice}`,
      `Average price is ${avgPrice.toFixed(2)}`,
    ],

    // 🔥 IMPORTANT: embed everything OR return separately
    prediction,
    tasks,
    farmer_advisory,
  };
};