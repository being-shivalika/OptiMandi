import { parseCSV } from "../utils/parseCSV.js";
import { parseExcel } from "../utils/parseExcel.js";
import { parsePDF } from "../utils/parsePDF.js";
import { generateInsights } from "../services/geminiService.js";

export const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    let parsedData = [];

    const fileType = req.file.mimetype;

    // 🔥 SWITCH BASED ON FILE TYPE
    if (fileType.includes("csv")) {
      parsedData = await parseCSV(req.file.buffer);
    } 
    else if (fileType.includes("excel") || fileType.includes("spreadsheet")) {
      parsedData = await parseExcel(req.file.buffer);
    } 
    else if (fileType.includes("pdf")) {
      parsedData = await parsePDF(req.file.buffer);
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    if (!parsedData.length) {
      return res.status(400).json({
        success: false,
        message: "File parsed but no usable data",
      });
    }

    const aiResponse = await generateInsights(parsedData);

    return res.status(200).json({
      success: true,
      data: aiResponse,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while processing file",
    });
  }
};