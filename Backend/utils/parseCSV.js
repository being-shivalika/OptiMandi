import csv from "csv-parser";
import { Readable } from "stream";

const cleanNumber = (val) => {
  if (!val) return 0;
  return Number(String(val).replace(/,/g, "").replace(/[^\d.]/g, "").trim()) || 0;
};

const findKey = (obj, keys) => {
  const rowKeys = Object.keys(obj);

  for (let key of rowKeys) {
    const normalized = key.toLowerCase().replace(/\s+/g, "");

    if (keys.some(k => normalized.includes(k))) {
      return obj[key];
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
      .pipe(csv())
      .on("data", (row) => {
        // 🔥 Try normal structured CSV first
        let parsedRow = {
          date: findKey(row, ["date"]),
          commodity: findKey(row, ["commodity", "crop"]),
          market: findKey(row, ["market", "mandi", "location"]),
          arrival: cleanNumber(findKey(row, ["arrival"])),
          price: cleanNumber(findKey(row, ["price", "rate", "modal"])),
        };

        // 🔥 Fallback for broken single-column CSV
        if (!parsedRow.price) {
          const key = Object.keys(row)[0];
          const raw = row[key];

          if (!raw) return;

          const parts = raw.split(",");

          parsedRow = {
            market: parts[0] || "unknown",
            date: parts[1] || "",
            commodity: parts[2] || "",
            arrival: cleanNumber(parts[3]),
            price: cleanNumber(parts[parts.length - 1]),
          };
        }

        if (parsedRow.price) {
          results.push(parsedRow);
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};