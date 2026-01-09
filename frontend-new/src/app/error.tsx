"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="p-4 rounded-full bg-red-500/10 mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
                Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md">
                An unexpected error occurred. Our team has been notified.
                {error.digest && (
                    <span className="block mt-2 text-xs font-mono text-muted-foreground/60">
                        Error ID: {error.digest}
                    </span>
                )}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-surface-1 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Go home
                </Link>
            </div>
        </div>
    )
}
