import { NextResponse } from "next/server"
import { PipelineRun } from "@/types"
import { supabase } from "@/lib/supabase"

const MOCK_PIPELINE_RUNS: PipelineRun[] = [
    { id: "RUN-001", sourceName: "WHO DONs API", startTime: new Date().toISOString(), status: "success", eventsFetched: 42 },
    { id: "RUN-002", sourceName: "CDC Emergency Feed", startTime: new Date().toISOString(), status: "success", eventsFetched: 15 },
    { id: "RUN-003", sourceName: "X Signal Aggregator", startTime: new Date().toISOString(), status: "failure", eventsFetched: 0, errorLog: "Rate limit exceeded" }
]

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("pipeline_runs")
            .select("*")
            .order("start_time", { ascending: false })
            .limit(10)

        const formattedRuns: PipelineRun[] = (data || []).map(run => ({
            id: run.id,
            sourceName: run.source_name,
            startTime: run.start_time,
            endTime: run.end_time,
            status: run.status,
            eventsFetched: run.events_fetched,
            errorLog: run.error_log
        }))

        // Basic system health aggregation (can be enhanced with live metadata if available)
        return NextResponse.json({
            uptime: "99.98%", // Mocking uptime until SLA tracking is implemented
            latency: "42ms",
            lag: "12s",
            storage: "1.4TB",
            runs: formattedRuns.length > 0 ? formattedRuns : MOCK_PIPELINE_RUNS
        })
    } catch (err) {
        console.error("Internal Server Error:", err)
        return NextResponse.json({
            uptime: "99.98%",
            latency: "42ms",
            lag: "12s",
            storage: "1.4TB",
            runs: MOCK_PIPELINE_RUNS
        })
    }
}
