import { useState } from 'react';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';

interface AiDashboardAnalysisProps {
    repos: any[];
    analytics: any;
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
            const minimalRepos = repos.map((r: any) => ({
                name: r.name,
                language: r.language,
                stargazers_count: r.stargazers_count,
                forks_count: r.forks_count,
                updated_at: r.updated_at || r.pushed_at,
                size: r.size
            }));

            const response = await fetch('http://localhost:5000/ai/dashboard-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repos: minimalRepos, analytics, username }),
            });

            if (!response.ok) throw new Error('Failed to fetch AI analysis');

            const data = await response.json();
            setAnalysis(data.response);
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Parse sections from Gemini's structured markdown response
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
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-colors hover:border-[var(--color-border-hover)]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <Brain className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                            AI Profile Analysis
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">Powered by Gemini</p>
                    </div>
                </div>

                {!analysis && (
                    <button
                        onClick={fetchAnalysis}
                        disabled={loading}
                        className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white/[0.04] px-3 py-2 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-white/[0.08] disabled:opacity-50"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        {loading ? 'Analyzing...' : 'Generate Insights'}
                    </button>
                )}
            </div>

            {error && (
                <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                    {error}
                </div>
            )}

            {analysis && (
                <div className="mt-2 space-y-3">
                    {parseSections(analysis).map((section, idx) => (
                        <div key={idx} className="rounded-lg bg-[var(--color-bg-secondary)] px-4 py-3 border border-[var(--color-border)]">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-1">
                                {section.title}
                            </p>
                            <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                    <div className="flex justify-end pt-1">
                        <button
                            onClick={fetchAnalysis}
                            disabled={loading}
                            className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                            {loading ? 'Re-analyzing...' : 'Refresh'} <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
