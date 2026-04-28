import { parseCSV } from "../utils/parseCSV.js";
import { parseExcel } from "../utils/parseExcel.js";
import { parsePDF } from "../utils/parsePDF.js";

/**
 * Detects file type and routes to correct parser
 * @param {Object} file - multer file object
 * @returns {Array} parsed raw data
 */
export const parseFile = async (file) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.buffer) {
      throw new Error("File buffer missing (check multer config)");
    }

    const mimeType = file.mimetype || "";
    const fileName = file.originalname || "";

    let parsedData = [];

    // helper: safe fallback
    const safeResult = (data) => {
      if (!Array.isArray(data)) return [];
      return data;
    };

    // ================= CSV =================
    if (
      mimeType.includes("csv") ||
      fileName.endsWith(".csv")
    ) {
      parsedData = safeResult(await parseCSV(file.buffer));
    }

    // ================= EXCEL =================
    else if (
      mimeType.includes("excel") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("sheet") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    ) {
      parsedData = safeResult(await parseExcel(file.buffer));
    }

    // ================= PDF =================
    else if (
      mimeType.includes("pdf") ||
      fileName.endsWith(".pdf")
    ) {
      parsedData = safeResult(await parsePDF(file.buffer));
    }

    // ================= UNKNOWN TYPE =================
    else {
      console.warn("Unsupported file type:", mimeType, fileName);
      return [];
    }

    // ================= IMPORTANT FIX =================
    // ❌ DO NOT THROW ERROR FOR EMPTY DATA (this was your bug)
    if (parsedData.length === 0) {
      console.warn("Parser returned empty dataset");
      return [];
    }

    return parsedData;

  } catch (error) {
    console.error("Parser Service Error:", error.message);

    // IMPORTANT: don't crash whole upload pipeline
    // return empty instead of throwing
    return [];
  }
};