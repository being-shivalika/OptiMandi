import { parseCSV } from "../utils/parseCSV.js";
import { generateInsights } from "../services/geminiService.js";

export const handleUpload = async (req, res) => {
  try {
    // 🔹 1. VALIDATE FILE
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // 🔹 2. PARSE CSV → JSON
    const parsedData = await parseCSV(req.file.buffer);

    // Optional: basic validation
    if (!parsedData || parsedData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV is empty or invalid",
      });
    }

    // 🔹 3. SEND DATA TO GEMINI
    const aiResponse = await generateInsights(parsedData);

    // 🔹 4. RETURN CLEAN RESPONSE
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