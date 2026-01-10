"use client"

import { WatchlistProvider } from "@/contexts/WatchlistContext"
import { ThemeProvider } from "@/contexts/ThemeContext"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <WatchlistProvider>
                {children}
            </WatchlistProvider>
        </ThemeProvider>
    )
}
