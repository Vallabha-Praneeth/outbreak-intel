"use client"

import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="p-4 rounded-full bg-amber-500/10 mb-6">
                <FileQuestion className="w-12 h-12 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
                Page not found
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Go home
                </Link>
                <button
                    onClick={() => history.back()}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-surface-1 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go back
                </button>
            </div>
        </div>
    )
}
