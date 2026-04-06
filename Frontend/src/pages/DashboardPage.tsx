import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import Sidebar, { type TabId } from '@/components/Sidebar';
import MetricCards from '@/components/MetricCards';
import ActivityChart from '@/components/ActivityChart';
import InsightsSection from '@/components/InsightsSection';
import RepoSelector from '@/components/RepoSelector';
import MotivationalBanner from '@/components/MotivationalBanner';
import LoadingSpinner, { ErrorDisplay } from '@/components/LoadingSpinner';
import AiDashboardAnalysis from '@/components/AiDashboardAnalysis';

export default function DashboardPage() {
    const { token, isAuthenticated, logout } = useAuth();
    const { data, repos, loading, error, selectedRepo, selectRepo, refetch } = useAnalytics(token);
    const [activeTab, setActiveTab] = useState<TabId>('dashboard');

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const activeDays = data ? Object.keys(data.commitsPerDay).length : 0;

    const renderReposTab = () => (
        <div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">Repositories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map(repo => (
                    <div key={repo.id} className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-colors hover:border-[var(--color-border-hover)]">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{repo.name}</h3>
                        {repo.description && <p className="mt-1.5 text-xs text-[var(--color-text-muted)] line-clamp-2">{repo.description}</p>}
                        <div className="mt-3 flex gap-3 text-[11px] text-[var(--color-text-muted)]">
                            <span>⭐ {repo.stargazers_count}</span>
                            {repo.language && <span>{repo.language}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInsightsTab = () => (
        <div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">AI Insights</h1>
            {data && (
                <AiDashboardAnalysis
                    repos={repos}
                    analytics={data}
                />
            )}
        </div>
    );

    const renderSettingsTab = () => (
        <div className="max-w-lg">
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">Settings</h1>
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                <p className="text-sm text-[var(--color-text-muted)] mb-4">Settings and preferences will appear here.</p>
                <button className="px-4 py-2 rounded-lg bg-white/[0.06] text-sm text-[var(--color-text-primary)] hover:bg-white/[0.1] transition-colors border border-[var(--color-border)]">
                    Manage Connections
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

            <main style={{ marginLeft: '220px' }} className="min-h-screen">
                <div className="px-8 py-6" style={{ maxWidth: '1200px' }}>

                    {activeTab === 'repos' && renderReposTab()}
                    {activeTab === 'insights' && renderInsightsTab()}
                    {activeTab === 'settings' && renderSettingsTab()}

                    {activeTab === 'dashboard' && (
                        <div>
                            {/* Header row with controls */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                        Dashboard
                                    </h1>
                                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
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
                                <div className="flex flex-col gap-6">
                                    {/* Motivational Banner */}
                                    <MotivationalBanner streak={data.streak} />

                                    {/* Metric Cards */}
                                    <MetricCards
                                        streak={data.streak}
                                        totalCommits={data.totalCommits}
                                        activeDays={activeDays}
                                    />

                                    {/* Chart + Insights grid */}
                                    <div className="grid grid-cols-5 gap-4">
                                        <div className="col-span-3">
                                            <ActivityChart commitsPerDay={data.commitsPerDay} />
                                        </div>
                                        <div className="col-span-2">
                                            <InsightsSection
                                                commitsPerDay={data.commitsPerDay}
                                                streak={data.streak}
                                            />
                                        </div>
                                    </div>

                                    {/* AI Dashboard Analysis */}
                                    <AiDashboardAnalysis
                                        repos={repos}
                                        analytics={data}
                                    />
                                </div>
                            ) : null}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
