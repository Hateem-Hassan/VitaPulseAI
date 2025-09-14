'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Footprints, Target, TrendingUp, Award, Calendar, Activity } from 'lucide-react'

interface StepGoalResult {
  dailySteps: number
  weeklySteps: number
  monthlySteps: number
  caloriesBurned: number
  distanceKm: number
  distanceMiles: number
  timeMinutes: number
  category: string
  description: string
  color: string
  bgColor: string
  recommendations: string[]
}

const fitnessLevels = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', baseSteps: 3000 },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', baseSteps: 5000 },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', baseSteps: 7500 },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week', baseSteps: 10000 },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job', baseSteps: 12500 }
]

const healthGoals = [
  { value: 'maintain', label: 'Maintain Current Health', multiplier: 1.0 },
  { value: 'weight_loss', label: 'Weight Loss', multiplier: 1.3 },
  { value: 'fitness_improvement', label: 'Improve Fitness', multiplier: 1.2 },
  { value: 'heart_health', label: 'Heart Health', multiplier: 1.25 },
  { value: 'diabetes_prevention', label: 'Diabetes Prevention', multiplier: 1.4 },
  { value: 'general_wellness', label: 'General Wellness', multiplier: 1.1 }
]

const ageGroups = [
  { min: 18, max: 29, label: '18-29 years', multiplier: 1.1 },
  { min: 30, max: 39, label: '30-39 years', multiplier: 1.05 },
  { min: 40, max: 49, label: '40-49 years', multiplier: 1.0 },
  { min: 50, max: 59, label: '50-59 years', multiplier: 0.95 },
  { min: 60, max: 69, label: '60-69 years', multiplier: 0.9 },
  { min: 70, max: 100, label: '70+ years', multiplier: 0.8 }
]

const getStepGoalCategory = (steps: number): { category: string; description: string; color: string; bgColor: string } => {
  if (steps < 5000) {
    return {
      category: 'Starter Goal',
      description: 'Great starting point for building a walking habit',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 border-blue-200'
    }
  } else if (steps < 7500) {
    return {
      category: 'Active Goal',
      description: 'Good level of daily activity for health benefits',
      color: 'text-green-600',
      bgColor: 'bg-green-100 border-green-200'
    }
  } else if (steps < 10000) {
    return {
      category: 'Fitness Goal',
      description: 'Excellent target for fitness and weight management',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 border-purple-200'
    }
  } else if (steps < 12500) {
    return {
      category: 'Athletic Goal',
      description: 'High activity level for serious fitness enthusiasts',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 border-orange-200'
    }
  } else {
    return {
      category: 'Elite Goal',
      description: 'Very high activity level for athletes and fitness pros',
      color: 'text-red-600',
      bgColor: 'bg-red-100 border-red-200'
    }
  }
}

