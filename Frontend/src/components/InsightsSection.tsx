import { useMemo } from 'react';
import { TrendingUp, Calendar, Zap, Moon, Sun, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsightsSectionProps {
    commitsPerDay: Record<string, number>;
    streak: number;
}

interface Insight {
    icon: LucideIcon;
    text: string;
    accent: string;
}

export default function InsightsSection({ commitsPerDay, streak }: InsightsSectionProps) {
    const insights = useMemo(() => {
        const entries = Object.entries(commitsPerDay);
        if (entries.length === 0) return [];

        const result: Insight[] = [];

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
            result.push({ icon: Sun, text: 'Weekday warrior — most activity on weekdays.', accent: 'text-amber-400' });
        } else if (weekendCommits > weekdayCommits) {
            result.push({ icon: Moon, text: 'Weekend coder — peak activity on weekends.', accent: 'text-indigo-400' });
        } else {
            result.push({ icon: Calendar, text: 'Balanced across the week.', accent: 'text-emerald-400' });
        }

        const sortedDays = Object.entries(dayCount).sort(([, a], [, b]) => b - a);
        if (sortedDays[0]) {
            result.push({ icon: Calendar, text: `Most productive on ${sortedDays[0][0]}s.`, accent: 'text-[var(--color-accent-hover)]' });
        }

        if (streak >= 7) {
            result.push({ icon: TrendingUp, text: `${streak}-day streak — building a powerful habit.`, accent: 'text-orange-400' });
        } else if (streak >= 3) {
            result.push({ icon: TrendingUp, text: `${streak}-day streak — keep the momentum.`, accent: 'text-emerald-400' });
        } else {
            result.push({ icon: TrendingUp, text: 'Commit daily to build a streak.', accent: 'text-amber-400' });
        }

        const sorted = [...entries].sort(([, a], [, b]) => b - a);
        if (sorted[0]) {
            const peakDate = new Date(sorted[0][0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            result.push({ icon: Zap, text: `Peak: ${sorted[0][1]} commits on ${peakDate}.`, accent: 'text-[var(--color-accent-hover)]' });
        }

        return result;
    }, [commitsPerDay, streak]);

    if (insights.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 sm:p-6 h-full"
        >
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">Insights</h3>
            <div className="space-y-2">
                {insights.map((insight, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl bg-[var(--color-bg-secondary)] px-4 py-3 transition-colors duration-200 hover:bg-[var(--color-bg-card-hover)]"
                    >
                        <insight.icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${insight.accent}`} />
                        <p className="text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                            {insight.text}
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
