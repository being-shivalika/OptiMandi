import express from "express";
import { analyzeWithPrompt } from "../controller/aiController.js";

const router = express.Router();

router.post("/analyze", analyzeWithPrompt);

export default router;