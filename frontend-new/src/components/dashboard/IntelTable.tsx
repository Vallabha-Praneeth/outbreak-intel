"use client"

import * as React from "react"
import {
    Search,
    Settings2,
    ChevronDown,
    Filter,
    Layers,
    Maximize2,
    ExternalLink,
    Info,
    Activity,
    Globe
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { IntelEvent } from "@/lib/mock-data/events"

interface IntelTableProps {
    data: IntelEvent[]
}

export function IntelTable({ data }: IntelTableProps) {
    const [density, setDensity] = React.useState<"comfortable" | "compact">("comfortable")
    const [search, setSearch] = React.useState("")

    const filteredData = data.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.diseases.some(d => d.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-4">
            {/* Table Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events, diseases..."
                        className="pl-9 bg-surface-1 border-border/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 gap-2 border-border/50 bg-surface-1">
                                <Layers size={14} />
                                Density: {density === "comfortable" ? "Comfortable" : "Compact"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 glass">
                            <DropdownMenuLabel>Table Density</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={density} onValueChange={(v: any) => setDensity(v)}>
                                <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="sm" className="h-10 gap-2 border-border/50 bg-surface-1">
                        <Filter size={14} />
                        Filters
                    </Button>

                    <Button variant="outline" size="sm" className="h-10 gap-2 border-border/50 bg-surface-1">
                        <Settings2 size={14} />
                        Columns
                    </Button>
                </div>
            </div>

            {/* Table Container */}
            <div className="rounded-xl border border-border/50 bg-surface-1 overflow-hidden">
                <div className="relative overflow-x-auto max-h-[600px]">
                    <Table className="relative w-full border-collapse">
                        <TableHeader className="sticky top-0 z-20 bg-surface-2 border-b border-border shadow-sm">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[400px] text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4">Event Signal</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classification</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confidence</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source Tier</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground pr-6">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((event) => (
                                <TableRow
                                    key={event.id}
                                    className={cn(
                                        "group cursor-pointer hover:bg-surface-2 transition-colors border-border/30",
                                        density === "compact" ? "h-10" : "h-16"
                                    )}
                                >
                                    <TableCell className="py-2 pl-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight group-hover:text-intel-cyan transition-colors truncate max-w-[350px]">
                                                {event.title}
                                            </span>
                                            {density === "comfortable" && (
                                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                                                    <Activity size={12} className="text-intel-cyan" /> {event.diseases[0]}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            event.classification === "confirmed_outbreak" ? "border-intel-red/30 text-intel-red bg-intel-red/5" :
                                                event.classification === "early_signal" ? "border-intel-amber/30 text-intel-amber bg-intel-amber/5" :
                                                    "border-slate-500/30 text-slate-400 bg-slate-400/5"
                                        )}>
                                            {event.classification.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-12 bg-surface-2 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        event.confidence > 0.8 ? "bg-emerald-500" : event.confidence > 0.5 ? "bg-intel-amber" : "bg-intel-red"
                                                    )}
                                                    style={{ width: `${event.confidence * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono font-bold">{(event.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Globe size={12} /> {event.locations[0].country}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-surface-2 text-muted-foreground border-border/50 text-[10px] font-bold">
                                            TIER {event.sourceTier}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        {new Date(event.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
