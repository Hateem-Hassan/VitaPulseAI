'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Scale, User, Target, TrendingUp, Award, Info } from 'lucide-react'

interface BodyFatResult {
  percentage: number
  category: string
  description: string
  healthRisk: string
  color: string
  bgColor: string
}

interface BodyFatResults {
  navy?: BodyFatResult
  army?: BodyFatResult
  ymca?: BodyFatResult
  average?: BodyFatResult
}

const methods = [
  { value: 'navy', label: 'Navy Method', description: 'Uses waist, neck, and hip measurements' },
  { value: 'army', label: 'Army Method', description: 'Uses height, waist, neck, and hip measurements' },
  { value: 'ymca', label: 'YMCA Method', description: 'Uses waist and weight measurements' }
]

const getBodyFatCategory = (percentage: number, gender: string): BodyFatResult => {
  let category: string
  let description: string
  let healthRisk: string
  let color: string
  let bgColor: string

  if (gender === 'male') {
    if (percentage < 6) {
      category = 'Essential Fat'
      description = 'Below essential fat levels'
      healthRisk = 'Health risk - too low'
      color = 'text-red-600'
      bgColor = 'bg-red-100 border-red-200'
    } else if (percentage < 14) {
      category = 'Athletes'
      description = 'Athletic body fat range'
      healthRisk = 'Excellent'
      color = 'text-green-600'
      bgColor = 'bg-green-100 border-green-200'
    } else if (percentage < 18) {
      category = 'Fitness'
      description = 'Fit and healthy range'
      healthRisk = 'Good'
      color = 'text-blue-600'
      bgColor = 'bg-blue-100 border-blue-200'
    } else if (percentage < 25) {
      category = 'Average'
      description = 'Average body fat range'
      healthRisk = 'Fair'
      color = 'text-yellow-600'
      bgColor = 'bg-yellow-100 border-yellow-200'
    } else {
      category = 'Obese'
      description = 'Above healthy range'
      healthRisk = 'Health risk - too high'
      color = 'text-red-600'
      bgColor = 'bg-red-100 border-red-200'
    }
  } else {
    if (percentage < 12) {
      category = 'Essential Fat'
      description = 'Below essential fat levels'
      healthRisk = 'Health risk - too low'
      color = 'text-red-600'
      bgColor = 'bg-red-100 border-red-200'
    } else if (percentage < 21) {
      category = 'Athletes'
      description = 'Athletic body fat range'
      healthRisk = 'Excellent'
      color = 'text-green-600'
      bgColor = 'bg-green-100 border-green-200'
    } else if (percentage < 25) {
      category = 'Fitness'
      description = 'Fit and healthy range'
      healthRisk = 'Good'
      color = 'text-blue-600'
      bgColor = 'bg-blue-100 border-blue-200'
    } else if (percentage < 32) {
      category = 'Average'
      description = 'Average body fat range'
      healthRisk = 'Fair'
      color = 'text-yellow-600'
      bgColor = 'bg-yellow-100 border-yellow-200'
    } else {
      category = 'Obese'
      description = 'Above healthy range'
      healthRisk = 'Health risk - too high'
      color = 'text-red-600'
      bgColor = 'bg-red-100 border-red-200'
    }
  }

  return {
    percentage,
    category,
    description,
    healthRisk,
    color,
    bgColor
  }
}

