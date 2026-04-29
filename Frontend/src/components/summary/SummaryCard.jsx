import React from "react";

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  const { summary: text, keyMetrics = {} } = summary;

  const avgPrice = keyMetrics.avgPrice ?? "--";
  const change = keyMetrics.change ?? "--";

  return (
    <div className="bg-[#112B24] p-6 rounded-2xl border border-green-900/20 space-y-4">
      <h3 className="text-white font-semibold text-lg">Market Summary</h3>

      <p className="text-gray-300 text-sm italic">
        {text || "No summary available"}
      </p>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-400">Avg Price</p>
          <p className="text-white text-lg font-semibold">₹{avgPrice}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Change %</p>
          <p className="text-white text-lg font-semibold">{change}%</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Volatility</p>
          <p className="text-white text-lg font-semibold">--</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Data Points</p>
          <p className="text-white text-lg font-semibold">--</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
