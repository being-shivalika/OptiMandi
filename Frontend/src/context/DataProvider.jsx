import React, { useState, useEffect } from "react";
import { DataContext } from "./DataContext";

const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("mandiData");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      localStorage.setItem("mandiData", JSON.stringify(data));
    }
  }, [data]);

  const uploadFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Upload failed");

      const normalizedData = result?.data || result;

      setData(normalizedData);
      return normalizedData;
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    localStorage.removeItem("mandiData");
  };

  return (
    <DataContext.Provider
      value={{ data, setData, loading, error, uploadFile, clearData }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
