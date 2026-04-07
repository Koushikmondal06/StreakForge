import { useState } from 'react';
import { LayoutDashboard, GitBranch, Brain, Settings, LogOut, Flame, Menu, X } from 'lucide-react';

export type TabId = 'dashboard' | 'repos' | 'insights' | 'settings';

interface SidebarProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    onLogout: () => void;
}

const navItems = [
    { id: 'dashboard' as TabId, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'repos' as TabId, icon: GitBranch, label: 'Repositories' },
    { id: 'insights' as TabId, icon: Brain, label: 'Insights (AI)' },
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
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] lg:hidden"
            >
                <Menu className="h-5 w-5 text-[var(--color-text-primary)]" />
            </button>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)] transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo + mobile close */}
                <div className="flex items-center justify-between px-5 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                            <Flame className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                            StreakForge
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/[0.06] lg:hidden"
                    >
                        <X className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="mt-2 flex-1 space-y-1 px-3">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition-colors duration-150 ${isActive
                                        ? 'bg-white/[0.06] text-white'
                                        : 'text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-[var(--color-text-secondary)]'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-[var(--color-border)] p-3">
                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
