"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const defaultContext: ThemeContextType = {
    theme: "dark",
    toggleTheme: () => {},
    setTheme: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultContext)

const STORAGE_KEY = "outbreak-intel-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark")
    const [mounted, setMounted] = useState(false)

    // Load theme on mount and apply dark class initially
    useEffect(() => {
        // Apply dark class by default on initial load
        if (!document.documentElement.classList.contains("dark") &&
            !document.documentElement.classList.contains("light")) {
            document.documentElement.classList.add("dark")
        }

        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
        if (stored) {
            setThemeState(stored)
            document.documentElement.classList.remove("dark", "light")
            document.documentElement.classList.add(stored)
        }
        setMounted(true)
    }, [])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem(STORAGE_KEY, newTheme)
        document.documentElement.classList.remove("dark", "light")
        document.documentElement.classList.add(newTheme)
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    // Always render children, but provide default theme until mounted
    const value = mounted
        ? { theme, toggleTheme, setTheme }
        : { theme: "dark" as Theme, toggleTheme: () => {}, setTheme: () => {} }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
