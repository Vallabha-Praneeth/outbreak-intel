import { NextResponse } from "next/server"
import { DashboardStats } from "@/types"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        // Fetch KPI counts in parallel
        const [signalsRes, diseasesRes, locationsRes] = await Promise.all([
            supabase.from("normalized_events").select("*", { count: "exact", head: true }),
            supabase.from("diseases").select("*", { count: "exact", head: true }),
            supabase.from("location_mentions").select("country", { count: "exact", head: false })
        ])

        const activeSignals = signalsRes.count || 0
        const diseasesTracked = diseasesRes.count || 0

        // Count unique countries
        const uniqueCountries = new Set((locationsRes.data || []).map(l => l.country))
        const locationsAffected = uniqueCountries.size || 0

        const stats: DashboardStats = {
            activeSignals,
            diseasesTracked,
            locationsAffected,
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
    } catch (err) {
        console.error("Internal Server Error:", err)
        // Return default mock stats on error
        return NextResponse.json({
            activeSignals: 100,
            diseasesTracked: 24,
            locationsAffected: 42,
            systemHealth: "99.2%",
            signalTrend: [],
            sourceDistribution: []
        })
    }
}
