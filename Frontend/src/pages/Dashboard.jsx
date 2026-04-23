import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import Layout from "./componentPage/Layout";
import MarketSnap from "../components/Main/MarketSnap";

const Dashboard = () => {
  const { data } = useContext(DataContext);
  const { userData } = useContext(AuthContext);
  const isEmpty = !data;
  const navigate = useNavigate();

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
              ? "Connect your data to start monitoring the market."
              : "Here is what's happening in the Mandi today."}
          </p>
        </div>

        {/* ================= STATE 1: EMPTY (NO DATA) ================= */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
            <div className="w-24 h-24 bg-[#112B24] rounded-2xl flex items-center justify-center mb-6 rotate-3 border border-green-900/30">
              <i className="fa-solid fa-chart-pie text-4xl text-green-500"></i>
            </div>

            <h2 className="text-2xl font-semibold text-white">
              Your Dashboard is Empty
            </h2>
            <p className="text-gray-400 mt-3 max-w-md leading-relaxed">
              To see price trends, oversupply risks, and AI insights, you need
              to upload your daily arrival data first.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="mt-8 bg-[#E67E22] hover:bg-[#d3721f] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              Upload Today's Data
            </button>
          </div>
        )}

        {/* ================= STATE 2: DATA AVAILABLE ================= */}
        {!isEmpty && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Use your existing MarketSnap component */}
            <MarketSnap />

            {/* 2. Price Trend Section */}
            <section className="bg-[#112B24] p-6 rounded-2xl border border-green-900/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Price Trend (7 Days)
                </h3>
                <span className="text-xs text-green-500 bg-green-500/10 px-3 py-1 rounded-full font-bold">
                  LIVE UPDATES
                </span>
              </div>
              <div className="h-48 flex items-center justify-center text-gray-500 border border-dashed border-green-900/50 rounded-xl">
                <p className="text-sm italic">
                  Chart visualization will load here...
                </p>
              </div>
            </section>

            {/* 3. AI Insights & Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Insight Card */}
              <div className="bg-[#112B24] p-6 rounded-2xl border-l-4 border-blue-500">
                <h3 className="text-md font-bold text-blue-400 mb-3 uppercase tracking-tight">
                  <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                  AI Insight
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {data.report?.summary ||
                    "Analyzing current supply fluctuations..."}
                </p>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-[#112B24] p-6 rounded-2xl border-l-4 border-orange-500">
                <h3 className="text-md font-bold text-orange-400 mb-4 uppercase tracking-tight">
                  <i className="fa-solid fa-bolt mr-2"></i>
                  Recommended Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.tasks?.slice(0, 3).map((task, i) => (
                    <button
                      key={i}
                      onClick={() => navigate("/tasks")}
                      className="bg-[#153b31] hover:bg-[#1c4d40] text-gray-200 text-xs px-4 py-2 rounded-lg transition-colors border border-green-800/40"
                    >
                      {typeof task === "string" ? task : task.text}
                    </button>
                  ))}
                  <button
                    onClick={() => navigate("/tasks")}
                    className="text-gray-500 text-xs underline underline-offset-4 hover:text-white"
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Dashboard;
