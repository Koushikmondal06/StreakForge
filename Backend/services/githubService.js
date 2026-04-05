"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserGithubData = exports.calculateStreak = exports.processCommits = exports.getCommits = exports.getRepos = exports.getUser = void 0;
const axios_1 = __importDefault(require("axios"));
const getUser = async (token) => {
    const res = await axios_1.default.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
exports.getUser = getUser;
const getRepos = async (token) => {
    const res = await axios_1.default.get("https://api.github.com/user/repos", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
exports.getRepos = getRepos;
const getCommits = async (token, owner, repo, username) => {
    const res = await axios_1.default.get(`https://api.github.com/repos/${owner}/${repo}/commits?author=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
exports.getCommits = getCommits;
const processCommits = (commits) => {
    const map = {};
    for (const c of commits) {
        const date = c.commit?.author?.date?.split("T")[0];
        if (!date)
            continue;
        map[date] = (map[date] ?? 0) + 1;
    }
    return map;
};
exports.processCommits = processCommits;
const calculateStreak = (data) => {
    const dates = Object.keys(data).sort().reverse();
    let streak = 0;
    for (const date of dates) {
        if ((data[date] ?? 0) > 0) {
            streak++;
        }
        else {
            break;
        }
    }
    return streak;
};
exports.calculateStreak = calculateStreak;
const syncUserGithubData = async (token) => {
    // 1. Get user to find username
    const user = await (0, exports.getUser)(token);
    const username = user.login;
    // 2. Get repos
    const repos = await (0, exports.getRepos)(token);
    // 3. Get analytics for top 5 repos
    let allCommits = [];
    for (const r of repos.slice(0, 5)) {
        try {
            const commits = await (0, exports.getCommits)(token, r.owner.login, r.name, username);
            allCommits = allCommits.concat(commits);
        }
        catch (e) {
            console.error(`Failed fetching commits for ${r.name}`);
        }
    }
    const processed = (0, exports.processCommits)(allCommits);
    const streak = (0, exports.calculateStreak)(processed);
    const analytics = {
        streak,
        totalCommits: allCommits.length,
        commitsPerDay: processed,
    };
    return { username, repos, analytics };
};
exports.syncUserGithubData = syncUserGithubData;
//# sourceMappingURL=githubService.js.map