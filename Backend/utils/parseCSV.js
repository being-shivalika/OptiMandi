import csv from "csv-parser";
import { Readable } from "stream";

const cleanNumber = (val) => {
  if (!val) return 0;

  return Number(
    String(val)
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "")
      .trim()
  ) || 0;
};

// 🔥 flexible column finder
const findKey = (obj, possibleKeys) => {
  const keys = Object.keys(obj);

  for (let key of keys) {
    const normalized = key.toLowerCase().replace(/\s+/g, "").replace(/_/g, "");

    for (let p of possibleKeys) {
      if (normalized.includes(p)) {
        return obj[key];
      }
    }
  }

  return undefined;
};

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    stream
      .pipe(csv()) // DO NOT TOUCH THIS NOW
      .on("data", (row) => {
  const key = Object.keys(row)[0]; // single broken column
  const raw = row[key];

  if (!raw) return;

  // 🔥 split manually
  const parts = raw.split(",");

  const cleanedRow = {
    date: parts[1] || "",
    commodity: parts[2] || "",
    arrival: Number(parts[3]) || 0,
    price: Number(parts[6]) || 0,
  };

  results.push(cleanedRow);
})
      .on("end", () => {
        console.log("✅ Parsed rows:", results.length);
        console.log("📊 SAMPLE:", results.slice(0, 5));
        resolve(results);
      })
      .on("error", reject);
  });
};