'use client';

// Food Logger - Comprehensive nutrition tracking with barcode scanning
// Track meals, calories, macros, and nutritional goals

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Search,
  Plus,
  Utensils,
  Coffee,
  Apple,
  Moon,
  BarChart3,
  Target,
  Clock,
  Calendar,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplets,
  Wheat,
  Beef,
  Flame,
  Scale,
  Timer,
  Star,
  Heart,
  Info,
  Filter,
  Download,
  Upload,
  Share2,
  BookOpen,
  ScanLine,
  QrCode
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  cholesterol: number; // mg
  vitaminC?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
}

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  servingSize: string;
  servingsPerContainer?: number;
  nutrition: NutritionInfo;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  verified: boolean;
  imageUrl?: string;
}

interface LoggedFood {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  servingSize: string;
  loggedAt: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
}

interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  water: number; // ml
}

interface NutritionSummary {
  consumed: NutritionInfo & { water: number };
  goals: DailyGoals;
  percentages: Record<keyof NutritionInfo, number>;
}

const mealTypes = [
  { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: 'bg-orange-500' },
  { id: 'lunch', name: 'Lunch', icon: Utensils, color: 'bg-green-500' },
  { id: 'dinner', name: 'Dinner', icon: Utensils, color: 'bg-blue-500' },
  { id: 'snack', name: 'Snacks', icon: Apple, color: 'bg-purple-500' }
];

const sampleFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    brand: 'Fresh',
    servingSize: '100g',
    nutrition: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      cholesterol: 85
    },
    category: 'lunch',
    verified: true
  },
  {
    id: '2',
    name: 'Brown Rice',
    brand: 'Organic',
    servingSize: '1 cup cooked',
    nutrition: {
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      fiber: 3.5,
      sugar: 0.7,
      sodium: 10,
      cholesterol: 0
    },
    category: 'lunch',
    verified: true
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    brand: 'Plain',
    servingSize: '1 cup',
    nutrition: {
      calories: 130,
      protein: 23,
      carbs: 9,
      fat: 0,
      fiber: 0,
      sugar: 9,
      sodium: 65,
      cholesterol: 5
    },
    category: 'breakfast',
    verified: true
  },
  {
    id: '4',
    name: 'Almonds',
    brand: 'Raw',
    servingSize: '28g (23 almonds)',
    nutrition: {
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5,
      sugar: 1.2,
      sodium: 1,
      cholesterol: 0
    },
    category: 'snack',
    verified: true
  }
];

