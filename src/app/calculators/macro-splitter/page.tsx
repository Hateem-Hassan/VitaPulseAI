'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Zap, Beef, Wheat, Droplets, Award, PieChart } from 'lucide-react'

interface MacroSplit {
  protein: { grams: number; calories: number; percentage: number }
  carbs: { grams: number; calories: number; percentage: number }
  fats: { grams: number; calories: number; percentage: number }
  totalCalories: number
}

const goals = [
  { value: 'weight-loss', label: 'Weight Loss', protein: 30, carbs: 35, fats: 35 },
  { value: 'maintenance', label: 'Maintenance', protein: 25, carbs: 45, fats: 30 },
  { value: 'muscle-gain', label: 'Muscle Gain', protein: 30, carbs: 40, fats: 30 },
  { value: 'athletic', label: 'Athletic Performance', protein: 25, carbs: 50, fats: 25 },
  { value: 'keto', label: 'Ketogenic', protein: 25, carbs: 5, fats: 70 },
  { value: 'low-carb', label: 'Low Carb', protein: 30, carbs: 20, fats: 50 }
]

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little/no exercise)', multiplier: 1.2 },
  { value: 'light', label: 'Light (1-3 days/week)', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate (3-5 days/week)', multiplier: 1.55 },
  { value: 'active', label: 'Very Active (6-7 days/week)', multiplier: 1.725 },
  { value: 'extra', label: 'Extra Active (2x/day, intense)', multiplier: 1.9 }
]

