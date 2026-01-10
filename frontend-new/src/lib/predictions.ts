/**
 * Predictive Analytics for Outbreak Intelligence
 * Simple statistical models for outbreak prediction and risk assessment
 */

export type RiskLevel = "low" | "moderate" | "high" | "critical"

export type OutbreakPrediction = {
    id: string
    disease: string
    region: string
    currentCases: number
    predictedCases7d: number
    predictedCases30d: number
    riskLevel: RiskLevel
    confidence: number
    trend: "increasing" | "stable" | "decreasing"
    factors: string[]
    lastUpdated: string
}

export type RegionalRisk = {
    region: string
    iso2: string
    overallRisk: RiskLevel
    riskScore: number
    activeDiseases: string[]
    predictions: OutbreakPrediction[]
}

export type TrendAnalysis = {
    disease: string
    period: "7d" | "30d" | "90d"
    dataPoints: { date: string; cases: number }[]
    growthRate: number
    r0Estimate: number
    peakPrediction: string | null
}

// Calculate risk level based on score
function getRiskLevel(score: number): RiskLevel {
    if (score >= 80) return "critical"
    if (score >= 60) return "high"
    if (score >= 40) return "moderate"
    return "low"
}

// Generate mock predictions (in production, this would use ML models)
export function generatePredictions(): OutbreakPrediction[] {
    return [
        {
            id: "pred-001",
            disease: "Influenza A (H3N2)",
            region: "Northern Hemisphere",
            currentCases: 45000,
            predictedCases7d: 52000,
            predictedCases30d: 78000,
            riskLevel: "high",
            confidence: 0.85,
            trend: "increasing",
            factors: ["Seasonal peak approaching", "Low vaccination coverage", "New variant detected"],
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "pred-002",
            disease: "Dengue Fever",
            region: "Southeast Asia",
            currentCases: 12500,
            predictedCases7d: 14200,
            predictedCases30d: 18500,
            riskLevel: "moderate",
            confidence: 0.78,
            trend: "increasing",
            factors: ["Monsoon season", "Urban population density", "Vector breeding conditions"],
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "pred-003",
            disease: "Cholera",
            region: "Sub-Saharan Africa",
            currentCases: 8900,
            predictedCases7d: 7800,
            predictedCases30d: 5500,
            riskLevel: "moderate",
            confidence: 0.72,
            trend: "decreasing",
            factors: ["Dry season beginning", "Improved water access", "Vaccination campaigns"],
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "pred-004",
            disease: "Mpox",
            region: "Central Africa",
            currentCases: 2100,
            predictedCases7d: 2800,
            predictedCases30d: 4200,
            riskLevel: "high",
            confidence: 0.68,
            trend: "increasing",
            factors: ["New clade variant", "Limited healthcare access", "Cross-border movement"],
            lastUpdated: new Date().toISOString(),
        },
        {
            id: "pred-005",
            disease: "Measles",
            region: "South Asia",
            currentCases: 15600,
            predictedCases7d: 15400,
            predictedCases30d: 14800,
            riskLevel: "low",
            confidence: 0.82,
            trend: "stable",
            factors: ["Vaccination campaigns active", "Endemic baseline", "School closures"],
            lastUpdated: new Date().toISOString(),
        },
    ]
}

// Generate regional risk assessments
export function generateRegionalRisks(): RegionalRisk[] {
    const predictions = generatePredictions()

    return [
        {
            region: "Southeast Asia",
            iso2: "TH",
            overallRisk: "high",
            riskScore: 72,
            activeDiseases: ["Dengue", "Avian Influenza", "Chikungunya"],
            predictions: predictions.filter(p => p.region.includes("Southeast") || p.region.includes("Asia")),
        },
        {
            region: "Sub-Saharan Africa",
            iso2: "KE",
            overallRisk: "high",
            riskScore: 68,
            activeDiseases: ["Cholera", "Mpox", "Marburg"],
            predictions: predictions.filter(p => p.region.includes("Africa")),
        },
        {
            region: "South America",
            iso2: "BR",
            overallRisk: "moderate",
            riskScore: 55,
            activeDiseases: ["Dengue", "Yellow Fever", "Chikungunya"],
            predictions: [],
        },
        {
            region: "Europe",
            iso2: "DE",
            overallRisk: "low",
            riskScore: 28,
            activeDiseases: ["Influenza", "COVID-19"],
            predictions: predictions.filter(p => p.region.includes("Northern")),
        },
        {
            region: "North America",
            iso2: "US",
            overallRisk: "low",
            riskScore: 32,
            activeDiseases: ["Influenza", "RSV"],
            predictions: predictions.filter(p => p.region.includes("Northern")),
        },
    ]
}

// Generate trend analysis data
export function generateTrendAnalysis(disease: string): TrendAnalysis {
    const now = Date.now()
    const dataPoints = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now - (29 - i) * 86400000)
        const baseValue = 1000 + Math.sin(i / 5) * 200
        const noise = Math.random() * 100 - 50
        return {
            date: date.toISOString().split("T")[0],
            cases: Math.round(baseValue + noise + i * 10),
        }
    })

    return {
        disease,
        period: "30d",
        dataPoints,
        growthRate: 0.15,
        r0Estimate: 1.8,
        peakPrediction: new Date(now + 14 * 86400000).toISOString().split("T")[0],
    }
}

// Risk color mapping
export const RISK_COLORS: Record<RiskLevel, string> = {
    low: "#22c55e",
    moderate: "#f59e0b",
    high: "#ef4444",
    critical: "#dc2626",
}

export const RISK_BG_COLORS: Record<RiskLevel, string> = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    moderate: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    high: "bg-red-500/10 text-red-500 border-red-500/30",
    critical: "bg-red-600/20 text-red-400 border-red-600/30",
}
