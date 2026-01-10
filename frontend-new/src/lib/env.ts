/**
 * Environment variable validation
 * Validates required env vars at runtime and provides type-safe access
 */

function getEnvVar(name: string, fallback: string = ''): string {
    if (typeof window !== 'undefined') {
        // Client-side: access from window.__ENV__ or process.env (Next.js injects NEXT_PUBLIC_ vars)
        return (process.env as Record<string, string | undefined>)[name] || fallback
    }
    // Server-side
    return process.env[name] || fallback
}

function validateUrl(value: string): boolean {
    if (!value) return false
    try {
        new URL(value)
        return true
    } catch {
        return false
    }
}

// Lazy initialization to avoid issues during build
let _env: ReturnType<typeof loadEnv> | null = null

function loadEnv() {
    const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
    const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    // Log warnings in development but don't throw
    if (!supabaseUrl || !validateUrl(supabaseUrl)) {
        console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL is missing or invalid')
    }

    if (!supabaseAnonKey || !supabaseAnonKey.startsWith('ey')) {
        console.warn('Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid')
    }

    return {
        SUPABASE_URL: supabaseUrl || 'https://placeholder.supabase.co',
        SUPABASE_ANON_KEY: supabaseAnonKey || 'eyPlaceholder',
        NODE_ENV: getEnvVar('NODE_ENV', 'development'),
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
    } as const
}

export function getEnv() {
    if (!_env) {
        _env = loadEnv()
    }
    return _env
}

// Type for the validated environment
export type Env = ReturnType<typeof loadEnv>
