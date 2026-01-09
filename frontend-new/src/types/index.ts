export type Classification = "confirmed_outbreak" | "early_signal" | "research"

export interface IntelEvent {
    id: string
    title: string
    summary: string
    publishedAt: string
    sourceName: string
    sourceTier: 1 | 2 | 3
    sourceUrl: string
    confidence: number
    classification: Classification
    diseases: string[]
    locations: {
        country: string
        region?: string
        city?: string
        iso2?: string
    }[]
    caseCount?: number
    deathCount?: number
    assessmentText: string
    tags: string[]
}

export interface Disease {
    id: string
    name: string
    pathogenAgent: string
    diagnosticProtocols: string
    symptoms: string
    treatment: string
    vaccineStatus: string
    classificationReason: string
    severityScore: number
    caseCount: number
    deathCount: number
    tags: string[]
}

export interface PipelineRun {
    id: string
    sourceName: string
    startTime: string
    endTime?: string
    status: "success" | "failure" | "running"
    eventsFetched: number
    errorLog?: string
}

export interface DashboardStats {
    activeSignals: number
    diseasesTracked: number
    locationsAffected: number
    systemHealth: string
    signalTrend: { name: string; confirmed: number; early: number }[]
    sourceDistribution: { name: string; value: number; color: string }[]
}
