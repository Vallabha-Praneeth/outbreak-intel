"use client"

import { useWatchlist } from "@/contexts/WatchlistContext"
import { GlowCard } from "@/components/ui/glow-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, AlertCircle, Globe, Activity } from "lucide-react"

export default function WatchlistPage() {
    const { watchlist, diseases, regions, removeFromWatchlist, clearWatchlist } = useWatchlist()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold intel-text-gradient tracking-tight">My Watchlist</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Track specific diseases and regions to get priority alerts and filtered views.
                    </p>
                </div>
                {watchlist.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearWatchlist}
                        className="h-10 gap-2 border-red-500/30 text-red-500 hover:bg-red-500/10"
                    >
                        <Trash2 size={14} /> Clear All
                    </Button>
                )}
            </div>

            {watchlist.length === 0 ? (
                <GlowCard className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-muted/20">
                            <Eye size={32} className="text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">No items in watchlist</h3>
                            <p className="text-muted-foreground text-sm max-w-md">
                                Add diseases or regions to your watchlist from the Diseases page or Events page to track them here.
                            </p>
                        </div>
                    </div>
                </GlowCard>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Diseases Section */}
                    <GlowCard className="p-0">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-intel-red/10">
                                    <Activity size={18} className="text-intel-red" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Diseases</h3>
                                    <p className="text-xs text-muted-foreground">{diseases.length} tracked</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-intel-red/30 text-intel-red">
                                {diseases.length}
                            </Badge>
                        </div>
                        <div className="divide-y divide-border">
                            {diseases.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground text-sm">
                                    No diseases tracked yet
                                </div>
                            ) : (
                                diseases.map(item => (
                                    <div
                                        key={item.id}
                                        className="p-4 flex items-center justify-between hover:bg-surface-1 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-intel-red" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.addedAt).toLocaleDateString()}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFromWatchlist(item.id)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlowCard>

                    {/* Regions Section */}
                    <GlowCard className="p-0">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-intel-cyan/10">
                                    <Globe size={18} className="text-intel-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Regions</h3>
                                    <p className="text-xs text-muted-foreground">{regions.length} tracked</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-intel-cyan/30 text-intel-cyan">
                                {regions.length}
                            </Badge>
                        </div>
                        <div className="divide-y divide-border">
                            {regions.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground text-sm">
                                    No regions tracked yet
                                </div>
                            ) : (
                                regions.map(item => (
                                    <div
                                        key={item.id}
                                        className="p-4 flex items-center justify-between hover:bg-surface-1 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-intel-cyan" />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.addedAt).toLocaleDateString()}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFromWatchlist(item.id)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlowCard>
                </div>
            )}

            {/* Info Card */}
            <GlowCard className="p-6 bg-gradient-to-r from-intel-amber/5 to-transparent border-intel-amber/20">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-intel-amber/10">
                        <AlertCircle size={18} className="text-intel-amber" />
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">How Watchlists Work</h4>
                        <p className="text-sm text-muted-foreground">
                            Items in your watchlist will be highlighted in the Events feed and you'll receive
                            priority notifications when new signals match your tracked diseases or regions.
                            Your watchlist is stored locally in your browser.
                        </p>
                    </div>
                </div>
            </GlowCard>
        </div>
    )
}
