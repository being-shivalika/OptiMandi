import pdfParse from "pdf-parse/lib/pdf-parse.js";
/**
 * Clean numeric values
 */
const cleanNumber = (val) => {
  if (!val) return 0;

  return (
    Number(
      String(val)
        .replace(/,/g, "")
        .replace(/[^\d.]/g, "")
        .trim()
    ) || 0
  );
};

/**
 * Basic noise filter (skip headers, junk lines)
 */
const isGarbageLine = (line) => {
  const lower = line.toLowerCase();

  return (
    lower.includes("mandi") ||
    lower.includes("report") ||
    lower.includes("price") ||
    lower.length < 10
  );
};

/**
 * Try parsing a line into structured data
 */
const parseLine = (line) => {
  if (isGarbageLine(line)) return null;

  // Step 1: Try comma split
  let parts = line.split(",");

  // Step 2: fallback split ONLY on multiple spaces (not single)
  if (parts.length < 4) {
    parts = line.split(/\s{2,}|\t/);
  }

  if (parts.length < 4) return null;

  // Clean all parts
  parts = parts.map((p) => p.trim()).filter(Boolean);

  if (parts.length < 4) return null;

  const market = parts[0];
  const date = parts[1];
  const commodity = parts[2];

  // Try to find numeric fields safely
  const arrival = cleanNumber(parts[3]);
  const price = cleanNumber(parts[parts.length - 1]);

  // Strong validation
  if (!price || price < 1) return null;
  if (!commodity || commodity.length < 2) return null;

  return {
    market: market.toLowerCase(),
    date,
    commodity: commodity.toLowerCase(),
    arrival,
    price,
  };
};

/**
 * Main PDF parser
 */
export const parsePDF = async (buffer) => {
  try {
    if (!buffer) {
      throw new Error("No buffer provided to PDF parser");
    }

    const data = await pdfParse(buffer);

    if (!data?.text) {
      console.warn("⚠️ No text extracted from PDF");
      return [];
    }

    const lines = data.text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const results = [];

    for (const line of lines) {
      const parsed = parseLine(line);
      if (parsed) {
        results.push(parsed);
      }
    }

    console.log(`📄 PDF Parsed rows: ${results.length}`);

    return results;
  } catch (error) {
    console.error("❌ PDF Parse Error:", error.message);
    return [];
  }
};