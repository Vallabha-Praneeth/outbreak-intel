import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("alerts")
            .select("*")
            .is("is_read", false)
            .order("created_at", { ascending: false })
            .limit(20)

        if (error) {
            console.error("Supabase alerts error:", error)
            return NextResponse.json([]) // Fail gracefully
        }

        return NextResponse.json(data || [])
    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json([])
    }
}
