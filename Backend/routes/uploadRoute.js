import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { handleUpload } from "../controller/uploadController.js";

const router = express.Router();

// POST /api/upload
router.post("/upload", upload.single("file"), handleUpload);

export default router;