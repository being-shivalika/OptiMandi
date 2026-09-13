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
          <div className="flex flex-col items-center text-center mt-12">
            <h1 className="text-3xl text-white mb-4">
              Upload Your First Mandi Data
            </h1>

            <FileUpload onFileSelect={handleFileSelect} disabled={loading} />
            
            <div className="mt-8 flex flex-col items-center border-t border-gray-700 pt-8 w-full max-w-md">
              <p className="text-gray-400 mb-4 text-sm">Or explore the app with sample data</p>
              <button 
                onClick={handleDemoData}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium border border-gray-600 transition-colors w-full"
              >
                Explore Demo Mode
              </button>
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
