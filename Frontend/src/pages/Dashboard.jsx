import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import Layout from "./componentPage/Layout";

import SummaryCard from "../components/summary/SummaryCard";
import SignalBadge from "../components/signal/SignalBadge";
import MetricsGrid from "../components/metrics/MetricsGrid";
import InsightsList from "../components/insights/InsightsList";
import PriceChart from "../components/charts/PriceChart";

const Dashboard = () => {
  const { data, savedMarkets, priceAlerts, removePriceAlert } = useContext(DataContext);
  const { userData, backendURL } = useContext(AuthContext);
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (userData?.role === 'FARMER') {
      navigate('/farmer-dashboard');
    } else if (userData?.role === 'OFFICIAL') {
      fetchSlots();
    }
  }, [userData]);

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get(`${backendURL}/api/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setSlots(data.bookings);
      }
    } catch (error) {
      console.error(error);
    }
  };
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

        {/* OFFICIALS SPECIFIC SECTIONS: Always visible regardless of data upload */}
        {userData?.role === 'OFFICIAL' && (
          <div className="space-y-8 mb-8">
            
            {/* Active Broadcasts */}
            <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <i className="fa-solid fa-bullhorn text-[#E67E22]"></i> Active Broadcasts to Farmers
                  </h3>
                  <button className="text-sm text-green-400 hover:underline">
                    + New Broadcast
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#112B24] p-4 rounded-xl border-l-4 border-[#E67E22]">
                        <h4 className="font-bold text-white">Rabi Harvest Procurement Starts</h4>
                        <p className="text-sm text-gray-400 mt-1">Live in all districts. Farmers are being advised to book slots.</p>
                        <p className="text-xs text-gray-500 mt-2">Issued: 2 days ago</p>
                    </div>
                    <div className="bg-[#112B24] p-4 rounded-xl border-l-4 border-green-500">
                        <h4 className="font-bold text-white">Weather Advisory: Heavy Rain</h4>
                        <p className="text-sm text-gray-400 mt-1">Targeted to Malwa region. Advising safe storage of soybean.</p>
                        <p className="text-xs text-gray-500 mt-2">Issued: Today</p>
                    </div>
                </div>
            </section>

            {/* Slot Management for Officials */}
            <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <i className="fa-solid fa-truck-field text-[#E67E22]"></i> Automated Slot Assignments
                  </h3>
                  <button onClick={fetchSlots} className="text-sm text-green-400 hover:underline">
                    <i className="fa-solid fa-rotate-right"></i> Refresh
                  </button>
                </div>
                
                <div className="bg-[#112B24] rounded-xl border border-green-900/30 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#0a1f1a] text-green-400">
                                <tr>
                                    <th className="px-4 py-3 border-b border-green-900/50">Token</th>
                                    <th className="px-4 py-3 border-b border-green-900/50">Farmer</th>
                                    <th className="px-4 py-3 border-b border-green-900/50">Mandi Location</th>
                                    <th className="px-4 py-3 border-b border-green-900/50">Crop (Qty)</th>
                                    <th className="px-4 py-3 border-b border-green-900/50">Allotted Slot</th>
                                    <th className="px-4 py-3 border-b border-green-900/50">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300 divide-y divide-green-900/30">
                                {(slots.length > 0 ? slots : [
                                    { _id: 'd1', tokenNumber: 'OPT-48291', farmerName: 'Ramesh Patel', district: 'Indore', commodity: 'Wheat', quantity: 50, allottedDate: '2023-11-15', allottedTime: 'Morning', status: 'APPROVED' },
                                    { _id: 'd2', tokenNumber: 'OPT-19283', farmerName: 'Suresh Kumar', district: 'Ujjain', commodity: 'Soybean', quantity: 120, allottedDate: '2023-11-15', allottedTime: 'Afternoon', status: 'PENDING' },
                                    { _id: 'd3', tokenNumber: 'OPT-57211', farmerName: 'Anil Sharma', district: 'Bhopal', commodity: 'Mustard', quantity: 30, allottedDate: '2023-11-16', allottedTime: 'Morning', status: 'APPROVED' }
                                ]).slice(0, 10).map(slot => (
                                    <tr key={slot._id} className="hover:bg-[#0a1f1a]/50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-green-400">{slot.tokenNumber || '---'}</td>
                                        <td className="px-4 py-3 font-semibold text-white">{slot.farmerName}</td>
                                        <td className="px-4 py-3">
                                            <i className="fa-solid fa-location-dot text-gray-500 mr-1"></i>
                                            {slot.district || slot.mandiName} APMC
                                        </td>
                                        <td className="px-4 py-3">{slot.commodity} ({slot.quantity || 0} Qtl)</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-white">{slot.allottedDate || slot.date}</span>
                                                <span className="text-xs text-[#E67E22]">{slot.allottedTime || slot.slotTime}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-bold">
                                                {slot.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {slots.length > 10 && (
                            <div className="p-3 bg-[#0a1f1a] text-center border-t border-green-900/30">
                                <span className="text-xs text-gray-500">Showing 10 most recent slots. View all →</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>
          </div>
        )}

        {/* DATA STATE */}
        {!isEmpty && (
          <div className="space-y-8">

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
