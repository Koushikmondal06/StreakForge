import { useMemo } from 'react';
import { TrendingUp, Calendar, Zap, Moon, Sun } from 'lucide-react';

interface InsightsSectionProps {
    commitsPerDay: Record<string, number>;
    streak: number;
}

export default function InsightsSection({ commitsPerDay, streak }: InsightsSectionProps) {
    const insights = useMemo(() => {
        const entries = Object.entries(commitsPerDay);
        if (entries.length === 0) return [];

        const result: { icon: any; text: string; accent: string }[] = [];

        // Weekday vs Weekend analysis
        let weekdayCommits = 0;
        let weekendCommits = 0;
        const dayCount: Record<string, number> = {};

        for (const [date, count] of entries) {
            const day = new Date(date).getDay();
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            dayCount[dayName] = (dayCount[dayName] ?? 0) + count;
            if (day === 0 || day === 6) {
                weekendCommits += count;
            } else {
                weekdayCommits += count;
            }
        }

        if (weekdayCommits > weekendCommits * 2) {
            result.push({ icon: Sun, text: 'You are consistent during weekdays but less active on weekends.', accent: 'text-amber-400' });
        } else if (weekendCommits > weekdayCommits) {
            result.push({ icon: Moon, text: 'You\'re a weekend warrior — most of your coding happens on weekends.', accent: 'text-indigo-400' });
        } else {
            result.push({ icon: Calendar, text: 'Your coding is evenly spread across the week. Great balance!', accent: 'text-emerald-400' });
        }

        // Most active day
        const sortedDays = Object.entries(dayCount).sort(([, a], [, b]) => b - a);
        if (sortedDays[0]) {
            result.push({ icon: Calendar, text: `Your most productive day is ${sortedDays[0][0]}.`, accent: 'text-[var(--color-accent)]' });
        }

        // Streak insight
        if (streak >= 7) {
            result.push({ icon: TrendingUp, text: `${streak}-day streak — you're building an incredible habit.`, accent: 'text-orange-400' });
        } else if (streak >= 3) {
            result.push({ icon: TrendingUp, text: `${streak}-day streak — keep the momentum going.`, accent: 'text-emerald-400' });
        } else {
            result.push({ icon: TrendingUp, text: 'Try committing daily to build a powerful streak.', accent: 'text-amber-400' });
        }

        // Peak day
        const sorted = [...entries].sort(([, a], [, b]) => b - a);
        if (sorted[0]) {
            const peakDate = new Date(sorted[0][0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            result.push({ icon: Zap, text: `Peak productivity: ${sorted[0][1]} commits on ${peakDate}.`, accent: 'text-[var(--color-accent)]' });
        }

        return result;
    }, [commitsPerDay, streak]);

    if (insights.length === 0) return null;

    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 h-full">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">Insights</h3>
            <div className="space-y-2.5">
                {insights.map((insight, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl bg-[var(--color-bg-secondary)] px-4 py-3 transition-colors hover:bg-[var(--color-bg-card-hover)]"
                    >
                        <insight.icon className={`mt-0.5 h-4 w-4 shrink-0 ${insight.accent}`} />
                        <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                            {insight.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
