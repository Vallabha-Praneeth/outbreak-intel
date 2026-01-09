import { NextResponse } from "next/server"
import { PipelineRun } from "@/types"

const MOCK_PIPELINE_RUNS: PipelineRun[] = [
    { id: "RUN-001", sourceName: "WHO DONs API", startTime: new Date().toISOString(), status: "success", eventsFetched: 42 },
    { id: "RUN-002", sourceName: "CDC Emergency Feed", startTime: new Date().toISOString(), status: "success", eventsFetched: 15 },
    { id: "RUN-003", sourceName: "X Signal Aggregator", startTime: new Date().toISOString(), status: "failure", eventsFetched: 0, errorLog: "Rate limit exceeded" }
]

export async function GET() {
    return NextResponse.json({
        uptime: "99.98%",
        latency: "42ms",
        lag: "12s",
        storage: "1.4TB",
        runs: MOCK_PIPELINE_RUNS
    })
}
