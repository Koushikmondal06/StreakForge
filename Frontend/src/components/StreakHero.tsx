import { Flame } from 'lucide-react';

interface StreakHeroProps {
    streak: number;
}

function getMessage(streak: number): string {
    if (streak >= 30) return 'Legendary! You\'re rewriting history.';
    if (streak >= 14) return 'Unstoppable — two weeks of pure dedication.';
    if (streak >= 7) return 'You\'re on fire! Keep pushing forward.';
    if (streak >= 3) return 'Nice momentum — don\'t break the chain.';
    if (streak >= 1) return 'Great start. Every journey begins with day one.';
    return 'Time to forge your streak.';
}

export default function StreakHero({ streak }: StreakHeroProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/15 p-5 sm:p-6 md:p-8"
            style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(22,22,30,1) 50%, rgba(139,92,246,0.05) 100%)',
            }}
        >
            {/* Ambient glow */}
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-[60px] pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-violet-500/8 blur-[50px] pointer-events-none" />

            <div className="relative flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame className="h-4 w-4 text-orange-400 shrink-0" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400/80">
                            Current Streak
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 sm:gap-3 mt-2">
                        <span
                            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-orange-400"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                textShadow: '0 0 40px rgba(249,115,22,0.3)',
                            }}
                        >
                            {streak}
                        </span>
                        <span className="text-base sm:text-lg font-medium text-orange-400/60">days</span>
                    </div>
                    <p className="mt-2 sm:mt-3 text-sm text-[var(--color-text-secondary)]">
                        {getMessage(streak)}
                    </p>
                </div>

                {/* Large decorative fire */}
                <div
                    className="text-5xl sm:text-6xl md:text-7xl opacity-20 select-none shrink-0"
                    style={{ animation: 'fire-glow 3s ease-in-out infinite' }}
                >
                    🔥
                </div>
            </div>
        </div>
    );
}
