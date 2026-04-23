import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfModule = require("pdf-parse");

// 🔥 Extract correct parser from module
const PDFParse =
  pdfModule?.PDFParse ||
  pdfModule?.default ||
  pdfModule;

// Safety check
if (typeof PDFParse !== "function" && typeof PDFParse !== "object") {
  console.log("DEBUG pdf-parse export:", pdfModule);
  throw new Error("❌ pdf-parse export is invalid");
}

// ================= HELPER =================
const cleanNumber = (val) => {
  if (!val) return 0;

  return Number(
    String(val)
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "")
      .trim()
  ) || 0;
};

// ================= MAIN =================
export const parsePDF = async (buffer) => {
  try {
    // 🔥 THIS is the real fix based on your debug output
    const parser =
      typeof PDFParse === "function"
        ? PDFParse
        : PDFParse?.getDocument
        ? PDFParse.getDocument
        : null;

    if (!parser) {
      throw new Error("❌ No valid PDF parser found in module");
    }

    const data = await parser(buffer);

    if (!data?.text) {
      console.log("⚠️ Empty PDF text");
      return [];
    }

    const lines = data.text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const results = [];

    for (const line of lines) {
      let parts = line.split(",");

      if (parts.length < 5) {
        parts = line.split(/\s+/);
      }

      if (parts.length >= 5) {
        results.push({
          mandi: parts[0] || "Unknown",
          date: parts[1] || "",
          commodity: parts[2] || "",
          arrival: cleanNumber(parts[3]),
          price: cleanNumber(parts[parts.length - 1]),
        });
      }
    }

    console.log("✅ PDF Parsed rows:", results.length);

    return results;
  } catch (error) {
    console.error("❌ PDF Parse Error:", error);
    return [];
  }
};

export default parsePDF;