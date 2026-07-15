import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import Sidebar, { type TabId } from '@/components/Sidebar';
import StreakHero from '@/components/StreakHero';
import MetricCards from '@/components/MetricCards';
import ActivityChart from '@/components/ActivityChart';
import InsightsSection from '@/components/InsightsSection';
import RepoSelector from '@/components/RepoSelector';
import LoadingSpinner, { ErrorDisplay } from '@/components/LoadingSpinner';
import AiDashboardAnalysis from '@/components/AiDashboardAnalysis';

export default function DashboardPage() {
    const { token, isAuthenticated, logout } = useAuth();
    const { data, repos, loading, error, selectedRepo, selectRepo, refetch } = useAnalytics(token);
    const [activeTab, setActiveTab] = useState<TabId>('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'assistant') {
            navigate('/assistant');
        }
    }, [activeTab, navigate]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (activeTab === 'assistant') {
        return null;
    }

    const activeDays = data ? Object.keys(data.commitsPerDay).length : 0;

    const renderReposTab = () => (
        <div>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">Repositories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {repos.map(repo => (
                    <div key={repo.id} className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card-hover)]">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{repo.name}</h3>
                        {repo.description && <p className="mt-1.5 text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">{repo.description}</p>}
                        <div className="mt-3 flex gap-3 text-[11px] text-[var(--color-text-muted)]">
                            {repo.stargazers_count > 0 && <span className="flex items-center gap-1">⭐ {repo.stargazers_count}</span>}
                            {repo.language && <span className="rounded-md bg-[var(--color-bg-secondary)] px-1.5 py-0.5">{repo.language}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInsightsTab = () => (
        <div>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">AI Insights</h1>
            {data && <AiDashboardAnalysis repos={repos} analytics={data} />}
        </div>
    );

    const renderSettingsTab = () => (
        <div className="max-w-lg">
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)] mb-5">Settings</h1>
            <div className="space-y-3">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Account</h2>
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">Connected to GitHub</p>
                    <button
                        onClick={logout}
                        className="rounded-xl bg-red-500/10 border border-red-500/10 px-4 py-2 text-xs font-medium text-red-400 transition-all duration-200 hover:bg-red-500/15"
                    >
                        Sign Out
                    </button>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Data Cache</h2>
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">GitHub data cached for 1 hour.</p>
                    <button
                        onClick={refetch}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
                    >
                        Refresh Data
                    </button>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">About</h2>
                    <p className="text-xs text-[var(--color-text-muted)]">StreakForge v1.0.0</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

            <main className="min-h-screen lg:ml-[220px]">
                <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-[1100px]">

                    {activeTab === 'repos' && renderReposTab()}
                    {activeTab === 'insights' && renderInsightsTab()}
                    {activeTab === 'settings' && renderSettingsTab()}

                    {activeTab === 'dashboard' && (
                        <div className="pt-10 lg:pt-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                <div>
                                    <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Dashboard</h1>
                                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Your coding activity at a glance</p>
                                </div>
                                <RepoSelector repos={repos} selectedRepo={selectedRepo} onSelect={selectRepo} />
                            </div>

                            {loading ? (
                                <LoadingSpinner />
                            ) : error ? (
                                <ErrorDisplay message={error} onRetry={refetch} />
                            ) : data ? (
                                <div className="flex flex-col gap-3">
                                    <StreakHero streak={data.streak} />

                                    <MetricCards
                                        totalCommits={data.totalCommits}
                                        activeDays={activeDays}
                                        commitsPerDay={data.commitsPerDay}
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                                        <div className="lg:col-span-3">
                                            <ActivityChart commitsPerDay={data.commitsPerDay} />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <InsightsSection commitsPerDay={data.commitsPerDay} streak={data.streak} />
                                        </div>
                                    </div>

                                    <AiDashboardAnalysis repos={repos} analytics={data} />
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
