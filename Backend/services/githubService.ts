import axios from "axios";
import { GitHubUser, GitHubRepo, GitHubCommit, AnalyticsData } from "../types";

export const getUser = async (token: string): Promise<GitHubUser> => {
    const res = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const getRepos = async (token: string): Promise<GitHubRepo[]> => {
    const res = await axios.get("https://api.github.com/user/repos", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};

export const getCommits = async (
    token: string,
    owner: string,
    repo: string
): Promise<GitHubCommit[]> => {
    const res = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};

export const processCommits = (commits: GitHubCommit[]): Record<string, number> => {
    const map: Record<string, number> = {};

    for (const c of commits) {
        const date = c.commit?.author?.date?.split("T")[0];
        if (!date) continue;

        map[date] = (map[date] ?? 0) + 1;
    }

    return map;
};

export const calculateStreak = (data: Record<string, number>): number => {
    const dates = Object.keys(data).sort().reverse();

    let streak = 0;

    for (const date of dates) {
        if ((data[date] ?? 0) > 0) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

export const syncUserGithubData = async (token: string) => {
    const user = await getUser(token);
    const username = user.login;

    const repos = await getRepos(token);

    let allCommits: GitHubCommit[] = [];
    for (const r of repos.slice(0, 5)) {
        try {
            const commits = await getCommits(token, r.owner.login, r.name);
            allCommits = allCommits.concat(commits);
        } catch (e) {
            console.error(`Failed fetching commits for ${r.name}`);
        }
    }

    const processed = processCommits(allCommits);
    const streak = calculateStreak(processed);

    const analytics: AnalyticsData = {
        streak,
        totalCommits: allCommits.length,
        commitsPerDay: processed,
    };

    return { username, repos, analytics };
};