export default function MacroSplitterCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [goal, setGoal] = useState('')
  const [customCalories, setCustomCalories] = useState('')
  const [useCustomCalories, setUseCustomCalories] = useState(false)
  const [macroSplit, setMacroSplit] = useState<MacroSplit | null>(null)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const savedPoints = localStorage.getItem('vitapulse_points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }
  }, [])

  const calculateBMR = () => {
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)
    const ageNum = parseFloat(age)

    if (gender === 'male') {
      return 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum)
    } else {
      return 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum)
    }
  }

  const calculateTDEE = () => {
    const bmr = calculateBMR()
    const activity = activityLevels.find(level => level.value === activityLevel)
    return bmr * (activity?.multiplier || 1.2)
  }

  const calculateMacros = () => {
    if (!goal || (!useCustomCalories && (!weight || !height || !age || !gender || !activityLevel))) {
      return
    }

    let totalCalories: number
    if (useCustomCalories && customCalories) {
      totalCalories = parseFloat(customCalories)
    } else {
      totalCalories = calculateTDEE()
      
      // Adjust calories based on goal
      if (goal === 'weight-loss') {
        totalCalories *= 0.8 // 20% deficit
      } else if (goal === 'muscle-gain') {
        totalCalories *= 1.1 // 10% surplus
      }
    }

    const selectedGoal = goals.find(g => g.value === goal)
    if (!selectedGoal) return

    // Calculate macros
    const proteinCalories = (totalCalories * selectedGoal.protein) / 100
    const carbCalories = (totalCalories * selectedGoal.carbs) / 100
    const fatCalories = (totalCalories * selectedGoal.fats) / 100

    const proteinGrams = proteinCalories / 4 // 4 calories per gram
    const carbGrams = carbCalories / 4 // 4 calories per gram
    const fatGrams = fatCalories / 9 // 9 calories per gram

    setMacroSplit({
      protein: {
        grams: Math.round(proteinGrams),
        calories: Math.round(proteinCalories),
        percentage: selectedGoal.protein
      },
      carbs: {
        grams: Math.round(carbGrams),
        calories: Math.round(carbCalories),
        percentage: selectedGoal.carbs
      },
      fats: {
        grams: Math.round(fatGrams),
        calories: Math.round(fatCalories),
        percentage: selectedGoal.fats
      },
      totalCalories: Math.round(totalCalories)
    })

    // Award points for using the calculator
    const newPoints = points + 15
    setPoints(newPoints)
    localStorage.setItem('vitapulse_points', newPoints.toString())
  }

  const getMacroColor = (macro: string) => {
    switch (macro) {
      case 'protein': return 'text-red-600'
      case 'carbs': return 'text-blue-600'
      case 'fats': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getMacroBg = (macro: string) => {
    switch (macro) {
      case 'protein': return 'bg-red-100 border-red-200'
      case 'carbs': return 'bg-blue-100 border-blue-200'
      case 'fats': return 'bg-yellow-100 border-yellow-200'
      default: return 'bg-gray-100 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <PieChart className="h-12 w-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Macro Splitter Calculator</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Calculate your optimal macronutrient distribution for your fitness goals
            </p>
            <div className="flex items-center justify-center mt-4 text-green-600">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-semibold">{points} Points</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="h-6 w-6 mr-2 text-green-600" />
                Macro Calculator
              </h2>

              <div className="space-y-6">
                {/* Goal Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Fitness Goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select your goal</option>
                    {goals.map((goalOption) => (
                      <option key={goalOption.value} value={goalOption.value}>
                        {goalOption.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Calories Toggle */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useCustomCalories}
                      onChange={(e) => setUseCustomCalories(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I know my daily calorie target
                    </span>
                  </label>
                </div>

                {useCustomCalories ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Calories
                    </label>
                    <input
                      type="number"
                      value={customCalories}
                      onChange={(e) => setCustomCalories(e.target.value)}
                      placeholder="Enter daily calories"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <>
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="Years"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="70"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="175"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Activity Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Activity Level
                      </label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select activity level</option>
                        {activityLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <button
                  onClick={calculateMacros}
                  disabled={!goal || (!useCustomCalories && (!weight || !height || !age || !gender || !activityLevel)) || (useCustomCalories && !customCalories)}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Calculate Macros
                </button>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {macroSplit && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Zap className="h-6 w-6 mr-2 text-green-500" />
                    Your Macro Split
                  </h2>

                  <div className="space-y-6">
                    {/* Total Calories */}
                    <div className="text-center bg-gray-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {macroSplit.totalCalories}
                      </div>
                      <div className="text-lg text-gray-600">Daily Calories</div>
                    </div>

                    {/* Macro Breakdown */}
                    <div className="space-y-4">
                      {/* Protein */}
                      <div className={`border rounded-lg p-4 ${getMacroBg('protein')}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Beef className={`h-5 w-5 mr-2 ${getMacroColor('protein')}`} />
                            <span className="font-semibold text-gray-900">Protein</span>
                          </div>
                          <span className={`font-bold ${getMacroColor('protein')}`}>
                            {macroSplit.protein.percentage}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Grams:</span>
                            <span className="font-semibold ml-2">{macroSplit.protein.grams}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Calories:</span>
                            <span className="font-semibold ml-2">{macroSplit.protein.calories}</span>
                          </div>
                        </div>
                      </div>

                      {/* Carbs */}
                      <div className={`border rounded-lg p-4 ${getMacroBg('carbs')}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Wheat className={`h-5 w-5 mr-2 ${getMacroColor('carbs')}`} />
                            <span className="font-semibold text-gray-900">Carbohydrates</span>
                          </div>
                          <span className={`font-bold ${getMacroColor('carbs')}`}>
                            {macroSplit.carbs.percentage}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Grams:</span>
                            <span className="font-semibold ml-2">{macroSplit.carbs.grams}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Calories:</span>
                            <span className="font-semibold ml-2">{macroSplit.carbs.calories}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fats */}
                      <div className={`border rounded-lg p-4 ${getMacroBg('fats')}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Droplets className={`h-5 w-5 mr-2 ${getMacroColor('fats')}`} />
                            <span className="font-semibold text-gray-900">Fats</span>
                          </div>
                          <span className={`font-bold ${getMacroColor('fats')}`}>
                            {macroSplit.fats.percentage}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Grams:</span>
                            <span className="font-semibold ml-2">{macroSplit.fats.grams}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Calories:</span>
                            <span className="font-semibold ml-2">{macroSplit.fats.calories}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-green-600 font-semibold">
                        +15 Points Earned!
                      </div>
                      <div className="text-sm text-gray-500">
                        Keep tracking your nutrition goals
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!macroSplit && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form to get your personalized macro split
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}