import React from "react";

const InsightsList = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30">
        <p className="text-gray-400 text-sm italic">No insights available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30">
      <h2 className="text-sm uppercase text-green-400 font-semibold mb-4">
        AI Insights
      </h2>

      <ul className="space-y-3">
        {insights.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
          >
            <span className="text-green-500 mt-1">●</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsightsList;
