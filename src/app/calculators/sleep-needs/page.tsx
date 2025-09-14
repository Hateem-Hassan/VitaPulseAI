'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Clock, Heart, Activity, AlertCircle, Award } from 'lucide-react'

interface SleepRecommendation {
  minHours: number
  maxHours: number
  optimal: number
  category: string
  description: string
}

const ageGroups = [
  { value: 'newborn', label: 'Newborn (0-3 months)', min: 14, max: 17, optimal: 15.5 },
  { value: 'infant', label: 'Infant (4-11 months)', min: 12, max: 15, optimal: 13.5 },
  { value: 'toddler', label: 'Toddler (1-2 years)', min: 11, max: 14, optimal: 12.5 },
  { value: 'preschool', label: 'Preschooler (3-5 years)', min: 10, max: 13, optimal: 11.5 },
  { value: 'school', label: 'School Age (6-13 years)', min: 9, max: 11, optimal: 10 },
  { value: 'teen', label: 'Teenager (14-17 years)', min: 8, max: 10, optimal: 9 },
  { value: 'young-adult', label: 'Young Adult (18-25 years)', min: 7, max: 9, optimal: 8 },
  { value: 'adult', label: 'Adult (26-64 years)', min: 7, max: 9, optimal: 8 },
  { value: 'older-adult', label: 'Older Adult (65+ years)', min: 7, max: 8, optimal: 7.5 }
]

const lifestyleFactors = [
  { id: 'exercise', label: 'Regular Exercise', adjustment: 0.5 },
  { id: 'stress', label: 'High Stress Levels', adjustment: 0.5 },
  { id: 'illness', label: 'Recent Illness/Recovery', adjustment: 1 },
  { id: 'pregnancy', label: 'Pregnancy', adjustment: 1 },
  { id: 'shift-work', label: 'Shift Work', adjustment: 0.5 },
  { id: 'caffeine', label: 'High Caffeine Intake', adjustment: -0.5 },
  { id: 'alcohol', label: 'Regular Alcohol Consumption', adjustment: 0.5 }
]

export default function SleepNeedsCalculator() {
  const [ageGroup, setAgeGroup] = useState('')
  const [selectedFactors, setSelectedFactors] = useState<string[]>([])
  const [sleepQuality, setSleepQuality] = useState(5)
  const [recommendation, setRecommendation] = useState<SleepRecommendation | null>(null)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const savedPoints = localStorage.getItem('vitapulse_points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }
  }, [])

  const calculateSleepNeeds = () => {
    if (!ageGroup) return

    const baseGroup = ageGroups.find(group => group.value === ageGroup)
    if (!baseGroup) return

    let adjustment = 0
    selectedFactors.forEach(factorId => {
      const factor = lifestyleFactors.find(f => f.id === factorId)
      if (factor) {
        adjustment += factor.adjustment
      }
    })

    // Adjust based on sleep quality (1-10 scale)
    if (sleepQuality <= 3) {
      adjustment += 1 // Poor sleep quality needs more sleep
    } else if (sleepQuality >= 8) {
      adjustment -= 0.5 // Good sleep quality may need slightly less
    }

    const adjustedMin = Math.max(baseGroup.min + adjustment - 0.5, 4)
    const adjustedMax = Math.min(baseGroup.max + adjustment + 0.5, 12)
    const adjustedOptimal = Math.max(Math.min(baseGroup.optimal + adjustment, adjustedMax), adjustedMin)

    let category = 'Normal'
    let description = 'Your sleep needs are within the typical range for your age group.'

    if (adjustment > 1) {
      category = 'Extended'
      description = 'You may need more sleep than average due to lifestyle factors or health conditions.'
    } else if (adjustment < -0.5) {
      category = 'Reduced'
      description = 'You may function well with slightly less sleep, but ensure quality remains high.'
    }

    setRecommendation({
      minHours: Math.round(adjustedMin * 10) / 10,
      maxHours: Math.round(adjustedMax * 10) / 10,
      optimal: Math.round(adjustedOptimal * 10) / 10,
      category,
      description
    })

    // Award points for using the calculator
    const newPoints = points + 10
    setPoints(newPoints)
    localStorage.setItem('vitapulse_points', newPoints.toString())
  }

  const handleFactorToggle = (factorId: string) => {
    setSelectedFactors(prev => 
      prev.includes(factorId) 
        ? prev.filter(id => id !== factorId)
        : [...prev, factorId]
    )
  }

  const getSleepQualityLabel = (value: number) => {
    if (value <= 2) return 'Very Poor'
    if (value <= 4) return 'Poor'
    if (value <= 6) return 'Fair'
    if (value <= 8) return 'Good'
    return 'Excellent'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Moon className="h-12 w-12 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Sleep Needs Calculator</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover your optimal sleep duration based on age, lifestyle, and health factors
            </p>
            <div className="flex items-center justify-center mt-4 text-indigo-600">
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
                <Clock className="h-6 w-6 mr-2 text-indigo-600" />
                Sleep Assessment
              </h2>

              <div className="space-y-6">
                {/* Age Group Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Age Group
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select your age group</option>
                    {ageGroups.map((group) => (
                      <option key={group.value} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sleep Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Sleep Quality: {getSleepQualityLabel(sleepQuality)} ({sleepQuality}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Very Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Lifestyle Factors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Lifestyle Factors (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {lifestyleFactors.map((factor) => (
                      <label key={factor.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFactors.includes(factor.id)}
                          onChange={() => handleFactorToggle(factor.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{factor.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculateSleepNeeds}
                  disabled={!ageGroup}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Calculate Sleep Needs
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
              {recommendation && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Heart className="h-6 w-6 mr-2 text-red-500" />
                    Your Sleep Recommendation
                  </h2>

                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-600 mb-2">
                        {recommendation.optimal} hours
                      </div>
                      <div className="text-lg text-gray-600">
                        Optimal Sleep Duration
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Range: {recommendation.minHours} - {recommendation.maxHours} hours
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Activity className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="font-semibold text-gray-900">
                          Category: {recommendation.category}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {recommendation.description}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Sleep Tips</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Maintain a consistent sleep schedule</li>
                            <li>• Create a relaxing bedtime routine</li>
                            <li>• Keep your bedroom cool and dark</li>
                            <li>• Avoid screens 1 hour before bed</li>
                            <li>• Limit caffeine after 2 PM</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-green-600 font-semibold">
                        +10 Points Earned!
                      </div>
                      <div className="text-sm text-gray-500">
                        Keep tracking your health metrics
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!recommendation && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <Moon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form to get your personalized sleep recommendations
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