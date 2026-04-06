interface MotivationalBannerProps {
    streak: number;
}

function getMessage(streak: number): string {
    if (streak >= 30) return '🏆 Legendary! You\'re rewriting history!';
    if (streak >= 14) return '⚡ Unstoppable — two weeks of pure dedication!';
    if (streak >= 7) return '🔥 You\'re on fire! Keep going!';
    if (streak >= 3) return '💪 Nice momentum — don\'t break the chain!';
    if (streak >= 1) return '🌱 Great start! Every journey begins with day one.';
    return '⚒️ Time to forge your streak — make your first commit.';
}

export default function MotivationalBanner({ streak }: MotivationalBannerProps) {
    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-[var(--color-accent-glow)] via-[var(--color-bg-card)] to-[var(--color-bg-card)] px-6 py-4">
            <p className="text-[13px] font-medium text-[var(--color-text-secondary)]">
                {getMessage(streak)}
            </p>
        </div>
    );
}
