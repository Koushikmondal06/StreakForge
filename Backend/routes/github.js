"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const githubService_1 = require("../services/githubService");
const supabaseService_1 = require("../services/supabaseService");
const router = express_1.default.Router();
router.get("/repos", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const user = await (0, githubService_1.getUser)(token);
        // Try cache
        const cached = await (0, supabaseService_1.getCachedUserData)(user.login);
        if (cached && cached.repos_json) {
            return res.json(cached.repos_json);
        }
        // Fetch fresh if no cache
        const { repos, analytics } = await (0, githubService_1.syncUserGithubData)(token);
        await (0, supabaseService_1.updateCachedUserData)(user.login, repos, analytics, {});
        res.json(repos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch repos" });
    }
});
router.get("/commits", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const { owner, repo } = req.query;
        if (!owner || !repo) {
            return res.status(400).json({ error: "Owner and repo required" });
        }
        const user = await (0, githubService_1.getUser)(token);
        const commits = await (0, githubService_1.getCommits)(token, owner, repo, user.login);
        const processed = (0, githubService_1.processCommits)(commits);
        const streak = (0, githubService_1.calculateStreak)(processed);
        const totalCommits = commits.length;
        const activeDays = Object.keys(processed).length;
        res.json({
            streak,
            totalCommits,
            activeDays,
            commitsPerDay: processed,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch commits" });
    }
});
router.get("/analytics", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const user = await (0, githubService_1.getUser)(token);
        // Try cache
        const cached = await (0, supabaseService_1.getCachedUserData)(user.login);
        if (cached && cached.analytics_json) {
            return res.json(cached.analytics_json);
        }
        // Fetch fresh if no cache
        const { repos, analytics } = await (0, githubService_1.syncUserGithubData)(token);
        await (0, supabaseService_1.updateCachedUserData)(user.login, repos, analytics, {});
        res.json(analytics);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Analytics failed" });
    }
});
exports.default = router;
//# sourceMappingURL=github.js.map