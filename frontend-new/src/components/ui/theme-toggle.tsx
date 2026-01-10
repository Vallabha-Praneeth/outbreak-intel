"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "./button"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
                "h-9 w-9 border border-border hover:bg-surface-1",
                className
            )}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
            {theme === "dark" ? (
                <Sun size={18} className="text-intel-amber" />
            ) : (
                <Moon size={18} className="text-intel-slate" />
            )}
        </Button>
    )
}
