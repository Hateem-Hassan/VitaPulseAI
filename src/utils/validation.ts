import { z } from 'zod';

// Auth schemas
export const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms and Conditions.',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  height: z.number().min(50).max(300).optional(),
  weight: z.number().min(20).max(500).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  healthGoals: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  preferredCuisines: z.array(z.string()).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// Meal planning schemas
export const mealPlanSchema = z.object({
  name: z.string().min(1, { message: 'Meal plan name is required.' }),
  description: z.string().optional(),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().min(1, { message: 'End date is required.' }),
  goals: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  cuisine: z.string().optional(),
  calorieTarget: z.number().min(1000).max(5000).optional(),
});

export const foodLogSchema = z.object({
  foodName: z.string().min(1, { message: 'Food name is required.' }),
  brand: z.string().optional(),
  quantity: z.number().min(0.1, { message: 'Quantity must be greater than 0.' }),
  unit: z.string().min(1, { message: 'Unit is required.' }),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  loggedAt: z.string().optional(),
});

// Health data schemas
export const healthDataSchema = z.object({
  dataType: z.enum(['weight', 'height', 'blood_pressure', 'heart_rate', 'steps', 'sleep', 'water', 'mood', 'energy', 'stress']),
  value: z.number().min(0, { message: 'Value must be greater than or equal to 0.' }),
  unit: z.string().min(1, { message: 'Unit is required.' }),
  notes: z.string().optional(),
  source: z.enum(['manual', 'wearable', 'app']).optional(),
  recordedAt: z.string().optional(),
});

// Calculator schemas
export const bmiCalculatorSchema = z.object({
  weight: z.number().min(20).max(500, { message: 'Weight must be between 20 and 500 kg.' }),
  height: z.number().min(50).max(300, { message: 'Height must be between 50 and 300 cm.' }),
  age: z.number().min(1).max(120, { message: 'Age must be between 1 and 120 years.' }),
  gender: z.enum(['male', 'female']),
});

export const bodyFatCalculatorSchema = z.object({
  waist: z.number().min(30).max(200, { message: 'Waist must be between 30 and 200 cm.' }),
  neck: z.number().min(20).max(100, { message: 'Neck must be between 20 and 100 cm.' }),
  height: z.number().min(50).max(300, { message: 'Height must be between 50 and 300 cm.' }),
  gender: z.enum(['male', 'female']),
});

export const calorieCalculatorSchema = z.object({
  weight: z.number().min(20).max(500, { message: 'Weight must be between 20 and 500 kg.' }),
  height: z.number().min(50).max(300, { message: 'Height must be between 50 and 300 cm.' }),
  age: z.number().min(1).max(120, { message: 'Age must be between 1 and 120 years.' }),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['maintain', 'lose', 'gain']),
});

export const waterIntakeCalculatorSchema = z.object({
  weight: z.number().min(20).max(500, { message: 'Weight must be between 20 and 500 kg.' }),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

// AI request schemas
export const aiRequestSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'deepseek']),
  model: z.string().min(1, { message: 'Model is required.' }),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1, { message: 'Message content is required.' }),
  })),
  context: z.object({
    taskType: z.enum(['meal_planning', 'health_advice', 'recipe_generation', 'food_analysis', 'general']).optional(),
    userContext: z.any().optional(),
  }).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
});

// Settings schemas
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  units: z.object({
    weight: z.enum(['kg', 'lbs']).optional(),
    height: z.enum(['cm', 'ft']).optional(),
    temperature: z.enum(['celsius', 'fahrenheit']).optional(),
    distance: z.enum(['km', 'miles']).optional(),
  }).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
    meal_reminders: z.boolean().optional(),
    water_reminders: z.boolean().optional(),
    exercise_reminders: z.boolean().optional(),
    sleep_reminders: z.boolean().optional(),
  }).optional(),
  privacy: z.object({
    profile_visibility: z.enum(['public', 'friends', 'private']).optional(),
    data_sharing: z.boolean().optional(),
    analytics: z.boolean().optional(),
  }).optional(),
  ai: z.object({
    provider: z.string().optional(),
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    max_tokens: z.number().min(1).max(4000).optional(),
  }).optional(),
});

// Community schemas
export const communityPostSchema = z.object({
  content: z.string().min(1, { message: 'Post content is required.' }).max(2000, { message: 'Post content must be less than 2000 characters.' }),
  images: z.array(z.string()).optional(),
});

export const communityCommentSchema = z.object({
  content: z.string().min(1, { message: 'Comment content is required.' }).max(500, { message: 'Comment content must be less than 500 characters.' }),
});

// Challenge schemas
export const challengeSchema = z.object({
  name: z.string().min(1, { message: 'Challenge name is required.' }),
  description: z.string().min(1, { message: 'Challenge description is required.' }),
  type: z.enum(['daily', 'weekly', 'monthly', 'seasonal']),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().min(1, { message: 'End date is required.' }),
  rewards: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

// Export types
export type AuthInput = z.infer<typeof authSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type MealPlanInput = z.infer<typeof mealPlanSchema>;
export type FoodLogInput = z.infer<typeof foodLogSchema>;
export type HealthDataInput = z.infer<typeof healthDataSchema>;
export type BMICalculatorInput = z.infer<typeof bmiCalculatorSchema>;
export type BodyFatCalculatorInput = z.infer<typeof bodyFatCalculatorSchema>;
export type CalorieCalculatorInput = z.infer<typeof calorieCalculatorSchema>;
export type WaterIntakeCalculatorInput = z.infer<typeof waterIntakeCalculatorSchema>;
export type AIRequestInput = z.infer<typeof aiRequestSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type CommunityPostInput = z.infer<typeof communityPostSchema>;
export type CommunityCommentInput = z.infer<typeof communityCommentSchema>;
export type ChallengeInput = z.infer<typeof challengeSchema>;