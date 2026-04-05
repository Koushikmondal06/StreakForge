import { useState, useEffect, useCallback } from 'react';
import {
    getAnalytics,
    getRepos,
    getCommitsByRepo,
    type AnalyticsData,
    type Repo,
} from '@/services/api';

interface AnalyticsState {
    data: AnalyticsData | null;
    repos: Repo[];
    loading: boolean;
    error: string | null;
    selectedRepo: string | null; // "all" or "owner/repo"
}

export function useAnalytics(token: string | null) {
    const [state, setState] = useState<AnalyticsState>({
        data: null,
        repos: [],
        loading: true,
        error: null,
        selectedRepo: null,
    });

    const fetchAll = useCallback(async () => {
        if (!token) return;
        setState((s) => ({ ...s, loading: true, error: null }));
        try {
            const [analytics, repos] = await Promise.all([
                getAnalytics(token),
                getRepos(token),
            ]);
            setState({
                data: analytics,
                repos,
                loading: false,
                error: null,
                selectedRepo: null,
            });
        } catch (err) {
            setState((s) => ({
                ...s,
                loading: false,
                error: err instanceof Error ? err.message : 'Failed to load analytics',
            }));
        }
    }, [token]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const selectRepo = useCallback(
        async (repoFullName: string | null) => {
            if (!token) return;
            if (!repoFullName) {
                // back to "All Repos"
                setState((s) => ({ ...s, selectedRepo: null, loading: true }));
                try {
                    const analytics = await getAnalytics(token);
                    setState((s) => ({ ...s, data: analytics, loading: false, selectedRepo: null }));
                } catch (err) {
                    setState((s) => ({
                        ...s,
                        loading: false,
                        error: err instanceof Error ? err.message : 'Failed to load analytics',
                    }));
                }
                return;
            }

            setState((s) => ({ ...s, selectedRepo: repoFullName, loading: true }));
            try {
                const [owner, repo] = repoFullName.split('/');
                const commits = await getCommitsByRepo(token, owner, repo);
                setState((s) => ({
                    ...s,
                    data: {
                        streak: commits.streak,
                        totalCommits: commits.totalCommits,
                        commitsPerDay: commits.commitsPerDay,
                    },
                    loading: false,
                }));
            } catch (err) {
                setState((s) => ({
                    ...s,
                    loading: false,
                    error: err instanceof Error ? err.message : 'Failed to load repo data',
                }));
            }
        },
        [token]
    );

    return {
        ...state,
        selectRepo,
        refetch: fetchAll,
    };
}
