import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot,
} from 'recharts';
import { Zap } from 'lucide-react';

interface ActivityChartProps {
    commitsPerDay: Record<string, number>;
}

export default function ActivityChart({ commitsPerDay }: ActivityChartProps) {
    const { chartData, peakDay } = useMemo(() => {
        const entries = Object.entries(commitsPerDay)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({
                date,
                commits: count,
                displayDate: new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
            }));

        let peak = entries[0] || null;
        for (const e of entries) {
            if (peak && e.commits > peak.commits) peak = e;
        }

        return { chartData: entries, peakDay: peak };
    }, [commitsPerDay]);

    if (chartData.length === 0) {
        return (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                <p className="text-sm text-[var(--color-text-muted)]">No commit data available</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 h-full">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Activity Overview
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                        Commits per day
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {peakDay && (
                        <div className="flex items-center gap-1.5 rounded-md bg-orange-500/10 px-2.5 py-1">
                            <Zap className="h-3 w-3 text-orange-400" />
                            <span className="text-[11px] font-medium text-orange-400">
                                Peak: {peakDay.commits} on {peakDay.displayDate}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-accent-glow)] px-2.5 py-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        <span className="text-[11px] font-medium text-[var(--color-accent)]">
                            {chartData.reduce((s, d) => s + d.commits, 0)} total
                        </span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="commitGradFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="displayDate"
                        stroke="var(--color-text-muted)"
                        fontSize={10}
                        fontFamily="var(--font-mono)"
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        stroke="var(--color-text-muted)"
                        fontSize={10}
                        fontFamily="var(--font-mono)"
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#111118',
                            border: '1px solid var(--color-border)',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            fontSize: '12px',
                            color: 'var(--color-text-primary)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                        labelStyle={{ color: 'var(--color-text-muted)', fontSize: '11px', marginBottom: '4px' }}
                        itemStyle={{ color: 'var(--color-accent)' }}
                        cursor={{ stroke: 'var(--color-border-hover)', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        fill="url(#commitGradFill)"
                        dot={false}
                        activeDot={{
                            r: 5,
                            fill: 'var(--color-accent)',
                            stroke: 'var(--color-bg-card)',
                            strokeWidth: 2,
                        }}
                        animationDuration={1200}
                        animationEasing="ease-out"
                    />
                    {/* Peak marker */}
                    {peakDay && (
                        <ReferenceDot
                            x={peakDay.displayDate}
                            y={peakDay.commits}
                            r={6}
                            fill="#f97316"
                            stroke="var(--color-bg-card)"
                            strokeWidth={2}
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
