import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
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
            <div className="flex h-64 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
                <p className="text-[var(--color-text-muted)]">No commit data available</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        Activity Overview
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Commits per day over time
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-glow)] px-3 py-1.5">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <span className="text-xs font-medium text-[var(--color-accent)]">
                        {chartData.reduce((s, d) => s + d.commits, 0)} total
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="displayDate"
                        stroke="var(--color-text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        stroke="var(--color-text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '13px',
                            color: 'var(--color-text-primary)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                        labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '4px' }}
                        itemStyle={{ color: 'var(--color-accent)' }}
                        cursor={{ stroke: 'var(--color-accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="url(#commitGradient)"
                        dot={false}
                        activeDot={{
                            r: 5,
                            fill: '#8b5cf6',
                            stroke: '#0a0a0f',
                            strokeWidth: 2,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
