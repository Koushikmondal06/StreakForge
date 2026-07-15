import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
}

const sanitizeInput = (input: string): string => {
    return input.trim().substring(0, 10000);
};

router.post("/", async (req, res) => {
    try {
        if (!genAI) {
            res.status(500).json({ error: "Gemini API key is missing or not configured properly." });
            return;
        }

        const { prompt } = req.body;
        if (!prompt || typeof prompt !== 'string') {
            res.status(400).json({ error: "Prompt is required and must be a string." });
            return;
        }

        const sanitizedPrompt = sanitizeInput(prompt);
        if (sanitizedPrompt.length === 0) {
            res.status(400).json({ error: "Prompt cannot be empty." });
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(sanitizedPrompt);
        const responseText = result.response.text();

        res.json({ response: responseText });
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        res.status(500).json({ error: "Failed to generate content from Gemini API." });
    }
});

router.post("/dashboard-analysis", async (req, res) => {
    try {
        if (!genAI) {
            res.status(500).json({ error: "Gemini API key is missing or not configured properly." });
            return;
        }

        const { repos, analytics, username } = req.body;
        if (!repos || !analytics) {
            res.status(400).json({ error: "Repos and analytics data are required." });
            return;
        }

        const sanitizedUsername = username ? sanitizeInput(String(username)) : 'the user';

        const prompt = `You are the AI engine for StreakForge, an intelligent developer habit tracker.
Here is the user's GitHub data. 
USERNAME: ${sanitizedUsername}
ANALYTICS: ${JSON.stringify(analytics)}. 
REPOS: ${JSON.stringify(repos)}.

Analyze the 'commitsPerDay', total commits, and streaks to detect patterns (consistency, gaps, peak days).
Provide a VERY SHORT, natural language summary. You MUST output your response in exactly these three sections (use the exact headings):

### Behavioral Analysis
(1 sentence like "You are most active on weekdays but your productivity drops on weekends.")

### Suggestions
(1 sentence like "Try committing at least once daily to maintain streak.")

### Motivation
(1 sentence with a fire emoji like "🔥 You're on a 5-day streak, keep pushing!")

Keep it strictly minimal and insightful!`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ response: responseText });
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        res.status(500).json({ error: "Failed to generate content from Gemini API." });
    }
});

export default router;
