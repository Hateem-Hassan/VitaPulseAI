'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, AlertTriangle, Heart, Zap, Award, TrendingDown, TrendingUp, Shield } from 'lucide-react'

interface StressResult {
  stressLevel: number
  category: string
  description: string
  color: string
  bgColor: string
  riskFactors: string[]
  recommendations: string[]
  physicalSymptoms: string[]
  mentalSymptoms: string[]
  copingStrategies: string[]
}

const stressQuestions = [
  {
    id: 'sleep_quality',
    question: 'How would you rate your sleep quality?',
    options: [
      { value: 1, label: 'Excellent - I sleep well and wake refreshed', weight: 0 },
      { value: 2, label: 'Good - Minor sleep issues occasionally', weight: 1 },
      { value: 3, label: 'Fair - Frequent sleep disturbances', weight: 2 },
      { value: 4, label: 'Poor - Chronic insomnia or restless sleep', weight: 3 }
    ]
  },
  {
    id: 'work_pressure',
    question: 'How much pressure do you feel at work/school?',
    options: [
      { value: 1, label: 'Low - Manageable workload and deadlines', weight: 0 },
      { value: 2, label: 'Moderate - Some pressure but generally manageable', weight: 1 },
      { value: 3, label: 'High - Frequent deadlines and heavy workload', weight: 2 },
      { value: 4, label: 'Overwhelming - Constant pressure and unrealistic demands', weight: 3 }
    ]
  },
  {
    id: 'relationships',
    question: 'How are your personal relationships?',
    options: [
      { value: 1, label: 'Very supportive - Strong social support network', weight: 0 },
      { value: 2, label: 'Generally good - Some minor relationship issues', weight: 1 },
      { value: 3, label: 'Strained - Frequent conflicts or lack of support', weight: 2 },
      { value: 4, label: 'Very difficult - Major relationship problems', weight: 3 }
    ]
  },
  {
    id: 'financial_stress',
    question: 'How concerned are you about finances?',
    options: [
      { value: 1, label: 'Not concerned - Financially secure', weight: 0 },
      { value: 2, label: 'Slightly concerned - Minor financial worries', weight: 1 },
      { value: 3, label: 'Moderately concerned - Significant financial pressure', weight: 2 },
      { value: 4, label: 'Very concerned - Severe financial difficulties', weight: 3 }
    ]
  },
  {
    id: 'physical_symptoms',
    question: 'Do you experience physical symptoms of stress?',
    options: [
      { value: 1, label: 'Rarely - No noticeable physical symptoms', weight: 0 },
      { value: 2, label: 'Occasionally - Minor headaches or tension', weight: 1 },
      { value: 3, label: 'Frequently - Regular headaches, muscle tension, fatigue', weight: 2 },
      { value: 4, label: 'Constantly - Chronic pain, digestive issues, frequent illness', weight: 3 }
    ]
  },
  {
    id: 'emotional_state',
    question: 'How would you describe your emotional state?',
    options: [
      { value: 1, label: 'Stable - Generally calm and positive', weight: 0 },
      { value: 2, label: 'Mostly stable - Occasional mood swings', weight: 1 },
      { value: 3, label: 'Unstable - Frequent anxiety, irritability, or sadness', weight: 2 },
      { value: 4, label: 'Very unstable - Overwhelming emotions, panic attacks', weight: 3 }
    ]
  },
  {
    id: 'coping_mechanisms',
    question: 'How do you typically cope with stress?',
    options: [
      { value: 1, label: 'Healthy coping - Exercise, meditation, hobbies', weight: 0 },
      { value: 2, label: 'Mostly healthy - Some good habits, occasional unhealthy choices', weight: 1 },
      { value: 3, label: 'Mixed coping - Equal healthy and unhealthy strategies', weight: 2 },
      { value: 4, label: 'Unhealthy coping - Alcohol, overeating, isolation, etc.', weight: 3 }
    ]
  },
  {
    id: 'time_management',
    question: 'How well do you manage your time?',
    options: [
      { value: 1, label: 'Excellent - Well-organized with good work-life balance', weight: 0 },
      { value: 2, label: 'Good - Generally organized with minor time pressures', weight: 1 },
      { value: 3, label: 'Poor - Frequently overwhelmed and behind schedule', weight: 2 },
      { value: 4, label: 'Very poor - Constantly rushing and feeling out of control', weight: 3 }
    ]
  }
]

