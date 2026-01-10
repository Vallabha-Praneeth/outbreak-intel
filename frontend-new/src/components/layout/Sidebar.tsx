"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Activity,
    Database,
    BarChart3,
    ShieldAlert,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Monitor,
    Eye,
    Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Activity, label: "Events", href: "/events" },
    { icon: Database, label: "Diseases", href: "/diseases" },
    { icon: Eye, label: "Watchlist", href: "/watchlist" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Brain, label: "Predictions", href: "/predictions" },
    { icon: Monitor, label: "Data Sources", href: "/data-sources" },
    { icon: ShieldAlert, label: "System Health", href: "/health" },
    { icon: Bell, label: "Alerts", href: "/alerts" },
]

export function Sidebar() {
    const [collapsed, setCollapsed] = React.useState(false)
    const pathname = usePathname()

    return (
        <aside className={cn(
            "relative border-r border-border bg-surface-1 transition-all duration-300 flex flex-col",
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="flex h-16 items-center border-b border-border px-4">
                <Link href="/" className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-intel-cyan text-surface-0">
                        <ShieldAlert size={20} />
                    </div>
                    {!collapsed && (
                        <span className="font-bold tracking-tight text-xl intel-text-gradient truncate">
                            OUTBREAK INTEL
                        </span>
                    )}
                </Link>
            </div>

            <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative group",
                            pathname === item.href
                                ? "bg-intel-cyan/10 text-intel-cyan"
                                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                        )}
                    >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.label}</span>}
                        {pathname === item.href && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-intel-cyan rounded-r-full" />
                        )}
                        {collapsed && (
                            <div className="absolute left-14 rounded-md px-2 py-1 bg-surface-2 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                {item.label}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-2 border-t border-border">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                    )}
                >
                    <Settings size={20} />
                    {!collapsed && <span>Settings</span>}
                </Link>
                <div className="mt-4 px-3 py-2">
                    {!collapsed && (
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
                                Version 2.4.0
                            </p>
                            <p className="text-[10px] text-muted-foreground/40 font-medium">
                                Powered by QuantumOps Private Limited
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 top-20 h-8 w-8 rounded-full border border-border bg-surface-1 shadow-md hover:bg-surface-2 z-50"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>
        </aside>
    )
}
