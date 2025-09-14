// Core types for VitaPulse application

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  health_goals?: string[];
  dietary_restrictions?: string[];
  preferred_cuisines?: string[];
  language?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  subscription_tier: 'free' | 'premium' | 'pro';
  subscription_expires_at?: string;
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  ingredients: string[];
  instructions?: string[];
  prep_time?: number; // in minutes
  cook_time?: number; // in minutes
  servings: number;
  cuisine?: string;
  dietary_tags?: string[];
  image_url?: string;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  meal_id?: string;
  food_name: string;
  brand?: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  logged_at: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  created_at: string;
}

export interface HealthData {
  id: string;
  user_id: string;
  data_type: 'weight' | 'height' | 'blood_pressure' | 'heart_rate' | 'steps' | 'sleep' | 'water' | 'mood' | 'energy' | 'stress';
  value: number;
  unit: string;
  notes?: string;
  source: 'manual' | 'wearable' | 'app';
  recorded_at: string;
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  meals: MealPlanDay[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  goals: string[];
  dietary_restrictions: string[];
  cuisine: string;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface MealPlanDay {
  day: number;
  meals: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    ingredients: string[];
    instructions: string[];
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
      sodium: number;
    };
    prep_time: number;
    cook_time: number;
    servings: number;
  }[];
}

export interface HealthCalculator {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'medical';
  inputs: CalculatorInput[];
  calculate: (data: any) => CalculatorResult;
}

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface CalculatorResult {
  value: number;
  unit: string;
  category: 'underweight' | 'normal' | 'overweight' | 'obese' | 'low' | 'high' | 'moderate' | 'severe';
  interpretation: string;
  recommendations: string[];
  risk_factors?: string[];
  next_steps?: string[];
}

export interface AIProviderConfig {
  name: string;
  enabled: boolean;
  priority: number;
  models: {
    chat: string;
    coder?: string;
  };
  maxTokens: number;
  temperature: number;
}

export interface AIRequest {
  provider: string;
  model: string;
  messages: AIMessage[];
  context?: {
    taskType?: 'meal_planning' | 'health_advice' | 'recipe_generation' | 'food_analysis' | 'general';
    userContext?: any;
  };
  temperature?: number;
  maxTokens?: number;
}

export interface AIMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIResponse {
  id: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
  timestamp: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  icon: string;
  points: number;
  unlocked_at: string;
  created_at: string;
}

export interface FoodDatabase {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  ingredients?: string[];
  allergens?: string[];
  dietary_tags?: string[];
  image_url?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WearableData {
  provider: 'apple-health' | 'google-fit' | 'fitbit' | 'garmin' | 'samsung-health';
  data_type: 'steps' | 'heart_rate' | 'sleep' | 'calories_burned' | 'distance';
  value: number;
  unit: string;
  timestamp: string;
  source: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  start_date: string;
  end_date: string;
  participants: number;
  rewards: string[];
  requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  completed: boolean;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  user_id: string;
  date: string;
  calories_consumed: number;
  calories_burned: number;
  water_intake: number;
  steps: number;
  sleep_hours: number;
  mood_score: number;
  energy_level: number;
  stress_level: number;
  weight?: number;
  bmi?: number;
  body_fat?: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'meal_reminder' | 'water_reminder' | 'exercise_reminder' | 'goal_achievement' | 'challenge_update' | 'community_activity';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    temperature: 'celsius' | 'fahrenheit';
    distance: 'km' | 'miles';
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    meal_reminders: boolean;
    water_reminders: boolean;
    exercise_reminders: boolean;
    sleep_reminders: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'friends' | 'private';
    data_sharing: boolean;
    analytics: boolean;
  };
  ai: {
    provider: string;
    model: string;
    temperature: number;
    max_tokens: number;
  };
  created_at: string;
  updated_at: string;
}

// Enums
export enum AIProvider {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  DeepSeek = 'deepseek',
}

export enum MealType {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
  Snack = 'snack',
}

export enum HealthDataType {
  Weight = 'weight',
  Height = 'height',
  BloodPressure = 'blood_pressure',
  HeartRate = 'heart_rate',
  Steps = 'steps',
  Sleep = 'sleep',
  Water = 'water',
  Mood = 'mood',
  Energy = 'energy',
  Stress = 'stress',
}

export enum SubscriptionTier {
  Free = 'free',
  Premium = 'premium',
  Pro = 'pro',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum ActivityLevel {
  Sedentary = 'sedentary',
  Light = 'light',
  Moderate = 'moderate',
  Active = 'active',
  VeryActive = 'very_active',
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  agreeToTerms: boolean;
}

export interface ProfileForm {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  healthGoals: string[];
  dietaryRestrictions: string[];
  preferredCuisines: string[];
  language: string;
  timezone: string;
}

export interface MealPlanForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goals: string[];
  dietaryRestrictions: string[];
  cuisine: string;
  calorieTarget: number;
}

export interface FoodLogForm {
  foodName: string;
  brand?: string;
  quantity: number;
  unit: string;
  mealType: MealType;
  loggedAt: string;
}

export interface HealthDataForm {
  dataType: HealthDataType;
  value: number;
  unit: string;
  notes?: string;
  source: 'manual' | 'wearable' | 'app';
  recordedAt: string;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

export interface ErrorProps {
  error: string;
  onRetry?: () => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}