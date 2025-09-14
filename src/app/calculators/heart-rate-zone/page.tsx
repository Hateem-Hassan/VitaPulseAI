'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Target, Zap, Award, TrendingUp } from 'lucide-react'

interface HeartRateZone {
  name: string
  description: string
  purpose: string
  minBpm: number
  maxBpm: number
  percentage: string
  color: string
  bgColor: string
}

interface HeartRateZones {
  restingHR: number
  maxHR: number
  zones: HeartRateZone[]
}

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner', adjustment: 0 },
  { value: 'intermediate', label: 'Intermediate', adjustment: -5 },
  { value: 'advanced', label: 'Advanced', adjustment: -10 },
  { value: 'elite', label: 'Elite Athlete', adjustment: -15 }
]

export default function HeartRateZoneCalculator() {
  const [age, setAge] = useState('')
  const [restingHR, setRestingHR] = useState('')
  const [fitnessLevel, setFitnessLevel] = useState('beginner')
  const [useKarvonen, setUseKarvonen] = useState(false)
  const [heartRateZones, setHeartRateZones] = useState<HeartRateZones | null>(null)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const savedPoints = localStorage.getItem('vitapulse_points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }
  }, [])

  const calculateHeartRateZones = () => {
    if (!age) return

    const ageNum = parseFloat(age)
    const restingHRNum = parseFloat(restingHR) || 70 // Default resting HR if not provided
    const fitnessAdjustment = fitnessLevels.find(level => level.value === fitnessLevel)?.adjustment || 0

    // Calculate maximum heart rate (220 - age + fitness adjustment)
    const maxHR = 220 - ageNum + fitnessAdjustment

    let zones: HeartRateZone[]

    if (useKarvonen && restingHR) {
      // Karvonen Formula: Target HR = ((Max HR - Resting HR) × %Intensity) + Resting HR
      const hrReserve = maxHR - restingHRNum
      
      zones = [
        {
          name: 'Zone 1: Recovery',
          description: 'Active Recovery',
          purpose: 'Warm-up, cool-down, recovery runs',
          minBpm: Math.round(restingHRNum + (hrReserve * 0.50)),
          maxBpm: Math.round(restingHRNum + (hrReserve * 0.60)),
          percentage: '50-60%',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 border-gray-200'
        },
        {
          name: 'Zone 2: Aerobic Base',
          description: 'Easy Aerobic',
          purpose: 'Base building, fat burning, easy runs',
          minBpm: Math.round(restingHRNum + (hrReserve * 0.60)),
          maxBpm: Math.round(restingHRNum + (hrReserve * 0.70)),
          percentage: '60-70%',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 border-blue-200'
        },
        {
          name: 'Zone 3: Aerobic',
          description: 'Moderate Aerobic',
          purpose: 'Tempo runs, moderate efforts',
          minBpm: Math.round(restingHRNum + (hrReserve * 0.70)),
          maxBpm: Math.round(restingHRNum + (hrReserve * 0.80)),
          percentage: '70-80%',
          color: 'text-green-600',
          bgColor: 'bg-green-100 border-green-200'
        },
        {
          name: 'Zone 4: Lactate Threshold',
          description: 'Hard Aerobic',
          purpose: 'Lactate threshold, race pace training',
          minBpm: Math.round(restingHRNum + (hrReserve * 0.80)),
          maxBpm: Math.round(restingHRNum + (hrReserve * 0.90)),
          percentage: '80-90%',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 border-orange-200'
        },
        {
          name: 'Zone 5: VO2 Max',
          description: 'Maximum Effort',
          purpose: 'VO2 max intervals, neuromuscular power',
          minBpm: Math.round(restingHRNum + (hrReserve * 0.90)),
          maxBpm: maxHR,
          percentage: '90-100%',
          color: 'text-red-600',
          bgColor: 'bg-red-100 border-red-200'
        }
      ]
    } else {
      // Simple percentage of max HR method
      zones = [
        {
          name: 'Zone 1: Recovery',
          description: 'Active Recovery',
          purpose: 'Warm-up, cool-down, recovery runs',
          minBpm: Math.round(maxHR * 0.50),
          maxBpm: Math.round(maxHR * 0.60),
          percentage: '50-60%',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 border-gray-200'
        },
        {
          name: 'Zone 2: Aerobic Base',
          description: 'Easy Aerobic',
          purpose: 'Base building, fat burning, easy runs',
          minBpm: Math.round(maxHR * 0.60),
          maxBpm: Math.round(maxHR * 0.70),
          percentage: '60-70%',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 border-blue-200'
        },
        {
          name: 'Zone 3: Aerobic',
          description: 'Moderate Aerobic',
          purpose: 'Tempo runs, moderate efforts',
          minBpm: Math.round(maxHR * 0.70),
          maxBpm: Math.round(maxHR * 0.80),
          percentage: '70-80%',
          color: 'text-green-600',
          bgColor: 'bg-green-100 border-green-200'
        },
        {
          name: 'Zone 4: Lactate Threshold',
          description: 'Hard Aerobic',
          purpose: 'Lactate threshold, race pace training',
          minBpm: Math.round(maxHR * 0.80),
          maxBpm: Math.round(maxHR * 0.90),
          percentage: '80-90%',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 border-orange-200'
        },
        {
          name: 'Zone 5: VO2 Max',
          description: 'Maximum Effort',
          purpose: 'VO2 max intervals, neuromuscular power',
          minBpm: Math.round(maxHR * 0.90),
          maxBpm: maxHR,
          percentage: '90-100%',
          color: 'text-red-600',
          bgColor: 'bg-red-100 border-red-200'
        }
      ]
    }

    setHeartRateZones({
      restingHR: restingHRNum,
      maxHR,
      zones
    })

    // Award points for using the calculator
    const newPoints = points + 12
    setPoints(newPoints)
    localStorage.setItem('vitapulse_points', newPoints.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-red-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Heart Rate Zone Calculator</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Calculate your optimal heart rate zones for different training intensities
            </p>
            <div className="flex items-center justify-center mt-4 text-red-600">
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
                <Target className="h-6 w-6 mr-2 text-red-600" />
                Zone Calculator
              </h2>

              <div className="space-y-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Fitness Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Fitness Level
                  </label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {fitnessLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Karvonen Method Toggle */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useKarvonen}
                      onChange={(e) => setUseKarvonen(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Use Karvonen Formula (more accurate)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Requires resting heart rate for better accuracy
                  </p>
                </div>

                {/* Resting Heart Rate */}
                {useKarvonen && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resting Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={restingHR}
                      onChange={(e) => setRestingHR(e.target.value)}
                      placeholder="Measure when you wake up (e.g., 60)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Best measured first thing in the morning before getting out of bed
                    </p>
                  </div>
                )}

                <button
                  onClick={calculateHeartRateZones}
                  disabled={!age || (useKarvonen && !restingHR)}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Calculate Heart Rate Zones
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
              {heartRateZones && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Activity className="h-6 w-6 mr-2 text-red-500" />
                    Your Heart Rate Zones
                  </h2>

                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-gray-900">
                          {heartRateZones.maxHR}
                        </div>
                        <div className="text-sm text-gray-600">Max HR (bpm)</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-gray-900">
                          {heartRateZones.restingHR}
                        </div>
                        <div className="text-sm text-gray-600">Resting HR (bpm)</div>
                      </div>
                    </div>

                    {/* Heart Rate Zones */}
                    <div className="space-y-3">
                      {heartRateZones.zones.map((zone, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`border rounded-lg p-4 ${zone.bgColor}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-bold ${zone.color}`}>
                              {zone.name}
                            </h3>
                            <span className={`font-bold ${zone.color}`}>
                              {zone.percentage}
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-gray-900 mb-1">
                            {zone.minBpm} - {zone.maxBpm} bpm
                          </div>
                          <div className="text-sm text-gray-700 mb-2">
                            <strong>{zone.description}</strong>
                          </div>
                          <div className="text-xs text-gray-600">
                            {zone.purpose}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Training Tips</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Spend 80% of training time in Zones 1-2</li>
                            <li>• Use Zone 3 for tempo workouts</li>
                            <li>• Zone 4 for race pace training</li>
                            <li>• Zone 5 for short, high-intensity intervals</li>
                            <li>• Monitor your heart rate with a chest strap or watch</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-red-600 font-semibold">
                        +12 Points Earned!
                      </div>
                      <div className="text-sm text-gray-500">
                        Keep optimizing your training
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!heartRateZones && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-gray-600">
                    Enter your age and fitness level to get your personalized heart rate zones
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