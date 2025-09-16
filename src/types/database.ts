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
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height: number | null
          weight: number | null
          activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          health_goals: string[] | null
          dietary_preferences: string[] | null
          allergies: string[] | null
          medical_conditions: string[] | null
          medications: string[] | null
          emergency_contact: Json | null
          preferred_language: string
          timezone: string
          subscription_tier: 'free' | 'premium' | 'professional'
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height?: number | null
          weight?: number | null
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          health_goals?: string[] | null
          dietary_preferences?: string[] | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          emergency_contact?: Json | null
          preferred_language?: string
          timezone?: string
          subscription_tier?: 'free' | 'premium' | 'professional'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height?: number | null
          weight?: number | null
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | null
          health_goals?: string[] | null
          dietary_preferences?: string[] | null
          allergies?: string[] | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          emergency_contact?: Json | null
          preferred_language?: string
          timezone?: string
          subscription_tier?: 'free' | 'premium' | 'professional'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_metrics: {
        Row: {
          id: string
          user_id: string
          metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake'
          value: number
          unit: string
          systolic?: number | null
          diastolic?: number | null
          notes: string | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake'
          value: number
          unit: string
          systolic?: number | null
          diastolic?: number | null
          notes?: string | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          metric_type?: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake'
          value?: number
          unit?: string
          systolic?: number | null
          diastolic?: number | null
          notes?: string | null
          recorded_at?: string
          created_at?: string
        }
      }
      food_entries: {
        Row: {
          id: string
          user_id: string
          food_name: string
          brand: string | null
          barcode: string | null
          serving_size: number
          serving_unit: string
          calories_per_serving: number
          protein: number | null
          carbs: number | null
          fat: number | null
          fiber: number | null
          sugar: number | null
          sodium: number | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          consumed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_name: string
          brand?: string | null
          barcode?: string | null
          serving_size: number
          serving_unit: string
          calories_per_serving: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          consumed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_name?: string
          brand?: string | null
          barcode?: string | null
          serving_size?: number
          serving_unit?: string
          calories_per_serving?: number
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          consumed_at?: string
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          target_calories: number
          target_protein: number | null
          target_carbs: number | null
          target_fat: number | null
          dietary_restrictions: string[] | null
          cultural_preferences: string[] | null
          meals: Json
          is_ai_generated: boolean
          ai_prompt: string | null
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          target_calories: number
          target_protein?: number | null
          target_carbs?: number | null
          target_fat?: number | null
          dietary_restrictions?: string[] | null
          cultural_preferences?: string[] | null
          meals: Json
          is_ai_generated?: boolean
          ai_prompt?: string | null
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          target_calories?: number
          target_protein?: number | null
          target_carbs?: number | null
          target_fat?: number | null
          dietary_restrictions?: string[] | null
          cultural_preferences?: string[] | null
          meals?: Json
          is_ai_generated?: boolean
          ai_prompt?: string | null
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      symptom_assessments: {
        Row: {
          id: string
          user_id: string
          symptoms: Json
          severity_level: number
          duration: string
          additional_info: string | null
          ai_assessment: Json | null
          ai_recommendations: Json | null
          cultural_context: Json | null
          requires_medical_attention: boolean
          emergency_level: 'low' | 'medium' | 'high' | 'critical'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symptoms: Json
          severity_level: number
          duration: string
          additional_info?: string | null
          ai_assessment?: Json | null
          ai_recommendations?: Json | null
          cultural_context?: Json | null
          requires_medical_attention?: boolean
          emergency_level?: 'low' | 'medium' | 'high' | 'critical'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symptoms?: Json
          severity_level?: number
          duration?: string
          additional_info?: string | null
          ai_assessment?: Json | null
          ai_recommendations?: Json | null
          cultural_context?: Json | null
          requires_medical_attention?: boolean
          emergency_level?: 'low' | 'medium' | 'high' | 'critical'
          created_at?: string
        }
      }
      health_goals: {
        Row: {
          id: string
          user_id: string
          goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general_health' | 'disease_management'
          title: string
          description: string | null
          target_value: number | null
          current_value: number | null
          unit: string | null
          target_date: string | null
          status: 'active' | 'completed' | 'paused' | 'cancelled'
          progress_percentage: number
          milestones: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general_health' | 'disease_management'
          title: string
          description?: string | null
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          target_date?: string | null
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          progress_percentage?: number
          milestones?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general_health' | 'disease_management'
          title?: string
          description?: string | null
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          target_date?: string | null
          status?: 'active' | 'completed' | 'paused' | 'cancelled'
          progress_percentage?: number
          milestones?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      health_check: {
        Row: {
          id: string
          status: string
          timestamp: string
        }
        Insert: {
          id?: string
          status: string
          timestamp?: string
        }
        Update: {
          id?: string
          status?: string
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_health_summary: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      calculate_bmi: {
        Args: {
          height_cm: number
          weight_kg: number
        }
        Returns: number
      }
      get_nutrition_summary: {
        Args: {
          user_id: string
          start_date: string
          end_date: string
        }
        Returns: Json
      }
    }
    Enums: {
      subscription_tier: 'free' | 'premium' | 'professional'
      subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
      gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
      activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
      metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'cholesterol' | 'body_fat' | 'muscle_mass' | 'bmi' | 'steps' | 'calories_burned' | 'sleep_hours' | 'water_intake'
      meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
      goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general_health' | 'disease_management'
      goal_status: 'active' | 'completed' | 'paused' | 'cancelled'
      emergency_level: 'low' | 'medium' | 'high' | 'critical'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type HealthMetric = Database['public']['Tables']['health_metrics']['Row']
export type FoodEntry = Database['public']['Tables']['food_entries']['Row']
export type MealPlan = Database['public']['Tables']['meal_plans']['Row']
export type SymptomAssessment = Database['public']['Tables']['symptom_assessments']['Row']
export type HealthGoal = Database['public']['Tables']['health_goals']['Row']

export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type HealthMetricInsert = Database['public']['Tables']['health_metrics']['Insert']
export type FoodEntryInsert = Database['public']['Tables']['food_entries']['Insert']
export type MealPlanInsert = Database['public']['Tables']['meal_plans']['Insert']
export type SymptomAssessmentInsert = Database['public']['Tables']['symptom_assessments']['Insert']
export type HealthGoalInsert = Database['public']['Tables']['health_goals']['Insert']

export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type HealthMetricUpdate = Database['public']['Tables']['health_metrics']['Update']
export type FoodEntryUpdate = Database['public']['Tables']['food_entries']['Update']
export type MealPlanUpdate = Database['public']['Tables']['meal_plans']['Update']
export type SymptomAssessmentUpdate = Database['public']['Tables']['symptom_assessments']['Update']
export type HealthGoalUpdate = Database['public']['Tables']['health_goals']['Update']