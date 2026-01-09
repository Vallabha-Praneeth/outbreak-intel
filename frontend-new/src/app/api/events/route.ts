import { NextResponse } from "next/server"
import { MOCK_EVENTS } from "@/lib/mock-data/events"
import { supabase } from "@/lib/supabase"
import { IntelEvent } from "@/types"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const classification = searchParams.get("classification")

    try {
        let query = supabase
            .from("normalized_events")
            .select(`
                *,
                locations:location_mentions(country, region, city, iso2),
                diseases:disease_mentions(disease_name),
                assessments:outbreak_assessments(assessment_text)
            `)
            .order("published_at", { ascending: false })

        if (classification) {
            query = query.eq("classification", classification)
        }

        const { data, error } = await query

        if (error) {
            console.error("Supabase error:", error)
            throw error
        }

        if (!data || data.length === 0) {
            // Return empty list if no data, don't fallback to mock if we want transparency
            // But for now, returning empty allows us to see if it works
            return NextResponse.json([])
        }

        // Map database fields to frontend types
        const formattedEvents: IntelEvent[] = data.map(event => ({
            id: event.id,
            title: event.title,
            summary: event.summary,
            publishedAt: event.published_at,
            sourceName: "WHO DONs", // Default for now as it is not in normalized_events
            sourceTier: event.source_tier,
            sourceUrl: "https://www.who.int/emergencies/disease-outbreak-news", // Fallback
            confidence: event.confidence_score, // Note: field is confidence_score
            classification: event.signal_classification as any, // Note: field is signal_classification
            diseases: event.diseases.map((d: any) => d.disease_name),
            locations: event.locations,
            caseCount: 0, // Not currently stored in normalized_events? Wait, it is in 'outbreak_assessments'
            deathCount: 0,
            assessmentText: event.assessments?.[0]?.assessment_text || "No assessment available.",
            tags: []
        }))

        return NextResponse.json(formattedEvents)
    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json([])

    }
}
