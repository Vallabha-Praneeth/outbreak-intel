/**
 * Cache configuration for API routes
 * Uses stale-while-revalidate pattern for optimal performance
 */

export type CacheConfig = {
    /** Cache duration in seconds for CDN/proxy caches */
    maxAge: number
    /** Duration to serve stale content while revalidating */
    staleWhileRevalidate: number
}

// Cache configurations for different data types
export const CACHE_CONFIG = {
    // Frequently updated data - short cache
    events: { maxAge: 60, staleWhileRevalidate: 120 },
    alerts: { maxAge: 30, staleWhileRevalidate: 60 },

    // Moderately updated data
    overview: { maxAge: 120, staleWhileRevalidate: 300 },
    health: { maxAge: 60, staleWhileRevalidate: 120 },

    // Rarely updated data - longer cache
    diseases: { maxAge: 300, staleWhileRevalidate: 600 },
} as const

/**
 * Generate cache control header value
 */
export function getCacheHeaders(config: CacheConfig): HeadersInit {
    return {
        'Cache-Control': `private, s-maxage=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`,
    }
}
