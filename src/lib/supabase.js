import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function hasUsableSupabaseConfig() {
  try {
    const url = new URL(supabaseUrl)
    return url.hostname.endsWith('.supabase.co') && supabaseAnonKey?.startsWith('eyJ')
  } catch {
    return false
  }
}

export const isSupabaseConfigured = hasUsableSupabaseConfig()

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
