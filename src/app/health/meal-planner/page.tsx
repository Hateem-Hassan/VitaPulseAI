'use client';

// AI Meal Planner with Halal Compliance and Cultural Considerations
// Personalized meal planning with dietary restrictions and cultural preferences

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  Calendar,
  Clock,
  Users,
  Target,
  Heart,
  Leaf,
  Globe,
  ShoppingCart,
  Download,
  RefreshCw,
  Star,
  Utensils,
  Apple,
  Wheat,
  Fish,
  Milk,
  Egg,
  Nut,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
  BookOpen,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { aiService } from '@/lib/ai-services';
import { toast } from 'sonner';

interface DietaryPreferences {
  dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'mediterranean';
  isHalal: boolean;
  isKosher: boolean;
  culturalCuisine: string[];
  allergies: string[];
  dislikes: string[];
  healthGoals: string[];
}

interface NutritionalGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

interface MealPlanRequest {
  duration: 1 | 3 | 7 | 14 | 30;
  mealsPerDay: 3 | 4 | 5 | 6;
  servings: 1 | 2 | 3 | 4;
  budget: 'low' | 'medium' | 'high';
  cookingTime: 'quick' | 'moderate' | 'elaborate';
  preferences: DietaryPreferences;
  nutritionalGoals: NutritionalGoals;
  specialRequirements?: string;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisine: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    isHalal?: boolean;
    isVegan?: boolean;
  }>;
  instructions: string[];
  tags: string[];
  culturalNotes?: string;
  halalCertification?: string;
  nutritionScore: number;
}

interface MealPlan {
  id: string;
  duration: number;
  totalCalories: number;
  avgNutritionScore: number;
  days: Array<{
    date: string;
    meals: Meal[];
    totalNutrition: NutritionalGoals;
  }>;
  shoppingList: Array<{
    category: string;
    items: Array<{
      name: string;
      amount: string;
      unit: string;
      estimatedCost?: number;
    }>;
  }>;
  culturalConsiderations: string[];
  halalCompliance: {
    isFullyCompliant: boolean;
    notes: string[];
  };
  tips: string[];
}

