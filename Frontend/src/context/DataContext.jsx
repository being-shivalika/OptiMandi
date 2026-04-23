import React, { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // ✅ Load from localStorage (so refresh doesn’t wipe data)
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("mandiData");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Persist data
  useEffect(() => {
    if (data) {
      localStorage.setItem("mandiData", JSON.stringify(data));
    }
  }, [data]);

  // ✅ Centralized upload handler (VERY IMPORTANT)
  const uploadFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

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

      // ✅ Store AI output
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error("Upload Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optional: clear data (useful for testing/reset)
  const clearData = () => {
    setData(null);
    localStorage.removeItem("mandiData");
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        loading,
        error,
        uploadFile,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
