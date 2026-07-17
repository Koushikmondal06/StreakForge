import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Folder } from 'lucide-react'
import type { Repo } from '@/services/api'

interface RepoSelectorProps {
  repos: Repo[]
  selectedRepo: string | null
  onSelect: (repoFullName: string | null) => void
}

export default function RepoSelector({ repos, selectedRepo, onSelect }: RepoSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const displayLabel = selectedRepo || 'All Repositories'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass text-sm font-medium text-text-secondary hover:text-text-primary transition-all w-full sm:w-auto"
      >
        <Folder className="w-4 h-4 text-accent" />
        <span className="truncate max-w-[200px]">{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 sm:right-auto sm:min-w-[280px] mt-2 rounded-xl glass border border-border-default shadow-2xl z-50 max-h-64 overflow-y-auto animate-scale-in">
          <button
            onClick={() => { onSelect(null); setOpen(false) }}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors hover:bg-bg-tertiary ${
              !selectedRepo ? 'text-accent bg-accent-muted' : 'text-text-secondary'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span className="flex-1">All Repositories</span>
            {!selectedRepo && <Check className="w-4 h-4 text-accent" />}
          </button>
          {repos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => { onSelect(repo.full_name); setOpen(false) }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors hover:bg-bg-tertiary border-t border-border-default ${
                selectedRepo === repo.full_name ? 'text-accent bg-accent-muted' : 'text-text-secondary'
              }`}
            >
              <Folder className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{repo.full_name}</span>
              {selectedRepo === repo.full_name && <Check className="w-4 h-4 text-accent shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
