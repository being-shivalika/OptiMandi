import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";
import FileUpload from "../../components/FileUpload";
import { toast } from "react-toastify";

const Upload = () => {
  const { data, uploadFile, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 🔥 FILE UPLOAD new
  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      const backendData = await uploadFile(file);

      if (!backendData) {
        toast.error("Upload failed - no response from server");
        return;
      }

      const cleanedData = backendData.cleanedData;

      if (!Array.isArray(cleanedData) || cleanedData.length === 0) {
        toast.error("No usable data found");
        return;
      }

      setUploadSuccess(true);
      toast.success("Upload successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // 🔥 DEMO DATA
  const { loadDemoData } = useContext(DataContext);
  
  const handleDemoData = () => {
    loadDemoData();
    setUploadSuccess(true);
    toast.success("Demo dataset loaded!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <Layout title="Upload Data">
      <div className="max-w-4xl mx-auto mt-10">
        {/* UPLOAD UI */}
        {!data ? (
          <div className="flex flex-col items-center mt-4">
            <h1 className="text-3xl text-white font-bold mb-2">
              Import Mandi Data
            </h1>
            <p className="text-gray-400 mb-8 text-center max-w-lg">
              Upload your daily APMC logs (.csv) to generate AI-driven insights, price predictions, and automated farmer advisories.
            </p>

            <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
            
            <div className="mt-8 flex flex-col items-center border-t border-green-900/50 pt-8 w-full max-w-md">
              <p className="text-gray-400 mb-4 text-sm">No CSV file right now? Use our test dataset.</p>
              <button 
                onClick={handleDemoData}
                className="bg-[#0a1f1a] hover:bg-[#112B24] text-green-400 px-6 py-3 rounded-xl font-bold border border-green-900/50 transition-colors w-full flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-flask"></i> Load Demo Dataset
              </button>
            </div>

            <div className="mt-12 space-y-6 w-full max-w-2xl text-left">
              
              <div className="bg-[#112B24] p-6 rounded-xl border border-green-900/30">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-bullseye text-[#E67E22]"></i> Purpose of Data Upload
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The uploaded data is processed by the OptiMandi AI engine to generate actionable intelligence for Mandi Officials. This includes forecasting crop price volatility, tracking seasonal harvest influxes, recommending capacity expansions for specific APMC gates, and generating automated advisories that are directly broadcasted to farmers via the Kisan Sahayak portal.
                </p>
              </div>

              <div className="bg-[#112B24] p-6 rounded-xl border border-green-900/30">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-database text-[#E67E22]"></i> Approved Data Sources
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Data must originate from verifiable government or state-level agricultural databases. Valid sources include:
                </p>
                <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
                  <li><strong>e-NAM Portals:</strong> Daily APMC trading and price logs.</li>
                  <li><strong>Gate Entry Systems:</strong> Tractor weightment and incoming harvest logs.</li>
                  <li><strong>Agmarknet:</strong> Historical district-wise commodity price indices.</li>
                </ul>
              </div>

              <div className="bg-[#112B24] p-6 rounded-xl border border-green-900/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <i className="fa-solid fa-file-csv text-[#E67E22]"></i> CSV Formatting Requirements
                  </h3>
                  <button className="text-xs bg-[#0a1f1a] text-green-400 px-3 py-1 rounded border border-green-900/50 hover:bg-[#153b31] transition-colors">
                    <i className="fa-solid fa-download mr-1"></i> Download Template
                  </button>
                </div>
                <ul className="text-gray-400 text-sm mb-4 space-y-2 list-disc pl-5">
                  <li>File must be in <strong>.csv</strong> format (Max size: 50MB).</li>
                  <li>Ensure there are no blank rows or corrupted characters.</li>
                  <li>The AI engine strictly requires the following exact column headers:</li>
                </ul>
                <div className="overflow-x-auto rounded-lg border border-green-900/30">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a1f1a] text-gray-400">
                      <tr>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Mandi</th>
                        <th className="px-3 py-2">Commodity</th>
                        <th className="px-3 py-2">Min Price</th>
                        <th className="px-3 py-2">Max Price</th>
                        <th className="px-3 py-2">Modal Price</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300 divide-y divide-green-900/30">
                      <tr>
                        <td className="px-3 py-2 font-mono">2023-10-12</td>
                        <td className="px-3 py-2">Indore</td>
                        <td className="px-3 py-2">Wheat</td>
                        <td className="px-3 py-2">2100</td>
                        <td className="px-3 py-2">2400</td>
                        <td className="px-3 py-2">2250</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono">2023-10-12</td>
                        <td className="px-3 py-2">Ujjain</td>
                        <td className="px-3 py-2">Soybean</td>
                        <td className="px-3 py-2">4200</td>
                        <td className="px-3 py-2">4600</td>
                        <td className="px-3 py-2">4450</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
          </div>
        )}

        {/* LOADING */}
        {loading && <p className="text-blue-400 mt-4">Analyzing...</p>}

        {/* ERROR */}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        {/* SUCCESS */}
        {uploadSuccess && (
          <p className="text-green-400 mt-4">
            Upload successful! Redirecting...
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Upload;
