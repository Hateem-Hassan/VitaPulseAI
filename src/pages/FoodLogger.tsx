import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft,
  Heart,
  UtensilsCrossed,
  Plus,
  Search,
  Trash2,
  Clock,
  Target
} from 'lucide-react'
import { toast } from 'sonner'

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  serving: string
  quantity: number
}

interface MealEntry {
  id: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: FoodItem[]
  timestamp: Date
}

interface NutritionSummary {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export const FoodLogger: React.FC = () => {
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [showAddFood, setShowAddFood] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Mock food database
  const foodDatabase: Omit<FoodItem, 'id' | 'quantity'>[] = [
    { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, serving: '1 medium (118g)' },
    { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, serving: '1 medium (182g)' },
    { name: 'Chicken Breast', calories: 231, protein: 43.5, carbs: 0, fat: 5, fiber: 0, serving: '100g cooked' },
    { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, serving: '1 cup cooked' },
    { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, serving: '1 cup chopped' },
    { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 12, fiber: 0, serving: '100g cooked' },
    { name: 'Oatmeal', calories: 147, protein: 5.4, carbs: 28, fat: 2.8, fiber: 4, serving: '1 cup cooked' },
    { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, serving: '170g container' },
    { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, serving: '28g (23 nuts)' },
    { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0.1, fiber: 3.9, serving: '1 medium baked' }
  ]



  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addFoodToMeal = () => {
    if (!selectedFood) return

    const newFood: FoodItem = {
      ...selectedFood,
      id: Date.now().toString(),
      quantity,
      calories: selectedFood.calories * quantity,
      protein: selectedFood.protein * quantity,
      carbs: selectedFood.carbs * quantity,
      fat: selectedFood.fat * quantity,
      fiber: selectedFood.fiber * quantity
    }

    const existingMealIndex = meals.findIndex(meal => 
      meal.mealType === selectedMeal && 
      new Date(meal.timestamp).toDateString() === new Date().toDateString()
    )

    if (existingMealIndex >= 0) {
      const updatedMeals = [...meals]
      updatedMeals[existingMealIndex].foods.push(newFood)
      setMeals(updatedMeals)
    } else {
      const newMeal: MealEntry = {
        id: Date.now().toString(),
        mealType: selectedMeal,
        foods: [newFood],
        timestamp: new Date()
      }
      setMeals([...meals, newMeal])
    }

    setSelectedFood(null)
    setQuantity(1)
    setShowAddFood(false)
    toast.success(`${newFood.name} added to ${selectedMeal}`)
  }

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    const updatedMeals = meals.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          foods: meal.foods.filter(food => food.id !== foodId)
        }
      }
      return meal
    }).filter(meal => meal.foods.length > 0)
    
    setMeals(updatedMeals)
    toast.success('Food item removed')
  }

  const getTodaysMeals = () => {
    const today = new Date().toDateString()
    return meals.filter(meal => new Date(meal.timestamp).toDateString() === today)
  }

  const calculateNutritionSummary = (): NutritionSummary => {
    const todaysMeals = getTodaysMeals()
    return todaysMeals.reduce((summary, meal) => {
      meal.foods.forEach(food => {
        summary.calories += food.calories
        summary.protein += food.protein
        summary.carbs += food.carbs
        summary.fat += food.fat
        summary.fiber += food.fiber
      })
      return summary
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })
  }

  const nutritionSummary = calculateNutritionSummary()
  const todaysMeals = getTodaysMeals()

  // Daily goals (example values)
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25
  }

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
    { id: 'lunch', name: 'Lunch', icon: '☀️' },
    { id: 'dinner', name: 'Dinner', icon: '🌙' },
    { id: 'snack', name: 'Snack', icon: '🍎' }
  ]

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
              <span className="text-gray-700">Food Logger</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <UtensilsCrossed className="h-8 w-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Food Logger</h2>
          </div>
          <p className="text-gray-600">Track your daily nutrition and meals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nutrition Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Nutrition</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Calories</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">{Math.round(nutritionSummary.calories)}</span>
                    <span className="text-sm text-gray-500">/{dailyGoals.calories}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((nutritionSummary.calories / dailyGoals.calories) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-xs text-gray-600">Protein</div>
                    <div className="text-sm font-medium">{Math.round(nutritionSummary.protein)}g</div>
                    <div className="text-xs text-gray-500">Goal: {dailyGoals.protein}g</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Carbs</div>
                    <div className="text-sm font-medium">{Math.round(nutritionSummary.carbs)}g</div>
                    <div className="text-xs text-gray-500">Goal: {dailyGoals.carbs}g</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Fat</div>
                    <div className="text-sm font-medium">{Math.round(nutritionSummary.fat)}g</div>
                    <div className="text-xs text-gray-500">Goal: {dailyGoals.fat}g</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Fiber</div>
                    <div className="text-sm font-medium">{Math.round(nutritionSummary.fiber)}g</div>
                    <div className="text-xs text-gray-500">Goal: {dailyGoals.fiber}g</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                  <select
                    value={selectedMeal}
                    onChange={(e) => setSelectedMeal(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {mealTypes.map(meal => (
                      <option key={meal.id} value={meal.id}>
                        {meal.icon} {meal.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAddFood(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Food</span>
                </button>
              </div>
            </div>
          </div>

          {/* Meals */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {mealTypes.map(mealType => {
                const mealData = todaysMeals.find(meal => meal.mealType === mealType.id)
                const mealCalories = mealData?.foods.reduce((sum, food) => sum + food.calories, 0) || 0
                
                return (
                  <div key={mealType.id} className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {mealType.icon} {mealType.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                          {Math.round(mealCalories)} calories
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      {mealData && mealData.foods.length > 0 ? (
                        <div className="space-y-3">
                          {mealData.foods.map(food => (
                            <div key={food.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{food.name}</div>
                                <div className="text-sm text-gray-600">
                                  {food.quantity}x {food.serving} • {Math.round(food.calories)} cal
                                </div>
                                <div className="text-xs text-gray-500">
                                  P: {Math.round(food.protein)}g • C: {Math.round(food.carbs)}g • F: {Math.round(food.fat)}g
                                </div>
                              </div>
                              <button
                                onClick={() => removeFoodFromMeal(mealData.id, food.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <UtensilsCrossed className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No foods logged for {mealType.name.toLowerCase()}</p>
                          <button
                            onClick={() => {
                              setSelectedMeal(mealType.id as any)
                              setShowAddFood(true)
                            }}
                            className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            Add food
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Add Food to {selectedMeal}</h3>
                <button
                  onClick={() => {
                    setShowAddFood(false)
                    setSelectedFood(null)
                    setSearchQuery('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {!selectedFood ? (
                <div>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for foods..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredFoods.map((food, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedFood(food)}
                          className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{food.name}</div>
                          <div className="text-sm text-gray-600">{food.serving} • {food.calories} cal</div>
                          <div className="text-xs text-gray-500">
                            P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedFood.name}</h4>
                    <p className="text-sm text-gray-600">{selectedFood.serving}</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <h5 className="font-medium text-gray-900 mb-2">Nutrition (per {quantity} serving{quantity !== 1 ? 's' : ''})</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Calories: <span className="font-medium">{Math.round(selectedFood.calories * quantity)}</span></div>
                      <div>Protein: <span className="font-medium">{Math.round(selectedFood.protein * quantity * 10) / 10}g</span></div>
                      <div>Carbs: <span className="font-medium">{Math.round(selectedFood.carbs * quantity * 10) / 10}g</span></div>
                      <div>Fat: <span className="font-medium">{Math.round(selectedFood.fat * quantity * 10) / 10}g</span></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedFood(null)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={addFoodToMeal}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Add to {selectedMeal}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodLogger