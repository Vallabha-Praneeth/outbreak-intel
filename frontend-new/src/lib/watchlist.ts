"use client"

export type WatchlistItem = {
    id: string
    type: "disease" | "region"
    name: string
    addedAt: string
}

const STORAGE_KEY = "outbreak-intel-watchlist"

/**
 * Get all watchlist items from localStorage
 */
export function getWatchlist(): WatchlistItem[] {
    if (typeof window === "undefined") return []
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch {
        return []
    }
}

/**
 * Add an item to the watchlist
 */
export function addToWatchlist(type: "disease" | "region", name: string): WatchlistItem[] {
    const watchlist = getWatchlist()
    const id = `${type}-${name.toLowerCase().replace(/\s+/g, "-")}`

    // Check if already exists
    if (watchlist.some(item => item.id === id)) {
        return watchlist
    }

    const newItem: WatchlistItem = {
        id,
        type,
        name,
        addedAt: new Date().toISOString(),
    }

    const updated = [...watchlist, newItem]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
}

/**
 * Remove an item from the watchlist
 */
export function removeFromWatchlist(id: string): WatchlistItem[] {
    const watchlist = getWatchlist()
    const updated = watchlist.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
}

/**
 * Check if an item is in the watchlist
 */
export function isInWatchlist(type: "disease" | "region", name: string): boolean {
    const id = `${type}-${name.toLowerCase().replace(/\s+/g, "-")}`
    return getWatchlist().some(item => item.id === id)
}

/**
 * Clear the entire watchlist
 */
export function clearWatchlist(): void {
    localStorage.removeItem(STORAGE_KEY)
}
