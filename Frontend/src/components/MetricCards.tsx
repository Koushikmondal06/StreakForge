import { GitCommit, CalendarDays, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

interface MetricCardsProps {
    totalCommits: number;
    activeDays: number;
    commitsPerDay: Record<string, number>;
}

interface StatCardProps {
    label: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    accent?: string;
}

function StatCard({ label, value, subtitle, icon: Icon, accent }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 sm:p-5 transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card-hover)] group overflow-hidden">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] truncate">
                        {label}
                    </p>
                    <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight truncate" style={{ fontFamily: 'var(--font-mono)', color: accent || 'var(--color-text-primary)' }}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-1 text-[11px] text-[var(--color-text-muted)] truncate">{subtitle}</p>
                    )}
                </div>
                <div className="rounded-lg p-2 bg-white/[0.04] group-hover:bg-white/[0.06] transition-colors shrink-0">
                    <Icon className="h-4 w-4" style={{ color: accent || 'var(--color-text-muted)' }} />
                </div>
            </div>
        </div>
    );
}

export default function MetricCards({ totalCommits, activeDays, commitsPerDay }: MetricCardsProps) {
    const stats = useMemo(() => {
        const entries = Object.entries(commitsPerDay);
        const totalDaysTracked = entries.length;

        const today = new Date();
        const last30 = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            last30.push(key);
        }
        const activeLast30 = last30.filter(d => commitsPerDay[d] && commitsPerDay[d] > 0).length;
        const consistencyScore = Math.round((activeLast30 / 30) * 100);

        let bestDayDate = '';
        let bestDayCount = 0;
        for (const [date, count] of entries) {
            if (count > bestDayCount) {
                bestDayCount = count;
                bestDayDate = date;
            }
        }
        const bestDayFormatted = bestDayDate
            ? new Date(bestDayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '—';

        return { consistencyScore, bestDayFormatted, bestDayCount, totalDaysTracked };
    }, [commitsPerDay]);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
                label="Total Commits"
                value={totalCommits.toLocaleString()}
                subtitle="Across all repos"
                icon={GitCommit}
                accent="var(--color-accent)"
            />
            <StatCard
                label="Active Days"
                value={activeDays}
                subtitle={`of ${stats.totalDaysTracked} tracked`}
                icon={CalendarDays}
            />
            <StatCard
                label="Consistency"
                value={`${stats.consistencyScore}%`}
                subtitle="Last 30 days"
                icon={Target}
                accent={stats.consistencyScore >= 70 ? 'var(--color-success)' : stats.consistencyScore >= 40 ? '#eab308' : '#ef4444'}
            />
            <StatCard
                label="Best Day"
                value={`${stats.bestDayCount}`}
                subtitle={stats.bestDayFormatted}
                icon={TrendingUp}
                accent="var(--color-accent)"
            />
        </div>
    );
}
