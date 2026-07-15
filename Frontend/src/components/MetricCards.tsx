import { useMemo } from 'react';
import { GitCommit, Calendar, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardsProps {
    totalCommits: number;
    activeDays: number;
    commitsPerDay: Record<string, number>;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
    accent?: string;
    delay?: number;
}

function StatCard({ icon, label, value, sub, accent, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card-hover)]"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                        {label}
                    </p>
                    <p className={`text-2xl font-bold tracking-tight font-[var(--font-mono)] ${accent || 'text-[var(--color-text-primary)]'}`}>
                        {value}
                    </p>
                    {sub && (
                        <p className="text-xs text-[var(--color-text-muted)]">{sub}</p>
                    )}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-secondary)]">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}

export default function MetricCards({ totalCommits, activeDays, commitsPerDay }: MetricCardsProps) {
    const stats = useMemo(() => {
        const entries = Object.entries(commitsPerDay);
        const trackedDays = entries.length;

        const last30 = new Date();
        last30.setDate(last30.getDate() - 30);
        const recentActive = entries.filter(([date]) => new Date(date) >= last30).length;
        const consistency = Math.round((recentActive / 30) * 100);

        let bestDay = { date: '', count: 0 };
        for (const [date, count] of entries) {
            if (count > bestDay.count) {
                bestDay = { date, count };
            }
        }

        const bestDateFormatted = bestDay.date
            ? new Date(bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '—';

        return { trackedDays, consistency, bestDay, bestDateFormatted };
    }, [commitsPerDay]);

    const consistencyColor = stats.consistency >= 70
        ? 'text-[var(--color-success)]'
        : stats.consistency >= 40
            ? 'text-[var(--color-warning)]'
            : 'text-[var(--color-error)]';

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
                icon={<GitCommit className="h-4 w-4" />}
                label="Total Commits"
                value={totalCommits.toLocaleString()}
                accent="text-[var(--color-accent-hover)]"
                delay={0.05}
            />
            <StatCard
                icon={<Calendar className="h-4 w-4" />}
                label="Active Days"
                value={String(activeDays)}
                sub={`of ${stats.trackedDays} tracked`}
                delay={0.1}
            />
            <StatCard
                icon={<Target className="h-4 w-4" />}
                label="Consistency"
                value={`${stats.consistency}%`}
                accent={consistencyColor}
                delay={0.15}
            />
            <StatCard
                icon={<Zap className="h-4 w-4" />}
                label="Best Day"
                value={String(stats.bestDay.count)}
                sub={stats.bestDateFormatted}
                accent="text-[var(--color-accent-hover)]"
                delay={0.2}
            />
        </div>
    );
}