const getStressCategory = (score: number): { category: string; description: string; color: string; bgColor: string } => {
  if (score <= 6) {
    return {
      category: 'Low Stress',
      description: 'You appear to be managing stress well with good coping mechanisms',
      color: 'text-green-600',
      bgColor: 'bg-green-100 border-green-200'
    }
  } else if (score <= 12) {
    return {
      category: 'Moderate Stress',
      description: 'You have some stress factors that could benefit from attention',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 border-yellow-200'
    }
  } else if (score <= 18) {
    return {
      category: 'High Stress',
      description: 'You are experiencing significant stress that may impact your health',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 border-orange-200'
    }
  } else {
    return {
      category: 'Very High Stress',
      description: 'You are under severe stress and should consider professional support',
      color: 'text-red-600',
      bgColor: 'bg-red-100 border-red-200'
    }
  }
}

const getRecommendations = (score: number, answers: Record<string, number>): string[] => {
  const recommendations = []
  
  if (score <= 6) {
    recommendations.push('Continue your current stress management practices')
    recommendations.push('Consider sharing your strategies with others')
    recommendations.push('Maintain regular exercise and healthy sleep habits')
  } else if (score <= 12) {
    recommendations.push('Develop a consistent stress management routine')
    recommendations.push('Practice deep breathing or meditation for 10-15 minutes daily')
    recommendations.push('Ensure you get 7-9 hours of quality sleep')
    recommendations.push('Consider talking to a counselor or therapist')
  } else if (score <= 18) {
    recommendations.push('Prioritize stress reduction as a health necessity')
    recommendations.push('Seek professional counseling or therapy')
    recommendations.push('Consider stress management workshops or programs')
    recommendations.push('Evaluate and reduce major stressors where possible')
    recommendations.push('Practice relaxation techniques multiple times daily')
  } else {
    recommendations.push('Seek immediate professional mental health support')
    recommendations.push('Consider speaking with your doctor about stress-related health impacts')
    recommendations.push('Explore stress management programs or intensive therapy')
    recommendations.push('Prioritize self-care and stress reduction above other commitments')
    recommendations.push('Build a strong support network of family, friends, or support groups')
  }

  // Specific recommendations based on answers
  if (answers.sleep_quality >= 3) {
    recommendations.push('Focus on improving sleep hygiene and creating a bedtime routine')
  }
  if (answers.work_pressure >= 3) {
    recommendations.push('Discuss workload management with your supervisor or HR')
  }
  if (answers.relationships >= 3) {
    recommendations.push('Consider relationship counseling or communication workshops')
  }
  if (answers.financial_stress >= 3) {
    recommendations.push('Seek financial counseling or budgeting assistance')
  }

  return recommendations
}

const getCopingStrategies = (score: number): string[] => {
  const strategies = [
    'Practice deep breathing exercises (4-7-8 technique)',
    'Try progressive muscle relaxation',
    'Use mindfulness meditation apps like Headspace or Calm',
    'Engage in regular physical exercise (even 10-minute walks help)',
    'Maintain a gratitude journal',
    'Limit caffeine and alcohol intake',
    'Connect with supportive friends and family',
    'Set boundaries and learn to say no to excessive demands'
  ]

  if (score > 12) {
    strategies.push('Practice grounding techniques (5-4-3-2-1 sensory method)')
    strategies.push('Consider professional therapy (CBT, mindfulness-based stress reduction)')
    strategies.push('Explore stress-reduction hobbies (art, music, gardening)')
    strategies.push('Join support groups or stress management classes')
  }

  return strategies.slice(0, 6) // Return top 6 strategies
}

