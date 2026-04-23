import csv from "csv-parser";
import { Readable } from "stream";

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // VERY important

    stream
      .pipe(csv())
      .on("data", (data) => {
        const cleanedRow = {
          date: data.Date || data.date || "",
          commodity: data.Commodity || data.commodity || "",
          arrival: Number(data.Arrival || data.arrival || 0),
          price: Number(
            data["Modal Price"] ||
            data.Price ||
            data.price ||
            0
          ),
        };

        results.push(cleanedRow);
      })
      .on("end", () => {
        console.log("✅ Parsed rows:", results.length);
        resolve(results);
      })
      .on("error", reject);
  });
};