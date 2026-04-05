import { motion } from 'framer-motion';

interface MotivationalBannerProps {
    streak: number;
}

function getMessage(streak: number): { text: string; emoji: string } {
    if (streak >= 30) return { text: "Legendary! You're rewriting history! 🏆", emoji: '🏆' };
    if (streak >= 14) return { text: "Unstoppable! Two weeks of pure dedication!", emoji: '⚡' };
    if (streak >= 7) return { text: "You're on fire! Keep going! 🔥", emoji: '🔥' };
    if (streak >= 3) return { text: "Nice momentum! Don't break the chain!", emoji: '💪' };
    if (streak >= 1) return { text: "Great start! Every journey begins with day one.", emoji: '🌱' };
    return { text: "Time to forge your streak! Make your first commit.", emoji: '⚒️' };
}

export default function MotivationalBanner({ streak }: MotivationalBannerProps) {
    const { text, emoji } = getMessage(streak);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-r from-violet-600/10 via-[var(--color-bg-card)] to-indigo-600/10 p-8 md:p-10"
        >
            <div className="absolute -right-6 -top-6 text-6xl opacity-20">{emoji}</div>
            <p className="relative text-sm font-medium text-[var(--color-text-secondary)]">
                Daily Motivation
            </p>
            <p className="relative mt-2 text-lg font-semibold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {text}
            </p>
        </motion.div>
    );
}
