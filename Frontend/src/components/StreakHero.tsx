import { Flame, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakHeroProps {
    streak: number;
}

function getMessage(streak: number): string {
    if (streak >= 30) return 'Legendary status unlocked.';
    if (streak >= 14) return 'Unstoppable momentum.';
    if (streak >= 7) return 'On fire — keep pushing.';
    if (streak >= 3) return 'Strong streak building.';
    if (streak >= 1) return 'Every day counts.';
    return 'Time to start your streak.';
}

function getTier(streak: number): { color: string; glow: string } {
    if (streak >= 14) return { color: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20' };
    if (streak >= 7) return { color: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/15' };
    if (streak >= 1) return { color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/10' };
    return { color: 'from-zinc-500 to-zinc-600', glow: 'shadow-zinc-500/10' };
}

export default function StreakHero({ streak }: StreakHeroProps) {
    const tier = getTier(streak);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-violet-500/[0.02]" />

            <div className="relative flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${tier.color} shadow-lg ${tier.glow}`}>
                            <Flame className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                            Current Streak
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-bold tracking-tight font-[var(--font-mono)] bg-gradient-to-r ${tier.color} bg-clip-text text-transparent sm:text-6xl`}>
                            {streak}
                        </span>
                        <span className="text-lg font-medium text-[var(--color-text-muted)]">
                            days
                        </span>
                    </div>

                    <p className="text-sm text-[var(--color-text-secondary)]">
                        {getMessage(streak)}
                    </p>
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                        <TrendingUp className={`h-7 w-7 bg-gradient-to-r ${tier.color} bg-clip-text`} style={{ color: streak > 0 ? '#f97316' : '#52525b' }} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
