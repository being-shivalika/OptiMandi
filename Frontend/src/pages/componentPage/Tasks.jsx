import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";

export default function Tasks() {
  const { data } = useContext(DataContext);
  const navigate = useNavigate();

  // ✅ SUPPORT BOTH STRUCTURES
  const tasks =
    data?.tasks || data?.report?.tasks || data?.aiInsights?.tasks || [];

  // 🔴 NO DATA
  if (!tasks.length) {
    return (
      <Layout title="Tasks">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <i className="fa-solid fa-list-check text-4xl text-[#E67E22] mb-4"></i>

          <h2 className="text-xl font-bold text-white">No Tasks Available</h2>

          <p className="text-gray-400 mt-2 max-w-sm">
            Either no insights were generated or dataset was weak.
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="mt-6 bg-[#E67E22] px-6 py-2 rounded-lg"
          >
            Upload Better Data
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Tasks">
      <div className="max-w-4xl mx-auto mt-10 space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-bold text-white">Recommended Actions</h2>
          <p className="text-gray-400 text-sm">AI + logic based suggestions</p>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {tasks.map((task, i) => {
            const text = typeof task === "string" ? task : task.text;

            const priority =
              task.priority ||
              (text?.toLowerCase().includes("sell") ? "HIGH" : "MEDIUM");

            const styles = {
              HIGH: "border-red-500 text-red-100",
              MEDIUM: "border-yellow-500 text-yellow-100",
              LOW: "border-green-500 text-green-100",
            };

            return (
              <div
                key={i}
                className={`flex justify-between items-center p-4 border-l-4 rounded-lg bg-[#112B24] ${
                  styles[priority] || styles.MEDIUM
                }`}
              >
                <p>{text}</p>
                <span className="text-xs opacity-60">{priority}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
