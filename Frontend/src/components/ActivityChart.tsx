import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { motion } from 'framer-motion';

interface ActivityChartProps {
    commitsPerDay: Record<string, number>;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-2.5 shadow-xl">
            <p className="text-[11px] font-medium text-[var(--color-text-muted)]">{label}</p>
            <p className="text-sm font-bold font-[var(--font-mono)] text-[var(--color-accent-hover)]">
                {payload[0].value} commits
            </p>
        </div>
    );
}

export default function ActivityChart({ commitsPerDay }: ActivityChartProps) {
    const { data, peakDay, totalCommits } = useMemo(() => {
        const entries = Object.entries(commitsPerDay)
            .map(([date, count]) => ({ date: formatDate(date), rawDate: date, commits: count }))
            .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());

        const peak = entries.reduce((max, e) => e.commits > max.commits ? e : max, entries[0]);
        const total = entries.reduce((sum, e) => sum + e.commits, 0);

        return { data: entries, peakDay: peak, totalCommits: total };
    }, [commitsPerDay]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 sm:p-6"
        >
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Activity</h3>
                <div className="flex items-center gap-3 text-[11px]">
                    {peakDay && (
                        <span className="flex items-center gap-1 rounded-lg bg-orange-500/10 px-2 py-1 text-orange-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                            Peak: {peakDay.commits}
                        </span>
                    )}
                    <span className="flex items-center gap-1 rounded-lg bg-[var(--color-accent-subtle)] px-2 py-1 text-[var(--color-accent-hover)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        {totalCommits} total
                    </span>
                </div>
            </div>

            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="commits"
                            stroke="var(--color-accent)"
                            strokeWidth={2}
                            fill="url(#chartGrad)"
                            animationDuration={1200}
                            animationEasing="ease-out"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--color-accent)', fill: 'var(--color-bg-card)' }}
                        />
                        {peakDay && (
                            <ReferenceDot
                                x={peakDay.date}
                                y={peakDay.commits}
                                r={5}
                                fill="#f97316"
                                stroke="var(--color-bg-card)"
                                strokeWidth={2}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-[220px] items-center justify-center text-sm text-[var(--color-text-muted)]">
                    No commit data available
                </div>
            )}
        </motion.div>
    );
}
