import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'

interface ActivityChartProps {
  commitsPerDay: Record<string, number>
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length || !label) return null
  const date = new Date(label)
  return (
    <div className="glass rounded-lg px-3 py-2 border border-border-default">
      <p className="text-xs text-text-muted">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      <p className="text-sm font-semibold text-text-primary">
        {payload[0].value} {payload[0].value === 1 ? 'commit' : 'commits'}
      </p>
    </div>
  )
}

export default function ActivityChart({ commitsPerDay }: ActivityChartProps) {
  const { data, peakDay } = useMemo(() => {
    const entries = Object.entries(commitsPerDay)
      .map(([date, count]) => ({ date, commits: count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const peak = entries.reduce((max, e) => (e.commits > max.commits ? e : max), { date: '', commits: 0 })
    return { data: entries, peakDay: peak }
  }, [commitsPerDay])

  if (data.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-text-muted text-sm">No commit activity to display</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Commit Activity</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#71717a' }}
              tickFormatter={(val: string) => {
                const d = new Date(val)
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#71717a' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#commitGradient)"
            />
            {peakDay.date && (
              <ReferenceDot
                x={peakDay.date}
                y={peakDay.commits}
                r={6}
                fill="#f97316"
                stroke="#f97316"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {peakDay.date && (
        <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-streak" />
          Peak day: {peakDay.commits} commits
        </div>
      )}
    </div>
  )
}
