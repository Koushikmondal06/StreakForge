import { Flame, GitCommit, CalendarDays, type LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    variant?: 'default' | 'streak';
    subtitle?: string;
}

function MetricCard({ label, value, icon: Icon, variant = 'default', subtitle }: MetricCardProps) {
    const isStreak = variant === 'streak';

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:border-[var(--color-border-hover)] ${isStreak
                    ? 'border-orange-500/20 bg-gradient-to-br from-orange-500/[0.06] to-[var(--color-bg-card)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-card)]'
                }`}
            style={isStreak ? { boxShadow: '0 0 40px rgba(249, 115, 22, 0.06)' } : {}}
        >
            {isStreak && (
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl" />
            )}

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                        {label}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span
                            className="text-3xl font-bold tracking-tight"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isStreak ? '#f97316' : 'var(--color-text-primary)',
                            }}
                        >
                            {value}
                        </span>
                        {isStreak && (
                            <span className="text-xl" style={{ animation: 'fire-glow 2s ease-in-out infinite' }}>
                                🔥
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="mt-2 text-xs text-[var(--color-text-muted)]">{subtitle}</p>
                    )}
                </div>
                <div
                    className={`rounded-lg p-2.5 ${isStreak ? 'bg-orange-500/10' : 'bg-[var(--color-accent-glow)]'
                        }`}
                >
                    <Icon
                        className="h-4 w-4"
                        style={{ color: isStreak ? '#f97316' : 'var(--color-accent)' }}
                    />
                </div>
            </div>
        </div>
    );
}

interface MetricCardsProps {
    streak: number;
    totalCommits: number;
    activeDays: number;
}

export default function MetricCards({ streak, totalCommits, activeDays }: MetricCardsProps) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <MetricCard
                label="Current Streak"
                value={streak}
                icon={Flame}
                variant="streak"
                subtitle={streak > 0 ? `${streak} consecutive days` : 'Start your streak today'}
            />
            <MetricCard
                label="Total Commits"
                value={totalCommits.toLocaleString()}
                icon={GitCommit}
                subtitle="Across all repos"
            />
            <MetricCard
                label="Active Days"
                value={activeDays}
                icon={CalendarDays}
                subtitle="Days with commits"
            />
        </div>
    );
}
