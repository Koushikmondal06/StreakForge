import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function LoadingSpinner() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-8 w-8 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]"
                />
            </div>
            <div className="space-y-2">
                <div className="h-2 w-36 rounded-full bg-[var(--color-bg-card)] overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent"
                        style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}
                    />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] text-center">Loading analytics</p>
            </div>
        </div>
    );
}

interface ErrorDisplayProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[40vh] items-center justify-center"
        >
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/10 bg-red-500/5 px-8 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Something went wrong</p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">{message}</p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)]"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Try Again
                    </button>
                )}
            </div>
        </motion.div>
    );
}
