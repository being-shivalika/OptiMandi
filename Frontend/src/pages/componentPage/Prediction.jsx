import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { DataProvider } from "../../context/DataProvider";
import Layout from "./Layout";

export default function Predictions() {
  const { data } = useContext(DataContext);
  const navigate = useNavigate();

  const prediction = data?.prediction;

  // 🔴 NO DATA STATE
  if (!prediction) {
    return (
      <Layout title="Predictions">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <i className="fa-solid fa-chart-line text-4xl text-green-500 mb-4"></i>

          <h2 className="text-xl font-bold text-white">
            No Predictions Available
          </h2>

          <p className="text-gray-400 mt-2 max-w-sm">
            Upload mandi data to generate AI-based market predictions.
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="mt-6 bg-[#E67E22] px-6 py-2 rounded-lg"
          >
            Upload Data
          </button>
        </div>
      </Layout>
    );
  }

  // 🔥 MAP VALUES
  const direction = prediction.direction;
  const confidence = Math.round((prediction.confidence || 0) * 100);

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
            AI-based short-term direction using recent mandi data.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-[#112B24] p-8 rounded-2xl border border-green-900/30 text-center space-y-6">
          {/* DIRECTION */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Expected Direction</p>

            <h1
              className={`text-3xl font-bold flex items-center justify-center gap-3 ${directionStyles[direction]}`}
            >
              <i className={`fa-solid ${directionIcons[direction]}`}></i>
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

        {/* INTERPRETATION BLOCK (THIS IS WHAT MAKES YOU LOOK SMART) */}
        <div className="bg-[#153b31] p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-3">What This Means</h3>

          <p className="text-gray-300 text-sm leading-relaxed">
            {direction === "UP" &&
              "Prices are expected to rise. Consider holding stock or delaying sales to maximize profit."}

            {direction === "DOWN" &&
              "Prices are likely to drop due to oversupply. Immediate selling or diversion is recommended."}

            {direction === "STABLE" &&
              "Market conditions are stable. No major price movement expected in the short term."}

            {direction === "MIXED" &&
              "Market signals are unclear. Monitor closely before making large decisions."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
