import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env?.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseKey = (import.meta as any).env?.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY. Set them in .env.local')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

