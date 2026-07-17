import { Flame, TrendingUp, TrendingDown } from 'lucide-react'

function getStreakColor(streak: number) {
  if (streak === 0) return 'from-zinc-600 to-zinc-700'
  if (streak <= 3) return 'from-red-500 to-orange-500'
  if (streak <= 6) return 'from-orange-500 to-amber-500'
  if (streak <= 13) return 'from-amber-500 to-yellow-400'
  return 'from-yellow-400 to-emerald-400'
}

function getStreakLabel(streak: number) {
  if (streak === 0) return 'Start your streak today!'
  if (streak <= 3) return 'Getting started'
  if (streak <= 6) return 'Building momentum'
  if (streak <= 13) return 'On fire'
  return 'Unstoppable'
}

export default function StreakHero({ streak }: { streak: number }) {
  const gradient = getStreakColor(streak)
  const label = getStreakLabel(streak)
  const isActive = streak > 0

  return (
    <div className="relative overflow-hidden rounded-2xl bg-bg-card border border-border-default p-6 sm:p-8">
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      </div>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center ${isActive ? 'animate-pulse-glow' : ''}`}>
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <div className="flex-1">
          <p className="text-sm text-text-muted font-medium uppercase tracking-wider mb-1">Current Streak</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text-streak">
              {streak}
            </span>
            <span className="text-lg sm:text-xl text-text-secondary font-medium">
              {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">{label}</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-glass border border-border-default">
          {isActive ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-danger" />
          )}
          <span className={`text-sm font-medium ${isActive ? 'text-success' : 'text-danger'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  )
}
