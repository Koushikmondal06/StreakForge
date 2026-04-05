import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

interface InsightsSectionProps {
    commitsPerDay: Record<string, number>;
    streak: number;
}

export default function InsightsSection({ commitsPerDay, streak }: InsightsSectionProps) {
    const insights = useMemo(() => {
        const entries = Object.entries(commitsPerDay);
        if (entries.length === 0) return [];

        const result: { icon: typeof TrendingUp; title: string; description: string; color: string }[] = [];

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
                description: `You tend to make ${Math.round(mostActiveDay[1] / entries.length * 7)} commits on ${mostActiveDay[0]}s`,
                color: 'text-blue-400',
            });
        }

        // Streak insight
        if (streak >= 7) {
            result.push({
                icon: TrendingUp,
                title: 'Your streak is on fire!',
                description: `${streak} days strong — you're building an incredible habit`,
                color: 'text-orange-400',
            });
        } else if (streak >= 3) {
            result.push({
                icon: TrendingUp,
                title: 'Your streak is growing',
                description: `${streak} days and counting — keep the momentum going`,
                color: 'text-green-400',
            });
        } else {
            result.push({
                icon: TrendingUp,
                title: 'Time to build momentum',
                description: 'Commit consistently to build a powerful streak',
                color: 'text-yellow-400',
            });
        }

        // Peak productivity
        const sortedByCommits = entries.sort(([, a], [, b]) => b - a);
        const peakDay = sortedByCommits[0];
        if (peakDay) {
            const peakDate = new Date(peakDay[0]).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            result.push({
                icon: Zap,
                title: `Peak: ${peakDay[1]} commits`,
                description: `Your most productive day was ${peakDate}`,
                color: 'text-purple-400',
            });
        }

        return result;
    }, [commitsPerDay, streak]);

    if (insights.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
        >
            <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                📅 Insights
            </h3>
            <div className="space-y-4">
                {insights.map((insight, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                        className="flex items-start gap-4 rounded-xl bg-[var(--color-bg-secondary)] p-4 transition-colors hover:bg-[var(--color-bg-card-hover)]"
                    >
                        <div className={`mt-0.5 ${insight.color}`}>
                            <insight.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                {insight.title}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                {insight.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
