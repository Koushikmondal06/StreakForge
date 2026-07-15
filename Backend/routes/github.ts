import express, { Response } from "express";
import { getRepos, getCommits, processCommits, calculateStreak, syncUserGithubData, getUser } from "../services/githubService";
import { getCachedUserData, updateCachedUserData } from "../services/supabaseService";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

const validateRepoParams = (owner: string, repo: string): boolean => {
    const repoPattern = /^[a-zA-Z0-9._-]+$/;
    return repoPattern.test(owner) && repoPattern.test(repo);
};

router.get("/repos", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.token!;
        const user = await getUser(token);

        const cached = await getCachedUserData(user.login);
        if (cached && cached.repos_json) {
            return res.json(cached.repos_json);
        }

        const { repos, analytics } = await syncUserGithubData(token);
        await updateCachedUserData(user.login, repos, analytics, {});
        res.json(repos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch repos" });
    }
});

router.get("/commits", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.token!;
        const { owner, repo } = req.query;

        if (!owner || !repo) {
            return res.status(400).json({ error: "Owner and repo required" });
        }

        const ownerStr = owner as string;
        const repoStr = repo as string;

        if (!validateRepoParams(ownerStr, repoStr)) {
            return res.status(400).json({ error: "Invalid owner or repo format" });
        }

        const commits = await getCommits(token, ownerStr, repoStr);

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

router.get("/analytics", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.token!;
        const user = await getUser(token);

        const cached = await getCachedUserData(user.login);
        if (cached && cached.analytics_json) {
            return res.json(cached.analytics_json);
        }

        const { repos, analytics } = await syncUserGithubData(token);
        await updateCachedUserData(user.login, repos, analytics, {});

        res.json(analytics);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Analytics failed" });
    }
});

export default router;