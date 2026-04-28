/**
 * Formats processed data into a clean, UI-ready report
 */

export const formatReport = ({ cleanedData, trends, aiInsights }) => {
  try {
    if (!trends || !trends.metrics) {
      return {
        summary: "No sufficient data for report",
        insights: [],
      };
    }

    const { metrics } = trends;

    // 🎯 CORE SUMMARY (human readable)
    const summary = `Prices moved from ₹${metrics.firstPrice} to ₹${metrics.lastPrice}, showing a ${metrics.direction} of ${metrics.percentageChange}% with ${metrics.risk} risk.`;

    // 📊 KEY METRICS (frontend cards)
    const keyMetrics = {
      averagePrice: metrics.avgPrice,
      changePercent: metrics.percentageChange,
      volatility: metrics.volatility,
      dataPoints: metrics.dataPoints,
    };

    // 🚦 SIGNAL (main decision output)
    const signal = {
      action: metrics.signal, // buy / sell / hold
      confidence:
        metrics.risk === "low"
          ? "high"
          : metrics.risk === "medium"
          ? "moderate"
          : "low",
    };

    // 🧠 AI INSIGHTS CLEANUP
    let insights = [];

    if (aiInsights) {
      if (Array.isArray(aiInsights)) {
        insights = aiInsights;
      } else if (typeof aiInsights === "string") {
        // Split into bullet points if raw text
        insights = aiInsights
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
      } else if (aiInsights.points) {
        insights = aiInsights.points;
      }
    }

    // 🧾 FINAL REPORT OBJECT
    return {
      summary,
      signal,
      keyMetrics,
      insights,
    };

  } catch (error) {
    console.error("Report Formatter Error:", error);

    return {
      summary: "Error generating report",
      signal: { action: "hold", confidence: "low" },
      keyMetrics: {},
      insights: [],
    };
  }
};