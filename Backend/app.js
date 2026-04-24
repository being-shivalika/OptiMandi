import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dns from "dns";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import aiRoutes from "./routes/aiRoute.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

// ---------------- MIDDLEWARE ----------------
app.use(express.json());

// IMPORTANT: Render + Vercel CORS FIX
const allowedOrigins = [
  "http://localhost:5173",
  "https://opti-mandi.vercel.app",
  "https://opti-mandi-knsceob60-shivalika-mehras-projects.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / mobile apps / postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, false); // IMPORTANT: don't throw error
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// preflight fix (VERY IMPORTANT for login/register)
app.options("*", cors());

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api", uploadRoutes);
app.use("/api/ai", aiRoutes);

// ---------------- SERVER ----------------
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});