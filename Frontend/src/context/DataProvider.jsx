import React, { useState, useEffect } from "react";
import { DataContext } from "./DataContext";

import demoData from "../data/demoData.json";

const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("mandiData");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Personalized Dashboard State
  const [savedMarkets, setSavedMarkets] = useState(() => {
    const saved = localStorage.getItem("savedMarkets");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [priceAlerts, setPriceAlerts] = useState(() => {
    const saved = localStorage.getItem("priceAlerts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (data) {
      localStorage.setItem("mandiData", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem("savedMarkets", JSON.stringify(savedMarkets));
  }, [savedMarkets]);

  useEffect(() => {
    localStorage.setItem("priceAlerts", JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  const uploadFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://optimandi.onrender.com";

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
      setError(err.message || "An unexpected error occurred during upload");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setData(demoData);
    return demoData;
  };

  const clearData = () => {
    setData(null);
    localStorage.removeItem("mandiData");
  };

  const toggleSavedMarket = (marketId) => {
    setSavedMarkets(prev => 
      prev.includes(marketId) ? prev.filter(id => id !== marketId) : [...prev, marketId]
    );
  };

  const addPriceAlert = (alert) => {
    setPriceAlerts(prev => [...prev, { ...alert, id: Date.now().toString() }]);
  };

  const removePriceAlert = (id) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <DataContext.Provider
      value={{ 
        data, setData, loading, error, uploadFile, loadDemoData, clearData,
        savedMarkets, toggleSavedMarket,
        priceAlerts, addPriceAlert, removePriceAlert
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
