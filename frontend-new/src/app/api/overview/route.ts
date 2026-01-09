import { NextResponse } from "next/server"
import { DashboardStats } from "@/types"

export async function GET() {
    const stats: DashboardStats = {
        activeSignals: 100,
        diseasesTracked: 24,
        locationsAffected: 42,
        systemHealth: "99.2%",
        signalTrend: [
            { name: "01 Jan", confirmed: 12, early: 45 },
            { name: "02 Jan", confirmed: 15, early: 52 },
            { name: "03 Jan", confirmed: 18, early: 48 },
            { name: "04 Jan", confirmed: 14, early: 61 },
            { name: "05 Jan", confirmed: 22, early: 55 },
            { name: "06 Jan", confirmed: 25, early: 72 },
            { name: "07 Jan", confirmed: 21, early: 68 },
        ],
        sourceDistribution: [
            { name: "Tier 1", value: 65, color: "var(--intel-cyan)" },
            { name: "Tier 2", value: 25, color: "var(--intel-amber)" },
            { name: "Tier 3", value: 10, color: "var(--intel-slate)" },
        ]
    }

    return NextResponse.json(stats)
}
