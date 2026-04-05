import { motion } from 'framer-motion';
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                border: isStreak ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid var(--color-border)',
                padding: '24px',
                background: isStreak
                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), var(--color-bg-card), var(--color-bg-card))'
                    : 'var(--color-bg-card)',
                boxShadow: isStreak ? '0 0 30px rgba(249, 115, 22, 0.1)' : 'none',
                transition: 'transform 0.3s, border-color 0.3s',
            }}
            whileHover={{ scale: 1.02 }}
        >
            {isStreak && (
                <div style={{
                    position: 'absolute',
                    top: '-48px',
                    right: '-48px',
                    width: '128px',
                    height: '128px',
                    borderRadius: '50%',
                    background: 'rgba(249, 115, 22, 0.1)',
                    filter: 'blur(32px)',
                }} />
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                        {label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: isStreak ? '#fb923c' : 'var(--color-text-primary)',
                        }}>
                            {value}
                        </span>
                        {isStreak && (
                            <span style={{ fontSize: '24px', animation: 'fire-glow 2s ease-in-out infinite' }}>
                                🔥
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div style={{
                    borderRadius: '12px',
                    padding: '12px',
                    background: isStreak ? 'rgba(249, 115, 22, 0.12)' : 'var(--color-accent-glow)',
                }}>
                    <Icon style={{
                        width: '20px',
                        height: '20px',
                        color: isStreak ? '#fb923c' : 'var(--color-accent)',
                    }} />
                </div>
            </div>
        </motion.div>
    );
}

interface MetricCardsProps {
    streak: number;
    totalCommits: number;
    activeDays: number;
}

export default function MetricCards({ streak, totalCommits, activeDays }: MetricCardsProps) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <MetricCard
                label="Current Streak"
                value={streak}
                icon={Flame}
                variant="streak"
                subtitle={streak > 0 ? `${streak} consecutive days` : 'Start your streak today!'}
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
                subtitle="Days with at least 1 commit"
            />
        </div>
    );
}
