import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'

export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
      <p className="text-sm text-text-muted">{text}</p>
    </div>
  )
}

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-12 h-12 rounded-full bg-danger-muted flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-danger" />
      </div>
      <p className="text-sm text-text-secondary text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}
