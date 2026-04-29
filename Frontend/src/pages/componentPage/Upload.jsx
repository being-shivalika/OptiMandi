import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";
import FileUpload from "../../components/FileUpload";

const Upload = () => {
  const { data, uploadFile, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 🔥 FILE UPLOAD new
  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      const backendData = await uploadFile(file);

      // 🔴 HARD CHECK (THIS WAS MISSING)
      if (!backendData) {
        alert("Upload failed - no response from server");
        return;
      }

      console.log("BACKEND DATA:", backendData); // 🔥 DEBUG

      const cleanedData = backendData.cleanedData;

      if (!Array.isArray(cleanedData) || cleanedData.length === 0) {
        alert("No usable data found");
        return;
      }

      setUploadSuccess(true);
      console.log("BACKEND DATA:", backendData);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
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
