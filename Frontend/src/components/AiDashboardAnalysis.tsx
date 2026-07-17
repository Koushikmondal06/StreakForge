import { useState } from 'react'
import { Sparkles, Loader2, Copy, Check } from 'lucide-react'
import { API_BASE } from '@/services/api'
import type { Repo, AnalyticsData } from '@/services/api'

interface AiDashboardAnalysisProps {
  token: string
  repos: Repo[]
  analytics: AnalyticsData | null
}

export default function AiDashboardAnalysis({ token, repos, analytics }: AiDashboardAnalysisProps) {
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setLoading(true)
    setError(null)
    setAnalysis('')
    try {
      const res = await fetch(`${API_BASE}/ai/dashboard-analysis`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repos: repos.map((r) => ({ name: r.full_name, description: r.description, stars: r.stargazers_count, language: r.language })),
          analytics,
        }),
      })
      if (!res.ok) throw new Error(`Analysis failed: ${res.status}`)
      const data = await res.json()
      setAnalysis(data.response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###')) {
        return <h4 key={i} className="text-sm font-semibold text-text-primary mt-4 mb-2">{line.replace(/^###\s*/, '')}</h4>
      }
      if (line.startsWith('##')) {
        return <h3 key={i} className="text-base font-bold text-text-primary mt-5 mb-2">{line.replace(/^##\s*/, '')}</h3>
      }
      if (line.startsWith('#')) {
        return <h2 key={i} className="text-lg font-bold text-accent mt-6 mb-3">{line.replace(/^#\s*/, '')}</h2>
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="text-sm text-text-secondary ml-4 list-disc">{line.slice(2)}</li>
      }
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-sm text-text-secondary leading-relaxed">{line}</p>
    })
  }

  return (
    <div className="glass rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">AI Analysis</h3>
            <p className="text-xs text-text-muted">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-danger-muted border border-danger/20 text-sm text-danger">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-8 text-center">
          <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto mb-2" />
          <p className="text-sm text-text-muted">Generating insights...</p>
        </div>
      )}

      {analysis && (
        <div className="prose-invert max-w-none bg-bg-primary/50 rounded-lg p-4 border border-border-default max-h-96 overflow-y-auto">
          {formatAnalysis(analysis)}
        </div>
      )}

      {!loading && !analysis && !error && (
        <p className="text-sm text-text-muted text-center py-4">
          Click Generate to get AI-powered insights about your coding patterns.
        </p>
      )}
    </div>
  )
}
