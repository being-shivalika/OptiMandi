/**
 * Calculate meaningful trends from normalized mandi data
 */

export const calculateTrends = (data) => {
  if (!Array.isArray(data) || data.length < 2) {
    return {
      summary: "Not enough data",
      metrics: {},
    };
  }

  // 🔹 Sort by date (important)
  const sorted = [...data].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date) - new Date(b.date);
  });

  const prices = sorted.map((d) => d.price);

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  // 📈 Percentage Change
  const percentageChange = ((lastPrice - firstPrice) / firstPrice) * 100;

  // 📊 Average Price
  const avgPrice =
    prices.reduce((sum, p) => sum + p, 0) / prices.length;

  // 📉 Volatility (standard deviation)
  const variance =
    prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) /
    prices.length;

  const volatility = Math.sqrt(variance);

  // 📌 Trend Direction
  let direction = "stable";
  if (percentageChange > 5) direction = "uptrend";
  else if (percentageChange < -5) direction = "downtrend";

  // ⚠️ Risk Level (based on volatility)
  let risk = "low";
  if (volatility > avgPrice * 0.2) risk = "high";
  else if (volatility > avgPrice * 0.1) risk = "medium";

  // 🎯 Basic Signal
  let signal = "hold";

  if (direction === "uptrend" && risk === "low") {
    signal = "buy";
  } else if (direction === "downtrend" && risk === "high") {
    signal = "sell";
  }

  return {
    summary: `Market shows a ${direction} with ${risk} risk`,
    metrics: {
      firstPrice,
      lastPrice,
      avgPrice,
      percentageChange: Number(percentageChange.toFixed(2)),
      volatility: Number(volatility.toFixed(2)),
      direction,
      risk,
      signal,
      dataPoints: prices.length,
    },
  };
};