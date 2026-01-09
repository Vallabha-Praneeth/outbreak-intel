import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export function GlowCard({ children, className, ...props }: GlowCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "relative overflow-hidden bg-surface-1 border-border/50 transition-all duration-300 hover:border-intel-cyan/30 hover:shadow-[0_0_20px_-10px_var(--intel-cyan)] group rounded-xl",
                className
            )}
            {...(props as any)}
        >
            <div className="relative z-10">{children}</div>
            <div className="absolute inset-0 bg-gradient-to-br from-intel-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    )
}

interface MetricCardProps {
    label: string
    value: string | number
    delta?: number
    deltaLabel?: string
    icon: LucideIcon
    description?: string
    className?: string
    trend?: "up" | "down" | "neutral"
}

export function MetricCard({
    label,
    value,
    delta,
    deltaLabel,
    icon: Icon,
    description,
    className,
    trend = "neutral"
}: MetricCardProps) {
    const isPositive = trend === "up" ? delta && delta > 0 : delta && delta < 0

    return (
        <GlowCard className={cn("p-6", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {label}
                    </p>
                    <h3 className="text-3xl font-bold intel-text-gradient tracking-tight">
                        {value}
                    </h3>
                </div>
                <div className="h-10 w-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-intel-cyan">
                    <Icon size={20} />
                </div>
            </div>

            {(delta !== undefined || description) && (
                <div className="mt-4 flex items-center gap-2">
                    {delta !== undefined && (
                        <div className={cn(
                            "flex items-center text-xs font-bold px-1.5 py-0.5 rounded",
                            trend === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-intel-red bg-intel-red/10"
                        )}>
                            {trend === "up" ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                            {Math.abs(delta)}%
                        </div>
                    )}
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                        {deltaLabel || (delta !== undefined ? "vs last period" : "")}
                    </span>
                    {description && !delta && (
                        <span className="text-xs text-muted-foreground italic">
                            {description}
                        </span>
                    )}
                </div>
            )}

            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-intel-cyan/10 group-hover:bg-intel-cyan/30 transition-colors" />
        </GlowCard>
    )
}
