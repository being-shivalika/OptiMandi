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
    if (!file || !file.buffer) {
      throw new Error("Invalid file input");
    }

    const mimeType = file.mimetype;

    let parsedData = [];

    // CSV
    if (mimeType.includes("csv")) {
      parsedData = await parseCSV(file.buffer);
    }

    // Excel (xls, xlsx)
    else if (
      mimeType.includes("excel") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("sheet")
    ) {
      parsedData = await parseExcel(file.buffer);
    }

    // PDF
    else if (mimeType.includes("pdf")) {
      parsedData = await parsePDF(file.buffer);
    }

    else {
      throw new Error("Unsupported file type");
    }

    if (!parsedData || parsedData.length === 0) {
      throw new Error("Parsing succeeded but no data extracted");
    }

    return parsedData;

  } catch (error) {
    console.error("Parser Service Error:", error.message);
    throw error;
  }
};