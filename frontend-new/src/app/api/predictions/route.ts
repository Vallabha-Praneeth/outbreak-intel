import { NextResponse } from "next/server"
import {
    generatePredictions,
    generateRegionalRisks,
    generateTrendAnalysis,
} from "@/lib/predictions"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type")
        const disease = searchParams.get("disease")

        switch (type) {
            case "regional":
                return NextResponse.json(generateRegionalRisks())
            case "trend":
                if (!disease) {
                    return NextResponse.json(
                        { error: "Disease parameter required for trend analysis" },
                        { status: 400 }
                    )
                }
                return NextResponse.json(generateTrendAnalysis(disease))
            default:
                return NextResponse.json(generatePredictions())
        }
    } catch (error) {
        console.error("Predictions API error:", error)
        return NextResponse.json(
            { error: "Failed to generate predictions" },
            { status: 500 }
        )
    }
}
