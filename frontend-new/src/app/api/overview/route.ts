import { NextResponse } from "next/server"
import { DashboardStats } from "@/types"
import { supabase } from "@/lib/supabase"
import { requireAuth } from "@/lib/api-auth"
import { CACHE_CONFIG, getCacheHeaders } from "@/lib/cache"
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit"

export async function GET(request: Request) {
    // Verify authentication
    const auth = await requireAuth()
    if (!auth.authenticated) {
        return auth.response
    }

    // Check rate limit
    const clientId = getClientIdentifier(request, auth.userId)
    const rateLimit = checkRateLimit(clientId, 'overview')
    if (!rateLimit.allowed) {
        return rateLimit.response
    }

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

        return NextResponse.json(stats, {
            headers: getCacheHeaders(CACHE_CONFIG.overview)
        })
    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json(
            { error: "Failed to fetch overview stats", message: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        )
    }
}
