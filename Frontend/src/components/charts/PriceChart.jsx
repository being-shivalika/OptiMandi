import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useMemo } from "react";
import CustomDot from "./CustomDot";

const PriceChart = ({ data }) => {
  const [selectedCommodity, setSelectedCommodity] = useState("");

  // ✅ STEP 1: get unique commodities
  const commodities = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((item) => item.commodity))];
  }, [data]);

  // ✅ STEP 2: derive active commodity (NO useEffect needed)
  const activeCommodity = selectedCommodity || commodities[0];

  // ✅ STEP 3: filter + spike detection
  const filteredData = useMemo(() => {
    if (!data || !activeCommodity) return [];

    const sorted = data
      .filter((item) => item.commodity === activeCommodity)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const last7 = sorted.slice(-7);

    return last7.map((item, index, arr) => {
      const prev = arr[index - 1];

      let spike = false;
      let change = 0;

      if (prev) {
        change = ((item.price - prev.price) / prev.price) * 100;

        if (Math.abs(change) > 15) {
          spike = true;
        }
      }

      return {
        date: new Date(item.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        price: item.price,
        spike,
        change: change.toFixed(1),
      };
    });
  }, [data, activeCommodity]);

  if (!data || data.length === 0) {
    return <p className="text-gray-400">No data available</p>;
  }

  return (
    <div className="space-y-4">
      {/* DROPDOWN */}
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold">Price Trend</h3>

        <select
          value={activeCommodity || ""}
          onChange={(e) => setSelectedCommodity(e.target.value)}
          className="bg-[#0a1f1a] text-white px-3 py-2 rounded border border-green-900/30"
        >
          {commodities.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* CHART */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f3a33" />

            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0a1f1a",
                border: "1px solid #1f3a33",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={3}
              dot={<CustomDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHTS */}
      <div className="bg-[#0a1f1a] p-4 rounded-xl border border-green-900/30">
        <h4 className="text-sm text-green-400 mb-2">Key Observations</h4>

        <ul className="text-sm text-gray-300 space-y-1">
          {filteredData.filter((d) => d.spike).length > 0 ? (
            filteredData
              .filter((d) => d.spike)
              .map((d, i) => (
                <li key={i}>
                  ⚡ {d.date}: {d.change}% price movement detected
                </li>
              ))
          ) : (
            <li className="text-gray-500 italic">
              No significant spikes detected
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PriceChart;
