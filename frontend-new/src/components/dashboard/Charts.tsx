"use client"

import React from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="glass border-border/50 p-3 rounded-lg shadow-2xl">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
                <div className="space-y-1">
                    {payload.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-semibold text-foreground">{item.name}:</span>
                            <span className="text-xs font-mono font-bold text-intel-cyan">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return null
}

export function SignalAreaChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--intel-red)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--intel-red)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEarly" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--intel-amber)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--intel-amber)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="confirmed"
                        name="Confirmed"
                        stroke="var(--intel-red)"
                        fillOpacity={1}
                        fill="url(#colorConfirmed)"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="early"
                        name="Early Signal"
                        stroke="var(--intel-amber)"
                        fillOpacity={1}
                        fill="url(#colorEarly)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function SourceDonutChart({ data }: { data: any[] }) {
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
