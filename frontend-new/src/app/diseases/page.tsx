"use client"

import React from "react"
import { GlowCard } from "@/components/ui/glow-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, ShieldCheck, Pill, Thermometer, UserPlus } from "lucide-react"



import { Disease } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function DiseasesPage() {
    const [diseases, setDiseases] = React.useState<Disease[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch("/api/diseases")
            .then(res => res.json())
            .then(d => {
                setDiseases(d)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">Disease Directory</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Encyclopedic database of infectious agents, diagnostic protocolos, and global vaccine status.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search pathogen database..." className="pl-9 bg-surface-1 border-border/50" />
                </div>
                <Button variant="outline" className="border-border/50 gap-2 bg-surface-1">
                    <Filter size={14} /> Faceted Search
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diseases.map((d) => (
                    <GlowCard key={d.id} className="p-0 flex flex-col h-full">
                        <div className="p-6 flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold group-hover:text-intel-cyan transition-colors">{d.name}</h3>
                                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{d.pathogenAgent}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-surface-2 border border-border flex items-center justify-center text-intel-cyan">
                                    <ShieldCheck size={20} />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {d.tags.map(t => (
                                    <Badge key={t} variant="secondary" className="text-[9px] font-bold bg-surface-2 uppercase tracking-tighter">
                                        {t}
                                    </Badge>
                                ))}
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-muted-foreground"><Thermometer size={14} /></div>
                                    <div className="text-xs">
                                        <span className="text-muted-foreground uppercase tracking-widest font-bold">Diagnosis:</span>
                                        <p className="mt-1 font-medium">{d.diagnosticProtocols}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-muted-foreground"><Pill size={14} /></div>
                                    <div className="text-xs">
                                        <span className="text-muted-foreground uppercase tracking-widest font-bold">Vaccine:</span>
                                        <p className="mt-1 font-medium">{d.vaccineStatus}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-border flex justify-between items-center bg-surface-2/50">
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-intel-cyan p-0 h-auto hover:bg-transparent">
                                View Detail Archive
                            </Button>
                            <Button size="sm" className="h-8 gap-2 bg-surface-2 border border-border hover:bg-surface-3 text-xs font-bold">
                                <UserPlus size={14} /> Watch
                            </Button>
                        </div>
                    </GlowCard>
                ))}
            </div>
        </div>
    )
}
