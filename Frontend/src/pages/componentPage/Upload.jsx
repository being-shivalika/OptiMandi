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
      const res = await uploadFile(file);

      const backendData = res?.data;

      const cleanedData = backendData?.cleanedData || [];

      // ❌ DO NOT PROCEED IF EMPTY
      if (!cleanedData.length) {
        setUploadSuccess(false);
        alert("No usable data found in file");
        return;
      }

      setUploadSuccess(true);

      // ✔ ONLY NAVIGATE IF VALID DATA EXISTS
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            data: backendData,
          },
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setUploadSuccess(false);
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
