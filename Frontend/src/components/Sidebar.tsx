import { LayoutDashboard, GitBranch, Brain, Settings, LogOut, Flame } from 'lucide-react';

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
    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                    <Flame className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                    StreakForge
                </span>
            </div>

            {/* Nav */}
            <nav className="mt-2 flex-1 space-y-1 px-3">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150 ${isActive
                                    ? 'bg-white/[0.06] text-white'
                                    : 'text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-[var(--color-text-secondary)]'
                                }`}
                        >
                            <item.icon className="h-[18px] w-[18px]" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-[var(--color-border)] p-3">
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="h-[18px] w-[18px]" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
