import { NextResponse } from "next/server"
import {
    getDataSources,
    fetchCDCOutbreaks,
    fetchProMEDAlerts,
    fetchWHOAlerts,
} from "@/lib/data-sources"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const source = searchParams.get("source")

        // If specific source requested, return that source's data
        if (source) {
            switch (source) {
                case "cdc":
                    const cdcData = await fetchCDCOutbreaks()
                    return NextResponse.json(cdcData)
                case "promed":
                    const promedData = await fetchProMEDAlerts()
                    return NextResponse.json(promedData)
                case "who":
                    const whoData = await fetchWHOAlerts()
                    return NextResponse.json(whoData)
                default:
                    return NextResponse.json(
                        { error: "Unknown data source" },
                        { status: 400 }
                    )
            }
        }

        // Return all data sources status
        const sources = getDataSources()
        return NextResponse.json(sources)
    } catch (error) {
        console.error("Data sources API error:", error)
        return NextResponse.json(
            { error: "Failed to fetch data sources" },
            { status: 500 }
        )
    }
}
