import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import Sidebar from '@/components/Sidebar';
import MetricCards from '@/components/MetricCards';
import ActivityChart from '@/components/ActivityChart';
import InsightsSection from '@/components/InsightsSection';
import RepoSelector from '@/components/RepoSelector';
import MotivationalBanner from '@/components/MotivationalBanner';
import LoadingSpinner, { ErrorDisplay } from '@/components/LoadingSpinner';

export default function DashboardPage() {
    const { token, isAuthenticated, logout } = useAuth();
    const { data, repos, loading, error, selectedRepo, selectRepo, refetch } = useAnalytics(token);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const activeDays = data ? Object.keys(data.commitsPerDay).length : 0;

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Sidebar onLogout={logout} />

            <main
                style={{ marginLeft: '240px' }}
                className="min-h-screen"
            >
                <div className="px-8 py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                Your GitHub activity at a glance
                            </p>
                        </div>
                        <RepoSelector
                            repos={repos}
                            selectedRepo={selectedRepo}
                            onSelect={selectRepo}
                        />
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorDisplay message={error} onRetry={refetch} />
                    ) : data ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Motivational Banner */}
                            <MotivationalBanner streak={data.streak} />

                            {/* Metric Cards */}
                            <MetricCards
                                streak={data.streak}
                                totalCommits={data.totalCommits}
                                activeDays={activeDays}
                            />

                            {/* Chart + Insights */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                <div style={{ minWidth: 0 }}>
                                    <ActivityChart commitsPerDay={data.commitsPerDay} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <InsightsSection
                                        commitsPerDay={data.commitsPerDay}
                                        streak={data.streak}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
}
