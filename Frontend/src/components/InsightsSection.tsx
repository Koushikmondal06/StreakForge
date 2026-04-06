import { useMemo } from 'react';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

interface InsightsSectionProps {
    commitsPerDay: Record<string, number>;
    streak: number;
}

export default function InsightsSection({ commitsPerDay, streak }: InsightsSectionProps) {
    const insights = useMemo(() => {
        const entries = Object.entries(commitsPerDay);
        if (entries.length === 0) return [];

        const result: { icon: typeof TrendingUp; title: string; description: string }[] = [];

        // Most active day of the week
        const dayCount: Record<string, number> = {};
        for (const [date, count] of entries) {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            dayCount[dayName] = (dayCount[dayName] ?? 0) + count;
        }
        const mostActiveDay = Object.entries(dayCount).sort(([, a], [, b]) => b - a)[0];
        if (mostActiveDay) {
            result.push({
                icon: Calendar,
                title: `Most active on ${mostActiveDay[0]}s`,
                description: `~${Math.round(mostActiveDay[1] / entries.length * 7)} commits on ${mostActiveDay[0]}s`,
            });
        }

        // Streak insight
        if (streak >= 7) {
            result.push({ icon: TrendingUp, title: 'Streak is on fire!', description: `${streak} days strong` });
        } else if (streak >= 3) {
            result.push({ icon: TrendingUp, title: 'Streak is growing', description: `${streak} days — keep going` });
        } else {
            result.push({ icon: TrendingUp, title: 'Build momentum', description: 'Commit daily to grow your streak' });
        }

        // Peak day
        const sortedByCommits = [...entries].sort(([, a], [, b]) => b - a);
        const peakDay = sortedByCommits[0];
        if (peakDay) {
            const peakDate = new Date(peakDay[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            result.push({ icon: Zap, title: `Peak: ${peakDay[1]} commits`, description: `Best day was ${peakDate}` });
        }

        return result;
    }, [commitsPerDay, streak]);

    if (insights.length === 0) return null;

    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">Insights</h3>
            <div className="space-y-3">
                {insights.map((insight, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg bg-[var(--color-bg-secondary)] p-3 transition-colors hover:bg-[var(--color-bg-card-hover)]"
                    >
                        <insight.icon className="mt-0.5 h-4 w-4 text-[var(--color-accent)]" />
                        <div>
                            <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
                                {insight.title}
                            </p>
                            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                                {insight.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
