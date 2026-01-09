"use client"

import React from "react"
import {
  Activity,
  Globe,
  ShieldAlert,
  Zap,
  ArrowRight,
  ExternalLink,
  MoreVertical
} from "lucide-react"
import { MetricCard, GlowCard } from "@/components/ui/glow-card"
import { SignalAreaChart, SourceDonutChart } from "@/components/dashboard/Charts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { DashboardStats, IntelEvent } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function OverviewPage() {
  const [data, setData] = React.useState<DashboardStats | null>(null)
  const [loading, setLoading] = React.useState(true)


  const [events, setEvents] = React.useState<IntelEvent[]>([])

  React.useEffect(() => {
    // Parallel fetch for stats and events
    Promise.all([
      fetch("/api/overview").then(res => res.json()),
      fetch("/api/events").then(res => res.json())
    ]).then(([statsData, eventsData]) => {
      setData(statsData)
      setEvents(eventsData.slice(0, 5))
      setLoading(false)
    }).catch(err => {
      console.error("Failed to fetch dashboard data:", err)
      setLoading(false)
    })
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">Intelligence Overview</h2>
        <p className="text-muted-foreground max-w-2xl">
          Real-time global health monitoring and predictive signal analysis for emerging pathogens.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Signals"
          value={data.activeSignals}
          delta={12}
          icon={Activity}
          trend="up"
        />
        <MetricCard
          label="Diseases Tracked"
          value={data.diseasesTracked}
          delta={2}
          icon={ShieldAlert}
          trend="up"
        />
        <MetricCard
          label="Locations Affected"
          value={data.locationsAffected}
          delta={-5}
          icon={Globe}
          trend="down"
        />
        <MetricCard
          label="System Health"
          value={data.systemHealth}
          description="Operational"
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <GlowCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Signals Over Time</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">Confirmed vs Early Signals (7D)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-intel-red" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-intel-amber" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Early</span>
              </div>
            </div>
          </div>
          <SignalAreaChart data={data.signalTrend} />
        </GlowCard>

        {/* Source Distribution */}
        <GlowCard className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-bold">Intelligence Sources</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">By Source Tier Reliability</p>
          </div>
          <SourceDonutChart data={data.sourceDistribution} />
          <div className="mt-8 space-y-4">
            {data.sourceDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Recent Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <GlowCard className="p-0">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Recent Intelligence Feed</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">Latest normalized signals</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-intel-cyan">
              View All <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {events.map((event) => (
              <div key={event.id} className="p-4 hover:bg-surface-2 transition-colors cursor-pointer group flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={cn(
                    "mt-1 h-2 w-2 rounded-full shrink-0",
                    event.classification === "confirmed_outbreak" ? "bg-intel-red shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-intel-amber shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  )} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold group-hover:text-intel-cyan transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] items-center flex gap-1 font-bold text-muted-foreground uppercase tracking-widest">
                        <Globe size={10} /> {event.locations[0].country}
                      </span>
                      <span className="text-[10px] items-center flex gap-1 font-bold text-muted-foreground uppercase tracking-widest">
                        <Activity size={10} /> {event.diseases[0]}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Tier {event.sourceTier} • {new Date(event.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  event.classification === "confirmed_outbreak" ? "border-intel-red text-intel-red bg-intel-red/5" : "border-intel-amber text-intel-amber bg-intel-amber/5"
                )}>
                  {event.classification.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* System & Analytics Extras */}
        <div className="space-y-6">
          <GlowCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Top Rising Diseases</h3>
              <Badge className="bg-intel-cyan/10 text-intel-cyan border-intel-cyan/20">7D TREND</Badge>
            </div>
            <div className="space-y-6">
              {[
                { name: "Avian Influenza (H5N1)", increase: 124, signals: 12, color: "var(--intel-red)" },
                { name: "Cholera", increase: 85, signals: 45, color: "var(--intel-amber)" },
                { name: "Mpox", increase: 42, signals: 28, color: "var(--intel-cyan)" },
              ].map((d) => (
                <div key={d.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-foreground">{d.name}</span>
                    <span className="text-intel-cyan">+{d.increase}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, (d.increase / 150) * 100)}%`,
                        backgroundColor: d.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard className="p-6 flex items-center justify-between bg-gradient-to-r from-intel-cyan/10 to-transparent">
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Critical Signal Alert</h3>
              <p className="text-sm text-intel-cyan font-medium">H7N9 Vector Mutation detected in South China</p>
              <p className="text-xs text-muted-foreground mt-2">Recommended: Escalation to Level 2 Investigation</p>
            </div>
            <Button className="bg-intel-cyan text-surface-0 font-bold hover:bg-intel-cyan/90">
              INVESTIGATE
            </Button>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
