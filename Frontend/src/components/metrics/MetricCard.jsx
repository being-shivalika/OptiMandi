import React from "react";

const MetricCard = ({ label, value }) => {
  return (
    <div className="bg-[#112B24] p-4 rounded-xl border border-green-900/30 hover:border-green-500/40 transition-all">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>

      <h3 className="text-xl font-bold text-white mt-1">{value ?? "--"}</h3>
    </div>
  );
};

export default MetricCard;
