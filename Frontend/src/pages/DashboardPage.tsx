import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import Sidebar, { type TabId } from '@/components/Sidebar';
import MetricCards from '@/components/MetricCards';
import ActivityChart from '@/components/ActivityChart';
import InsightsSection from '@/components/InsightsSection';
import RepoSelector from '@/components/RepoSelector';
import MotivationalBanner from '@/components/MotivationalBanner';
import LoadingSpinner, { ErrorDisplay } from '@/components/LoadingSpinner';

export default function DashboardPage() {
    const { token, isAuthenticated, logout } = useAuth();
    const { data, repos, loading, error, selectedRepo, selectRepo, refetch } = useAnalytics(token);
    const [activeTab, setActiveTab] = useState<TabId>('dashboard');

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const activeDays = data ? Object.keys(data.commitsPerDay).length : 0;

    const renderReposTab = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">Repositories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {repos.map(repo => (
                    <div key={repo.id} className="p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{repo.name}</h3>
                        {repo.description && <p className="mt-2 text-sm text-[var(--color-text-secondary)] line-clamp-2">{repo.description}</p>}
                        <div className="mt-4 flex gap-4 text-xs text-[var(--color-text-muted)]">
                            <span>⭐ {repo.stargazers_count}</span>
                            {repo.language && <span>{repo.language}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderSettingsTab = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">Settings</h1>
            <div className="p-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                <p className="text-[var(--color-text-secondary)] mb-6">Settings and preferences will go here.</p>
                <button className="px-6 py-3 rounded-xl bg-[var(--color-border)] text-white hover:bg-[var(--color-border-hover)] transition-colors">
                    Manage Connections
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

            <main
                style={{ marginLeft: '240px' }}
                className="min-h-screen pb-16"
            >
                {/* Increased padding here to space out the content properly */}
                <div className="px-12 py-10" style={{ maxWidth: '1400px', margin: '0 auto' }}>

                    {activeTab === 'repos' && renderReposTab()}
                    {activeTab === 'settings' && renderSettingsTab()}

                    {activeTab === 'dashboard' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                                <div>
                                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                                        Dashboard
                                    </h1>
                                    <p className="mt-2 text-base text-[var(--color-text-muted)]">
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                    {/* Motivational Banner */}
                                    <MotivationalBanner streak={data.streak} />

                                    {/* Metric Cards */}
                                    <div className="mt-2">
                                        <MetricCards
                                            streak={data.streak}
                                            totalCommits={data.totalCommits}
                                            activeDays={activeDays}
                                        />
                                    </div>

                                    {/* Chart + Insights */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '48px', marginTop: '16px' }}>
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
                        </motion.div>
                    )}

                </div>
            </main>
        </div>
    );
}
