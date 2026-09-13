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

  // 🔴 NO DATA STATE - FALLBACK TO DUMMY REPORTS
  if (!report) {
    return (
      <Layout title="Reports">
        <div className="max-w-5xl mx-auto mt-10 space-y-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Historical Market Reports</h2>
              <p className="text-sm text-gray-400">Past generated AI analytics and procurement records.</p>
            </div>
            <button
              onClick={() => navigate("/upload")}
              className="bg-[#E67E22] hover:bg-[#d3721f] text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg"
            >
              + Generate New
            </button>
          </div>

          <div className="grid gap-4">
            <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/30 flex justify-between items-center hover:bg-[#153b31] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#0a1f1a] flex items-center justify-center border border-green-900/50">
                  <i className="fa-solid fa-file-pdf text-red-400 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Weekly Mandi Summary - Indore APMC</h3>
                  <p className="text-sm text-gray-400">Generated: Oct 12, 2023 • Wheat & Soybean focus</p>
                </div>
              </div>
              <button className="text-green-400 hover:text-white"><i className="fa-solid fa-download"></i></button>
            </div>

            <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/30 flex justify-between items-center hover:bg-[#153b31] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#0a1f1a] flex items-center justify-center border border-green-900/50">
                  <i className="fa-solid fa-file-pdf text-red-400 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Monthly Price Trend Analysis</h3>
                  <p className="text-sm text-gray-400">Generated: Sep 30, 2023 • Highlights unusual price spikes in Mustard</p>
                </div>
              </div>
              <button className="text-green-400 hover:text-white"><i className="fa-solid fa-download"></i></button>
            </div>

            <div className="bg-[#112B24] p-5 rounded-xl border border-green-900/30 flex justify-between items-center hover:bg-[#153b31] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#0a1f1a] flex items-center justify-center border border-green-900/50">
                  <i className="fa-solid fa-file-csv text-green-400 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Q3 Procurement Raw Data Export</h3>
                  <p className="text-sm text-gray-400">Generated: Sep 15, 2023 • 15,420 records</p>
                </div>
              </div>
              <button className="text-green-400 hover:text-white"><i className="fa-solid fa-download"></i></button>
            </div>
          </div>
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
                report.risk?.toUpperCase() === "HIGH"
                  ? "text-red-500"
                  : report.risk?.toUpperCase() === "MEDIUM"
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
