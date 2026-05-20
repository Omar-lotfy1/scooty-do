export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: string | null
          created_at?: string | null
        }
      }
      media: {
        Row: {
          id: string
          url: string
          public_id: string
          file_name: string
          folder: string
          created_at: string | null
        }
        Insert: {
          id?: string
          url: string
          public_id: string
          file_name: string
          folder?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          url?: string
          public_id?: string
          file_name?: string
          folder?: string
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name_en: string
          name_ar: string
          description_en: string
          description_ar: string
          price: number
          images: string[] | null
          image_public_ids: string[] | null
          key_spec_en: string | null
          key_spec_ar: string | null
          badge_status: string | null
          features_en: string[] | null
          features_ar: string[] | null
          is_available: boolean | null
          stock_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          name_en: string
          name_ar: string
          description_en: string
          description_ar: string
          price: number
          images?: string[] | null
          image_public_ids?: string[] | null
          key_spec_en?: string | null
          key_spec_ar?: string | null
          badge_status?: string | null
          features_en?: string[] | null
          features_ar?: string[] | null
          is_available?: boolean | null
          stock_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name_en?: string
          name_ar?: string
          description_en?: string
          description_ar?: string
          price?: number
          images?: string[] | null
          image_public_ids?: string[] | null
          key_spec_en?: string | null
          key_spec_ar?: string | null
          badge_status?: string | null
          features_en?: string[] | null
          features_ar?: string[] | null
          is_available?: boolean | null
          stock_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string | null
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string | null
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
