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
app.use(cors({
    origin: ['http://localhost:5174',
        'https://opti-mandi.vercel.app'], // Your frontend URL
    credentials: true
}));

app.get('/', (req, res)=>{
    res.send('Hello World');
});
app.use("/api/auth", authRouter);
app.use("/api", uploadRoutes);
app.use("/api/ai", aiRoutes);


app.listen(PORT ,() => {
    console.log(`server is running on port  localhost:${PORT}`);
})

