import { useState } from 'react';
import { LayoutDashboard, GitBranch, Brain, Settings, LogOut, Flame, Menu, X, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabId = 'dashboard' | 'repos' | 'insights' | 'settings' | 'assistant';

interface SidebarProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    onLogout: () => void;
}

const navItems = [
    { id: 'dashboard' as TabId, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'repos' as TabId, icon: GitBranch, label: 'Repositories' },
    { id: 'insights' as TabId, icon: Brain, label: 'AI Insights' },
    { id: 'assistant' as TabId, icon: MessageSquare, label: 'AI Chat' },
    { id: 'settings' as TabId, icon: Settings, label: 'Settings' },
];

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleTabChange = (tab: TabId) => {
        onTabChange(tab);
        setMobileOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed left-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] backdrop-blur-sm lg:hidden"
            >
                <Menu className="h-4 w-4 text-[var(--color-text-secondary)]" />
            </button>

            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)] backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between px-5 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                            <Flame className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
                            StreakForge
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/[0.06] lg:hidden"
                    >
                        <X className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                    </button>
                </div>

                <nav className="mt-1 flex-1 space-y-0.5 px-2.5">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${isActive
                                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-hover)]'
                                    : 'text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-[var(--color-text-secondary)]'
                                }`}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-[var(--color-border)] p-2.5">
                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[var(--color-text-muted)] transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
