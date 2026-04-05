"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCachedUserData = exports.getCachedUserData = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
exports.supabase = supabaseUrl && supabaseKey
    ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey)
    : null;
/**
 * Checks the Supabase database for cached data.
 * @param username GitHub username
 * @returns Cached data if it's less than 1 hour old, else null.
 */
const getCachedUserData = async (username) => {
    if (!exports.supabase)
        return null;
    try {
        const { data, error } = await exports.supabase
            .from('github_cache')
            .select('*')
            .eq('username', username)
            .single();
        if (error || !data)
            return null;
        // Check if cache is older than 1 hour
        const lastSynced = new Date(data.last_synced_at).getTime();
        const now = Date.now();
        const oneHourMs = 60 * 60 * 1000;
        if (now - lastSynced > oneHourMs) {
            return null; // Cache expired
        }
        return data;
    }
    catch (e) {
        console.error("Supabase get cache error:", e);
        return null;
    }
};
exports.getCachedUserData = getCachedUserData;
/**
 * Upserts a user's GitHub data into Supabase cache.
 */
const updateCachedUserData = async (username, repos, analytics, commitsPerRepo) => {
    if (!exports.supabase)
        return;
    try {
        const { error } = await exports.supabase
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
    }
    catch (e) {
        console.error("Supabase Cache Upsert exception:", e);
    }
};
exports.updateCachedUserData = updateCachedUserData;
//# sourceMappingURL=supabaseService.js.map