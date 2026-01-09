import { NextResponse } from "next/server"
import { MOCK_EVENTS } from "@/lib/mock-data/events"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const classification = searchParams.get("classification")

    let events = [...MOCK_EVENTS]

    if (classification) {
        events = events.filter(e => e.classification === classification)
    }

    return NextResponse.json(events)
}
