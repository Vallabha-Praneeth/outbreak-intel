/**
 * Environment variable validation
 * Validates required env vars at runtime and provides type-safe access
 */

function getRequiredEnvVar(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}. ` +
            `Please check your .env.local file.`
        )
    }
    return value
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
    return process.env[name] || defaultValue
}

function validateUrl(value: string, name: string): string {
    try {
        new URL(value)
        return value
    } catch {
        throw new Error(
            `Invalid URL for ${name}: "${value}". ` +
            `Expected a valid URL (e.g., https://example.supabase.co)`
        )
    }
}

// Lazy initialization to avoid issues during build
let _env: ReturnType<typeof loadEnv> | null = null

function loadEnv() {
    const supabaseUrl = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL')
    const supabaseAnonKey = getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    // Validate URL format
    validateUrl(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')

    // Validate anon key format (should be a JWT)
    if (!supabaseAnonKey.startsWith('ey')) {
        throw new Error(
            `Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY: Expected a JWT token starting with "ey"`
        )
    }

    return {
        SUPABASE_URL: supabaseUrl,
        SUPABASE_ANON_KEY: supabaseAnonKey,
        NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),
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
