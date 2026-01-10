"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const STORAGE_KEY = "outbreak-intel-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark")
    const [mounted, setMounted] = useState(false)

    // Load theme on mount
    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
        if (stored) {
            setThemeState(stored)
            document.documentElement.classList.remove("dark", "light")
            document.documentElement.classList.add(stored)
        }
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

    // Prevent flash of wrong theme
    if (!mounted) {
        return null
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
