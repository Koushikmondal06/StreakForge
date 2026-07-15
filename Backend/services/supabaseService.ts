import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { GitHubRepo, AnalyticsData, GitHubCommit, CachedUserData } from '../types';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const getCachedUserData = async (username: string): Promise<CachedUserData | null> => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('github_cache')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) return null;

        const lastSynced = new Date(data.last_synced_at).getTime();
        const now = Date.now();
        const oneHourMs = 60 * 60 * 1000;

        if (now - lastSynced > oneHourMs) {
            return null;
        }

        return data as CachedUserData;
    } catch (e) {
        console.error("Supabase get cache error:", e);
        return null;
    }
};

export const updateCachedUserData = async (
    username: string,
    repos: GitHubRepo[],
    analytics: AnalyticsData,
    commitsPerRepo: Record<string, GitHubCommit[]>
): Promise<void> => {
    if (!supabase) return;

    try {
        const { error } = await supabase
            .from('github_cache')
            .upsert({
                username,
                repos_json: repos,
                analytics_json: analytics,
                commits_per_repo: commitsPerRepo,
                last_synced_at: new Date().toISOString()
            }, { onConflict: 'username' });

        if (error) {
            console.error("Supabase Cache Upsert error:", error);
        }
    } catch (e) {
        console.error("Supabase Cache Upsert exception:", e);
    }
};
