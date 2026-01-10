"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import { IntelEvent, Classification } from "@/types"
import { getCountryCoordinates } from "@/lib/country-coords"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Next.js
import L from "leaflet"
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

type OutbreakMarker = {
    id: string
    position: [number, number]
    event: IntelEvent
    classification: Classification
}

const CLASSIFICATION_COLORS: Record<Classification, string> = {
    confirmed_outbreak: "#ef4444", // red
    early_signal: "#f59e0b",       // amber
    research: "#3b82f6",           // blue
}

function Legend() {
    return (
        <div className="absolute bottom-6 left-6 z-[1000] bg-surface-0/90 backdrop-blur-sm border border-border rounded-lg p-3 text-xs">
            <div className="font-semibold mb-2 text-foreground">Classification</div>
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">Confirmed Outbreak</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">Early Signal</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Research</span>
                </div>
            </div>
        </div>
    )
}

function MapController({ markers }: { markers: OutbreakMarker[] }) {
    const map = useMap()

    useEffect(() => {
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(m => m.position))
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 })
        }
    }, [markers, map])

    return null
}

interface OutbreakMapProps {
    events?: IntelEvent[]
    height?: string
    className?: string
}

export default function OutbreakMap({ events, height = "500px", className = "" }: OutbreakMapProps) {
    const [markers, setMarkers] = useState<OutbreakMarker[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchEvents() {
            if (events) {
                processEvents(events)
                return
            }

            try {
                const res = await fetch("/api/events")
                if (!res.ok) {
                    throw new Error("Failed to fetch events")
                }
                const data: IntelEvent[] = await res.json()
                processEvents(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load map data")
            } finally {
                setLoading(false)
            }
        }

        function processEvents(data: IntelEvent[]) {
            const newMarkers: OutbreakMarker[] = []

            data.forEach(event => {
                event.locations.forEach(loc => {
                    const coords = getCountryCoordinates(loc.iso2 || loc.country)
                    if (coords) {
                        // Add slight randomness to prevent overlap
                        const jitter = () => (Math.random() - 0.5) * 2
                        newMarkers.push({
                            id: `${event.id}-${loc.country}`,
                            position: [coords[0] + jitter(), coords[1] + jitter()],
                            event,
                            classification: event.classification,
                        })
                    }
                })
            })

            setMarkers(newMarkers)
            setLoading(false)
        }

        fetchEvents()
    }, [events])

    if (loading) {
        return (
            <div
                className={`flex items-center justify-center bg-surface-1 rounded-lg border border-border ${className}`}
                style={{ height }}
            >
                <div className="text-muted-foreground">Loading map...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-surface-1 rounded-lg border border-border ${className}`}
                style={{ height }}
            >
                <div className="text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className={`relative rounded-lg overflow-hidden border border-border ${className}`} style={{ height }}>
            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapController markers={markers} />

                {markers.map((marker) => (
                    <CircleMarker
                        key={marker.id}
                        center={marker.position}
                        radius={8}
                        fillColor={CLASSIFICATION_COLORS[marker.classification]}
                        fillOpacity={0.7}
                        stroke={true}
                        color="#fff"
                        weight={1}
                    >
                        <Popup>
                            <div className="min-w-[200px] max-w-[300px]">
                                <h3 className="font-semibold text-sm mb-1 text-gray-900">
                                    {marker.event.title}
                                </h3>
                                <div className="text-xs text-gray-600 mb-2">
                                    {marker.event.locations.map(l => l.country).join(", ")}
                                </div>
                                <p className="text-xs text-gray-700 mb-2 line-clamp-3">
                                    {marker.event.summary}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {marker.event.diseases.slice(0, 3).map(d => (
                                        <span
                                            key={d}
                                            className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded"
                                        >
                                            {d}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-[10px] text-gray-500">
                                    <span>Confidence: {Math.round(marker.event.confidence * 100)}%</span>
                                    <span>{new Date(marker.event.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
            <Legend />
        </div>
    )
}
