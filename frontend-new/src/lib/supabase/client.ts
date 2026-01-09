import { createBrowserClient } from '@supabase/ssr'
import { getEnv } from '../env'

export function createClient() {
    const env = getEnv()
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}
