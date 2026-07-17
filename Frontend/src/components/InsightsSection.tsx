import { useMemo } from 'react'
import { TrendingUp, Clock, Zap, Calendar } from 'lucide-react'

interface InsightsSectionProps {
  commitsPerDay: Record<string, number>
  streak: number
}

function getWeekdayVsWeekend(commitsPerDay: Record<string, number>) {
  let weekday = 0, weekend = 0
  for (const [date, count] of Object.entries(commitsPerDay)) {
    const day = new Date(date).getDay()
    if (day === 0 || day === 6) weekend += count
    else weekday += count
  }
  const weekdayDays = Math.max(1, Object.keys(commitsPerDay).length * 5 / 7)
  const weekendDays = Math.max(1, Object.keys(commitsPerDay).length * 2 / 7)
  return {
    weekdayAvg: (weekday / weekdayDays).toFixed(1),
    weekendAvg: (weekend / weekendDays).toFixed(1),
    preference: weekday > weekend ? 'Weekdays' : weekend > weekday ? 'Weekends' : 'Balanced',
  }
}

function getMostProductiveDay(commitsPerDay: Record<string, number>) {
  const dayTotals: Record<string, number> = {}
  const dayCounts: Record<string, number> = {}
  for (const [date, count] of Object.entries(commitsPerDay)) {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
    dayTotals[dayName] = (dayTotals[dayName] || 0) + count
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1
  }
  let best = { day: '-', avg: 0 }
  for (const [day, total] of Object.entries(dayTotals)) {
    const avg = total / (dayCounts[day] || 1)
    if (avg > best.avg) best = { day, avg }
  }
  return { day: best.day, avg: best.avg.toFixed(1) }
}

export default function InsightsSection({ commitsPerDay, streak }: InsightsSectionProps) {
  const insights = useMemo(() => {
    const weekdayWeekend = getWeekdayVsWeekend(commitsPerDay)
    const productiveDay = getMostProductiveDay(commitsPerDay)
    const totalDays = Object.keys(commitsPerDay).length
    return { weekdayWeekend, productiveDay, totalDays }
  }, [commitsPerDay])

  const items = [
    {
      icon: TrendingUp,
      label: 'Work Pattern',
      value: insights.weekdayWeekend.preference,
      detail: `Weekday avg: ${insights.weekdayWeekend.weekdayAvg} | Weekend avg: ${insights.weekdayWeekend.weekendAvg}`,
      color: 'text-accent',
      bg: 'bg-accent-muted',
    },
    {
      icon: Clock,
      label: 'Most Productive Day',
      value: insights.productiveDay.day,
      detail: `Average ${insights.productiveDay.avg} commits per ${insights.productiveDay.day.toLowerCase()}`,
      color: 'text-streak',
      bg: 'bg-streak-muted',
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: `${streak} day${streak !== 1 ? 's' : ''}`,
      detail: streak > 0 ? 'Keep the momentum going!' : 'Start coding today!',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      icon: Calendar,
      label: 'Total Active Days',
      value: insights.totalDays.toString(),
      detail: `${insights.totalDays > 0 ? 'Great consistency' : 'No data yet'}`,
      color: 'text-success',
      bg: 'bg-success-muted',
    },
  ]

  return (
    <div className="glass rounded-xl p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-bg-primary/50 border border-border-default">
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-text-muted">{item.label}</p>
                <p className="text-sm font-semibold text-text-primary truncate">{item.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
