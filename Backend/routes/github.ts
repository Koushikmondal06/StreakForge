import express, { Request, Response } from "express";
import { getRepos, getCommits, processCommits, calculateStreak, syncUserGithubData, getUser } from "../services/githubService";
import { getCachedUserData, updateCachedUserData } from "../services/supabaseService";


const router = express.Router();

router.get("/repos", async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const user = await getUser(token);

        // Try cache
        const cached = await getCachedUserData(user.login);
        if (cached && cached.repos_json) {
            return res.json(cached.repos_json);
        }

        // Fetch fresh if no cache
        const { repos, analytics } = await syncUserGithubData(token);
        await updateCachedUserData(user.login, repos, analytics, {});
        res.json(repos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch repos" });
    }
});
router.get("/commits", async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const { owner, repo } = req.query;

        if (!owner || !repo) {
            return res.status(400).json({ error: "Owner and repo required" });
        }

        const commits = await getCommits(
            token,
            owner as string,
            repo as string
        );

        const processed = processCommits(commits);
        const streak = calculateStreak(processed);

        const totalCommits = commits.length;
        const activeDays = Object.keys(processed).length;

        res.json({
            streak,
            totalCommits,
            activeDays,
            commitsPerDay: processed,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch commits" });
    }
});
router.get("/analytics", async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const user = await getUser(token);

        // Try cache
        const cached = await getCachedUserData(user.login);
        if (cached && cached.analytics_json) {
            return res.json(cached.analytics_json);
        }

        // Fetch fresh if no cache
        const { repos, analytics } = await syncUserGithubData(token);
        await updateCachedUserData(user.login, repos, analytics, {});

        res.json(analytics);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Analytics failed" });
    }
});

export default router;