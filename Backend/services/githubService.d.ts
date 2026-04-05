export declare const getUser: (token: string) => Promise<any>;
export declare const getRepos: (token: string) => Promise<any>;
export declare const getCommits: (token: string, owner: string, repo: string, username: string) => Promise<any>;
export declare const processCommits: (commits: any[]) => Record<string, number>;
export declare const calculateStreak: (data: Record<string, number>) => number;
export declare const syncUserGithubData: (token: string) => Promise<{
    username: any;
    repos: any;
    analytics: {
        streak: number;
        totalCommits: number;
        commitsPerDay: Record<string, number>;
    };
}>;
//# sourceMappingURL=githubService.d.ts.map