import React, { useContext, useState, useMemo } from "react";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";
import ComparisonTable from "../../components/comparison/ComparisonTable";
import RecommendationPanel from "../../components/comparison/RecommendationPanel";
import { Link } from "react-router-dom";

const MarketComparison = () => {
  const { data, savedMarkets, toggleSavedMarket } = useContext(DataContext);
  const [selectedCommodity, setSelectedCommodity] = useState("");

  // Process data to group by commodity and mandi
  const processedData = useMemo(() => {
    if (!data?.cleanedData || data.cleanedData.length === 0) return null;

    const commodities = {};
    
    data.cleanedData.forEach(row => {
      if (!commodities[row.commodity]) {
        commodities[row.commodity] = {};
      }
      if (!commodities[row.commodity][row.mandi]) {
        commodities[row.commodity][row.mandi] = [];
      }
      commodities[row.commodity][row.mandi].push(row);
    });

    // Default selection
    if (!selectedCommodity) {
      const keys = Object.keys(commodities);
      if (keys.length > 0) setSelectedCommodity(keys[0]);
    }

    return commodities;
  }, [data]);

  const marketStats = useMemo(() => {
    if (!processedData || !selectedCommodity || !processedData[selectedCommodity]) return [];

    const mandisData = processedData[selectedCommodity];
    
    return Object.keys(mandisData).map(mandi => {
      const rows = mandisData[mandi].sort((a, b) => new Date(a.date) - new Date(b.date));
      const latestPrice = rows[rows.length - 1].price;
      const firstPrice = rows[0].price;
      const avgPrice = rows.reduce((sum, r) => sum + r.price, 0) / rows.length;
      const trend = ((latestPrice - firstPrice) / firstPrice) * 100;
      
      return {
        name: mandi,
        latestPrice,
        avgPrice,
        trend,
        rows
      };
    }).sort((a, b) => b.latestPrice - a.latestPrice);
  }, [processedData, selectedCommodity]);

  const recommendedMarket = useMemo(() => {
    if (!marketStats || marketStats.length === 0) return null;

    // Recommendation logic (scoring based on price and trend)
    const bestMarket = marketStats[0]; // Currently simply taking the highest latest price
    
    const reasons = [
      `${(bestMarket.latestPrice > bestMarket.avgPrice ? "Higher" : "Stable")} current price at ₹${bestMarket.latestPrice}/quintal`,
      bestMarket.trend > 0 ? `Positive trend of ${bestMarket.trend.toFixed(1)}% over the period` : `Stable pricing relative to initial data`,
    ];
    
    const concerns = [];
    if (bestMarket.trend < 0) {
      concerns.push("Price has been decreasing recently.");
    }

    return {
      name: bestMarket.name,
      reasons,
      concerns
    };

  }, [marketStats]);

  const isEmpty = !data?.cleanedData || data.cleanedData.length === 0;

  return (
    <Layout title="Market Comparison">
      <div className="max-w-6xl mx-auto mt-15">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Intelligent Market Comparison
          </h1>
          <p className="text-gray-400 text-sm">
            Compare prices across mandis to make data-driven decisions.
          </p>
        </div>

        {isEmpty ? (
          <div className="bg-[#112B24] p-8 rounded-2xl text-center border border-green-900/20">
            <h3 className="text-xl text-white mb-4">No data available to compare</h3>
            <Link to="/upload" className="text-[#E67E22] hover:underline">Upload Data to Get Started</Link>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="mb-6 flex items-center space-x-4">
              <label className="text-gray-300 font-medium">Select Commodity:</label>
              <select 
                value={selectedCommodity} 
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="bg-[#1a3a32] text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-[#E67E22]"
              >
                {processedData && Object.keys(processedData).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <RecommendationPanel recommendedMarket={recommendedMarket} />

            <h3 className="text-xl font-bold text-white mb-4">Compare Markets for {selectedCommodity}</h3>
            <ComparisonTable 
              markets={marketStats} 
              savedMarkets={savedMarkets}
              onSaveMarket={toggleSavedMarket} 
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default MarketComparison;
