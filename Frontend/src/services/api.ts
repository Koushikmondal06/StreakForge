const API_BASE = 'http://localhost:5000';

function getAuthHeaders(token: string) {
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

export interface AnalyticsData {
    streak: number;
    totalCommits: number;
    commitsPerDay: Record<string, number>;
}

export interface CommitsData {
    streak: number;
    totalCommits: number;
    activeDays: number;
    commitsPerDay: Record<string, number>;
}

export interface Repo {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
    };
    description: string | null;
    stargazers_count: number;
    language: string | null;
    updated_at: string;
}

export async function getAnalytics(token: string): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/github/analytics`, {
        headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error(`Analytics failed: ${res.status}`);
    return res.json();
}

export async function getRepos(token: string): Promise<Repo[]> {
    const res = await fetch(`${API_BASE}/github/repos`, {
        headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error(`Repos failed: ${res.status}`);
    return res.json();
}

export async function getCommitsByRepo(
    token: string,
    owner: string,
    repo: string
): Promise<CommitsData> {
    const res = await fetch(
        `${API_BASE}/github/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
        { headers: getAuthHeaders(token) }
    );
    if (!res.ok) throw new Error(`Commits failed: ${res.status}`);
    return res.json();
}
