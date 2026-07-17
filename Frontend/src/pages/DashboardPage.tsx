import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Folder, GitBranch } from 'lucide-react'
import TopNav from '@/components/TopNav'
import StreakHero from '@/components/StreakHero'
import MetricCards from '@/components/MetricCards'
import ActivityChart from '@/components/ActivityChart'
import InsightsSection from '@/components/InsightsSection'
import RepoSelector from '@/components/RepoSelector'
import AiDashboardAnalysis from '@/components/AiDashboardAnalysis'
import { LoadingSpinner, ErrorDisplay } from '@/components/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function DashboardPage() {
  const { token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { data, repos, loading, error, selectedRepo, selectRepo, refetch } = useAnalytics(token)

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-bg-primary">
      <TopNav />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Your coding activity at a glance</p>
          </div>
          <div className="flex items-center gap-3">
            <RepoSelector repos={repos} selectedRepo={selectedRepo} onSelect={selectRepo} />
            <button
              onClick={refetch}
              className="p-2.5 rounded-lg glass text-text-muted hover:text-text-primary transition-all"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner text="Fetching your analytics..." />}
        {error && <ErrorDisplay message={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <div className="space-y-6">
            <StreakHero streak={data.streak} />
            <MetricCards totalCommits={data.totalCommits} commitsPerDay={data.commitsPerDay} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityChart commitsPerDay={data.commitsPerDay} />
              <InsightsSection commitsPerDay={data.commitsPerDay} streak={data.streak} />
            </div>
            <AiDashboardAnalysis token={token!} repos={repos} analytics={data} />
          </div>
        )}

        {!loading && !error && !data && (
          <div className="text-center py-20">
            <Folder className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No data yet</h3>
            <p className="text-sm text-text-secondary mb-6">Connect your GitHub account to see analytics</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-all"
            >
              <GitBranch className="w-4 h-4" />
              Sync GitHub Data
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
