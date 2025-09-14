'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface MealPlan {
  mealPlan: {
    days: Array<{
      day: number;
      meals: Array<{
        type: string;
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
        prepTime: number;
        cookTime: number;
        servings: number;
      }>;
    }>;
    shoppingList: string[];
    mealPrepTips: string[];
  };
}

interface UserProfile {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  healthGoals: string[];
  dietaryRestrictions: string[];
  preferredCuisines: string[];
  calorieTarget: number;
}

interface MealPlannerProps {
  userProfile?: UserProfile;
}

export default function MealPlanner({ userProfile: initialProfile }: MealPlannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [userProfile, setUserProfile] = useState({
    age: initialProfile?.age?.toString() || '',
    gender: initialProfile?.gender || '',
    weight: initialProfile?.weight?.toString() || '',
    height: initialProfile?.height?.toString() || '',
    activityLevel: initialProfile?.activityLevel || 'moderate',
    healthGoals: initialProfile?.healthGoals || [],
    dietaryRestrictions: initialProfile?.dietaryRestrictions || [],
    preferredCuisines: initialProfile?.preferredCuisines || [],
    calorieTarget: initialProfile?.calorieTarget?.toString() || '2000',
  });

  const healthGoals = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'General Wellness',
    'Athletic Performance', 'Heart Health', 'Diabetes Management', 'Digestive Health'
  ];

  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Keto', 'Paleo', 'Low-Carb', 'Low-Sodium', 'Halal', 'Kosher'
  ];

  const cuisines = [
    'Any', 'Mediterranean', 'Asian', 'Italian', 'Mexican',
    'Indian', 'Middle Eastern', 'American', 'French', 'Thai'
  ];

  const handleGenerateMealPlan = async () => {
    if (!userProfile.age || !userProfile.gender || !userProfile.weight || !userProfile.height) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile }),
      });

      if (!response.ok) throw new Error('Failed to generate meal plan');

      const data = await response.json();
      setMealPlan(data.data);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArrayItem = (array: string[], setter: (value: string[]) => void, item: string) => {
    setter(array.includes(item) ? array.filter(i => i !== item) : [...array, item]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ... your existing JSX unchanged ... */}
    </div>
  );
}
