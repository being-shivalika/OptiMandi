import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'dns';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import uploadRoutes from "./routes/uploadRoute.js";
import aiRoutes from "./routes/aiRoute.js";



dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

connectDB();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://opti-mandi.vercel.app",
  "https://opti-mandi-knsceob60-shivalika-mehras-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors());

app.get('/', (req, res)=>{
    res.send('Hello World');
});
app.use("/api/auth", authRouter);
app.use("/api", uploadRoutes);
app.use("/api/ai", aiRoutes);


app.listen(PORT ,() => {
    console.log(`server is running on port  localhost:${PORT}`);
})

