import { generateChatResponse } from "../services/geminiService.js";

export const analyzeWithPrompt = async (req, res) => {
  try {
    const { data, question } = req.body;

    const response = await generateChatResponse(data, question);

    res.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error("AI Controller Error:", error.message);

    res.status(500).json({
      success: false,
      data: "AI could not process your question right now.",
    });
  }
};