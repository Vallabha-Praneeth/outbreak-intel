"use client"

import React from "react"
import { GlowCard } from "@/components/ui/glow-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    TrendingUp,
    TrendingDown,
    Minus,
    AlertTriangle,
    Brain,
    Target,
    Activity,
    MapPin,
    Calendar,
    BarChart3,
} from "lucide-react"
import { OutbreakPrediction, RegionalRisk, RISK_BG_COLORS } from "@/lib/predictions"

const TREND_ICONS = {
    increasing: TrendingUp,
    stable: Minus,
    decreasing: TrendingDown,
}

const TREND_COLORS = {
    increasing: "text-red-500",
    stable: "text-amber-500",
    decreasing: "text-emerald-500",
}

export default function PredictionsPage() {
    const [predictions, setPredictions] = React.useState<OutbreakPrediction[]>([])
    const [regionalRisks, setRegionalRisks] = React.useState<RegionalRisk[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        Promise.all([
            fetch("/api/predictions").then((r) => r.json()),
            fetch("/api/predictions?type=regional").then((r) => r.json()),
        ])
            .then(([preds, risks]) => {
                setPredictions(preds)
                setRegionalRisks(risks)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    const highRiskCount = predictions.filter(
        (p) => p.riskLevel === "high" || p.riskLevel === "critical"
    ).length
    const avgConfidence = Math.round(
        (predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length) * 100
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">
                        Predictive Analytics
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                        AI-powered outbreak forecasting and risk assessment using epidemiological models and real-time surveillance data.
                    </p>
                </div>
                <Badge variant="outline" className="gap-2 px-3 py-1.5 border-intel-cyan/30">
                    <Brain size={14} className="text-intel-cyan" />
                    <span className="text-xs">Models updated hourly</span>
                </Badge>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlowCard className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10">
                            <AlertTriangle size={24} className="text-red-500" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{highRiskCount}</div>
                            <div className="text-sm text-muted-foreground">High Risk Predictions</div>
                        </div>
                    </div>
                </GlowCard>

                <GlowCard className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-intel-cyan/10">
                            <Target size={24} className="text-intel-cyan" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{avgConfidence}%</div>
                            <div className="text-sm text-muted-foreground">Avg Model Confidence</div>
                        </div>
                    </div>
                </GlowCard>

                <GlowCard className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-intel-amber/10">
                            <Activity size={24} className="text-intel-amber" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{predictions.length}</div>
                            <div className="text-sm text-muted-foreground">Active Forecasts</div>
                        </div>
                    </div>
                </GlowCard>
            </div>

            {/* Regional Risk Overview */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-intel-cyan" />
                    Regional Risk Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {regionalRisks.map((risk) => (
                        <GlowCard key={risk.region} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="font-bold text-sm">{risk.region}</div>
                                <Badge
                                    variant="outline"
                                    className={RISK_BG_COLORS[risk.overallRisk]}
                                >
                                    {risk.overallRisk.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Risk Score</span>
                                    <span className="font-mono font-bold">{risk.riskScore}/100</span>
                                </div>
                                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            risk.riskScore >= 60
                                                ? "bg-red-500"
                                                : risk.riskScore >= 40
                                                ? "bg-amber-500"
                                                : "bg-emerald-500"
                                        }`}
                                        style={{ width: `${risk.riskScore}%` }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {risk.activeDiseases.slice(0, 2).map((d) => (
                                        <span
                                            key={d}
                                            className="text-[9px] px-1.5 py-0.5 bg-surface-2 rounded"
                                        >
                                            {d}
                                        </span>
                                    ))}
                                    {risk.activeDiseases.length > 2 && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-surface-2 rounded">
                                            +{risk.activeDiseases.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </GlowCard>
                    ))}
                </div>
            </div>

            {/* Outbreak Predictions */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-intel-cyan" />
                    Outbreak Forecasts
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {predictions.map((pred) => {
                        const TrendIcon = TREND_ICONS[pred.trend]
                        const change7d = Math.round(
                            ((pred.predictedCases7d - pred.currentCases) / pred.currentCases) * 100
                        )
                        const change30d = Math.round(
                            ((pred.predictedCases30d - pred.currentCases) / pred.currentCases) * 100
                        )

                        return (
                            <GlowCard key={pred.id} className="p-0">
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg">{pred.disease}</h4>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <MapPin size={10} />
                                                {pred.region}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendIcon
                                                size={16}
                                                className={TREND_COLORS[pred.trend]}
                                            />
                                            <Badge
                                                variant="outline"
                                                className={RISK_BG_COLORS[pred.riskLevel]}
                                            >
                                                {pred.riskLevel.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-surface-1 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">Current</div>
                                            <div className="text-xl font-bold">
                                                {pred.currentCases.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-surface-1 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">7-Day</div>
                                            <div className="text-xl font-bold">
                                                {pred.predictedCases7d.toLocaleString()}
                                            </div>
                                            <div
                                                className={`text-xs ${
                                                    change7d > 0 ? "text-red-500" : "text-emerald-500"
                                                }`}
                                            >
                                                {change7d > 0 ? "+" : ""}
                                                {change7d}%
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-surface-1 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">30-Day</div>
                                            <div className="text-xl font-bold">
                                                {pred.predictedCases30d.toLocaleString()}
                                            </div>
                                            <div
                                                className={`text-xs ${
                                                    change30d > 0 ? "text-red-500" : "text-emerald-500"
                                                }`}
                                            >
                                                {change30d > 0 ? "+" : ""}
                                                {change30d}%
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">
                                            Contributing Factors
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {pred.factors.map((factor, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="text-[10px] bg-surface-2"
                                                >
                                                    {factor}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-border flex justify-between items-center bg-surface-2/50">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar size={12} />
                                        Updated {new Date(pred.lastUpdated).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Confidence:</span>
                                        <span className="text-xs font-bold text-intel-cyan">
                                            {Math.round(pred.confidence * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </GlowCard>
                        )
                    })}
                </div>
            </div>

            {/* Info Card */}
            <GlowCard className="p-6 bg-gradient-to-r from-purple-500/5 to-transparent border-purple-500/20">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <Brain size={18} className="text-purple-500" />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">About Predictive Models</h4>
                        <p className="text-sm text-muted-foreground">
                            Our predictive analytics use ensemble machine learning models combining SEIR epidemiological
                            modeling with real-time surveillance data. Predictions are updated hourly and factor in
                            seasonality, population density, healthcare capacity, and historical outbreak patterns.
                            Model confidence scores indicate prediction reliability based on data quality and historical accuracy.
                        </p>
                    </div>
                </div>
            </GlowCard>
        </div>
    )
}
