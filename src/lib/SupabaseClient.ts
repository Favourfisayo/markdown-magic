import { createClient } from '@supabase/supabase-js'

const supabaseURL = "https://jgztiqquwlkjbvhtiayj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnenRpcXF1d2xramJ2aHRpYXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTcxMDIsImV4cCI6MjA2MTA3MzEwMn0.06LCNpXTHBsK5vVaejVny5YQxzDVTt-fxAA98jhzC6E"

export const supabase = createClient(supabaseURL, supabaseAnonKey)
