import express from "express";
import { analyzeWithPrompt, farmerChat } from "../controller/aiController.js";

const router = express.Router();

router.post("/analyze", analyzeWithPrompt);
router.post("/farmer-chat", farmerChat);

export default router;