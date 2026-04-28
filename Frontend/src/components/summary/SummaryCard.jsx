import React from "react";

const SummaryCard = ({ summary }) => {
  return (
    <div className="bg-linear-to-br from-[#112B24] to-[#0c211b] p-6 rounded-2xl border border-green-900/30 shadow-lg">
      <h2 className="text-sm uppercase tracking-wider text-green-400 font-semibold mb-2">
        Market Summary
      </h2>

      <p className="text-gray-200 text-lg leading-relaxed">
        {summary || "No summary available"}
      </p>
    </div>
  );
};

export default SummaryCard;
