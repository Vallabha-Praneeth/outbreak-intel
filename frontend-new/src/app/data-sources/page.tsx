"use client"

import React from "react"
import { GlowCard } from "@/components/ui/glow-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Database,
    RefreshCw,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Rss,
    Globe,
    Building2,
} from "lucide-react"
import { DataSource } from "@/lib/data-sources"

const SOURCE_ICONS: Record<string, React.ReactNode> = {
    cdc: <Building2 size={20} />,
    promed: <Rss size={20} />,
    who: <Globe size={20} />,
    gphin: <Database size={20} />,
    ecdc: <Building2 size={20} />,
}

const STATUS_CONFIG = {
    active: { color: "bg-emerald-500", icon: CheckCircle2, label: "Active" },
    inactive: { color: "bg-slate-500", icon: XCircle, label: "Inactive" },
    error: { color: "bg-red-500", icon: AlertCircle, label: "Error" },
}

export default function DataSourcesPage() {
    const [sources, setSources] = React.useState<DataSource[]>([])
    const [loading, setLoading] = React.useState(true)
    const [syncing, setSyncing] = React.useState<string | null>(null)

    React.useEffect(() => {
        fetch("/api/data-sources")
            .then((res) => res.json())
            .then((data) => {
                setSources(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const handleSync = async (sourceId: string) => {
        setSyncing(sourceId)
        // Simulate sync
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setSources((prev) =>
            prev.map((s) =>
                s.id === sourceId
                    ? { ...s, lastSync: new Date().toISOString() }
                    : s
            )
        )
        setSyncing(null)
    }

    const formatLastSync = (date: string | null) => {
        if (!date) return "Never"
        const diff = Date.now() - new Date(date).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    const activeSources = sources.filter((s) => s.status === "active").length
    const totalRecords = sources.reduce((acc, s) => acc + s.recordCount, 0)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">
                        Data Sources
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Real-time integrations with global health surveillance networks including CDC, ProMED, WHO, and regional health authorities.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-surface-1 rounded-lg border border-border">
                        <div className="text-2xl font-bold text-intel-cyan">{activeSources}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Active Sources</div>
                    </div>
                    <div className="px-4 py-2 bg-surface-1 rounded-lg border border-border">
                        <div className="text-2xl font-bold text-intel-amber">{totalRecords.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Records</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sources.map((source) => {
                    const statusConfig = STATUS_CONFIG[source.status]
                    const StatusIcon = statusConfig.icon

                    return (
                        <GlowCard key={source.id} className="p-0">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-surface-2 text-intel-cyan">
                                            {SOURCE_ICONS[source.id] || <Database size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{source.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {source.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`gap-1 ${
                                            source.status === "active"
                                                ? "border-emerald-500/30 text-emerald-500"
                                                : source.status === "error"
                                                ? "border-red-500/30 text-red-500"
                                                : "border-slate-500/30 text-slate-500"
                                        }`}
                                    >
                                        <StatusIcon size={12} />
                                        {statusConfig.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                            Type
                                        </div>
                                        <div className="text-sm font-medium uppercase">{source.type}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                            Last Sync
                                        </div>
                                        <div className="text-sm font-medium">
                                            {formatLastSync(source.lastSync)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                            Records
                                        </div>
                                        <div className="text-sm font-medium">
                                            {source.recordCount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border flex justify-between items-center bg-surface-2/50">
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                                >
                                    <ExternalLink size={12} />
                                    {source.url.replace(/^https?:\/\//, "").split("/")[0]}
                                </a>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSync(source.id)}
                                    disabled={source.status !== "active" || syncing === source.id}
                                    className="gap-2"
                                >
                                    <RefreshCw
                                        size={14}
                                        className={syncing === source.id ? "animate-spin" : ""}
                                    />
                                    {syncing === source.id ? "Syncing..." : "Sync Now"}
                                </Button>
                            </div>
                        </GlowCard>
                    )
                })}
            </div>

            <GlowCard className="p-6 bg-gradient-to-r from-intel-cyan/5 to-transparent border-intel-cyan/20">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-intel-cyan/10">
                        <Database size={18} className="text-intel-cyan" />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">About Data Sources</h4>
                        <p className="text-sm text-muted-foreground">
                            Outbreak Intel aggregates data from multiple authoritative health surveillance networks.
                            Data is synchronized at regular intervals and cross-referenced to provide comprehensive
                            outbreak intelligence. CDC and WHO sources are updated every 15 minutes, while ProMED
                            alerts are processed in real-time via RSS feeds.
                        </p>
                    </div>
                </div>
            </GlowCard>
        </div>
    )
}
