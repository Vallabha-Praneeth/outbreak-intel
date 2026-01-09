import { NextResponse } from "next/server"
import { Disease } from "@/types"
import { supabase } from "@/lib/supabase"
import { requireAuth } from "@/lib/api-auth"
import { CACHE_CONFIG, getCacheHeaders } from "@/lib/cache"
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit"

const MOCK_DISEASES: Disease[] = [
    {
        id: "1",
        name: "Ebola Virus Disease",
        pathogenAgent: "Ebolavirus",
        diagnosticProtocols: "RT-PCR, ELISA",
        symptoms: "Fever, headache, muscle pain, bleeding",
        treatment: "Supportive care, Monoclonal antibodies",
        vaccineStatus: "Ervebo (rVSV-ZEBOV)",
        classificationReason: "Official WHO database",
        severityScore: 9.5,
        caseCount: 34500,
        deathCount: 15300,
        tags: ["Viral Hemorrhagic Fever", "P6"]
    },
    {
        id: "2",
        name: "Cholera",
        pathogenAgent: "Vibrio cholerae",
        diagnosticProtocols: "Stool culture, Rapid test",
        symptoms: "Watery diarrhea, vomiting, dehydration",
        treatment: "ORS, IV fluids, Antibiotics",
        vaccineStatus: "Oral Cholera Vaccine (OCV)",
        classificationReason: "Endemic surveillance",
        severityScore: 6.2,
        caseCount: 450000,
        deathCount: 2200,
        tags: ["Waterborne", "Bacterial"]
    },
    {
        id: "3",
        name: "Mpox",
        pathogenAgent: "Mpox virus",
        diagnosticProtocols: "PCR (skin lesion swap)",
        symptoms: "Rash, fever, swollen lymph nodes",
        treatment: "Tecovirimat",
        vaccineStatus: "JYNNEOS / MVA-BN",
        classificationReason: "Global outbreak status",
        severityScore: 4.8,
        caseCount: 92000,
        deathCount: 170,
        tags: ["Zoonotic", "Orthopoxvirus"]
    }
]

export async function GET(request: Request) {
    // Verify authentication
    const auth = await requireAuth()
    if (!auth.authenticated) {
        return auth.response
    }

    // Check rate limit
    const clientId = getClientIdentifier(request, auth.userId)
    const rateLimit = checkRateLimit(clientId, 'diseases')
    if (!rateLimit.allowed) {
        return rateLimit.response
    }

    try {
        const { data, error } = await supabase
            .from("diseases")
            .select("*")
            .order("name", { ascending: true })

        if (error) {
            console.error("Supabase error:", error)
            throw error
        }

        if (!data) return NextResponse.json([])

        const formattedDiseases: Disease[] = data.map(d => ({
            id: d.id,
            name: d.name,
            pathogenAgent: d.pathogen_agent,
            diagnosticProtocols: d.diagnostic_protocols,
            symptoms: d.symptoms,
            treatment: d.treatment,
            vaccineStatus: d.vaccine_status,
            classificationReason: d.classification_reason,
            severityScore: d.severity_score,
            caseCount: d.case_count,
            deathCount: d.death_count,
            tags: d.tags || []
        }))

        return NextResponse.json(formattedDiseases, {
            headers: getCacheHeaders(CACHE_CONFIG.diseases)
        })
    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json(
            { error: "Failed to fetch diseases", message: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        )
    }
}
