import React, { useState } from "react";

const RecommendationPanel = ({ recommendedMarket }) => {
  const [expanded, setExpanded] = useState(true);

  if (!recommendedMarket) return null;

  return (
    <div className="bg-gradient-to-r from-[#1a3a32] to-[#112B24] p-6 rounded-2xl border border-green-500/30 mb-8 shadow-lg shadow-green-900/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-green-400 font-bold text-sm tracking-wider uppercase mb-1">
            Top Recommendation
          </h3>
          <h2 className="text-2xl font-bold text-white">
            {recommendedMarket.name} Mandi
          </h2>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-green-900/30">
          <p className="text-gray-300 text-sm mb-3">
            <strong>WHY THIS MARKET?</strong> Based on our decision-support algorithm, {recommendedMarket.name} is currently the better option because:
          </p>
          <ul className="space-y-2 text-sm text-gray-200">
            {recommendedMarket.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {reason}
              </li>
            ))}
          </ul>
          
          {recommendedMarket.concerns && recommendedMarket.concerns.length > 0 && (
            <div className="mt-4 bg-orange-900/20 border border-orange-500/20 p-3 rounded-lg">
              <p className="text-orange-400 text-xs font-semibold mb-1">POTENTIAL CONCERN</p>
              <ul className="space-y-1 text-xs text-orange-200/80">
                {recommendedMarket.concerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">⚠</span>
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="text-gray-500 text-xs mt-4 italic">
            * Suggested based on current trend. Actual prices and market conditions may vary.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;
