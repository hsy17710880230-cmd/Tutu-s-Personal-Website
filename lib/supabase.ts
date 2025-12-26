import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
console.log(supabaseKey, supabaseUrl)

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are missing!")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
