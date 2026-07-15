import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth";
import githubRoutes from "./routes/github";
import geminiRoutes from "./routes/gemini";

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/auth", authRoutes);
app.use("/github", githubRoutes);
app.use("/ai", geminiRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
