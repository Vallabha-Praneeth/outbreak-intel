"use client"

import * as React from "react"
import { Search, Bell, RefreshCw, Calendar, Command as CommandIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CommandPalette } from "./CommandPalette"

export function Topbar() {
    const [time, setTime] = React.useState<string>("")
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    React.useEffect(() => {
        setTime(new Date().toLocaleTimeString())
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 2000)
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface-0/80 backdrop-blur-md px-6">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center justify-between w-full h-10 pl-9 pr-3 py-2 rounded-lg bg-surface-1 border border-border text-sm text-muted-foreground hover:border-border/30 transition-colors cursor-pointer relative">
                        <span>Search intel, diseases, events...</span>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-surface-2 text-[10px] font-mono group-hover:bg-surface-3 transition-colors">
                            <CommandIcon size={10} />
                            <span>K</span>
                        </div>
                        <CommandPalette />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-muted-foreground mr-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-1 border border-border">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>SYSTEM ONLINE</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-1 border border-border">
                        <Calendar size={12} />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="w-20 font-mono text-center">{time}</div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-2 hidden sm:flex h-9 border border-border hover:bg-surface-1"
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
                        Last Sync: 2m ago
                    </Button>

                    <div className="relative">
                        <Button variant="ghost" size="icon" className="h-9 w-9 border border-border hover:bg-surface-1 relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-intel-red" />
                        </Button>
                    </div>

                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-intel-cyan to-blue-600 border border-border p-[1px]">
                        <div className="w-full h-full rounded-full bg-surface-0 flex items-center justify-center font-bold text-xs">
                            JD
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
