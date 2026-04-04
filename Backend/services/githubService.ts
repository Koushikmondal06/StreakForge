
import axios from "axios";

export const getUser = async (token: string) => {
    const res = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
};
export const getRepos = async (token: string) => {
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
) => {
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
export const processCommits = (commits: any[]) => {
    const map: Record<string, number> = {};

    for (const c of commits) {
        const date = c.commit?.author?.date?.split("T")[0];
        if (!date) continue;

        map[date] = (map[date] ?? 0) + 1;
    }

    return map;
};

export const calculateStreak = (data: Record<string, number>) => {
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