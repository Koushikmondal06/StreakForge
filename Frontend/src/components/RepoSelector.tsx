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

    const displayName = selectedRepo ?? 'All Repositories';

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card-hover)]"
            >
                <span className="max-w-[200px] truncate">{displayName}</span>
                <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 max-h-72 w-64 overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-1.5 shadow-2xl">
                    <button
                        onClick={() => { onSelect(null); setIsOpen(false); }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${!selectedRepo
                                ? 'bg-[var(--color-accent-glow)] text-[var(--color-accent)]'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]'
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
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${isSelected
                                        ? 'bg-[var(--color-accent-glow)] text-[var(--color-accent)]'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]'
                                    }`}
                            >
                                <div className="truncate font-medium">{repo.name}</div>
                                {repo.description && (
                                    <div className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                                        {repo.description}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
