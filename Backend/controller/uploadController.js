import { processMandiData } from "../services/dataProcessor.js";

export const handleUpload = async (req, res) => {
  try {
    // 1. Basic validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // 2. Process file
    const result = await processMandiData(req.file);

    // 3. Normalize safety check
    const data = result?.cleanedData || [];

    // 4. EMPTY DATA CASE (NOT ERROR, JUST WARNING)
    if (data.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          cleanedData: [],
          message: "File processed but no usable data found",
        },
      });
    }

    // 5. Success response
    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Upload Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while processing file",
    });
  }
};