export default function StressEstimator() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<StressResult | null>(null)
  const [points, setPoints] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  useEffect(() => {
    const savedPoints = localStorage.getItem('vitapulse_points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }
  }, [])

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const calculateStress = () => {
    const totalQuestions = stressQuestions.length
    const answeredQuestions = Object.keys(answers).length
    
    if (answeredQuestions < totalQuestions) {
      alert('Please answer all questions to get your stress assessment.')
      return
    }

    // Calculate weighted score
    let totalScore = 0
    stressQuestions.forEach(question => {
      const answerValue = answers[question.id]
      const option = question.options.find(opt => opt.value === answerValue)
      if (option) {
        totalScore += option.weight
      }
    })

    const maxScore = stressQuestions.length * 3 // Maximum possible score
    const stressLevel = Math.round((totalScore / maxScore) * 100)

    const categoryInfo = getStressCategory(totalScore)
    const recommendations = getRecommendations(totalScore, answers)
    const copingStrategies = getCopingStrategies(totalScore)

    // Generate risk factors and symptoms based on score
    const riskFactors = []
    const physicalSymptoms = []
    const mentalSymptoms = []

    if (totalScore >= 6) {
      riskFactors.push('Increased risk of anxiety and depression')
      physicalSymptoms.push('Headaches and muscle tension')
      mentalSymptoms.push('Difficulty concentrating')
    }
    if (totalScore >= 12) {
      riskFactors.push('Higher risk of cardiovascular problems')
      riskFactors.push('Weakened immune system')
      physicalSymptoms.push('Digestive issues', 'Sleep disturbances')
      mentalSymptoms.push('Irritability and mood swings', 'Memory problems')
    }
    if (totalScore >= 18) {
      riskFactors.push('Significant risk of burnout')
      riskFactors.push('Increased risk of chronic health conditions')
      physicalSymptoms.push('Chronic fatigue', 'Frequent illness')
      mentalSymptoms.push('Overwhelming anxiety', 'Feelings of hopelessness')
    }

    const stressResult: StressResult = {
      stressLevel,
      ...categoryInfo,
      riskFactors,
      recommendations,
      physicalSymptoms,
      mentalSymptoms,
      copingStrategies
    }

    setResult(stressResult)

    // Award points for completing the assessment
    const newPoints = points + 15
    setPoints(newPoints)
    localStorage.setItem('vitapulse_points', newPoints.toString())
  }

  const resetAssessment = () => {
    setAnswers({})
    setResult(null)
    setCurrentQuestion(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Stress Level Estimator</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Assess your current stress levels and get personalized recommendations for better mental wellness
            </p>
            <div className="flex items-center justify-center mt-4 text-purple-600">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-semibold">{points} Points</span>
            </div>
          </div>

          {!result ? (
            <div className="grid lg:grid-cols-1 gap-8">
              {/* Assessment Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-2 text-purple-600" />
                    Stress Assessment
                  </h2>
                  <div className="text-sm text-gray-500">
                    {Object.keys(answers).length} of {stressQuestions.length} completed
                  </div>
                </div>

                <div className="space-y-8">
                  {stressQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-start cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={answers[question.id] === option.value}
                              onChange={() => handleAnswer(question.id, option.value)}
                              className="mt-1 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-3 text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={calculateStress}
                    disabled={Object.keys(answers).length < stressQuestions.length}
                    className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Calculate My Stress Level
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Heart className="h-6 w-6 mr-2 text-red-500" />
                    Your Stress Assessment
                  </h2>

                  {/* Main Result */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-2 rounded-lg p-6 text-center mb-6 ${result.bgColor}`}
                  >
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {result.stressLevel}%
                    </div>
                    <div className={`text-xl font-semibold mb-2 ${result.color}`}>
                      {result.category}
                    </div>
                    <div className="text-sm text-gray-600">
                      {result.description}
                    </div>
                  </motion.div>

                  {/* Risk Factors */}
                  {result.riskFactors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Potential Risk Factors
                      </h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        {result.riskFactors.map((factor, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Symptoms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {result.physicalSymptoms.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">Physical Symptoms</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          {result.physicalSymptoms.map((symptom, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-orange-600 mr-2">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.mentalSymptoms.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Mental Symptoms</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {result.mentalSymptoms.map((symptom, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-purple-600 font-semibold mb-2">
                      +15 Points Earned!
                    </div>
                    <button
                      onClick={resetAssessment}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Take Assessment Again
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Recommendations
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2 mt-1">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Coping Strategies */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                    Coping Strategies
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-3">
                    {result.copingStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2 mt-1">★</span>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Professional Help Notice */}
                {result.stressLevel > 60 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <h4 className="font-bold text-red-900 mb-2 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Important Notice
                    </h4>
                    <p className="text-sm text-red-800 mb-3">
                      Your stress levels indicate you may benefit from professional support. 
                      Consider speaking with a healthcare provider, counselor, or therapist.
                    </p>
                    <p className="text-xs text-red-700">
                      If you're experiencing thoughts of self-harm, please contact a crisis helpline immediately.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}