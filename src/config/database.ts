import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nbzpkeyzodcafbgupxne.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ienBrZXl6b2RjYWZiZ3VweG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzU4OTAsImV4cCI6MjA3MjgxMTg5MH0.ByI2oD8H9ZH9Kw9BZy3VEqsQA6YSCUbHUng7-n01hBA';

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error('Invalid Supabase URL format');
}

if (!supabaseAnonKey || supabaseAnonKey.length < 50) {
  throw new Error('Invalid Supabase anon key');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types based on migration schema
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          height: number | null;
          weight: number | null;
          activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null;
          health_goals: string[] | null;
          dietary_preferences: string[] | null;
          allergies: string[] | null;
          medical_conditions: string[] | null;
          medications: string[] | null;
          emergency_contact: any | null;
          preferred_language: string;
          timezone: string;
          subscription_tier: 'free' | 'premium' | 'professional';
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          height?: number | null;
          weight?: number | null;
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null;
          health_goals?: string[] | null;
          dietary_preferences?: string[] | null;
          allergies?: string[] | null;
          medical_conditions?: string[] | null;
          medications?: string[] | null;
          emergency_contact?: any | null;
          preferred_language?: string;
          timezone?: string;
          subscription_tier?: 'free' | 'premium' | 'professional';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          height?: number | null;
          weight?: number | null;
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null;
          health_goals?: string[] | null;
          dietary_preferences?: string[] | null;
          allergies?: string[] | null;
          medical_conditions?: string[] | null;
          medications?: string[] | null;
          emergency_contact?: any | null;
          preferred_language?: string;
          timezone?: string;
          subscription_tier?: 'free' | 'premium' | 'professional';
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
          subscription_expires_at?: string | null;
          updated_at?: string;
        };
      };
      health_metrics: {
        Row: {
          id: string;
          user_id: string;
          metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake';
          value: number;
          unit: string;
          systolic: number | null;
          diastolic: number | null;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake';
          value: number;
          unit: string;
          systolic?: number | null;
          diastolic?: number | null;
          notes?: string | null;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          metric_type?: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake';
          value?: number;
          unit?: string;
          systolic?: number | null;
          diastolic?: number | null;
          notes?: string | null;
          recorded_at?: string;
        };
      };
      food_entries: {
        Row: {
          id: string;
          user_id: string;
          food_name: string;
          brand: string | null;
          barcode: string | null;
          serving_size: number;
          serving_unit: string;
          calories_per_serving: number;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          fiber: number | null;
          sugar: number | null;
          sodium: number | null;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          consumed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_name: string;
          brand?: string | null;
          barcode?: string | null;
          serving_size: number;
          serving_unit: string;
          calories_per_serving: number;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          fiber?: number | null;
          sugar?: number | null;
          sodium?: number | null;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          consumed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_name?: string;
          brand?: string | null;
          barcode?: string | null;
          serving_size?: number;
          serving_unit?: string;
          calories_per_serving?: number;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          fiber?: number | null;
          sugar?: number | null;
          sodium?: number | null;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          consumed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_bmi: {
        Args: { height_cm: number; weight_kg: number };
        Returns: number;
      };
      get_user_health_summary: {
        Args: { user_id: string };
        Returns: any;
      };
      get_nutrition_summary: {
        Args: { user_id: string; start_date: string; end_date: string };
        Returns: any;
      };
    };
    Enums: {
      subscription_tier: 'free' | 'premium' | 'professional';
      subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due';
      gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
      activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
      metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake';
      meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    };
  };
}

// Export types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
