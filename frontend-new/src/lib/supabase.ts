import { createClient } from "@supabase/supabase-js"
import { getEnv } from "./env"

const env = getEnv()

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
