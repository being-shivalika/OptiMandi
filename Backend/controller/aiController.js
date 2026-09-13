import { generateChatResponse } from "../services/geminiService.js";
import { normalizeData } from "../services/normalizeService.js";

/**
 * Handles ad-hoc AI questions on dataset
 */
export const analyzeWithPrompt = async (req, res) => {
  try {
    const { data, question } = req.body;

    // 1. VALIDATION
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid question is required.",
      });
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "No data provided for analysis.",
      });
    }

    // 2. LIMIT DATA SIZE (VERY IMPORTANT)
    const MAX_ROWS = 100;
    let safeData = Array.isArray(data) ? data.slice(0, MAX_ROWS) : data;

    // 3. NORMALIZE DATA (CRITICAL)
    if (Array.isArray(safeData)) {
      safeData = normalizeData(safeData);
    }

    if (!safeData || (Array.isArray(safeData) && safeData.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Data could not be processed properly.",
      });
    }

    // 4. CALL AI SERVICE
    const aiResponse = await generateChatResponse(safeData, question);

    if (!aiResponse) {
      throw new Error("Empty AI response");
    }

    // 5. CLEAN RESPONSE STRUCTURE
    return res.status(200).json({
      success: true,
      data: {
        answer: aiResponse,
      },
    });

  } catch (error) {
    console.error("AI Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "AI analysis failed. Try simplifying your query.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const farmerChat = async (req, res) => {
  try {
    const { question, language = "English" } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required." });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a helpful agricultural advisor for Indian farmers. 
Please answer the following question clearly and concisely.
IMPORTANT: You MUST answer strictly in the ${language} language.

Farmer's Question: ${question}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ success: true, answer: text });
  } catch (error) {
    console.error("farmerChat error:", error);
    res.status(500).json({ success: false, message: "Chatbot failed." });
  }
};