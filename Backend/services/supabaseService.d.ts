export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any> | null;
/**
 * Checks the Supabase database for cached data.
 * @param username GitHub username
 * @returns Cached data if it's less than 1 hour old, else null.
 */
export declare const getCachedUserData: (username: string) => Promise<any>;
/**
 * Upserts a user's GitHub data into Supabase cache.
 */
export declare const updateCachedUserData: (username: string, repos: any, analytics: any, commitsPerRepo: any) => Promise<void>;
//# sourceMappingURL=supabaseService.d.ts.map