'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Utensils, 
  Clock, 
  Flame, 
  Plus,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  type: string;
  calories: number;
  time: string;
  image: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface RecentMealsProps {
  meals: Meal[];
}

export function RecentMeals({ meals }: RecentMealsProps) {
  const getMealTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'lunch': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'snack': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMealTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Meals
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your latest food entries
            </p>
          </div>
        </div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Log Meal
        </Button>
      </div>

      {meals.length > 0 ? (
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-xl">
                  {getMealTypeIcon(meal.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {meal.name}
                  </h3>
                  <Badge className={getMealTypeColor(meal.type)}>
                    {meal.type}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{meal.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400">
                    <Flame className="h-3 w-3" />
                    <span>{meal.calories} cal</span>
                  </div>
                </div>
                
                {meal.protein && meal.carbs && meal.fat && (
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>P: {meal.protein}g</span>
                    <span>C: {meal.carbs}g</span>
                    <span>F: {meal.fat}g</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No meals logged yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start tracking your nutrition by logging your first meal
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Log Your First Meal
          </Button>
        </div>
      )}

      {meals.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Today's total: {meals.reduce((sum, meal) => sum + meal.calories, 0)} calories</span>
            </div>
            <Button variant="outline" size="sm">
              View All Meals
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}