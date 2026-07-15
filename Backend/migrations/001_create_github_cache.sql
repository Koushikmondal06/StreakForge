-- StreakForge Database Schema
-- Run this migration to create the github_cache table

CREATE TABLE IF NOT EXISTS github_cache (
    username TEXT PRIMARY KEY,
    repos_json JSONB,
    analytics_json JSONB,
    commits_per_repo JSONB,
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_github_cache_username ON github_cache(username);

-- Create index for cache expiration checks
CREATE INDEX IF NOT EXISTS idx_github_cache_last_synced ON github_cache(last_synced_at);
