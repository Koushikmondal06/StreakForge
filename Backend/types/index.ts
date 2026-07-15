export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
    email: string | null;
    bio: string | null;
}

export interface GitHubRepo {
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

export interface GitHubCommit {
    sha: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
    };
}

export interface AnalyticsData {
    streak: number;
    totalCommits: number;
    commitsPerDay: Record<string, number>;
}

export interface CachedUserData {
    username: string;
    repos_json: GitHubRepo[];
    analytics_json: AnalyticsData;
    commits_per_repo: Record<string, GitHubCommit[]>;
    last_synced_at: string;
}
