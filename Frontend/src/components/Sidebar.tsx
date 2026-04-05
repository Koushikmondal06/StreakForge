import { motion } from 'framer-motion';
import { LayoutDashboard, GitBranch, Settings, LogOut, Flame } from 'lucide-react';

interface SidebarProps {
    onLogout: () => void;
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: GitBranch, label: 'Repos', active: false },
    { icon: Settings, label: 'Settings', active: false },
];

export default function Sidebar({ onLogout }: SidebarProps) {
    return (
        <motion.aside
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-[var(--color-border)]"
            style={{ background: 'rgba(14, 14, 20, 0.92)', backdropFilter: 'blur(24px)' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/20">
                    <Flame className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                    StreakForge
                </span>
            </div>

            {/* Nav Items */}
            <nav className="mt-4 flex-1 space-y-1 px-3">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${item.active
                                ? 'bg-[var(--color-accent-glow)] text-[var(--color-accent)]'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]'
                            }`}
                    >
                        <item.icon className="h-[18px] w-[18px]" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <div className="border-t border-[var(--color-border)] p-3">
                <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="h-[18px] w-[18px]" />
                    Logout
                </button>
            </div>
        </motion.aside>
    );
}
