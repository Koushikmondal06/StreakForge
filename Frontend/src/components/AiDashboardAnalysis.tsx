import { useState } from 'react';
import { Sparkles, Brain, RefreshCw } from 'lucide-react';
import { API_BASE } from '@/services/api';
import { motion } from 'framer-motion';

interface Repo {
    name: string;
    language: string | null;
    stargazers_count: number;
    forks_count?: number;
    updated_at?: string;
    pushed_at?: string;
    size?: number;
}

interface Analytics {
    streak: number;
    totalCommits: number;
    commitsPerDay: Record<string, number>;
}

interface AiDashboardAnalysisProps {
    repos: Repo[];
    analytics: Analytics;
    username?: string;
}

export default function AiDashboardAnalysis({ repos, analytics, username }: AiDashboardAnalysisProps) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const minimalRepos = repos.map((r) => ({
                name: r.name,
                language: r.language,
                stargazers_count: r.stargazers_count,
                forks_count: r.forks_count,
                updated_at: r.updated_at || r.pushed_at,
                size: r.size
            }));

            const response = await fetch(`${API_BASE}/ai/dashboard-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repos: minimalRepos, analytics, username }),
            });

            if (!response.ok) throw new Error('Failed to fetch AI analysis');

            const data = await response.json();
            setAnalysis(data.response);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const parseSections = (text: string) => {
        const sections: { title: string; content: string }[] = [];
        const parts = text.split('###');
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            const newlineIdx = trimmed.indexOf('\n');
            if (newlineIdx === -1) {
                sections.push({ title: trimmed, content: '' });
            } else {
                sections.push({
                    title: trimmed.substring(0, newlineIdx).trim(),
                    content: trimmed.substring(newlineIdx + 1).trim(),
                });
            }
        }
        return sections;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 sm:p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)]">
                        <Brain className="h-4 w-4 text-[var(--color-accent-hover)]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">AI Analysis</h3>
                        <p className="text-[11px] text-[var(--color-text-muted)]">Powered by Gemini</p>
                    </div>
                </div>

                {!analysis && (
                    <button
                        onClick={fetchAnalysis}
                        disabled={loading}
                        className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3.5 py-2 text-[12px] font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-hover)]" />
                        {loading ? 'Analyzing...' : 'Generate'}
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-3 rounded-xl bg-red-500/5 border border-red-500/10 px-4 py-3 text-xs text-red-400">
                    {error}
                </div>
            )}

            {analysis && (
                <div className="space-y-2.5">
                    {parseSections(analysis).map((section, idx) => (
                        <div key={idx} className="rounded-xl bg-[var(--color-bg-secondary)] px-4 py-3 border border-[var(--color-border)]">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent-hover)] mb-1">
                                {section.title}
                            </p>
                            <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                    <div className="flex justify-end pt-1">
                        <button
                            onClick={fetchAnalysis}
                            disabled={loading}
                            className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-text-secondary)]"
                        >
                            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Re-analyzing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
