'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Utensils, 
  Clock, 
  Users, 
  Leaf, 
  Heart, 
  Globe, 
  ChefHat,
  Calendar,
  Download,
  Share,
  Loader2,
  Star,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface MealPlan {
  id: string;
  day: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  isHalal: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  ingredients: string[];
  instructions: string[];
  culturalNotes?: string;
}

interface MealPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  allergies: string[];
  calorieGoal: number;
  mealsPerDay: number;
  cookingTime: string;
  culturalBackground: string;
  isHalalRequired: boolean;
}

export default function MealPlannerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<MealPreferences>({
    dietaryRestrictions: [],
    cuisinePreferences: [],
    allergies: [],
    calorieGoal: 2000,
    mealsPerDay: 3,
    cookingTime: 'medium',
    culturalBackground: '',
    isHalalRequired: false
  });
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/ai-tools/meal-planner');
    }
  }, [user, loading, router]);

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Halal',
    'Kosher',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low-Carb',
    'High-Protein'
  ];

  const cuisineOptions = [
    'Mediterranean',
    'Middle Eastern',
    'South Asian',
    'East Asian',
    'Mexican',
    'Italian',
    'French',
    'American',
    'African',
    'Latin American'
  ];

  const allergyOptions = [
    'Nuts',
    'Shellfish',
    'Eggs',
    'Dairy',
    'Soy',
    'Wheat/Gluten',
    'Fish',
    'Sesame'
  ];

  const culturalBackgrounds = [
    'Western/European',
    'Middle Eastern',
    'South Asian',
    'East Asian',
    'African',
    'Latin American',
    'Mediterranean',
    'Other'
  ];

  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI meal plan generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock meal plan data
      const mockMealPlan: MealPlan[] = [
        {
          id: '1',
          day: 'Monday',
          meals: {
            breakfast: {
              id: 'b1',
              name: 'Mediterranean Shakshuka',
              description: 'Eggs poached in spiced tomato sauce with herbs',
              calories: 320,
              protein: 18,
              carbs: 12,
              fat: 22,
              prepTime: 25,
              difficulty: 'medium',
              cuisine: 'Mediterranean',
              isHalal: true,
              isVegetarian: true,
              isVegan: false,
              ingredients: ['Eggs', 'Tomatoes', 'Onions', 'Bell peppers', 'Cumin', 'Paprika', 'Olive oil'],
              instructions: [
                'Heat olive oil in a pan',
                'Sauté onions and peppers until soft',
                'Add tomatoes and spices, simmer 10 minutes',
                'Create wells and crack eggs into them',
                'Cover and cook until eggs are set'
              ],
              culturalNotes: 'Popular breakfast dish in Middle Eastern and North African cultures'
            },
            lunch: {
              id: 'l1',
              name: 'Grilled Chicken Quinoa Bowl',
              description: 'Halal grilled chicken with quinoa, vegetables, and tahini dressing',
              calories: 450,
              protein: 35,
              carbs: 40,
              fat: 18,
              prepTime: 30,
              difficulty: 'easy',
              cuisine: 'Mediterranean',
              isHalal: true,
              isVegetarian: false,
              isVegan: false,
              ingredients: ['Halal chicken breast', 'Quinoa', 'Cucumber', 'Tomatoes', 'Red onion', 'Tahini', 'Lemon'],
              instructions: [
                'Cook quinoa according to package instructions',
                'Season and grill chicken breast',
                'Chop vegetables',
                'Make tahini dressing with lemon and herbs',
                'Assemble bowl and drizzle with dressing'
              ]
            },
            dinner: {
              id: 'd1',
              name: 'Moroccan Lamb Tagine',
              description: 'Slow-cooked halal lamb with apricots and aromatic spices',
              calories: 520,
              protein: 42,
              carbs: 28,
              fat: 26,
              prepTime: 120,
              difficulty: 'hard',
              cuisine: 'Middle Eastern',
              isHalal: true,
              isVegetarian: false,
              isVegan: false,
              ingredients: ['Halal lamb shoulder', 'Dried apricots', 'Onions', 'Ginger', 'Cinnamon', 'Saffron', 'Almonds'],
              instructions: [
                'Brown lamb pieces in tagine or heavy pot',
                'Add onions, spices, and aromatics',
                'Add liquid and bring to simmer',
                'Cover and cook slowly for 1.5-2 hours',
                'Add apricots in last 30 minutes',
                'Garnish with almonds and serve'
              ],
              culturalNotes: 'Traditional Moroccan dish, perfect for family gatherings'
            },
            snacks: [
              {
                id: 's1',
                name: 'Dates with Almonds',
                description: 'Natural energy boost with traditional Middle Eastern flavors',
                calories: 150,
                protein: 4,
                carbs: 32,
                fat: 6,
                prepTime: 5,
                difficulty: 'easy',
                cuisine: 'Middle Eastern',
                isHalal: true,
                isVegetarian: true,
                isVegan: true,
                ingredients: ['Medjool dates', 'Raw almonds'],
                instructions: [
                  'Remove pits from dates',
                  'Stuff each date with an almond',
                  'Serve immediately'
                ],
                culturalNotes: 'Traditional Islamic snack, often eaten to break fasts'
              }
            ]
          },
          totalCalories: 1440,
          totalProtein: 99,
          totalCarbs: 112,
          totalFat: 72
        }
      ];

      setMealPlan(mockMealPlan);
      toast.success('Meal plan generated successfully!');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast.error('Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreferenceChange = (key: keyof MealPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayPreference = (key: 'dietaryRestrictions' | 'cuisinePreferences' | 'allergies', value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center">
                <Utensils className="h-8 w-8 mr-3 text-green-600" />
                AI Meal Planner
              </h1>
              <p className="text-gray-600 mt-1">
                Personalized meal plans with cultural sensitivity and Halal compliance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Leaf className="h-3 w-3 mr-1" />
                Culturally Aware
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Heart className="h-3 w-3 mr-1" />
                Halal Certified
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="preferences" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences">Set Preferences</TabsTrigger>
            <TabsTrigger value="meal-plan" disabled={mealPlan.length === 0}>
              View Meal Plan
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Preferences */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Calorie Goal
                    </label>
                    <Input
                      type="number"
                      value={preferences.calorieGoal}
                      onChange={(e) => handlePreferenceChange('calorieGoal', parseInt(e.target.value))}
                      min={1200}
                      max={4000}
                      step={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meals Per Day
                    </label>
                    <Select value={preferences.mealsPerDay.toString()} onValueChange={(value) => handlePreferenceChange('mealsPerDay', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 meals</SelectItem>
                        <SelectItem value="4">3 meals + 1 snack</SelectItem>
                        <SelectItem value="5">3 meals + 2 snacks</SelectItem>
                        <SelectItem value="6">6 small meals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cooking Time Preference
                    </label>
                    <Select value={preferences.cookingTime} onValueChange={(value) => handlePreferenceChange('cookingTime', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick (15-30 min)</SelectItem>
                        <SelectItem value="medium">Medium (30-60 min)</SelectItem>
                        <SelectItem value="long">Long (60+ min)</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Cultural & Religious Preferences */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-purple-600" />
                    Cultural & Religious Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cultural Background
                    </label>
                    <Select value={preferences.culturalBackground} onValueChange={(value) => handlePreferenceChange('culturalBackground', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cultural background" />
                      </SelectTrigger>
                      <SelectContent>
                        {culturalBackgrounds.map((background) => (
                          <SelectItem key={background} value={background}>
                            {background}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="halal"
                      checked={preferences.isHalalRequired}
                      onCheckedChange={(checked) => handlePreferenceChange('isHalalRequired', checked)}
                    />
                    <label htmlFor="halal" className="text-sm font-medium text-gray-700">
                      Halal food required
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dietary Restrictions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Dietary Restrictions
                </CardTitle>
                <CardDescription>
                  Select all that apply to your dietary needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {dietaryOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={preferences.dietaryRestrictions.includes(option)}
                        onCheckedChange={() => toggleArrayPreference('dietaryRestrictions', option)}
                      />
                      <label htmlFor={option} className="text-sm text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cuisine Preferences */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="h-5 w-5 mr-2 text-orange-600" />
                  Cuisine Preferences
                </CardTitle>
                <CardDescription>
                  Choose your favorite cuisines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={preferences.cuisinePreferences.includes(cuisine)}
                        onCheckedChange={() => toggleArrayPreference('cuisinePreferences', cuisine)}
                      />
                      <label htmlFor={cuisine} className="text-sm text-gray-700">
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Allergies & Intolerances
                </CardTitle>
                <CardDescription>
                  Select any allergies or food intolerances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allergyOptions.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={preferences.allergies.includes(allergy)}
                        onCheckedChange={() => toggleArrayPreference('allergies', allergy)}
                      />
                      <label htmlFor={allergy} className="text-sm text-gray-700">
                        {allergy}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateMealPlan}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Your Meal Plan...
                  </>
                ) : (
                  <>
                    <ChefHat className="h-5 w-5 mr-2" />
                    Generate Personalized Meal Plan
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Meal Plan Tab */}
          <TabsContent value="meal-plan" className="space-y-6">
            {mealPlan.length > 0 && (
              <>
                {/* Meal Plan Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Personalized Meal Plan</h2>
                    <p className="text-gray-600">Culturally sensitive and nutritionally balanced</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Day Navigation */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {mealPlan.map((day, index) => (
                    <Button
                      key={day.id}
                      variant={selectedDay === index ? "default" : "outline"}
                      onClick={() => setSelectedDay(index)}
                      className="whitespace-nowrap"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {day.day}
                    </Button>
                  ))}
                </div>

                {/* Selected Day Meal Plan */}
                {mealPlan[selectedDay] && (
                  <div className="space-y-6">
                    {/* Daily Nutrition Summary */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Star className="h-5 w-5 mr-2 text-yellow-500" />
                          Daily Nutrition Summary - {mealPlan[selectedDay].day}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {mealPlan[selectedDay].totalCalories}
                            </div>
                            <div className="text-sm text-gray-600">Calories</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {mealPlan[selectedDay].totalProtein}g
                            </div>
                            <div className="text-sm text-gray-600">Protein</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {mealPlan[selectedDay].totalCarbs}g
                            </div>
                            <div className="text-sm text-gray-600">Carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {mealPlan[selectedDay].totalFat}g
                            </div>
                            <div className="text-sm text-gray-600">Fat</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Meals */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Breakfast */}
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Clock className="h-5 w-5 mr-2 text-orange-500" />
                              Breakfast
                            </span>
                            <div className="flex space-x-2">
                              {mealPlan[selectedDay].meals.breakfast.isHalal && (
                                <Badge className="bg-green-100 text-green-800">Halal</Badge>
                              )}
                              {mealPlan[selectedDay].meals.breakfast.isVegetarian && (
                                <Badge className="bg-blue-100 text-blue-800">Vegetarian</Badge>
                              )}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {mealPlan[selectedDay].meals.breakfast.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {mealPlan[selectedDay].meals.breakfast.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{mealPlan[selectedDay].meals.breakfast.calories} cal</span>
                            <span>{mealPlan[selectedDay].meals.breakfast.prepTime} min</span>
                            <Badge className={getDifficultyColor(mealPlan[selectedDay].meals.breakfast.difficulty)}>
                              {mealPlan[selectedDay].meals.breakfast.difficulty}
                            </Badge>
                          </div>
                          {mealPlan[selectedDay].meals.breakfast.culturalNotes && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <Globe className="h-4 w-4 inline mr-1" />
                                {mealPlan[selectedDay].meals.breakfast.culturalNotes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Lunch */}
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Utensils className="h-5 w-5 mr-2 text-blue-500" />
                              Lunch
                            </span>
                            <div className="flex space-x-2">
                              {mealPlan[selectedDay].meals.lunch.isHalal && (
                                <Badge className="bg-green-100 text-green-800">Halal</Badge>
                              )}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {mealPlan[selectedDay].meals.lunch.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {mealPlan[selectedDay].meals.lunch.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{mealPlan[selectedDay].meals.lunch.calories} cal</span>
                            <span>{mealPlan[selectedDay].meals.lunch.prepTime} min</span>
                            <Badge className={getDifficultyColor(mealPlan[selectedDay].meals.lunch.difficulty)}>
                              {mealPlan[selectedDay].meals.lunch.difficulty}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Dinner */}
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                              <ChefHat className="h-5 w-5 mr-2 text-purple-500" />
                              Dinner
                            </span>
                            <div className="flex space-x-2">
                              {mealPlan[selectedDay].meals.dinner.isHalal && (
                                <Badge className="bg-green-100 text-green-800">Halal</Badge>
                              )}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {mealPlan[selectedDay].meals.dinner.name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {mealPlan[selectedDay].meals.dinner.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{mealPlan[selectedDay].meals.dinner.calories} cal</span>
                            <span>{mealPlan[selectedDay].meals.dinner.prepTime} min</span>
                            <Badge className={getDifficultyColor(mealPlan[selectedDay].meals.dinner.difficulty)}>
                              {mealPlan[selectedDay].meals.dinner.difficulty}
                            </Badge>
                          </div>
                          {mealPlan[selectedDay].meals.dinner.culturalNotes && (
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-sm text-purple-800">
                                <Globe className="h-4 w-4 inline mr-1" />
                                {mealPlan[selectedDay].meals.dinner.culturalNotes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Snacks */}
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Heart className="h-5 w-5 mr-2 text-green-500" />
                            Snacks
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {mealPlan[selectedDay].meals.snacks.map((snack, index) => (
                            <div key={snack.id} className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-semibold">{snack.name}</h4>
                              <p className="text-gray-600 text-sm">{snack.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                                <span>{snack.calories} cal</span>
                                <span>{snack.prepTime} min</span>
                                {snack.isHalal && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Halal</Badge>
                                )}
                                {snack.isVegan && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">Vegan</Badge>
                                )}
                              </div>
                              {snack.culturalNotes && (
                                <div className="bg-green-50 p-2 rounded mt-2">
                                  <p className="text-sm text-green-800">
                                    <Globe className="h-3 w-3 inline mr-1" />
                                    {snack.culturalNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}