import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export type AuthResult =
    | { authenticated: true; userId: string }
    | { authenticated: false; response: NextResponse }

/**
 * Verify user authentication for API routes
 * Returns user ID if authenticated, or 401 response if not
 */
export async function requireAuth(): Promise<AuthResult> {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return {
                authenticated: false,
                response: NextResponse.json(
                    { error: 'Unauthorized', message: 'Authentication required' },
                    { status: 401 }
                )
            }
        }

        return { authenticated: true, userId: user.id }
    } catch (err) {
        console.error('Auth check failed:', err)
        return {
            authenticated: false,
            response: NextResponse.json(
                { error: 'Unauthorized', message: 'Authentication check failed' },
                { status: 401 }
            )
        }
    }
}
