import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

/**
 * Checks the Supabase database for cached data.
 * @param username GitHub username
 * @returns Cached data if it's less than 1 hour old, else null.
 */
export const getCachedUserData = async (username: string) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('github_cache')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) return null;

        // Check if cache is older than 1 hour
        const lastSynced = new Date(data.last_synced_at).getTime();
        const now = Date.now();
        const oneHourMs = 60 * 60 * 1000;

        if (now - lastSynced > oneHourMs) {
            return null; // Cache expired
        }

        return data;
    } catch (e) {
        console.error("Supabase get cache error:", e);
        return null;
    }
};

/**
 * Upserts a user's GitHub data into Supabase cache.
 */
export const updateCachedUserData = async (username: string, repos: any, analytics: any, commitsPerRepo: any) => {
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
