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

    // 2. Delegate ALL logic to service layer
    const result = await processMandiData(req.file);

    // 3. Handle empty result case
    if (!result || !result.cleanedData?.length) {
      return res.status(400).json({
        success: false,
        message: "File processed but no usable data found",
      });
    }

    // 4. Send structured response
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