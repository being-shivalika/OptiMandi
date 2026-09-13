import React from "react";

const ComparisonTable = ({ markets, onSaveMarket, savedMarkets }) => {
  return (
    <div className="overflow-x-auto bg-[#112B24] rounded-2xl border border-green-900/20">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-sm">
            <th className="p-4 font-medium">Market / Mandi</th>
            <th className="p-4 font-medium">Latest Price</th>
            <th className="p-4 font-medium">Avg Price</th>
            <th className="p-4 font-medium">7-Day Trend</th>
            <th className="p-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="text-white text-sm">
          {markets.map((market, index) => {
            const isSaved = savedMarkets.includes(market.name);
            return (
              <tr 
                key={index} 
                className="border-b border-gray-700/50 hover:bg-[#1a3a32] transition-colors"
              >
                <td className="p-4 font-semibold">{market.name}</td>
                <td className="p-4 text-[#E67E22] font-bold">₹{market.latestPrice}</td>
                <td className="p-4">₹{market.avgPrice.toFixed(0)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${market.trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {market.trend > 0 ? '↑' : '↓'} {Math.abs(market.trend).toFixed(1)}%
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => onSaveMarket(market.name)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${isSaved ? 'bg-green-600/20 border-green-500 text-green-400' : 'border-gray-500 text-gray-300 hover:border-gray-300'}`}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
