import { GitCommit, Calendar, Target, Star } from 'lucide-react'

interface MetricCardsProps {
  totalCommits: number
  commitsPerDay: Record<string, number>
}

function getBestDay(commitsPerDay: Record<string, number>) {
  const days = Object.entries(commitsPerDay)
  if (days.length === 0) return { day: '-', count: 0 }
  const best = days.reduce((a, b) => (b[1] > a[1] ? b : a))
  const date = new Date(best[0])
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    count: best[1],
  }
}

function getConsistency(commitsPerDay: Record<string, number>) {
  const days = Object.keys(commitsPerDay).length
  if (days === 0) return 0
  const total = Object.values(commitsPerDay).reduce((a, b) => a + b, 0)
  const avg = total / days
  const variance = Object.values(commitsPerDay).reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / days
  const stddev = Math.sqrt(variance)
  const cv = avg > 0 ? stddev / avg : 1
  return Math.round(Math.max(0, Math.min(100, (1 - cv) * 100)))
}

export default function MetricCards({ totalCommits, commitsPerDay }: MetricCardsProps) {
  const activeDays = Object.keys(commitsPerDay).length
  const consistency = getConsistency(commitsPerDay)
  const bestDay = getBestDay(commitsPerDay)

  const metrics = [
    {
      icon: GitCommit,
      label: 'Total Commits',
      value: totalCommits.toLocaleString(),
      color: 'text-accent',
      bg: 'bg-accent-muted',
    },
    {
      icon: Calendar,
      label: 'Active Days',
      value: activeDays.toString(),
      color: 'text-success',
      bg: 'bg-success-muted',
    },
    {
      icon: Target,
      label: 'Consistency',
      value: `${consistency}%`,
      color: 'text-streak',
      bg: 'bg-streak-muted',
    },
    {
      icon: Star,
      label: 'Best Day',
      value: bestDay.count.toString(),
      sub: bestDay.day,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon
        return (
          <div
            key={m.label}
            className={`glass rounded-xl p-4 sm:p-5 animate-fade-in stagger-${i + 1} opacity-0`}
          >
            <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">{m.value}</p>
            {m.sub && <p className="text-xs text-text-muted mt-1">{m.sub}</p>}
          </div>
        )
      })}
    </div>
  )
}
