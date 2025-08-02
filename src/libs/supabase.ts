import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if environment variables are present
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side client for API routes
export const createServerSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Supabase environment variables not configured')
  }

  return createClient(url, serviceKey)
}

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          image: string | null
          about: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          image?: string | null
          about?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          image?: string | null
          about?: string | null
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          discount: number
          type: string
          dimension: string
          number_of_beds: number
          is_booked: boolean
          is_featured: boolean
          special_note: string | null
          cover_image: string
          images: string[]
          amenities: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          description: string
          price: number
          discount?: number
          type: string
          dimension: string
          number_of_beds: number
          is_booked?: boolean
          is_featured?: boolean
          special_note?: string | null
          cover_image: string
          images?: string[]
          amenities?: string[]
        }
        Update: {
          name?: string
          slug?: string
          description?: string
          price?: number
          discount?: number
          type?: string
          dimension?: string
          number_of_beds?: number
          is_booked?: boolean
          is_featured?: boolean
          special_note?: string | null
          cover_image?: string
          images?: string[]
          amenities?: string[]
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          room_id: string
          checkin_date: string
          checkout_date: string
          number_of_days: number
          adults: number
          children: number
          total_price: number
          discount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          room_id: string
          checkin_date: string
          checkout_date: string
          number_of_days: number
          adults: number
          children: number
          total_price: number
          discount?: number
        }
        Update: {
          user_id?: string
          room_id?: string
          checkin_date?: string
          checkout_date?: string
          number_of_days?: number
          adults?: number
          children?: number
          total_price?: number
          discount?: number
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          room_id: string
          rating: number
          text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          room_id: string
          rating: number
          text: string
        }
        Update: {
          rating?: number
          text?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
