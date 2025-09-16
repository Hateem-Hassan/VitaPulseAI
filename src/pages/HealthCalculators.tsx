import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft,
  Heart,
  Calculator,
  Activity,
  Target,
  Scale
} from 'lucide-react'

type CalculatorType = 'bmi' | 'tdee' | 'bodyfat'

interface BMIResult {
  bmi: number
  category: string
  healthyRange: string
}

interface TDEEResult {
  bmr: number
  tdee: number
  goals: {
    maintain: number
    lose: number
    gain: number
  }
}

interface BodyFatResult {
  bodyFat: number
  category: string
  leanMass: number
}

export const HealthCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('bmi')
  
  // BMI Calculator State
  const [bmiData, setBmiData] = useState({ height: '', weight: '', unit: 'metric' })
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null)
  
  // TDEE Calculator State
  const [tdeeData, setTdeeData] = useState({
    age: '', gender: 'male', height: '', weight: '', activity: '1.2', unit: 'metric'
  })
  const [tdeeResult, setTdeeResult] = useState<TDEEResult | null>(null)
  
  // Body Fat Calculator State
  const [bodyFatData, setBodyFatData] = useState({
    gender: 'male', age: '', height: '', weight: '', neck: '', waist: '', hip: '', unit: 'metric'
  })
  const [bodyFatResult, setBodyFatResult] = useState<BodyFatResult | null>(null)



  const calculateBMI = () => {
    const { height, weight, unit } = bmiData
    if (!height || !weight) {
      return
    }

    let heightM = parseFloat(height)
    let weightKg = parseFloat(weight)

    if (unit === 'imperial') {
      heightM = heightM * 0.0254 // inches to meters
      weightKg = weightKg * 0.453592 // pounds to kg
    } else {
      heightM = heightM / 100 // cm to meters
    }

    const bmi = weightKg / (heightM * heightM)
    let category = ''
    
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal weight'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obese'

    setBmiResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      healthyRange: '18.5 - 24.9'
    })
  }

  const calculateTDEE = () => {
    const { age, gender, height, weight, activity, unit } = tdeeData
    if (!age || !height || !weight) {
      return
    }

    let heightCm = parseFloat(height)
    let weightKg = parseFloat(weight)

    if (unit === 'imperial') {
      heightCm = parseFloat(height) * 2.54 // inches to cm
      weightKg = parseFloat(weight) * 0.453592 // pounds to kg
    }

    // Mifflin-St Jeor Equation
    let bmr
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * parseFloat(age) + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * parseFloat(age) - 161
    }

    const tdee = bmr * parseFloat(activity)

    setTdeeResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goals: {
        maintain: Math.round(tdee),
        lose: Math.round(tdee - 500),
        gain: Math.round(tdee + 500)
      }
    })
  }

  const calculateBodyFat = () => {
    const { gender, age, height, weight, neck, waist, hip, unit } = bodyFatData
    if (!age || !height || !weight || !neck || !waist || (gender === 'female' && !hip)) {
      return
    }

    let heightCm = parseFloat(height)
    let weightKg = parseFloat(weight)
    let neckCm = parseFloat(neck)
    let waistCm = parseFloat(waist)
    let hipCm = parseFloat(hip)

    if (unit === 'imperial') {
      heightCm = parseFloat(height) * 2.54
      weightKg = parseFloat(weight) * 0.453592
      neckCm = parseFloat(neck) * 2.54
      waistCm = parseFloat(waist) * 2.54
      hipCm = parseFloat(hip) * 2.54
    }

    // US Navy Method
    let bodyFat
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450
    }

    let category = ''
    if (gender === 'male') {
      if (bodyFat < 6) category = 'Essential fat'
      else if (bodyFat < 14) category = 'Athletes'
      else if (bodyFat < 18) category = 'Fitness'
      else if (bodyFat < 25) category = 'Average'
      else category = 'Obese'
    } else {
      if (bodyFat < 14) category = 'Essential fat'
      else if (bodyFat < 21) category = 'Athletes'
      else if (bodyFat < 25) category = 'Fitness'
      else if (bodyFat < 32) category = 'Average'
      else category = 'Obese'
    }

    const leanMass = weightKg * (1 - bodyFat / 100)

    setBodyFatResult({
      bodyFat: Math.round(bodyFat * 10) / 10,
      category,
      leanMass: Math.round(leanMass * 10) / 10
    })
  }

  const calculators = [
    { id: 'bmi', name: 'BMI Calculator', icon: Scale, description: 'Body Mass Index' },
    { id: 'tdee', name: 'TDEE Calculator', icon: Activity, description: 'Total Daily Energy Expenditure' },
    { id: 'bodyfat', name: 'Body Fat Calculator', icon: Target, description: 'Body Fat Percentage' }
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
              <span className="text-gray-700">Health Calculators</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Calculator className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Health Calculators</h2>
          </div>
          <p className="text-gray-600">Calculate your BMI, TDEE, and body fat percentage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calculator Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculators</h3>
              <div className="space-y-2">
                {calculators.map((calc) => {
                  const IconComponent = calc.icon
                  return (
                    <button
                      key={calc.id}
                      onClick={() => setActiveCalculator(calc.id as CalculatorType)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-md transition-colors ${
                        activeCalculator === calc.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{calc.name}</div>
                        <div className="text-xs opacity-75">{calc.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Calculator Content */}
          <div className="lg:col-span-3">
            {activeCalculator === 'bmi' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">BMI Calculator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
                      <select
                        value={bmiData.unit}
                        onChange={(e) => setBmiData({ ...bmiData, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="metric">Metric (cm, kg)</option>
                        <option value="imperial">Imperial (in, lbs)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height ({bmiData.unit === 'metric' ? 'cm' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={bmiData.height}
                        onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={bmiData.unit === 'metric' ? '170' : '67'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight ({bmiData.unit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        value={bmiData.weight}
                        onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={bmiData.unit === 'metric' ? '70' : '154'}
                      />
                    </div>
                    <button
                      onClick={calculateBMI}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Calculate BMI
                    </button>
                  </div>
                  {bmiResult && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Results</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">BMI:</span>
                          <span className="text-2xl font-bold text-blue-600 ml-2">{bmiResult.bmi}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Category:</span>
                          <span className="text-lg font-medium text-gray-900 ml-2">{bmiResult.category}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Healthy Range:</span>
                          <span className="text-sm text-gray-900 ml-2">{bmiResult.healthyRange}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeCalculator === 'tdee' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">TDEE Calculator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          value={tdeeData.age}
                          onChange={(e) => setTdeeData({ ...tdeeData, age: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={tdeeData.gender}
                          onChange={(e) => setTdeeData({ ...tdeeData, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
                      <select
                        value={tdeeData.unit}
                        onChange={(e) => setTdeeData({ ...tdeeData, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="metric">Metric (cm, kg)</option>
                        <option value="imperial">Imperial (in, lbs)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Height ({tdeeData.unit === 'metric' ? 'cm' : 'in'})
                        </label>
                        <input
                          type="number"
                          value={tdeeData.height}
                          onChange={(e) => setTdeeData({ ...tdeeData, height: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={tdeeData.unit === 'metric' ? '170' : '67'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight ({tdeeData.unit === 'metric' ? 'kg' : 'lbs'})
                        </label>
                        <input
                          type="number"
                          value={tdeeData.weight}
                          onChange={(e) => setTdeeData({ ...tdeeData, weight: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={tdeeData.unit === 'metric' ? '70' : '154'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                      <select
                        value={tdeeData.activity}
                        onChange={(e) => setTdeeData({ ...tdeeData, activity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1.2">Sedentary (little/no exercise)</option>
                        <option value="1.375">Light (light exercise 1-3 days/week)</option>
                        <option value="1.55">Moderate (moderate exercise 3-5 days/week)</option>
                        <option value="1.725">Active (hard exercise 6-7 days/week)</option>
                        <option value="1.9">Very Active (very hard exercise, physical job)</option>
                      </select>
                    </div>
                    <button
                      onClick={calculateTDEE}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Calculate TDEE
                    </button>
                  </div>
                  {tdeeResult && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Results</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm text-gray-600">BMR (Basal Metabolic Rate):</span>
                          <span className="text-xl font-bold text-green-600 ml-2">{tdeeResult.bmr} cal/day</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">TDEE (Total Daily Energy Expenditure):</span>
                          <span className="text-xl font-bold text-blue-600 ml-2">{tdeeResult.tdee} cal/day</span>
                        </div>
                        <div className="border-t pt-3">
                          <h5 className="font-medium text-gray-900 mb-2">Calorie Goals:</h5>
                          <div className="space-y-1 text-sm">
                            <div>Maintain weight: <span className="font-medium">{tdeeResult.goals.maintain} cal/day</span></div>
                            <div>Lose weight: <span className="font-medium">{tdeeResult.goals.lose} cal/day</span></div>
                            <div>Gain weight: <span className="font-medium">{tdeeResult.goals.gain} cal/day</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeCalculator === 'bodyfat' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Body Fat Calculator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={bodyFatData.gender}
                          onChange={(e) => setBodyFatData({ ...bodyFatData, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          value={bodyFatData.age}
                          onChange={(e) => setBodyFatData({ ...bodyFatData, age: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="25"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
                      <select
                        value={bodyFatData.unit}
                        onChange={(e) => setBodyFatData({ ...bodyFatData, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="metric">Metric (cm, kg)</option>
                        <option value="imperial">Imperial (in, lbs)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Height ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})
                        </label>
                        <input
                          type="number"
                          value={bodyFatData.height}
                          onChange={(e) => setBodyFatData({ ...bodyFatData, height: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={bodyFatData.unit === 'metric' ? '170' : '67'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight ({bodyFatData.unit === 'metric' ? 'kg' : 'lbs'})
                        </label>
                        <input
                          type="number"
                          value={bodyFatData.weight}
                          onChange={(e) => setBodyFatData({ ...bodyFatData, weight: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={bodyFatData.unit === 'metric' ? '70' : '154'}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Neck ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})
                        </label>
                        <input
                          type="number"
                          value={bodyFatData.neck}
                          onChange={(e) => setBodyFatData({ ...bodyFatData, neck: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={bodyFatData.unit === 'metric' ? '37' : '14.5'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Waist ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})
                        </label>
                        <input
                          type="number"
                          value={bodyFatData.waist}
                          onChange={(e) => setBodyFatData({ ...bodyFatData, waist: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={bodyFatData.unit === 'metric' ? '85' : '33.5'}
                        />
                      </div>
                    </div>
                    {bodyFatData.gender === 'female' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hip ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})
                        </label>
                        <input
                          type="number"
                          value={bodyFatData.hip}
                          onChange={(e) => setBodyFatData({ ...bodyFatData, hip: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={bodyFatData.unit === 'metric' ? '95' : '37.5'}
                        />
                      </div>
                    )}
                    <button
                      onClick={calculateBodyFat}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Calculate Body Fat
                    </button>
                  </div>
                  {bodyFatResult && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Results</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">Body Fat Percentage:</span>
                          <span className="text-2xl font-bold text-blue-600 ml-2">{bodyFatResult.bodyFat}%</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Category:</span>
                          <span className="text-lg font-medium text-gray-900 ml-2">{bodyFatResult.category}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Lean Body Mass:</span>
                          <span className="text-lg font-medium text-gray-900 ml-2">{bodyFatResult.leanMass} kg</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HealthCalculators