import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";

export default function Reports() {
  const { data } = useContext(DataContext);
  const navigate = useNavigate();

  const report = data?.report;
  const prediction = data?.prediction;
  const advisory = data?.farmer_advisory || [];

  // 🔴 NO DATA STATE
  if (!report) {
    return (
      <Layout title="Reports">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <i className="fa-solid fa-file text-4xl text-green-500 mb-4"></i>
          <h2 className="text-xl font-bold text-white">No Report Available</h2>
          <p className="text-gray-400 mt-2 max-w-sm">
            Upload mandi data to generate AI-based market insights.
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

  return (
    <Layout title="Reports">
      <div className="max-w-5xl mx-auto mt-10 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Market Intelligence Report
          </h2>
          <span className="text-xs text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#112B24] p-4 rounded-xl">
            <p className="text-xs text-gray-400">Trend</p>
            <p className="text-lg text-blue-400 font-semibold">
              {report.trend}
            </p>
          </div>

          <div className="bg-[#112B24] p-4 rounded-xl">
            <p className="text-xs text-gray-400">Risk</p>
            <p
              className={`text-lg font-bold ${
                report.risk === "HIGH"
                  ? "text-red-500"
                  : report.risk === "MEDIUM"
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}
            >
              {report.risk}
            </p>
          </div>

          <div className="bg-[#112B24] p-4 rounded-xl">
            <p className="text-xs text-gray-400">Confidence</p>
            <p className="text-lg text-white">
              {Math.round((prediction?.confidence || 0) * 100)}%
            </p>
          </div>
        </div>

        {/* AI SUMMARY */}
        <div className="bg-[#112B24] p-6 rounded-xl">
          <h3 className="text-green-400 font-semibold mb-3">AI Insight</h3>
          <p className="text-gray-300 italic">"{report.summary}"</p>
        </div>

        {/* ADVISORY */}
        <div className="bg-[#153b31] p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-4">Farmer Advisory</h3>

          {advisory.length === 0 ? (
            <p className="text-gray-400 text-sm">No advisory generated.</p>
          ) : (
            <ul className="space-y-3">
              {advisory.map((item, i) => (
                <li key={i} className="text-gray-200 text-sm flex gap-2">
                  <span className="text-green-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