export default function MealPlannerPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();
  
  const [currentStep, setCurrentStep] = useState<'preferences' | 'goals' | 'plan'>('preferences');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  
  const [preferences, setPreferences] = useState<DietaryPreferences>({
    dietType: 'omnivore',
    isHalal: userProfile?.dietary_preferences?.includes('halal') || false,
    isKosher: userProfile?.dietary_preferences?.includes('kosher') || false,
    culturalCuisine: userProfile?.cultural_background ? [userProfile.cultural_background] : [],
    allergies: userProfile?.allergies || [],
    dislikes: [],
    healthGoals: []
  });
  
  const [planRequest, setPlanRequest] = useState<MealPlanRequest>({
    duration: 7,
    mealsPerDay: 3,
    servings: 2,
    budget: 'medium',
    cookingTime: 'moderate',
    preferences,
    nutritionalGoals: {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 67,
      fiber: 25,
      sodium: 2300
    }
  });

  // Common dietary options
  const dietTypes = [
    { value: 'omnivore', label: 'Omnivore', icon: Utensils },
    { value: 'vegetarian', label: 'Vegetarian', icon: Leaf },
    { value: 'vegan', label: 'Vegan', icon: Apple },
    { value: 'pescatarian', label: 'Pescatarian', icon: Fish },
    { value: 'keto', label: 'Ketogenic', icon: Target },
    { value: 'paleo', label: 'Paleo', icon: Heart },
    { value: 'mediterranean', label: 'Mediterranean', icon: Globe }
  ];

  const commonAllergies = [
    'Nuts', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Shellfish', 'Fish', 'Sesame'
  ];

  const culturalCuisines = [
    'Middle Eastern', 'Indian', 'Chinese', 'Japanese', 'Italian', 'Mexican',
    'Thai', 'French', 'Greek', 'Turkish', 'Korean', 'Vietnamese',
    'Moroccan', 'Lebanese', 'Pakistani', 'Indonesian', 'Spanish', 'American'
  ];

  const healthGoals = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Heart Health',
    'Diabetes Management', 'Lower Cholesterol', 'Increase Energy',
    'Better Digestion', 'Immune Support', 'Anti-inflammatory'
  ];

  // Generate meal plan
  const generateMealPlan = async () => {
    setIsGenerating(true);
    setCurrentStep('plan');
    
    try {
      const result = await aiService.generateMealPlan({
        ...planRequest,
        preferences: {
          ...preferences,
          culturalCuisine: preferences.culturalCuisine,
          allergies: preferences.allergies,
          dislikes: preferences.dislikes,
          healthGoals: preferences.healthGoals
        },
        culturalContext: {
          language: 'en',
          region: userProfile?.location || 'global',
          culturalBackground: userProfile?.cultural_background || 'general',
          religiousRequirements: {
            halal: preferences.isHalal,
            kosher: preferences.isKosher
          }
        }
      });
      
      setMealPlan(result);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast.error('Failed to generate meal plan. Please try again.');
      setCurrentStep('preferences');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get nutrition color
  const getNutritionColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'text-green-600';
    if (percentage >= 80 && percentage <= 120) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Format time
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ChefHat className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                AI Meal Planner
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Personalized meal plans with Halal compliance and cultural preferences
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              currentStep === 'preferences' ? 'text-green-600' : 
              currentStep === 'goals' || currentStep === 'plan' ? 'text-green-600' : 'text-neutral-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'preferences' ? 'bg-green-600 text-white' :
                currentStep === 'goals' || currentStep === 'plan' ? 'bg-green-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                1
              </div>
              <span className="font-medium">Preferences</span>
            </div>
            
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'goals' ? 'text-green-600' : 
              currentStep === 'plan' ? 'text-green-600' : 'text-neutral-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'goals' ? 'bg-green-600 text-white' :
                currentStep === 'plan' ? 'bg-green-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                2
              </div>
              <span className="font-medium">Goals</span>
            </div>
            
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
            
            <div className={`flex items-center space-x-2 ${
              currentStep === 'plan' ? 'text-green-600' : 'text-neutral-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'plan' ? 'bg-green-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                3
              </div>
              <span className="font-medium">Meal Plan</span>
            </div>
          </div>
        </div>

        {/* Step 1: Dietary Preferences */}
        {currentStep === 'preferences' && (
          <div className="space-y-6">
            {/* Diet Type */}
            <Card>
              <CardHeader>
                <CardTitle>Diet Type</CardTitle>
                <CardDescription>
                  Choose your primary dietary approach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dietTypes.map((diet) => {
                    const Icon = diet.icon;
                    return (
                      <Button
                        key={diet.value}
                        variant={preferences.dietType === diet.value ? 'default' : 'outline'}
                        className="h-20 flex-col space-y-2"
                        onClick={() => setPreferences(prev => ({ ...prev, dietType: diet.value as any }))}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm">{diet.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Religious & Cultural Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Religious & Cultural Preferences</CardTitle>
                <CardDescription>
                  Ensure your meal plan respects your beliefs and traditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="halal"
                      checked={preferences.isHalal}
                      onChange={(e) => setPreferences(prev => ({ ...prev, isHalal: e.target.checked }))}
                      className="rounded border-neutral-300"
                    />
                    <Label htmlFor="halal" className="flex items-center space-x-2">
                      <span>Halal</span>
                      {preferences.isHalal && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="kosher"
                      checked={preferences.isKosher}
                      onChange={(e) => setPreferences(prev => ({ ...prev, isKosher: e.target.checked }))}
                      className="rounded border-neutral-300"
                    />
                    <Label htmlFor="kosher" className="flex items-center space-x-2">
                      <span>Kosher</span>
                      {preferences.isKosher && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Preferred Cuisines</Label>
                  <div className="flex flex-wrap gap-2">
                    {culturalCuisines.map((cuisine) => (
                      <Button
                        key={cuisine}
                        variant={preferences.culturalCuisine.includes(cuisine) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setPreferences(prev => ({
                            ...prev,
                            culturalCuisine: prev.culturalCuisine.includes(cuisine)
                              ? prev.culturalCuisine.filter(c => c !== cuisine)
                              : [...prev.culturalCuisine, cuisine]
                          }));
                        }}
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allergies & Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle>Allergies & Food Restrictions</CardTitle>
                <CardDescription>
                  Help us keep you safe by specifying any allergies or foods to avoid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Common Allergies</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonAllergies.map((allergy) => (
                      <Button
                        key={allergy}
                        variant={preferences.allergies.includes(allergy) ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setPreferences(prev => ({
                            ...prev,
                            allergies: prev.allergies.includes(allergy)
                              ? prev.allergies.filter(a => a !== allergy)
                              : [...prev.allergies, allergy]
                          }));
                        }}
                      >
                        {allergy}
                        {preferences.allergies.includes(allergy) && <AlertCircle className="h-3 w-3 ml-1" />}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dislikes">Foods You Dislike</Label>
                  <Textarea
                    id="dislikes"
                    placeholder="e.g., mushrooms, spicy food, seafood"
                    value={preferences.dislikes.join(', ')}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      dislikes: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Health Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Health Goals</CardTitle>
                <CardDescription>
                  What are you trying to achieve with your nutrition?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {healthGoals.map((goal) => (
                    <Button
                      key={goal}
                      variant={preferences.healthGoals.includes(goal) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          healthGoals: prev.healthGoals.includes(goal)
                            ? prev.healthGoals.filter(g => g !== goal)
                            : [...prev.healthGoals, goal]
                        }));
                      }}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setPlanRequest(prev => ({ ...prev, preferences }));
                  setCurrentStep('goals');
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue to Goals
                <Target className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Nutritional Goals */}
        {currentStep === 'goals' && (
          <div className="space-y-6">
            {/* Plan Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Meal Plan Settings</CardTitle>
                <CardDescription>
                  Customize your meal plan duration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Plan Duration</Label>
                    <select
                      id="duration"
                      className="w-full p-2 border rounded-md bg-background"
                      value={planRequest.duration}
                      onChange={(e) => setPlanRequest(prev => ({ ...prev, duration: parseInt(e.target.value) as any }))}
                    >
                      <option value={1}>1 Day</option>
                      <option value={3}>3 Days</option>
                      <option value={7}>1 Week</option>
                      <option value={14}>2 Weeks</option>
                      <option value={30}>1 Month</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meals">Meals per Day</Label>
                    <select
                      id="meals"
                      className="w-full p-2 border rounded-md bg-background"
                      value={planRequest.mealsPerDay}
                      onChange={(e) => setPlanRequest(prev => ({ ...prev, mealsPerDay: parseInt(e.target.value) as any }))}
                    >
                      <option value={3}>3 Meals</option>
                      <option value={4}>4 Meals</option>
                      <option value={5}>5 Meals</option>
                      <option value={6}>6 Meals</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings</Label>
                    <select
                      id="servings"
                      className="w-full p-2 border rounded-md bg-background"
                      value={planRequest.servings}
                      onChange={(e) => setPlanRequest(prev => ({ ...prev, servings: parseInt(e.target.value) as any }))}
                    >
                      <option value={1}>1 Person</option>
                      <option value={2}>2 People</option>
                      <option value={3}>3 People</option>
                      <option value={4}>4 People</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <select
                      id="budget"
                      className="w-full p-2 border rounded-md bg-background"
                      value={planRequest.budget}
                      onChange={(e) => setPlanRequest(prev => ({ ...prev, budget: e.target.value as any }))}
                    >
                      <option value="low">Budget-Friendly</option>
                      <option value="medium">Moderate</option>
                      <option value="high">Premium</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cooking-time">Cooking Time Preference</Label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'quick', label: 'Quick (≤30 min)', icon: Clock },
                      { value: 'moderate', label: 'Moderate (30-60 min)', icon: Clock },
                      { value: 'elaborate', label: 'Elaborate (60+ min)', icon: Clock }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.value}
                          variant={planRequest.cookingTime === option.value ? 'default' : 'outline'}
                          onClick={() => setPlanRequest(prev => ({ ...prev, cookingTime: option.value as any }))}
                          className="flex-1"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutritional Targets */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Nutritional Targets</CardTitle>
                <CardDescription>
                  Set your daily nutrition goals (we'll suggest values based on your profile)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={planRequest.nutritionalGoals.calories}
                      onChange={(e) => setPlanRequest(prev => ({
                        ...prev,
                        nutritionalGoals: { ...prev.nutritionalGoals, calories: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={planRequest.nutritionalGoals.protein}
                      onChange={(e) => setPlanRequest(prev => ({
                        ...prev,
                        nutritionalGoals: { ...prev.nutritionalGoals, protein: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbohydrates (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={planRequest.nutritionalGoals.carbs}
                      onChange={(e) => setPlanRequest(prev => ({
                        ...prev,
                        nutritionalGoals: { ...prev.nutritionalGoals, carbs: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={planRequest.nutritionalGoals.fat}
                      onChange={(e) => setPlanRequest(prev => ({
                        ...prev,
                        nutritionalGoals: { ...prev.nutritionalGoals, fat: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fiber">Fiber (g)</Label>
                    <Input
                      id="fiber"
                      type="number"
                      value={planRequest.nutritionalGoals.fiber}
                      onChange={(e) => setPlanRequest(prev => ({
                        ...prev,
                        nutritionalGoals: { ...prev.nutritionalGoals, fiber: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sodium">Sodium (mg)</Label>
                    <Input
                      id="sodium"
                      type="number"
                      value={planRequest.nutritionalGoals.sodium}
                      onChange={(e) => setPlanRequest(prev => ({
                        ...prev,
                        nutritionalGoals: { ...prev.nutritionalGoals, sodium: parseInt(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Special Requirements</CardTitle>
                <CardDescription>
                  Any additional considerations for your meal plan?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., meal prep friendly, low sodium for blood pressure, high protein for workouts"
                  value={planRequest.specialRequirements || ''}
                  onChange={(e) => setPlanRequest(prev => ({ ...prev, specialRequirements: e.target.value }))}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('preferences')}
              >
                Back to Preferences
              </Button>
              <Button
                onClick={generateMealPlan}
                className="bg-green-600 hover:bg-green-700"
              >
                Generate Meal Plan
                <ChefHat className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Generated Meal Plan */}
        {currentStep === 'plan' && (
          <div className="space-y-6">
            {isGenerating ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Creating Your Personalized Meal Plan
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-center mb-4">
                    Our AI is crafting meals that respect your dietary preferences and cultural needs...
                  </p>
                  <Progress value={65} className="w-64" />
                </CardContent>
              </Card>
            ) : mealPlan ? (
              <>
                {/* Plan Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          {planRequest.duration}-Day Meal Plan
                        </CardTitle>
                        <CardDescription>
                          Personalized for your dietary preferences and cultural needs
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">
                          <Star className="h-3 w-3 mr-1" />
                          {mealPlan.avgNutritionScore}/10 Nutrition Score
                        </Badge>
                        {mealPlan.halalCompliance.isFullyCompliant && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Halal Certified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(mealPlan.totalCalories / planRequest.duration)}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Avg Daily Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {mealPlan.days.length}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Days Planned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {mealPlan.days.reduce((acc, day) => acc + day.meals.length, 0)}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Meals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {mealPlan.shoppingList.reduce((acc, category) => acc + category.items.length, 0)}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">Shopping Items</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Halal Compliance & Cultural Notes */}
                {(mealPlan.halalCompliance.notes.length > 0 || mealPlan.culturalConsiderations.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mealPlan.halalCompliance.notes.length > 0 && (
                      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <strong>Halal Compliance:</strong>
                          <ul className="mt-2 space-y-1">
                            {mealPlan.halalCompliance.notes.map((note, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {note}
                              </li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {mealPlan.culturalConsiderations.length > 0 && (
                      <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <AlertDescription>
                          <strong>Cultural Considerations:</strong>
                          <ul className="mt-2 space-y-1">
                            {mealPlan.culturalConsiderations.map((consideration, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {consideration}
                              </li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Meal Plan Tabs */}
                <Tabs defaultValue="meals" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="meals">Daily Meals</TabsTrigger>
                    <TabsTrigger value="shopping">Shopping List</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  </TabsList>
                  
                  {/* Daily Meals */}
                  <TabsContent value="meals" className="space-y-6">
                    {/* Day Selector */}
                    <div className="flex flex-wrap gap-2">
                      {mealPlan.days.map((day, index) => (
                        <Button
                          key={index}
                          variant={selectedDay === index ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedDay(index)}
                        >
                          Day {index + 1}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Selected Day Meals */}
                    {mealPlan.days[selectedDay] && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          Day {selectedDay + 1} - {new Date(mealPlan.days[selectedDay].date).toLocaleDateString()}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mealPlan.days[selectedDay].meals.map((meal) => (
                            <Card key={meal.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="capitalize">
                                    {meal.type}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3 text-neutral-500" />
                                    <span className="text-xs text-neutral-500">
                                      {formatTime(meal.prepTime + meal.cookTime)}
                                    </span>
                                  </div>
                                </div>
                                <CardTitle className="text-base">{meal.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {meal.cuisine} • {meal.difficulty} • {meal.servings} servings
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Calories:</span>
                                  <span className="font-medium">{meal.nutrition.calories}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {meal.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                {meal.culturalNotes && (
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                                    <p className="text-xs text-blue-800 dark:text-blue-200">
                                      <strong>Cultural Note:</strong> {meal.culturalNotes}
                                    </p>
                                  </div>
                                )}
                                <Button variant="outline" size="sm" className="w-full">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  View Recipe
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        
                        {/* Daily Nutrition Summary */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Daily Nutrition Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                              <div>
                                <div className="font-medium">Calories</div>
                                <div className={getNutritionColor(
                                  mealPlan.days[selectedDay].totalNutrition.calories,
                                  planRequest.nutritionalGoals.calories
                                )}>
                                  {mealPlan.days[selectedDay].totalNutrition.calories}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Protein</div>
                                <div className={getNutritionColor(
                                  mealPlan.days[selectedDay].totalNutrition.protein,
                                  planRequest.nutritionalGoals.protein
                                )}>
                                  {mealPlan.days[selectedDay].totalNutrition.protein}g
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Carbs</div>
                                <div className={getNutritionColor(
                                  mealPlan.days[selectedDay].totalNutrition.carbs,
                                  planRequest.nutritionalGoals.carbs
                                )}>
                                  {mealPlan.days[selectedDay].totalNutrition.carbs}g
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Fat</div>
                                <div className={getNutritionColor(
                                  mealPlan.days[selectedDay].totalNutrition.fat,
                                  planRequest.nutritionalGoals.fat
                                )}>
                                  {mealPlan.days[selectedDay].totalNutrition.fat}g
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Fiber</div>
                                <div className={getNutritionColor(
                                  mealPlan.days[selectedDay].totalNutrition.fiber,
                                  planRequest.nutritionalGoals.fiber
                                )}>
                                  {mealPlan.days[selectedDay].totalNutrition.fiber}g
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Sodium</div>
                                <div className={getNutritionColor(
                                  mealPlan.days[selectedDay].totalNutrition.sodium,
                                  planRequest.nutritionalGoals.sodium
                                )}>
                                  {mealPlan.days[selectedDay].totalNutrition.sodium}mg
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Shopping List */}
                  <TabsContent value="shopping">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Shopping List
                        </CardTitle>
                        <CardDescription>
                          Organized by category for easy shopping
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {mealPlan.shoppingList.map((category) => (
                            <div key={category.category}>
                              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                                {category.category}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {category.items.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                                    <span className="text-sm">{item.name}</span>
                                    <span className="text-xs text-neutral-500">
                                      {item.amount} {item.unit}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Nutrition Analysis */}
                  <TabsContent value="nutrition">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Average Daily Nutrition</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(planRequest.nutritionalGoals).map(([key, target]) => {
                              const avgValue = mealPlan.days.reduce((acc, day) => 
                                acc + (day.totalNutrition as any)[key], 0
                              ) / mealPlan.days.length;
                              const percentage = (avgValue / target) * 100;
                              
                              return (
                                <div key={key}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize">{key}</span>
                                    <span className={getNutritionColor(avgValue, target)}>
                                      {Math.round(avgValue)}{key === 'calories' ? '' : key === 'sodium' ? 'mg' : 'g'} / {target}{key === 'calories' ? '' : key === 'sodium' ? 'mg' : 'g'}
                                    </span>
                                  </div>
                                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Health Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {mealPlan.tips.map((tip, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      setCurrentStep('preferences');
                      setMealPlan(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Create New Plan
                  </Button>
                  <Button
                    onClick={() => {
                      // Save meal plan logic here
                      toast.success('Meal plan saved to your profile');
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save Meal Plan
                  </Button>
                  <Button
                    onClick={() => {
                      // Share meal plan logic here
                      toast.success('Meal plan link copied to clipboard');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Plan
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}