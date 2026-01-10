"use client"

import dynamic from "next/dynamic"
import { IntelEvent } from "@/types"

const OutbreakMap = dynamic(() => import("./OutbreakMap"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center bg-surface-1 rounded-lg border border-border h-[500px]">
            <div className="text-muted-foreground animate-pulse">Loading map...</div>
        </div>
    ),
})

interface MapWrapperProps {
    events?: IntelEvent[]
    height?: string
    className?: string
}

export default function MapWrapper({ events, height, className }: MapWrapperProps) {
    return <OutbreakMap events={events} height={height} className={className} />
}
