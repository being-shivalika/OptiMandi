import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";
import FileUpload from "../../components/FileUpload";

export default function Upload() {
  const { data, setData } = useContext(DataContext);
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  uploadSuccess && setTimeout(() => setUploadSuccess(false), 3000);
  const [lastCallTime, setLastCallTime] = useState(0);

  // ✅ CHAT STATE (YOU MISSED THIS)
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // 🔥 CHAT FUNCTION
  const askAI = async () => {
    try {
      const now = Date.now();

      if (now - lastCallTime < 5000) {
        setAnswer("Wait a few seconds before asking again.");
        return;
      }

      setLastCallTime(now);
      const res = await fetch("https://optimandi.onrender.com/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data, // ⚠️ TEMP: works, but not ideal (explained below)
          question,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setAnswer(JSON.stringify(result.data, null, 2));
    } catch (err) {
      console.error(err);
      setAnswer("Failed to get response from AI");
    }
  };

  // 🔥 FILE UPLOAD
  const handleFileSelect = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://optimandi.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Upload failed");
      }

      const aiData = result.data;

      if (!aiData?.report || !aiData?.tasks || !aiData?.prediction) {
        throw new Error("Invalid AI response structure");
      }

      const finalData = {
        ...aiData,
        lastUpload: {
          commodity: "Mixed Commodities",
          date: new Date().toLocaleDateString(),
          qty: "Processed",
        },
      };

      setData(finalData);

      setUploadSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout title="Upload Data">
      <div className="max-w-4xl mx-auto mt-10">
        {/* FIRST TIME */}
        {!data ? (
          <div className="flex flex-col items-center text-center mt-12">
            <h1 className="text-3xl text-white mb-4">
              Upload Your First Mandi Data
            </h1>

            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isUploading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isUploading}
            />
          </div>
        )}

        {/* LOADING */}
        {isUploading && <p className="text-blue-400 mt-4">Analyzing...</p>}

        {/* ERROR */}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        {/* CHAT SECTION */}
        {data && (
          <div className="mt-10 bg-[#112B24] p-6 rounded-xl">
            <h3 className="text-white mb-4">Ask AI</h3>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              className="w-full p-3 bg-[#0a1f1a] text-white mb-4"
            />

            <button
              onClick={askAI}
              className="bg-orange-500 px-4 py-2 text-white"
            >
              Ask
            </button>

            {answer && (
              <pre className="mt-4 text-gray-300 text-sm whitespace-pre-wrap">
                {answer}
              </pre>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
