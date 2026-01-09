import { NextResponse } from "next/server"
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
    const rateLimit = checkRateLimit(clientId, 'alerts')
    if (!rateLimit.allowed) {
        return rateLimit.response
    }

    try {
        const { data, error } = await supabase
            .from("alerts")
            .select("*")
            .is("is_read", false)
            .order("created_at", { ascending: false })
            .limit(20)

        if (error) {
            console.error("Supabase alerts error:", error)
            return NextResponse.json(
                { error: "Failed to fetch alerts", message: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(data || [], {
            headers: getCacheHeaders(CACHE_CONFIG.alerts)
        })
    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json(
            { error: "Failed to fetch alerts", message: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        )
    }
}
