import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. ' +
    'Copy .env.example to .env and fill in your Supabase credentials.'
  )
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)

// Type definitions for database tables
export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          invite_code: string
          cohort: string
          scenario_id: string
          nickname: string | null
          started_at: string
          consented_at: string | null
          guided_completed_at: string | null
          free_roam_started_at: string | null
          completed_at: string | null
          ended_early: boolean
          user_agent: string | null
          viewport_width: number | null
          is_moderated: boolean
          end_survey: unknown | null
          sus_responses: unknown | null
          pricing_response: string | null
        }
        Insert: {
          id?: string
          invite_code: string
          cohort: string
          scenario_id: string
          nickname?: string | null
          started_at?: string
          consented_at?: string | null
          guided_completed_at?: string | null
          free_roam_started_at?: string | null
          completed_at?: string | null
          ended_early?: boolean
          user_agent?: string | null
          viewport_width?: number | null
          is_moderated?: boolean
          end_survey?: unknown | null
          sus_responses?: unknown | null
          pricing_response?: string | null
        }
        Update: {
          id?: string
          invite_code?: string
          cohort?: string
          scenario_id?: string
          nickname?: string | null
          started_at?: string
          consented_at?: string | null
          guided_completed_at?: string | null
          free_roam_started_at?: string | null
          completed_at?: string | null
          ended_early?: boolean
          user_agent?: string | null
          viewport_width?: number | null
          is_moderated?: boolean
          end_survey?: unknown | null
          sus_responses?: unknown | null
          pricing_response?: string | null
        }
      }
      events: {
        Row: {
          id: number
          session_id: string
          ts: string
          screen_id: string | null
          event_type: string
          payload: unknown | null
        }
        Insert: {
          id?: number
          session_id: string
          ts?: string
          screen_id?: string | null
          event_type: string
          payload?: unknown | null
        }
      }
    }
  }
}

export type SessionRow = Database['public']['Tables']['sessions']['Row']
export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type EventRow = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
