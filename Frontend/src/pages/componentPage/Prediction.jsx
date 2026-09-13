import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";

export default function Predictions() {
  const { data } = useContext(DataContext);
  const navigate = useNavigate();

  // ✅ SUPPORT MULTIPLE SOURCES
  const prediction =
    data?.prediction ||
    data?.report?.prediction ||
    data?.aiInsights?.prediction;

  // 🔴 NO DATA - FALLBACK TO DUMMY PREDICTIONS
  if (!prediction) {
    return (
      <Layout title="Predictions">
        <div className="max-w-4xl mx-auto mt-10 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">AI Market Predictions</h2>
              <p className="text-sm text-gray-400">Forecasts for next 7-14 days based on historical trends.</p>
            </div>
            <button
              onClick={() => navigate("/upload")}
              className="bg-[#E67E22] hover:bg-[#d3721f] text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg"
            >
              Run New Forecast
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-xl">Wheat</h3>
                  <p className="text-sm text-gray-400">Indore APMC</p>
                </div>
                <div className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <i className="fa-solid fa-arrow-trend-up"></i> UP
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">₹2,350 <span className="text-sm text-gray-400 font-normal">Est. Peak</span></p>
              <div className="w-full bg-[#0a1f1a] rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500">85% Confidence Level</p>
              <p className="mt-4 text-sm text-gray-300 italic">"Prices likely to rise due to delayed monsoon and high procurement demand."</p>
            </div>

            <div className="bg-[#112B24] p-6 rounded-2xl border border-green-900/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-xl">Soybean</h3>
                  <p className="text-sm text-gray-400">Ujjain APMC</p>
                </div>
                <div className="bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <i className="fa-solid fa-arrow-trend-down"></i> DOWN
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">₹4,420 <span className="text-sm text-gray-400 font-normal">Est. Bottom</span></p>
              <div className="w-full bg-[#0a1f1a] rounded-full h-2 mb-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-gray-500">70% Confidence Level</p>
              <p className="mt-4 text-sm text-gray-300 italic">"Prices may fall slightly due to oversupply in neighboring districts."</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ SAFE VALUES
  const direction = prediction.direction || "STABLE";

  let confidence =
    typeof prediction.confidence === "number" ? prediction.confidence : 0.65;

  // 🔥 FIX: HANDLE 0–1 OR 0–100
  if (confidence <= 1) confidence = confidence * 100;

  confidence = Math.round(confidence);

  const directionStyles = {
    UP: "text-green-400",
    DOWN: "text-red-400",
    STABLE: "text-yellow-400",
    MIXED: "text-blue-400",
  };

  const directionIcons = {
    UP: "fa-arrow-trend-up",
    DOWN: "fa-arrow-trend-down",
    STABLE: "fa-minus",
    MIXED: "fa-wave-square",
  };

  return (
    <Layout title="Predictions">
      <div className="max-w-4xl mx-auto mt-10 space-y-8">
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold text-white">Market Prediction</h2>
          <p className="text-gray-400 text-sm">
            AI + statistical direction forecast
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-[#112B24] p-8 rounded-2xl border border-green-900/30 text-center space-y-6">
          {/* DIRECTION */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Expected Direction</p>

            <h1
              className={`text-3xl font-bold flex items-center justify-center gap-3 ${
                directionStyles[direction] || "text-white"
              }`}
            >
              <i
                className={`fa-solid ${
                  directionIcons[direction] || "fa-minus"
                }`}
              ></i>
              {direction}
            </h1>
          </div>

          {/* CONFIDENCE */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Confidence Level</p>

            <h2 className="text-xl font-semibold text-white">{confidence}%</h2>

            <div className="w-full bg-[#0a1f1a] rounded-full h-2 mt-3">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* INTERPRETATION */}
        <div className="bg-[#153b31] p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-3">What This Means</h3>

          <p className="text-gray-300 text-sm leading-relaxed">
            {direction === "UP" &&
              "Prices likely to rise. Consider holding inventory."}

            {direction === "DOWN" &&
              "Prices may fall due to supply pressure. Selling early is safer."}

            {direction === "STABLE" &&
              "No major movement expected. Maintain steady strategy."}

            {direction === "MIXED" &&
              "Market unclear. Avoid aggressive decisions."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
