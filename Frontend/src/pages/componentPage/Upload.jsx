import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import Layout from "./Layout";
import FileUpload from "../../components/FileUpload";

const Upload = () => {
  const { data, uploadFile, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastCallTime, setLastCallTime] = useState(0);

  // 🔥 CHAT STATE
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // ✅ REDIRECT AFTER SUCCESS (SAFE WAY)
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [uploadSuccess, navigate]);

  // 🔥 FILE UPLOAD (NOW USING CONTEXT)
  const handleFileSelect = async (file) => {
    if (!file) return;

    await uploadFile(file);

    // If upload worked → data will be set automatically
    if (!error) {
      setUploadSuccess(true);
    }
  };

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
          data: data?.cleanedData || data?.report || data,
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

  return (
    <Layout title="Upload Data">
      <div className="max-w-4xl mx-auto mt-10">
        {/* FIRST TIME */}
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

        {/* CHAT SECTION */}
        {data && (
          <div className="mt-10 bg-[#112B24] p-6 rounded-xl">
            <h3 className="text-white mb-4">Ask AI</h3>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              className="w-full p-3 bg-[#0a1f1a] text-white mb-4 rounded"
            />

            <button
              onClick={askAI}
              className="bg-orange-500 px-4 py-2 text-white rounded"
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
};

export default Upload;
