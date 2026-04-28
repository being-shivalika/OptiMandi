import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import Layout from "./componentPage/Layout";

// 🔥 NEW COMPONENTS (you will create these next)
import SummaryCard from "../components/summary/SummaryCard";
import SignalBadge from "../components/signal/SignalBadge";
import MetricsGrid from "../components/metrics/MetricsGrid";
import InsightsList from "../components/insights/InsightsList";
import PriceChart from "../components/charts/PriceChart";

const Dashboard = () => {
  const { data } = useContext(DataContext);
  const { userData, getUserData } = useContext(AuthContext);

  const navigate = useNavigate();

  // 🔥 IMPORTANT: extract report cleanly
  const report = data?.report;

  const isEmpty = !report;

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <Layout title="Dashboard">
      <div className="max-w-6xl mx-auto mt-15">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, {userData?.name || "Mandi User"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isEmpty
              ? "Upload mandi data to unlock market insights."
              : "Live market insights based on your uploaded data."}
          </p>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
            <div className="w-24 h-24 bg-[#112B24] rounded-2xl flex items-center justify-center mb-6 rotate-3 border border-green-900/30">
              <i className="fa-solid fa-chart-line text-4xl text-green-500"></i>
            </div>

            <h2 className="text-2xl font-semibold text-white">No Data Yet</h2>

            <p className="text-gray-400 mt-3 max-w-md">
              Upload your mandi dataset (CSV, Excel, or PDF) to analyze trends,
              risks, and actionable insights.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="mt-8 bg-[#E67E22] hover:bg-[#d3721f] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
            >
              <i className="fa-solid fa-upload"></i>
              Upload Data
            </button>
          </div>
        )}

        {/* ================= DATA STATE ================= */}
        {!isEmpty && (
          <div className="space-y-8 animate-fade-in">
            {/* 🔥 SUMMARY */}
            <SummaryCard summary={report.summary} />

            {/* 🔥 SIGNAL */}
            <SignalBadge signal={report.signal} />

            {/* 🔥 METRICS */}
            <MetricsGrid metrics={report.keyMetrics} />

            {/* 🔥 CHART PLACEHOLDER (NEXT STEP) */}
            <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Price Trend
                </h3>
              </div>

              <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Price Trend (Last 7 Entries)
                  </h3>
                </div>

                <PriceChart data={data.cleanedData || []} />
              </section>
            </section>

            {/* 🔥 INSIGHTS */}
            <InsightsList insights={report.insights} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
