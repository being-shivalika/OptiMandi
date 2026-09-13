import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import Layout from "./componentPage/Layout";

import SummaryCard from "../components/summary/SummaryCard";
import SignalBadge from "../components/signal/SignalBadge";
import MetricsGrid from "../components/metrics/MetricsGrid";
import InsightsList from "../components/insights/InsightsList";
import PriceChart from "../components/charts/PriceChart";

const Dashboard = () => {
  const { data, savedMarkets, priceAlerts, removePriceAlert } = useContext(DataContext);
  const { userData, getUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  }, []);

  const cleanedData = data?.cleanedData || [];
  const report = data?.report || null;
  const isDemo = data?.isDemo || false;
  const isEmpty = cleanedData.length === 0;

  // Filter out latest prices for saved markets
  const savedMarketsData = savedMarkets.map(marketName => {
    const marketData = cleanedData.filter(d => d.mandi === marketName);
    if (marketData.length === 0) return null;
    const sorted = marketData.sort((a, b) => new Date(a.date) - new Date(b.date));
    const latest = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : latest;
    const trend = ((latest.price - previous.price) / previous.price) * 100;
    
    return {
      name: marketName,
      commodity: latest.commodity,
      price: latest.price,
      trend
    };
  }).filter(Boolean);

  return (
    <Layout title="Dashboard">
      <div className="max-w-6xl mx-auto mt-15">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {userData?.name || "Mandi User"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {isEmpty
                ? "Upload mandi data to unlock market insights."
                : "Live market insights based on your selected data."}
            </p>
          </div>
          
          {!isEmpty && (
            <div className="mt-4 md:mt-0 text-right">
              <span className={`text-xs px-3 py-1 rounded-full border ${isDemo ? 'bg-purple-900/30 border-purple-500/50 text-purple-300' : 'bg-blue-900/30 border-blue-500/50 text-blue-300'}`}>
                {isDemo ? 'Demo Dataset' : 'User Uploaded Data'}
              </span>
              <p className="text-[10px] text-gray-500 mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-2xl font-semibold text-white">No Data Yet</h2>
            <p className="text-gray-400 mt-3 max-w-md">
              Upload your dataset to analyze trends and insights.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="mt-8 bg-[#E67E22] hover:bg-[#d3721f] text-white px-8 py-3 rounded-xl font-bold"
            >
              Upload Data
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="mt-4 text-gray-400 hover:text-white underline text-sm"
            >
              Or explore Demo Mode
            </button>
          </div>
        )}

        {/* DATA STATE */}
        {!isEmpty && (
          <div className="space-y-8">
            
            {/* SAVED MARKETS QUICK VIEW */}
            {savedMarketsData.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Your Saved Markets</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {savedMarketsData.map((market, idx) => (
                    <div key={idx} className="bg-[#112B24] p-4 rounded-xl border border-green-900/30 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">{market.commodity}</p>
                        <h4 className="text-lg font-bold text-white">{market.name}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#E67E22]">₹{market.price}</p>
                        <p className={`text-xs font-semibold ${market.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {market.trend > 0 ? '↑' : '↓'} {Math.abs(market.trend).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <SummaryCard summary={report?.summary} />
            <SignalBadge signal={report?.signal} />
            <MetricsGrid metrics={report?.keyMetrics} />

            {/* PRICE CHART */}
            <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Price Trend Analysis
                </h3>
                <button 
                  onClick={() => navigate("/compare")}
                  className="text-sm text-[#E67E22] hover:underline"
                >
                  Compare Markets →
                </button>
              </div>
              <PriceChart data={cleanedData} />
            </section>

            <InsightsList insights={report?.insights} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