export default function StepGoalCalculator() {
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [fitnessLevel, setFitnessLevel] = useState('moderately_active')
  const [healthGoal, setHealthGoal] = useState('maintain')
  const [currentSteps, setCurrentSteps] = useState('')
  const [hasHealthConditions, setHasHealthConditions] = useState(false)
  const [unit, setUnit] = useState('metric')
  const [result, setResult] = useState<StepGoalResult | null>(null)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const savedPoints = localStorage.getItem('vitapulse_points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }
  }, [])

  const calculateStepGoal = () => {
    if (!age || !weight) return

    const ageNum = parseFloat(age)
    const weightNum = parseFloat(weight)
    const currentStepsNum = parseFloat(currentSteps) || 0

    // Get base steps from fitness level
    const fitnessData = fitnessLevels.find(level => level.value === fitnessLevel)
    const baseSteps = fitnessData?.baseSteps || 7500

    // Get age multiplier
    const ageGroup = ageGroups.find(group => ageNum >= group.min && ageNum <= group.max)
    const ageMultiplier = ageGroup?.multiplier || 1.0

    // Get health goal multiplier
    const goalData = healthGoals.find(goal => goal.value === healthGoal)
    const goalMultiplier = goalData?.multiplier || 1.0

    // Adjust for health conditions
    const healthMultiplier = hasHealthConditions ? 0.8 : 1.0

    // Calculate target steps
    let targetSteps = Math.round(baseSteps * ageMultiplier * goalMultiplier * healthMultiplier)

    // If user has current steps, make gradual increase
    if (currentStepsNum > 0) {
      const increase = Math.min(2000, Math.max(500, (targetSteps - currentStepsNum) * 0.3))
      targetSteps = Math.max(targetSteps, currentStepsNum + increase)
    }

    // Ensure minimum and maximum bounds
    targetSteps = Math.max(2000, Math.min(20000, targetSteps))

    // Calculate additional metrics
    const weeklySteps = targetSteps * 7
    const monthlySteps = targetSteps * 30

    // Estimate calories burned (rough estimate: 0.04 calories per step per kg)
    const weightKg = unit === 'metric' ? weightNum : weightNum * 0.453592
    const caloriesBurned = Math.round(targetSteps * 0.04 * weightKg)

    // Estimate distance (average step length: 0.762 meters)
    const distanceKm = (targetSteps * 0.762) / 1000
    const distanceMiles = distanceKm * 0.621371

    // Estimate time (average walking speed: 5 km/h)
    const timeMinutes = Math.round((distanceKm / 5) * 60)

    // Get category info
    const categoryInfo = getStepGoalCategory(targetSteps)

    // Generate recommendations
    const recommendations = []
    if (targetSteps > currentStepsNum + 3000) {
      recommendations.push('Increase gradually by 500-1000 steps per week')
    }
    if (targetSteps >= 10000) {
      recommendations.push('Consider breaking into 2-3 walking sessions throughout the day')
    }
    if (healthGoal === 'weight_loss') {
      recommendations.push('Combine with strength training for better results')
    }
    if (ageNum >= 60) {
      recommendations.push('Focus on consistency rather than intensity')
    }
    recommendations.push('Track your steps with a smartphone app or fitness tracker')
    recommendations.push('Take the stairs instead of elevators when possible')

    const stepGoalResult: StepGoalResult = {
      dailySteps: targetSteps,
      weeklySteps,
      monthlySteps,
      caloriesBurned,
      distanceKm,
      distanceMiles,
      timeMinutes,
      ...categoryInfo,
      recommendations
    }

    setResult(stepGoalResult)

    // Award points for using the calculator
    const newPoints = points + 10
    setPoints(newPoints)
    localStorage.setItem('vitapulse_points', newPoints.toString())
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
              <Footprints className="h-12 w-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Step Goal Calculator</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Calculate your personalized daily step goal for optimal health and fitness
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
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Unit Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Measurement Unit
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="metric"
                        checked={unit === 'metric'}
                        onChange={(e) => setUnit(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Metric (cm, kg)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="imperial"
                        checked={unit === 'imperial'}
                        onChange={(e) => setUnit(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Imperial (in, lbs)</span>
                    </label>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="30"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={unit === 'metric' ? '70' : '154'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height ({unit === 'metric' ? 'cm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={unit === 'metric' ? '170' : '67'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Current Steps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Daily Steps (optional)
                  </label>
                  <input
                    type="number"
                    value={currentSteps}
                    onChange={(e) => setCurrentSteps(e.target.value)}
                    placeholder="5000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If provided, we'll suggest a gradual increase from your current level
                  </p>
                </div>

                {/* Fitness Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Fitness Level
                  </label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {fitnessLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Health Goal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Primary Health Goal
                  </label>
                  <select
                    value={healthGoal}
                    onChange={(e) => setHealthGoal(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {healthGoals.map((goal) => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Health Conditions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hasHealthConditions}
                      onChange={(e) => setHasHealthConditions(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I have health conditions that may limit my activity
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    This will adjust your goal to be more conservative
                  </p>
                </div>

                <button
                  onClick={calculateStepGoal}
                  disabled={!age || !weight}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Calculate My Step Goal
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
              {result && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Activity className="h-6 w-6 mr-2 text-green-500" />
                    Your Personalized Step Goal
                  </h2>

                  <div className="space-y-6">
                    {/* Main Goal */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border-2 rounded-lg p-6 text-center ${result.bgColor}`}
                    >
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {result.dailySteps.toLocaleString()}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-2">
                        Steps per Day
                      </div>
                      <div className={`text-sm font-medium ${result.color}`}>
                        {result.category}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {result.description}
                      </div>
                    </motion.div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <Calendar className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900">
                          {result.weeklySteps.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Weekly Steps</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <TrendingUp className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900">
                          {result.caloriesBurned}
                        </div>
                        <div className="text-sm text-gray-600">Calories Burned</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {unit === 'metric' ? result.distanceKm.toFixed(1) : result.distanceMiles.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {unit === 'metric' ? 'Kilometers' : 'Miles'}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {result.timeMinutes}
                        </div>
                        <div className="text-sm text-gray-600">Minutes Walking</div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">Recommendations</h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-center">
                      <div className="text-green-600 font-semibold">
                        +10 Points Earned!
                      </div>
                      <div className="text-sm text-gray-500">
                        Start walking towards your goal
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!result && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <Footprints className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Set Your Goal?
                  </h3>
                  <p className="text-gray-600">
                    Enter your information to get a personalized daily step target
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