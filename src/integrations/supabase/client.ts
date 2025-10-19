import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mudgumcnyawrigwsedsf.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZGd1bWNueWF3cmlnd3NlZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NjMxNjEsImV4cCI6MjA3NjIzOTE2MX0.1cY4LdeDz3Y2H118yFgLAJJCBz8nNOdiwVbf0guPwdU'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})