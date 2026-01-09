"use client"

import React from "react"
import { GlowCard } from "@/components/ui/glow-card"
import { MetricCard } from "@/components/ui/glow-card"
import { SignalAreaChart } from "@/components/dashboard/Charts"
import {
    BarChart3,
    TrendingUp,
    AlertTriangle,
    Globe2,
    ArrowUpRight,
    Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const trendData = [
    { name: "Week 1", confirmed: 40, early: 120 },
    { name: "Week 2", confirmed: 55, early: 150 },
    { name: "Week 3", confirmed: 70, early: 140 },
    { name: "Week 4", confirmed: 120, early: 210 },
]

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">Predictive Analytics</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Long-term trend analysis, anomaly detection, and pathogen propagation modeling.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-border/50 bg-surface-1">
                        <Filter size={14} className="mr-2" /> Global Filter
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlowCard className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Signal Propagation (All Regions)</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">Confirmed vs Early Signals (30D)</p>
                        </div>
                    </div>
                    <SignalAreaChart data={trendData} />
                </GlowCard>

                <div className="space-y-6">
                    <GlowCard className="p-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Top Rising Locations</h3>
                        <div className="space-y-4">
                            {[
                                { country: "DRC", signals: 124, change: 82 },
                                { country: "India", signals: 85, change: 15 },
                                { country: "Brazil", signals: 72, change: -4 },
                            ].map(l => (
                                <div key={l.country} className="flex items-center justify-between">
                                    <span className="text-sm font-bold">{l.country}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-muted-foreground">{l.signals} Signals</span>
                                        <span className={cn("text-xs font-bold", l.change > 0 ? "text-emerald-500" : "text-intel-red")}>
                                            {l.change > 0 ? "+" : ""}{l.change}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlowCard>

                    <GlowCard className="p-6 bg-intel-amber/5 border-intel-amber/20">
                        <div className="flex items-center gap-2 text-intel-amber mb-2">
                            <AlertTriangle size={18} />
                            <h4 className="text-sm font-bold uppercase tracking-widest">Anomaly Detected</h4>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            214% spike in "Undiagnosed Respiratory" mentions in South Asia cluster.
                        </p>
                        <Button variant="outline" size="sm" className="w-full mt-4 border-intel-amber/30 text-intel-amber hover:bg-intel-amber/10">
                            Run Deep Scan
                        </Button>
                    </GlowCard>
                </div>
            </div>
        </div>
    )
}
