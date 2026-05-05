import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // This warning helps quickly identify broken env setup in local machines.
  console.warn('Supabase environment variables are missing.')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
