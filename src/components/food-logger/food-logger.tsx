'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  category: string;
  barcode?: string;
}

interface LoggedFood {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

const CHAIN_RESTAURANTS = {
  mcdonalds: {
    name: "McDonald's",
    items: [
      { name: "Big Mac", calories: 550, protein: 25, carbs: 45, fat: 33, fiber: 3, sugar: 9, sodium: 1010, servingSize: "1 sandwich" },
      { name: "Quarter Pounder", calories: 520, protein: 26, carbs: 42, fat: 26, fiber: 3, sugar: 10, sodium: 950, servingSize: "1 sandwich" },
      { name: "McChicken", calories: 400, protein: 14, carbs: 39, fat: 22, fiber: 2, sugar: 5, sodium: 750, servingSize: "1 sandwich" },
      { name: "French Fries (Medium)", calories: 320, protein: 4, carbs: 43, fat: 15, fiber: 4, sugar: 0, sodium: 260, servingSize: "1 medium" },
      { name: "Apple Pie", calories: 240, protein: 2, carbs: 33, fat: 11, fiber: 1, sugar: 13, sodium: 170, servingSize: "1 pie" },
    ]
  },
  kfc: {
    name: "KFC",
    items: [
      { name: "Original Recipe Chicken (2 pieces)", calories: 360, protein: 30, carbs: 11, fat: 22, fiber: 0, sugar: 0, sodium: 1080, servingSize: "2 pieces" },
      { name: "Extra Crispy Chicken (2 pieces)", calories: 460, protein: 32, carbs: 12, fat: 32, fiber: 0, sugar: 0, sodium: 1200, servingSize: "2 pieces" },
      { name: "Popcorn Chicken (Large)", calories: 530, protein: 24, carbs: 28, fat: 36, fiber: 2, sugar: 0, sodium: 1400, servingSize: "1 large" },
      { name: "Mashed Potatoes with Gravy", calories: 120, protein: 3, carbs: 18, fat: 4, fiber: 1, sugar: 2, sodium: 530, servingSize: "1 serving" },
    ]
  },
  subway: {
    name: "Subway",
    items: [
      { name: "Turkey Breast 6\"", calories: 280, protein: 18, carbs: 46, fat: 3.5, fiber: 5, sugar: 8, sodium: 810, servingSize: "1 6\" sub" },
      { name: "Chicken Teriyaki 6\"", calories: 370, protein: 26, carbs: 46, fat: 8, fiber: 5, sugar: 16, sodium: 830, servingSize: "1 6\" sub" },
      { name: "Veggie Delite 6\"", calories: 200, protein: 9, carbs: 40, fat: 2, fiber: 5, sugar: 8, sodium: 280, servingSize: "1 6\" sub" },
      { name: "Meatball Marinara 6\"", calories: 480, protein: 20, carbs: 48, fat: 20, fiber: 5, sugar: 12, sodium: 1280, servingSize: "1 6\" sub" },
    ]
  },
  starbucks: {
    name: "Starbucks",
    items: [
      { name: "Grande Caffè Latte", calories: 190, protein: 13, carbs: 18, fat: 7, fiber: 0, sugar: 18, sodium: 170, servingSize: "1 grande" },
      { name: "Grande Cappuccino", calories: 120, protein: 8, carbs: 12, fat: 4, fiber: 0, sugar: 10, sodium: 115, servingSize: "1 grande" },
      { name: "Grande Mocha", calories: 360, protein: 13, carbs: 35, fat: 19, fiber: 3, sugar: 32, sodium: 170, servingSize: "1 grande" },
      { name: "Blueberry Muffin", calories: 350, protein: 5, carbs: 49, fat: 14, fiber: 1, sugar: 25, sodium: 420, servingSize: "1 muffin" },
    ]
  }
};

export default function FoodLogger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  // Calculate daily totals
  const dailyTotals = loggedFoods.reduce((totals, loggedFood) => {
    const food = loggedFood.foodItem;
    const multiplier = loggedFood.quantity;
    
    return {
      calories: totals.calories + (food.calories * multiplier),
      protein: totals.protein + (food.protein * multiplier),
      carbs: totals.carbs + (food.carbs * multiplier),
      fat: totals.fat + (food.fat * multiplier),
      fiber: totals.fiber + (food.fiber * multiplier),
      sugar: totals.sugar + (food.sugar * multiplier),
      sodium: totals.sodium + (food.sodium * multiplier),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });

  const searchFoods = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would call your food database API
      const allItems: FoodItem[] = [];
      
      // Add chain restaurant items
      Object.values(CHAIN_RESTAURANTS).forEach(restaurant => {
        restaurant.items.forEach(item => {
          allItems.push({
            id: `${restaurant.name}-${item.name}`,
            name: item.name,
            brand: restaurant.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            fiber: item.fiber,
            sugar: item.sugar,
            sodium: item.sodium,
            servingSize: item.servingSize,
            category: 'Fast Food',
          });
        });
      });

      // Filter results based on search query
      const filtered = allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFoodToLog = (foodItem: FoodItem, quantity: number = 1, unit: string = 'serving', mealType: LoggedFood['mealType'] = 'snack') => {
    const loggedFood: LoggedFood = {
      id: `${foodItem.id}-${Date.now()}`,
      foodItem,
      quantity,
      unit,
      mealType,
      timestamp: new Date().toISOString(),
    };
    
    setLoggedFoods(prev => [...prev, loggedFood]);
  };

  const removeLoggedFood = (id: string) => {
    setLoggedFoods(prev => prev.filter(food => food.id !== id));
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800';
      case 'lunch': return 'bg-blue-100 text-blue-800';
      case 'dinner': return 'bg-purple-100 text-purple-800';
      case 'snack': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Food Logger
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track your meals and nutrition with our comprehensive food database
        </p>
      </div>

      {/* Daily Totals */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Today's Nutrition</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(dailyTotals.calories)}</div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(dailyTotals.protein)}g</div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(dailyTotals.carbs)}g</div>
            <div className="text-sm text-gray-600">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{Math.round(dailyTotals.fat)}g</div>
            <div className="text-sm text-gray-600">Fat</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(dailyTotals.fiber)}g</div>
            <div className="text-sm text-gray-600">Fiber</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{Math.round(dailyTotals.sugar)}g</div>
            <div className="text-sm text-gray-600">Sugar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{Math.round(dailyTotals.sodium)}mg</div>
            <div className="text-sm text-gray-600">Sodium</div>
          </div>
        </div>
      </Card>

      {/* Search Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Add Food</h2>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Search for food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchFoods()}
              className="flex-1"
            />
            <Button onClick={searchFoods} disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : 'Search'}
            </Button>
          </div>

          {/* Restaurant Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Restaurant</label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Restaurants</option>
              {Object.entries(CHAIN_RESTAURANTS).map(([key, restaurant]) => (
                <option key={key} value={key}>{restaurant.name}</option>
              ))}
            </select>
          </div>

          {/* Barcode Scanner Button */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBarcodeScanner(!showBarcodeScanner)}
            >
              📷 Scan Barcode
            </Button>
            <Button variant="outline">
              📸 Photo Recognition
            </Button>
          </div>

          {/* Barcode Scanner */}
          {showBarcodeScanner && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Barcode Scanner</p>
              <p className="text-sm text-gray-500">
                Camera access required for barcode scanning
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Search Results</h3>
          <div className="space-y-2">
            {searchResults.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  {item.brand && <p className="text-sm text-gray-600">{item.brand}</p>}
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{item.calories} cal</span>
                    <span>{item.protein}g protein</span>
                    <span>{item.carbs}g carbs</span>
                    <span>{item.fat}g fat</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    className="w-16"
                    min="0.1"
                    step="0.1"
                    defaultValue="1"
                  />
                  <select className="px-2 py-1 border rounded">
                    <option value="serving">serving</option>
                    <option value="piece">piece</option>
                    <option value="gram">gram</option>
                    <option value="cup">cup</option>
                  </select>
                  <select className="px-2 py-1 border rounded">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                  <Button
                    size="sm"
                    onClick={() => addFoodToLog(item)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Logged Foods */}
      {loggedFoods.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Logged Foods</h3>
          <div className="space-y-2">
            {loggedFoods.map((loggedFood) => (
              <div key={loggedFood.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{loggedFood.foodItem.name}</h4>
                    <Badge className={getMealTypeColor(loggedFood.mealType)}>
                      {loggedFood.mealType}
                    </Badge>
                  </div>
                  {loggedFood.foodItem.brand && (
                    <p className="text-sm text-gray-600">{loggedFood.foodItem.brand}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{Math.round(loggedFood.foodItem.calories * loggedFood.quantity)} cal</span>
                    <span>{Math.round(loggedFood.foodItem.protein * loggedFood.quantity)}g protein</span>
                    <span>{loggedFood.quantity} {loggedFood.unit}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeLoggedFood(loggedFood.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
