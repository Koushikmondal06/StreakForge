import { motion } from 'framer-motion';

export default function LoadingSpinner() {
    return (
        <div className="flex h-full min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <motion.div
                    className="h-12 w-12 rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-accent)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <div className="space-y-3">
                    <div className="h-3 w-48 rounded-full bg-[var(--color-bg-card)]" style={{ animation: 'shimmer 2s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-card) 25%, var(--color-bg-card-hover) 50%, var(--color-bg-card) 75%)' }} />
                    <div className="h-3 w-32 rounded-full bg-[var(--color-bg-card)] mx-auto" style={{ animation: 'shimmer 2s infinite 0.3s', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-card) 25%, var(--color-bg-card-hover) 50%, var(--color-bg-card) 75%)' }} />
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">Forging your analytics...</p>
            </div>
        </div>
    );
}

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="flex h-full min-h-[60vh] items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center"
            >
                <div className="text-4xl">⚠️</div>
                <p className="text-sm font-medium text-red-400">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                    >
                        Try Again
                    </button>
                )}
            </motion.div>
        </div>
    );
}
