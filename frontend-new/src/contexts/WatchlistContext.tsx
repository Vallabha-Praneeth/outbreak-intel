"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
    WatchlistItem,
    getWatchlist,
    addToWatchlist as addItem,
    removeFromWatchlist as removeItem,
    clearWatchlist as clearAll,
} from "@/lib/watchlist"

type WatchlistContextType = {
    watchlist: WatchlistItem[]
    isWatching: (type: "disease" | "region", name: string) => boolean
    addToWatchlist: (type: "disease" | "region", name: string) => void
    removeFromWatchlist: (id: string) => void
    clearWatchlist: () => void
    diseases: WatchlistItem[]
    regions: WatchlistItem[]
}

const defaultContext: WatchlistContextType = {
    watchlist: [],
    isWatching: () => false,
    addToWatchlist: () => {},
    removeFromWatchlist: () => {},
    clearWatchlist: () => {},
    diseases: [],
    regions: [],
}

const WatchlistContext = createContext<WatchlistContextType>(defaultContext)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [mounted, setMounted] = useState(false)

    // Load watchlist on mount
    useEffect(() => {
        setWatchlist(getWatchlist())
        setMounted(true)
    }, [])

    // Check if item is watched using state (not localStorage directly)
    const isWatching = useCallback((type: "disease" | "region", name: string) => {
        const id = `${type}-${name.toLowerCase().replace(/\s+/g, "-")}`
        return watchlist.some(item => item.id === id)
    }, [watchlist])

    const addToWatchlist = useCallback((type: "disease" | "region", name: string) => {
        if (typeof window === "undefined") return
        const updated = addItem(type, name)
        setWatchlist(updated)
    }, [])

    const removeFromWatchlist = useCallback((id: string) => {
        if (typeof window === "undefined") return
        const updated = removeItem(id)
        setWatchlist(updated)
    }, [])

    const clearWatchlist = useCallback(() => {
        if (typeof window === "undefined") return
        clearAll()
        setWatchlist([])
    }, [])

    const diseases = watchlist.filter(item => item.type === "disease")
    const regions = watchlist.filter(item => item.type === "region")

    const value = mounted
        ? {
            watchlist,
            isWatching,
            addToWatchlist,
            removeFromWatchlist,
            clearWatchlist,
            diseases,
            regions,
        }
        : defaultContext

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist() {
    return useContext(WatchlistContext)
}
