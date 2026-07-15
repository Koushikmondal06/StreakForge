import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Repo {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
}

interface RepoSelectorProps {
    repos: Repo[];
    selectedRepo: string | null;
    onSelect: (repoFullName: string | null) => void;
}

export default function RepoSelector({ repos, selectedRepo, onSelect }: RepoSelectorProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const label = selectedRepo || 'All Repositories';

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3.5 py-2 text-[13px] font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
            >
                <span className="max-w-[140px] truncate">{label}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-2xl shadow-black/40">
                    <div className="max-h-64 overflow-y-auto p-1">
                        <button
                            onClick={() => { onSelect(null); setOpen(false); }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition-colors duration-150 ${!selectedRepo
                                ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-hover)]'
                                : 'text-[var(--color-text-secondary)] hover:bg-white/[0.04] hover:text-[var(--color-text-primary)]'
                            }`}
                        >
                            <span className="font-medium">All Repositories</span>
                            {!selectedRepo && <Check className="h-3.5 w-3.5" />}
                        </button>
                        {repos.map(repo => (
                            <button
                                key={repo.id}
                                onClick={() => { onSelect(repo.full_name); setOpen(false); }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] transition-colors duration-150 ${selectedRepo === repo.full_name
                                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-hover)]'
                                    : 'text-[var(--color-text-secondary)] hover:bg-white/[0.04] hover:text-[var(--color-text-primary)]'
                                }`}
                            >
                                <span className="truncate font-medium">{repo.name}</span>
                                {selectedRepo === repo.full_name && <Check className="h-3.5 w-3.5 shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
