import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import dns from "dns";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import aiRoutes from "./routes/aiRoute.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

// ---------------- BODY PARSER ----------------
app.use(express.json());

// ---------------- CORS ----------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://opti-mandi.vercel.app",
  "https://opti-mandi-knsceob60-shivalika-mehras-projects.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // instead of crashing → just block silently
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// IMPORTANT: preflight handling (Express 5 safe way)
app.options(/.*/, cors());

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
  res.send("OptiMandi Backend Running 🚀");
});

app.use("/api/auth", authRouter);
app.use("/api", uploadRoutes);
app.use("/api/ai", aiRoutes);

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});