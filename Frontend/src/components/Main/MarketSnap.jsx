import React from "react";

const MarketSnap = ({ marketData, isNewUser = false }) => {
  // Destructure with fallbacks
  const { lastUpload, report, predictions } = marketData || {};

  return (
    <section className="max-w-6xl space-y-8 mt-10">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          {isNewUser ? "Welcome to Market Insights" : "Market Snapshot"}
        </h2>
        <p className="text-gray-400 text-sm">
          {isNewUser
            ? "Complete your first upload to unlock AI-driven price predictions."
            : "Real-time updates and strategic market intelligence."}
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Arrivals Card */}
        <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/30 hover:border-green-500/30 transition-colors">
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">
            Today's Arrivals
          </p>
          <h2 className="text-2xl font-bold text-white">
            {lastUpload?.qty || "0 kg"}
          </h2>
          {!isNewUser && (
            <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
              <i className="fa-solid fa-caret-up"></i> +12%{" "}
              <span className="text-gray-500 uppercase ml-1">vs avg</span>
            </p>
          )}
        </div>

        {/* Price Card */}
        <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/30">
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">
            Modal Price
          </p>
          <h2 className="text-2xl font-bold text-green-400">
            {lastUpload?.price ? `₹${lastUpload.price}` : "₹0/kg"}
          </h2>
          <p className="text-gray-500 text-xs mt-1 uppercase">Current Market</p>
        </div>

        {/* Risk/Status Card */}
        <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/30">
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">
            System Status
          </p>
          <h2
            className={`text-2xl font-bold ${report?.risk === "HIGH" ? "text-red-500" : "text-blue-400"}`}
          >
            {isNewUser ? "READY" : report?.risk || "STABLE"}
          </h2>
          <p className="text-gray-400 text-[11px] mt-1 italic">
            {isNewUser ? "Awaiting data input" : "AI monitoring active"}
          </p>
        </div>
      </div>

      {isNewUser ? (
        /* --- NEW USER: STARTING POINT --- */
        <div className="bg-[#112B24] p-8 rounded-2xl border border-dashed border-green-800/50 flex flex-col items-center text-center">
          <div className="p-4 bg-green-500/10 rounded-full mb-4">
            <i className="fa-solid fa-rocket text-3xl text-green-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Get Your First Prediction
          </h3>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Upload your inventory or local market prices to see how AI predicts
            price trends for the next 7 days.
          </p>
          <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-all">
            Upload Market Data
          </button>
        </div>
      ) : (
        /* --- EXISTING USER: PREDICTIONS & TASKS --- */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forecast Summary Adaptation */}
            <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/20">
              <h4 className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
                AI Forecast Summary
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Expected Trend</span>
                  <span className="text-green-400 font-medium">
                    Rising <i className="fa-solid fa-arrow-trend-up ml-1"></i>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Target Price</span>
                  <span className="text-white font-bold">
                    ₹{predictions?.target || "34"}/kg
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0a1f1a] rounded-full mt-2">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <p className="text-[10px] text-blue-400 text-right uppercase">
                  70% Confidence
                </p>
              </div>
            </div>

            {/* Previous Tasks / Recent Activity */}
            <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/20">
              <h4 className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
                Strategic Actions
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#0a1f1a] rounded-lg border border-green-900/30">
                  <i className="fa-solid fa-circle-check text-green-500 text-xs"></i>
                  <p className="text-xs text-gray-300">
                    Updated inventory levels (Yesterday)
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0a1f1a] rounded-lg border border-green-900/30">
                  <i className="fa-solid fa-clock text-blue-400 text-xs"></i>
                  <p className="text-xs text-gray-300">
                    Buyer alert scheduled for Apr 20
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 bg-[#153b31] rounded-xl border border-green-500/30">
              <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  Detailed Analysis
                </p>
                <p className="text-[11px] text-gray-300">
                  View the full 14-day trend analysis and risk reports.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-[#112B24] border border-green-900/30 rounded-xl hover:bg-[#112B24]/80 cursor-pointer transition-all">
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                <i className="fa-solid fa-file-export"></i>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  Download Report
                </p>
                <p className="text-[11px] text-gray-300">
                  Get a PDF summary of recent market fluctuations.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default MarketSnap;
