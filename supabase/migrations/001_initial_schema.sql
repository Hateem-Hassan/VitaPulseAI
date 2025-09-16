-- VitaPulse AI Health Platform - Initial Database Schema
-- This migration creates the core tables for the health platform

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('free', 'premium', 'professional');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'free',
    date_of_birth DATE,
    gender gender_type,
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    activity_level activity_level DEFAULT 'moderate',
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health metrics table
CREATE TABLE public.health_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL, -- 'weight', 'blood_pressure', 'heart_rate', etc.
    value JSONB NOT NULL, -- Flexible storage for different metric types
    unit TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health goals table
CREATE TABLE public.health_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL, -- 'weight_loss', 'muscle_gain', 'fitness', etc.
    target_value JSONB,
    current_value JSONB,
    target_date DATE,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal plans table
CREATE TABLE public.meal_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target_calories INTEGER,
    diet_type TEXT, -- 'balanced', 'keto', 'vegan', etc.
    meals JSONB NOT NULL, -- Store meal data as JSON
    date_range DATERANGE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food diary table
CREATE TABLE public.food_diary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    meal_type meal_type NOT NULL,
    food_name TEXT NOT NULL,
    quantity DECIMAL(8,2),
    unit TEXT,
    calories INTEGER,
    protein DECIMAL(6,2),
    carbs DECIMAL(6,2),
    fat DECIMAL(6,2),
    fiber DECIMAL(6,2),
    sugar DECIMAL(6,2),
    sodium DECIMAL(8,2),
    consumed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts table
CREATE TABLE public.workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- 'cardio', 'strength', 'flexibility', etc.
    duration_minutes INTEGER,
    calories_burned INTEGER,
    exercises JSONB, -- Store exercise details as JSON
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptom reports table
CREATE TABLE public.symptom_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    symptoms TEXT[] NOT NULL,
    severity INTEGER CHECK (severity >= 1 AND severity <= 10),
    duration TEXT,
    additional_info TEXT,
    ai_analysis JSONB, -- Store AI analysis results
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health assessments table
CREATE TABLE public.health_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL, -- 'bmi', 'tdee', 'body_fat', etc.
    input_data JSONB NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'reminder', 'alert', 'achievement'
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    preference_key TEXT NOT NULL,
    preference_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_key)
);

-- Create indexes for better performance
CREATE INDEX idx_health_metrics_user_id ON public.health_metrics(user_id);
CREATE INDEX idx_health_metrics_type ON public.health_metrics(metric_type);
CREATE INDEX idx_health_metrics_recorded_at ON public.health_metrics(recorded_at);

CREATE INDEX idx_food_diary_user_id ON public.food_diary(user_id);
CREATE INDEX idx_food_diary_consumed_at ON public.food_diary(consumed_at);

CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_completed_at ON public.workouts(completed_at);

CREATE INDEX idx_symptom_reports_user_id ON public.symptom_reports(user_id);
CREATE INDEX idx_symptom_reports_reported_at ON public.symptom_reports(reported_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Health metrics policies
CREATE POLICY "Users can view own health metrics" ON public.health_metrics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics" ON public.health_metrics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics" ON public.health_metrics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics" ON public.health_metrics
    FOR DELETE USING (auth.uid() = user_id);

-- Health goals policies
CREATE POLICY "Users can manage own health goals" ON public.health_goals
    FOR ALL USING (auth.uid() = user_id);

-- Meal plans policies
CREATE POLICY "Users can manage own meal plans" ON public.meal_plans
    FOR ALL USING (auth.uid() = user_id);

-- Food diary policies
CREATE POLICY "Users can manage own food diary" ON public.food_diary
    FOR ALL USING (auth.uid() = user_id);

-- Workouts policies
CREATE POLICY "Users can manage own workouts" ON public.workouts
    FOR ALL USING (auth.uid() = user_id);

-- Symptom reports policies
CREATE POLICY "Users can manage own symptom reports" ON public.symptom_reports
    FOR ALL USING (auth.uid() = user_id);

-- Health assessments policies
CREATE POLICY "Users can manage own health assessments" ON public.health_assessments
    FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant basic read access to anonymous users (for public data if needed)
GRANT SELECT ON public.users TO anon;

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_health_goals_updated_at
    BEFORE UPDATE ON public.health_goals
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_meal_plans_updated_at
    BEFORE UPDATE ON public.meal_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample data for development
INSERT INTO public.users (id, email, full_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@vitapulse.ai', 'Demo User', 'premium')
ON CONFLICT (id) DO NOTHING;

-- Create a view for user dashboard data
CREATE OR REPLACE VIEW public.user_dashboard AS
SELECT 
    u.id,
    u.full_name,
    u.role,
    COUNT(DISTINCT hm.id) as total_health_metrics,
    COUNT(DISTINCT fd.id) as total_food_entries,
    COUNT(DISTINCT w.id) as total_workouts,
    COUNT(DISTINCT sr.id) as total_symptom_reports
FROM public.users u
LEFT JOIN public.health_metrics hm ON u.id = hm.user_id
LEFT JOIN public.food_diary fd ON u.id = fd.user_id
LEFT JOIN public.workouts w ON u.id = w.user_id
LEFT JOIN public.symptom_reports sr ON u.id = sr.user_id
GROUP BY u.id, u.full_name, u.role;

-- Grant access to the view
GRANT SELECT ON public.user_dashboard TO authenticated;

COMMIT;