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
  const { data } = useContext(DataContext);
  const { userData, getUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  });

  // 🔥 FIXED DATA SOURCE LOGIC
  const cleanedData = data?.cleanedData || [];
  const report = data?.report || null;

  // 🔥 TRUE EMPTY STATE CHECK (IMPORTANT FIX)
  const isEmpty = cleanedData.length === 0;

  return (
    <Layout title="Dashboard">
      <div className="max-w-6xl mx-auto mt-15">
        {/* HEADER */}
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
          </div>
        )}

        {/* DATA STATE */}
        {!isEmpty && (
          <div className="space-y-8">
            <SummaryCard summary={report?.summary} />

            <SignalBadge signal={report?.signal} />

            <MetricsGrid metrics={report?.keyMetrics} />

            {/* PRICE CHART (FIXED SINGLE SECTION) */}
            <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/20">
              <h3 className="text-lg font-semibold text-white mb-6">
                Price Trend (Last 7 Entries)
              </h3>

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
