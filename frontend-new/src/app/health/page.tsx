"use client"

import React from "react"
import { GlowCard } from "@/components/ui/glow-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, ShieldCheck, Database, Zap, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function SystemHealthPage() {
    const [data, setData] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch("/api/health")
            .then(res => res.json())
            .then(d => {
                setData(d)
                setLoading(false)
            })
    }, [])

    if (loading || !data) {
        return (
            <div className="space-y-8 p-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">System Health & Pipeline</h2>
                <p className="text-muted-foreground max-w-2xl">
                    Real-time monitoring of ingestion workers, data normalization pipelines, and source reliability SLAs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlowCard className="p-6 text-center">
                    <CheckCircle2 size={32} className="mx-auto mb-4 text-emerald-500" />
                    <div className="text-3xl font-bold">{data.uptime}</div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Uptime SLA</p>
                </GlowCard>
                <GlowCard className="p-6 text-center">
                    <Zap size={32} className="mx-auto mb-4 text-intel-cyan" />
                    <div className="text-3xl font-bold">{data.latency}</div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Avg Transformation</p>
                </GlowCard>
                <GlowCard className="p-6 text-center">
                    <Clock size={32} className="mx-auto mb-4 text-intel-amber" />
                    <div className="text-3xl font-bold">{data.lag}</div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Max Ingestion Lag</p>
                </GlowCard>
                <GlowCard className="p-6 text-center">
                    <Database size={32} className="mx-auto mb-4 text-purple-500" />
                    <div className="text-3xl font-bold">{data.storage}</div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Storage Utilized</p>
                </GlowCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlowCard className="p-6">
                    <h3 className="text-lg font-bold mb-6">Pipeline Status</h3>
                    <div className="space-y-6">
                        {[
                            { source: "WHO DONs API", status: "Operational", health: 100, lastRun: "2m ago" },
                            { source: "CDC Emergency Feed", status: "Operational", health: 98, lastRun: "14m ago" },
                            { source: "X Signal Aggregator", status: "Degraded", health: 72, lastRun: "1m ago" },
                            { source: "ECDC Weekly Snapshot", status: "Operational", health: 100, lastRun: "4d ago" },
                        ].map(s => (
                            <div key={s.source} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{s.source}</span>
                                        <Badge variant="outline" className={cn(
                                            "text-[8px] h-4",
                                            s.status === "Operational" ? "text-emerald-500 border-emerald-500/30" : "text-intel-amber border-intel-amber/30"
                                        )}>{s.status}</Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{s.lastRun}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-1 flex-1 bg-surface-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-intel-cyan" style={{ width: `${s.health}%` }} />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{s.health}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlowCard>

                <GlowCard className="p-0">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-bold">Recent Pipeline Runs</h3>
                    </div>
                    <div className="divide-y divide-border">
                        {data.runs.map((l: any) => (
                            <div key={l.id} className="p-4 flex gap-4 items-start hover:bg-surface-2 transition-colors">
                                <span className="text-[10px] font-mono text-muted-foreground pt-0.5">{new Date(l.startTime).toLocaleTimeString()}</span>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{l.id}</span>
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            l.status === "failure" ? "bg-intel-red" : l.status === "running" ? "bg-intel-amber" : "bg-emerald-500"
                                        )} />
                                    </div>
                                    <p className="text-xs font-medium">{l.sourceName}: {l.status === "success" ? `Fetched ${l.eventsFetched} events` : l.errorLog}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlowCard>
            </div>
        </div>
    )
}
