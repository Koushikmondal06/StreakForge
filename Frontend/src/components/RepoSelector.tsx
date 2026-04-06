import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Repo } from '@/services/api';

interface RepoSelectorProps {
    repos: Repo[];
    selectedRepo: string | null;
    onSelect: (repoFullName: string | null) => void;
}

export default function RepoSelector({ repos, selectedRepo, onSelect }: RepoSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayName = selectedRepo?.split('/')[1] ?? 'All Repositories';

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-hover)]"
            >
                <span className="max-w-[160px] truncate">{displayName}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-1.5 max-h-64 w-56 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-1 shadow-xl">
                    <button
                        onClick={() => { onSelect(null); setIsOpen(false); }}
                        className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition-colors ${!selectedRepo
                                ? 'bg-white/[0.06] text-white'
                                : 'text-[var(--color-text-secondary)] hover:bg-white/[0.04]'
                            }`}
                    >
                        All Repositories
                    </button>
                    {repos.map((repo) => {
                        const fullName = `${repo.owner.login}/${repo.name}`;
                        const isSelected = selectedRepo === fullName;
                        return (
                            <button
                                key={repo.id}
                                onClick={() => { onSelect(fullName); setIsOpen(false); }}
                                className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition-colors ${isSelected
                                        ? 'bg-white/[0.06] text-white'
                                        : 'text-[var(--color-text-secondary)] hover:bg-white/[0.04]'
                                    }`}
                            >
                                {repo.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