export default function BodyFatCalculator() {
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [selectedMethods, setSelectedMethods] = useState(['navy'])
  const [unit, setUnit] = useState('metric')
  const [results, setResults] = useState<BodyFatResults | null>(null)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const savedPoints = localStorage.getItem('vitapulse_points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }
  }, [])

  const calculateNavyMethod = () => {
    if (!waist || !neck || (gender === 'female' && !hip)) return null

    const waistCm = unit === 'metric' ? parseFloat(waist) : parseFloat(waist) * 2.54
    const neckCm = unit === 'metric' ? parseFloat(neck) : parseFloat(neck) * 2.54
    const hipCm = gender === 'female' && hip ? (unit === 'metric' ? parseFloat(hip) : parseFloat(hip) * 2.54) : 0

    let bodyFat: number

    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(parseFloat(height) || 170)) - 450
    } else {
      const heightCm = unit === 'metric' ? parseFloat(height) || 160 : (parseFloat(height) || 63) * 2.54
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450
    }

    return Math.max(0, Math.min(50, bodyFat))
  }

  const calculateArmyMethod = () => {
    if (!height || !waist || !neck || (gender === 'female' && !hip)) return null

    const heightCm = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54
    const waistCm = unit === 'metric' ? parseFloat(waist) : parseFloat(waist) * 2.54
    const neckCm = unit === 'metric' ? parseFloat(neck) : parseFloat(neck) * 2.54
    const hipCm = gender === 'female' && hip ? (unit === 'metric' ? parseFloat(hip) : parseFloat(hip) * 2.54) : 0

    let bodyFat: number

    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450
    }

    return Math.max(0, Math.min(50, bodyFat))
  }

  const calculateYMCAMethod = () => {
    if (!weight || !waist) return null

    const weightKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.453592
    const waistCm = unit === 'metric' ? parseFloat(waist) : parseFloat(waist) * 2.54

    let bodyFat: number

    if (gender === 'male') {
      bodyFat = (waistCm * 0.74) - (weightKg * 0.082) - 44.74
    } else {
      bodyFat = (waistCm * 0.55) - (weightKg * 0.084) - 35.69
    }

    return Math.max(0, Math.min(50, bodyFat))
  }

  const calculateBodyFat = () => {
    const results: BodyFatResults = {}
    const percentages: number[] = []

    if (selectedMethods.includes('navy')) {
      const navyResult = calculateNavyMethod()
      if (navyResult !== null) {
        results.navy = getBodyFatCategory(navyResult, gender)
        percentages.push(navyResult)
      }
    }

    if (selectedMethods.includes('army')) {
      const armyResult = calculateArmyMethod()
      if (armyResult !== null) {
        results.army = getBodyFatCategory(armyResult, gender)
        percentages.push(armyResult)
      }
    }

    if (selectedMethods.includes('ymca')) {
      const ymcaResult = calculateYMCAMethod()
      if (ymcaResult !== null) {
        results.ymca = getBodyFatCategory(ymcaResult, gender)
        percentages.push(ymcaResult)
      }
    }

    if (percentages.length > 1) {
      const average = percentages.reduce((sum, val) => sum + val, 0) / percentages.length
      results.average = getBodyFatCategory(average, gender)
    }

    setResults(results)

    // Award points for using the calculator
    const newPoints = points + 15
    setPoints(newPoints)
    localStorage.setItem('vitapulse_points', newPoints.toString())
  }

  const handleMethodChange = (method: string) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter(m => m !== method))
    } else {
      setSelectedMethods([...selectedMethods, method])
    }
  }

  const canCalculate = () => {
    if (selectedMethods.includes('navy') && (!waist || !neck || (gender === 'female' && !hip))) return false
    if (selectedMethods.includes('army') && (!height || !waist || !neck || (gender === 'female' && !hip))) return false
    if (selectedMethods.includes('ymca') && (!weight || !waist)) return false
    return selectedMethods.length > 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Scale className="h-12 w-12 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Body Fat Calculator</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Calculate your body fat percentage using proven scientific methods
            </p>
            <div className="flex items-center justify-center mt-4 text-purple-600">
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
                <User className="h-6 w-6 mr-2 text-purple-600" />
                Body Measurements
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
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Metric (cm, kg)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="imperial"
                        checked={unit === 'imperial'}
                        onChange={(e) => setUnit(e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Imperial (in, lbs)</span>
                    </label>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gender
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="male"
                        checked={gender === 'male'}
                        onChange={(e) => setGender(e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="female"
                        checked={gender === 'female'}
                        onChange={(e) => setGender(e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Female</span>
                    </label>
                  </div>
                </div>

                {/* Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Calculation Methods
                  </label>
                  <div className="space-y-2">
                    {methods.map((method) => (
                      <label key={method.value} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={selectedMethods.includes(method.value)}
                          onChange={() => handleMethodChange(method.value)}
                          className="mt-1 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="ml-2">
                          <span className="text-sm font-medium text-gray-700">{method.label}</span>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Basic Measurements */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={unit === 'metric' ? '70' : '154'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waist ({unit === 'metric' ? 'cm' : 'inches'})
                    </label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      placeholder={unit === 'metric' ? '80' : '32'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Neck ({unit === 'metric' ? 'cm' : 'inches'})
                    </label>
                    <input
                      type="number"
                      value={neck}
                      onChange={(e) => setNeck(e.target.value)}
                      placeholder={unit === 'metric' ? '37' : '15'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  {gender === 'female' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hip ({unit === 'metric' ? 'cm' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                        placeholder={unit === 'metric' ? '95' : '37'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={calculateBodyFat}
                  disabled={!canCalculate()}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Calculate Body Fat
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
              {results && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="h-6 w-6 mr-2 text-purple-500" />
                    Your Body Fat Results
                  </h2>

                  <div className="space-y-4">
                    {results.navy && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-lg p-4 ${results.navy.bgColor}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">Navy Method</h3>
                          <span className={`font-bold ${results.navy.color}`}>
                            {results.navy.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className={`text-sm ${results.navy.color}`}>
                          {results.navy.category} - {results.navy.healthRisk}
                        </div>
                      </motion.div>
                    )}

                    {results.army && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`border rounded-lg p-4 ${results.army.bgColor}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">Army Method</h3>
                          <span className={`font-bold ${results.army.color}`}>
                            {results.army.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className={`text-sm ${results.army.color}`}>
                          {results.army.category} - {results.army.healthRisk}
                        </div>
                      </motion.div>
                    )}

                    {results.ymca && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`border rounded-lg p-4 ${results.ymca.bgColor}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">YMCA Method</h3>
                          <span className={`font-bold ${results.ymca.color}`}>
                            {results.ymca.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className={`text-sm ${results.ymca.color}`}>
                          {results.ymca.category} - {results.ymca.healthRisk}
                        </div>
                      </motion.div>
                    )}

                    {results.average && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`border-2 rounded-lg p-4 ${results.average.bgColor}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">Average Result</h3>
                          <span className={`font-bold text-lg ${results.average.color}`}>
                            {results.average.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className={`text-sm ${results.average.color} mb-2`}>
                          {results.average.category} - {results.average.healthRisk}
                        </div>
                        <div className="text-xs text-gray-600">
                          {results.average.description}
                        </div>
                      </motion.div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Important Notes</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• These are estimates - DEXA scans are most accurate</li>
                            <li>• Results may vary between methods</li>
                            <li>• Measure consistently at the same time of day</li>
                            <li>• Consider trends over single measurements</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-purple-600 font-semibold">
                        +15 Points Earned!
                      </div>
                      <div className="text-sm text-gray-500">
                        Keep tracking your body composition
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!results && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-gray-600">
                    Enter your measurements and select calculation methods to get your body fat percentage
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