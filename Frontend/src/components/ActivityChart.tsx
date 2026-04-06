import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ActivityChartProps {
    commitsPerDay: Record<string, number>;
}

export default function ActivityChart({ commitsPerDay }: ActivityChartProps) {
    const chartData = useMemo(() => {
        return Object.entries(commitsPerDay)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({
                date,
                commits: count,
                displayDate: new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
            }));
    }, [commitsPerDay]);

    if (chartData.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                <p className="text-sm text-[var(--color-text-muted)]">No commit data available</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Activity Overview
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                        Commits per day
                    </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-[var(--color-accent-glow)] px-2.5 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-[11px] font-medium text-[var(--color-accent)]">
                        {chartData.reduce((s, d) => s + d.commits, 0)} total
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
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
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: 'var(--color-text-primary)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                        }}
                        labelStyle={{ color: 'var(--color-text-muted)', fontSize: '11px' }}
                        itemStyle={{ color: 'var(--color-accent)' }}
                        cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="var(--color-accent)"
                        strokeWidth={1.5}
                        fill="url(#commitGrad)"
                        dot={false}
                        activeDot={{
                            r: 4,
                            fill: 'var(--color-accent)',
                            stroke: 'var(--color-bg-card)',
                            strokeWidth: 2,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
