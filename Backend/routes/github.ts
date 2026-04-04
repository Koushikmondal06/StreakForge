import express, { Request, Response } from "express";
import { getRepos } from "../services/githubService";
import { getCommits } from "../services/githubService";
import { processCommits, calculateStreak } from "../services/githubService";


const router = express.Router();

router.get("/repos", async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const repos = await getRepos(token);

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

        const repos = await getRepos(token);

        let allCommits: any[] = [];

        for (const r of repos.slice(0, 5)) {
            const commits = await getCommits(token, r.owner.login, r.name);
            allCommits = allCommits.concat(commits);
        }

        const processed = processCommits(allCommits);
        const streak = calculateStreak(processed);

        res.json({
            streak,
            totalCommits: allCommits.length,
            commitsPerDay: processed,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Analytics failed" });
    }
});

export default router;