export default function FoodLoggerPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddFood, setShowAddFood] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0); // ml
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    calories: userProfile?.daily_calorie_goal || 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
    sodium: 2300,
    water: 2000
  });
  const [editingFood, setEditingFood] = useState<LoggedFood | null>(null);
  const [customFood, setCustomFood] = useState<Partial<FoodItem>>({});
  const [showCustomFood, setShowCustomFood] = useState(false);

  // Load logged foods for selected date
  useEffect(() => {
    loadLoggedFoods();
  }, [selectedDate, user]);

  const loadLoggedFoods = async () => {
    if (!user) return;
    
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('food_logs')
        .select(`
          *,
          food_items (*)
        `)
        .eq('user_id', user.id)
        .gte('logged_at', startOfDay.toISOString())
        .lte('logged_at', endOfDay.toISOString())
        .order('logged_at', { ascending: true });
      
      if (error) throw error;
      
      const foods: LoggedFood[] = data?.map(log => ({
        id: log.id,
        foodItem: log.food_items,
        quantity: log.quantity,
        servingSize: log.serving_size,
        loggedAt: new Date(log.logged_at),
        mealType: log.meal_type,
        notes: log.notes
      })) || [];
      
      setLoggedFoods(foods);
    } catch (error) {
      console.error('Error loading food logs:', error);
      // Use sample data for demo
      setLoggedFoods([]);
    }
  };

  // Search for foods
  const searchFoods = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // First search in database
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(20);
      
      if (error) throw error;
      
      let results: FoodItem[] = data || [];
      
      // If no results, use sample data for demo
      if (results.length === 0) {
        results = sampleFoods.filter(food => 
          food.name.toLowerCase().includes(query.toLowerCase()) ||
          food.brand?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching foods:', error);
      // Fallback to sample data
      const results = sampleFoods.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.brand?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  // Log a food item
  const logFood = async (foodItem: FoodItem, quantity: number = 1, mealType: string = selectedMealType) => {
    if (!user) {
      toast.error('Please sign in to log foods');
      return;
    }
    
    try {
      const loggedFood: LoggedFood = {
        id: Date.now().toString(),
        foodItem,
        quantity,
        servingSize: foodItem.servingSize,
        loggedAt: new Date(),
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
      };
      
      // Add to local state immediately for better UX
      setLoggedFoods(prev => [...prev, loggedFood]);
      
      // Save to database
      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          food_item_id: foodItem.id,
          quantity,
          serving_size: foodItem.servingSize,
          meal_type: mealType,
          logged_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(`${foodItem.name} logged successfully!`);
      setShowAddFood(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error logging food:', error);
      toast.error('Failed to log food');
    }
  };

  // Delete logged food
  const deleteLoggedFood = async (logId: string) => {
    try {
      setLoggedFoods(prev => prev.filter(food => food.id !== logId));
      
      const { error } = await supabase
        .from('food_logs')
        .delete()
        .eq('id', logId);
      
      if (error) throw error;
      
      toast.success('Food removed from log');
    } catch (error) {
      console.error('Error deleting food log:', error);
      toast.error('Failed to remove food');
    }
  };

  // Calculate nutrition summary
  const calculateNutritionSummary = (): NutritionSummary => {
    const consumed = loggedFoods.reduce(
      (total, loggedFood) => {
        const nutrition = loggedFood.foodItem.nutrition;
        const multiplier = loggedFood.quantity;
        
        return {
          calories: total.calories + (nutrition.calories * multiplier),
          protein: total.protein + (nutrition.protein * multiplier),
          carbs: total.carbs + (nutrition.carbs * multiplier),
          fat: total.fat + (nutrition.fat * multiplier),
          fiber: total.fiber + (nutrition.fiber * multiplier),
          sugar: total.sugar + (nutrition.sugar * multiplier),
          sodium: total.sodium + (nutrition.sodium * multiplier),
          cholesterol: total.cholesterol + (nutrition.cholesterol * multiplier),
          water: total.water + waterIntake
        };
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        cholesterol: 0,
        water: waterIntake
      }
    );
    
    const percentages = {
      calories: (consumed.calories / dailyGoals.calories) * 100,
      protein: (consumed.protein / dailyGoals.protein) * 100,
      carbs: (consumed.carbs / dailyGoals.carbs) * 100,
      fat: (consumed.fat / dailyGoals.fat) * 100,
      fiber: (consumed.fiber / dailyGoals.fiber) * 100,
      sugar: 0, // No goal for sugar
      sodium: (consumed.sodium / dailyGoals.sodium) * 100,
      cholesterol: 0 // No goal for cholesterol
    };
    
    return {
      consumed,
      goals: dailyGoals,
      percentages
    };
  };

  // Barcode scanning simulation
  const simulateBarcodeScanning = () => {
    // Simulate finding a product
    setTimeout(() => {
      const randomFood = sampleFoods[Math.floor(Math.random() * sampleFoods.length)];
      setSearchResults([randomFood]);
      setShowBarcodeScanner(false);
      toast.success('Product found!');
    }, 2000);
  };

  // Add water intake
  const addWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
    toast.success(`Added ${amount}ml of water`);
  };

  const nutritionSummary = calculateNutritionSummary();
  const mealFoods = (mealType: string) => loggedFoods.filter(food => food.mealType === mealType);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Utensils className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  Food Logger
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Track your nutrition and reach your health goals
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-auto"
              />
              <Button
                onClick={() => setShowAddFood(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Food
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nutrition Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Overview</CardTitle>
                <CardDescription>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Calories */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Flame className="h-4 w-4 mr-1 text-orange-500" />
                      Calories
                    </span>
                    <span>
                      {Math.round(nutritionSummary.consumed.calories)} / {dailyGoals.calories}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(nutritionSummary.percentages.calories, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {dailyGoals.calories - nutritionSummary.consumed.calories > 0 
                      ? `${Math.round(dailyGoals.calories - nutritionSummary.consumed.calories)} remaining`
                      : `${Math.round(nutritionSummary.consumed.calories - dailyGoals.calories)} over goal`
                    }
                  </div>
                </div>
                
                {/* Macros */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {Math.round(nutritionSummary.consumed.protein)}g
                    </div>
                    <div className="text-xs text-neutral-500">Protein</div>
                    <Progress 
                      value={Math.min(nutritionSummary.percentages.protein, 100)} 
                      className="h-1 mt-1"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {Math.round(nutritionSummary.consumed.carbs)}g
                    </div>
                    <div className="text-xs text-neutral-500">Carbs</div>
                    <Progress 
                      value={Math.min(nutritionSummary.percentages.carbs, 100)} 
                      className="h-1 mt-1"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {Math.round(nutritionSummary.consumed.fat)}g
                    </div>
                    <div className="text-xs text-neutral-500">Fat</div>
                    <Progress 
                      value={Math.min(nutritionSummary.percentages.fat, 100)} 
                      className="h-1 mt-1"
                    />
                  </div>
                </div>
                
                {/* Water Intake */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                      Water
                    </span>
                    <span>{waterIntake} / {dailyGoals.water} ml</span>
                  </div>
                  <Progress 
                    value={Math.min((waterIntake / dailyGoals.water) * 100, 100)} 
                    className="h-2"
                  />
                  <div className="flex space-x-1">
                    {[250, 500, 750].map(amount => (
                      <Button
                        key={amount}
                        size="sm"
                        variant="outline"
                        onClick={() => addWater(amount)}
                        className="flex-1 text-xs"
                      >
                        +{amount}ml
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Fiber</span>
                  <span>{Math.round(nutritionSummary.consumed.fiber)}g / {dailyGoals.fiber}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sugar</span>
                  <span>{Math.round(nutritionSummary.consumed.sugar)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sodium</span>
                  <span>{Math.round(nutritionSummary.consumed.sodium)}mg / {dailyGoals.sodium}mg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cholesterol</span>
                  <span>{Math.round(nutritionSummary.consumed.cholesterol)}mg</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Food Log */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meal Sections */}
            {mealTypes.map((meal) => {
              const Icon = meal.icon;
              const foods = mealFoods(meal.id);
              const mealCalories = foods.reduce((total, food) => 
                total + (food.foodItem.nutrition.calories * food.quantity), 0
              );
              
              return (
                <Card key={meal.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md mr-3 ${meal.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span>{meal.name}</span>
                          <div className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                            {Math.round(mealCalories)} calories
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMealType(meal.id as any);
                          setShowAddFood(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {foods.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                        <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No foods logged for {meal.name.toLowerCase()}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setSelectedMealType(meal.id as any);
                            setShowAddFood(true);
                          }}
                        >
                          Add food
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {foods.map((loggedFood) => (
                          <div
                            key={loggedFood.id}
                            className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{loggedFood.foodItem.name}</div>
                              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                {loggedFood.quantity} × {loggedFood.servingSize}
                                {loggedFood.foodItem.brand && ` • ${loggedFood.foodItem.brand}`}
                              </div>
                              <div className="text-xs text-neutral-400 mt-1">
                                {Math.round(loggedFood.foodItem.nutrition.calories * loggedFood.quantity)} cal
                                • {Math.round(loggedFood.foodItem.nutrition.protein * loggedFood.quantity)}g protein
                                • {Math.round(loggedFood.foodItem.nutrition.carbs * loggedFood.quantity)}g carbs
                                • {Math.round(loggedFood.foodItem.nutrition.fat * loggedFood.quantity)}g fat
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingFood(loggedFood)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteLoggedFood(loggedFood.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Add Food Dialog */}
        <Dialog open={showAddFood} onOpenChange={setShowAddFood}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Food</DialogTitle>
              <DialogDescription>
                Search for foods or scan a barcode to add to your log
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Search and Barcode */}
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchFoods(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => setShowBarcodeScanner(true)}
                  variant="outline"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan
                </Button>
                <Button
                  onClick={() => setShowCustomFood(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Custom
                </Button>
              </div>
              
              {/* Meal Type Selection */}
              <div className="flex space-x-2">
                {mealTypes.map((meal) => {
                  const Icon = meal.icon;
                  return (
                    <Button
                      key={meal.id}
                      variant={selectedMealType === meal.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMealType(meal.id as any)}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {meal.name}
                    </Button>
                  );
                })}
              </div>
              
              {/* Search Results */}
              {isSearching && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-neutral-500 mt-2">Searching...</p>
                </div>
              )}
              
              {searchResults.length > 0 && (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {searchResults.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {food.brand && `${food.brand} • `}
                          {food.servingSize} • {food.nutrition.calories} cal
                        </div>
                        <div className="text-xs text-neutral-400">
                          P: {food.nutrition.protein}g • C: {food.nutrition.carbs}g • F: {food.nutrition.fat}g
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {food.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <Button
                          size="sm"
                          onClick={() => logFood(food)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No foods found for "{searchQuery}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowCustomFood(true)}
                  >
                    Create custom food
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Barcode Scanner Dialog */}
        <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan Barcode</DialogTitle>
              <DialogDescription>
                Point your camera at the product barcode
              </DialogDescription>
            </DialogHeader>
            
            <div className="text-center py-8">
              <div className="relative mx-auto w-64 h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <ScanLine className="h-16 w-16 text-neutral-400 animate-pulse" />
                <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mt-4">Scanning for products...</p>
              <Button
                onClick={simulateBarcodeScanning}
                className="mt-4"
              >
                Simulate Scan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}