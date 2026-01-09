"use client"

import React from "react"
import { IntelTable } from "@/components/dashboard/IntelTable"
import { Button } from "@/components/ui/button"
import { Download, Share2, Filter, Plus } from "lucide-react"
import { IntelEvent } from "@/types"

export default function EventsPage() {
    const [events, setEvents] = React.useState<IntelEvent[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch("/api/events")
            .then(res => res.json())
            .then(d => {
                setEvents(d)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">Intelligence Events</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Detailed log of all detected signals, normalized and classified by Tier 1 and Tier 2 source validation.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-10 gap-2 border-border/50 bg-surface-1">
                        <Download size={14} /> Export CSV
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 gap-2 border-border/50 bg-surface-1">
                        <Share2 size={14} /> Share View
                    </Button>
                    <Button className="h-10 gap-2 bg-intel-cyan text-surface-0 font-bold hover:bg-intel-cyan/90">
                        <Plus size={16} /> New signal
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 border-b border-border pb-px">
                <Button variant="ghost" className="h-10 rounded-none border-b-2 border-intel-cyan font-bold text-intel-cyan text-xs uppercase tracking-widest">
                    Active Signals
                </Button>
                <Button variant="ghost" className="h-10 rounded-none border-b-2 border-transparent text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest font-bold">
                    Archived
                </Button>
                <Button variant="ghost" className="h-10 rounded-none border-b-2 border-transparent text-muted-foreground hover:text-foreground text-xs uppercase tracking-widest font-bold">
                    False Positives
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Loading events...</div>
            ) : (
                <IntelTable data={events} />
            )}
        </div>
    )
}
