"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
    WatchlistItem,
    getWatchlist,
    addToWatchlist as addItem,
    removeFromWatchlist as removeItem,
    isInWatchlist as checkItem,
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

const WatchlistContext = createContext<WatchlistContextType | null>(null)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

    // Load watchlist on mount
    useEffect(() => {
        setWatchlist(getWatchlist())
    }, [])

    const isWatching = useCallback((type: "disease" | "region", name: string) => {
        return checkItem(type, name)
    }, [])

    const addToWatchlist = useCallback((type: "disease" | "region", name: string) => {
        const updated = addItem(type, name)
        setWatchlist(updated)
    }, [])

    const removeFromWatchlist = useCallback((id: string) => {
        const updated = removeItem(id)
        setWatchlist(updated)
    }, [])

    const clearWatchlist = useCallback(() => {
        clearAll()
        setWatchlist([])
    }, [])

    const diseases = watchlist.filter(item => item.type === "disease")
    const regions = watchlist.filter(item => item.type === "region")

    return (
        <WatchlistContext.Provider
            value={{
                watchlist,
                isWatching,
                addToWatchlist,
                removeFromWatchlist,
                clearWatchlist,
                diseases,
                regions,
            }}
        >
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist() {
    const context = useContext(WatchlistContext)
    if (!context) {
        throw new Error("useWatchlist must be used within a WatchlistProvider")
    }
    return context
}
