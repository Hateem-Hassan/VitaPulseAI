import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, UtensilsCrossed, Clock, Users } from 'lucide-react'

export const MealPlanner: React.FC = () => {
  const [mealPlan, setMealPlan] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: ''
  })

  const [preferences, setPreferences] = useState({
    dietType: 'balanced',
    calories: '2000',
    servings: '2'
  })

  const generateMealPlan = () => {
    // Simple meal plan generation without API calls
    const samplePlans = {
      balanced: {
        breakfast: 'Oatmeal with berries and nuts',
        lunch: 'Grilled chicken salad with mixed vegetables',
        dinner: 'Baked salmon with quinoa and steamed broccoli',
        snacks: 'Greek yogurt with almonds'
      },
      vegetarian: {
        breakfast: 'Avocado toast with tomatoes',
        lunch: 'Lentil soup with whole grain bread',
        dinner: 'Vegetable stir-fry with tofu and brown rice',
        snacks: 'Hummus with carrot sticks'
      },
      keto: {
        breakfast: 'Scrambled eggs with spinach and cheese',
        lunch: 'Caesar salad with grilled chicken (no croutons)',
        dinner: 'Grilled steak with asparagus and cauliflower mash',
        snacks: 'Cheese and nuts'
      }
    }

    const plan = samplePlans[preferences.dietType as keyof typeof samplePlans] || samplePlans.balanced
    setMealPlan(plan)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <Heart className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-green-600">VitaPulse AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UtensilsCrossed className="h-6 w-6 text-gray-600" />
              <span className="text-gray-700">Meal Planner</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Meal Planner</h2>
          <p className="text-gray-600">Create personalized meal plans based on your preferences</p>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Meal Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diet Type
              </label>
              <select
                value={preferences.dietType}
                onChange={(e) => setPreferences({ ...preferences, dietType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto">Keto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Target Calories
              </label>
              <select
                value={preferences.calories}
                onChange={(e) => setPreferences({ ...preferences, calories: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="1500">1500 calories</option>
                <option value="2000">2000 calories</option>
                <option value="2500">2500 calories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Servings
              </label>
              <select
                value={preferences.servings}
                onChange={(e) => setPreferences({ ...preferences, servings: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="4">4 people</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateMealPlan}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Generate Meal Plan
          </button>
        </div>

        {/* Meal Plan Results */}
        {(mealPlan.breakfast || mealPlan.lunch || mealPlan.dinner) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Meal Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Breakfast</h4>
                  <p className="text-yellow-700">{mealPlan.breakfast}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Lunch</h4>
                  <p className="text-blue-700">{mealPlan.lunch}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Dinner</h4>
                  <p className="text-green-700">{mealPlan.dinner}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Snacks</h4>
                  <p className="text-purple-700">{mealPlan.snacks}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default MealPlanner