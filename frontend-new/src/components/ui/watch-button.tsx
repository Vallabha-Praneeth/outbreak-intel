"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "./button"
import { useWatchlist } from "@/contexts/WatchlistContext"
import { cn } from "@/lib/utils"

interface WatchButtonProps {
    type: "disease" | "region"
    name: string
    variant?: "icon" | "full"
    className?: string
}

export function WatchButton({ type, name, variant = "icon", className }: WatchButtonProps) {
    const { isWatching, addToWatchlist, removeFromWatchlist } = useWatchlist()
    const [watching, setWatching] = useState(false)

    useEffect(() => {
        setWatching(isWatching(type, name))
    }, [isWatching, type, name])

    const handleToggle = () => {
        if (watching) {
            const id = `${type}-${name.toLowerCase().replace(/\s+/g, "-")}`
            removeFromWatchlist(id)
            setWatching(false)
        } else {
            addToWatchlist(type, name)
            setWatching(true)
        }
    }

    if (variant === "icon") {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className={cn(
                    "h-8 w-8 p-0",
                    watching ? "text-intel-cyan" : "text-muted-foreground hover:text-foreground",
                    className
                )}
                title={watching ? "Remove from watchlist" : "Add to watchlist"}
            >
                {watching ? <Eye size={16} /> : <EyeOff size={16} />}
            </Button>
        )
    }

    return (
        <Button
            variant={watching ? "default" : "outline"}
            size="sm"
            onClick={handleToggle}
            className={cn(
                "gap-2",
                watching
                    ? "bg-intel-cyan text-surface-0 hover:bg-intel-cyan/90"
                    : "border-border/50",
                className
            )}
        >
            {watching ? <Eye size={14} /> : <EyeOff size={14} />}
            {watching ? "Watching" : "Watch"}
        </Button>
    )
}
