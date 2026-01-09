import { NextResponse } from 'next/server'

/**
 * Simple in-memory rate limiter
 * For production, replace with Redis/Upstash for distributed rate limiting
 */

type RateLimitEntry = {
    count: number
    resetTime: number
}

// In-memory store (resets on cold start - use Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 60000) // Clean every minute

export type RateLimitConfig = {
    /** Max requests allowed in the window */
    limit: number
    /** Time window in seconds */
    windowSeconds: number
}

export const RATE_LIMIT_CONFIG: Record<string, RateLimitConfig> = {
    default: { limit: 60, windowSeconds: 60 },      // 60 req/min
    events: { limit: 30, windowSeconds: 60 },       // 30 req/min
    alerts: { limit: 30, windowSeconds: 60 },       // 30 req/min
    overview: { limit: 20, windowSeconds: 60 },     // 20 req/min
    diseases: { limit: 20, windowSeconds: 60 },     // 20 req/min
    health: { limit: 10, windowSeconds: 60 },       // 10 req/min
}

export type RateLimitResult =
    | { allowed: true; remaining: number }
    | { allowed: false; response: NextResponse; retryAfter: number }

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
    identifier: string,
    endpoint: string = 'default'
): RateLimitResult {
    const config = RATE_LIMIT_CONFIG[endpoint] || RATE_LIMIT_CONFIG.default
    const key = `${identifier}:${endpoint}`
    const now = Date.now()

    let entry = rateLimitStore.get(key)

    // Create new entry if doesn't exist or expired
    if (!entry || now > entry.resetTime) {
        entry = {
            count: 0,
            resetTime: now + config.windowSeconds * 1000
        }
    }

    entry.count++
    rateLimitStore.set(key, entry)

    const remaining = Math.max(0, config.limit - entry.count)
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)

    if (entry.count > config.limit) {
        return {
            allowed: false,
            retryAfter,
            response: NextResponse.json(
                {
                    error: 'Too Many Requests',
                    message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': String(config.limit),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(entry.resetTime)
                    }
                }
            )
        }
    }

    return { allowed: true, remaining }
}

/**
 * Get client identifier from request (IP or user ID)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
    if (userId) return `user:${userId}`

    // Try to get IP from headers (works with Vercel/proxies)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

    return `ip:${ip}`
}
