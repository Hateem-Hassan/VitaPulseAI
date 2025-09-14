'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Calendar, Award, Plus, Trash2, BarChart3, Activity, Zap } from 'lucide-react'

interface ProgressEntry {
  id: string
  date: string
  weight?: number
  bodyFat?: number
  muscleMass?: number
  benchPress?: number
  squat?: number
  deadlift?: number
  runTime5k?: number
  pushUps?: number
  pullUps?: number
  waist?: number
  chest?: number
  arms?: number
  thighs?: number
}

interface ProgressAnalysis {
  weightChange: number
  bodyFatChange: number
  strengthGains: {
    benchPress: number
    squat: number
    deadlift: number
    total: number
  }
  enduranceGains: {
    runTime5k: number
    pushUps: number
    pullUps: number
  }
  measurementChanges: {
    waist: number
    chest: number
    arms: number
    thighs: number
  }
  overallProgress: string
  recommendations: string[]
  achievements: string[]
}

const getProgressCategory = (changePercent: number): { color: string; label: string } => {
  if (changePercent > 10) return { color: 'text-green-600', label: 'Excellent' }
  if (changePercent > 5) return { color: 'text-blue-600', label: 'Great' }
  if (changePercent > 0) return { color: 'text-yellow-600', label: 'Good' }
  if (changePercent > -5) return { color: 'text-orange-600', label: 'Maintain' }
  return { color: 'text-red-600', label: 'Needs Focus' }
}

export default function FitnessProgressTracker() {
  const [entries, setEntries] = useState<ProgressEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<Partial<ProgressEntry>>({
    date: new Date().toISOString().split('T')[0]
  })
  const [unit, setUnit] = useState('metric')
  const [analysis, setAnalysis] = useState<ProgressAnalysis | null>(null)
  const [points, setPoints] = useState(0)
  const [activeTab, setActiveTab] = useState('add')

  useEffect(() => {
    const savedPoints = localStorage.getItem('vitapulse_points')
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }

    const savedEntries = localStorage.getItem('fitness_progress_entries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('fitness_progress_entries', JSON.stringify(entries))
      if (entries.length >= 2) {
        analyzeProgress()
      }
    }
  }, [entries])

  const addEntry = () => {
    if (!currentEntry.date) {
      alert('Please select a date for your entry.')
      return
    }

    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: currentEntry.date,
      ...currentEntry
    }

    setEntries(prev => [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    setCurrentEntry({ date: new Date().toISOString().split('T')[0] })

    // Award points for tracking progress
    const newPoints = points + 5
    setPoints(newPoints)
    localStorage.setItem('vitapulse_points', newPoints.toString())

    setActiveTab('progress')
  }

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const analyzeProgress = () => {
    if (entries.length < 2) return

    const firstEntry = entries[0]
    const lastEntry = entries[entries.length - 1]
    const timeSpan = (new Date(lastEntry.date).getTime() - new Date(firstEntry.date).getTime()) / (1000 * 60 * 60 * 24)

    // Calculate changes
    const weightChange = lastEntry.weight && firstEntry.weight ? 
      ((lastEntry.weight - firstEntry.weight) / firstEntry.weight) * 100 : 0
    
    const bodyFatChange = lastEntry.bodyFat && firstEntry.bodyFat ? 
      ((lastEntry.bodyFat - firstEntry.bodyFat) / firstEntry.bodyFat) * 100 : 0

    const strengthGains = {
      benchPress: lastEntry.benchPress && firstEntry.benchPress ? 
        ((lastEntry.benchPress - firstEntry.benchPress) / firstEntry.benchPress) * 100 : 0,
      squat: lastEntry.squat && firstEntry.squat ? 
        ((lastEntry.squat - firstEntry.squat) / firstEntry.squat) * 100 : 0,
      deadlift: lastEntry.deadlift && firstEntry.deadlift ? 
        ((lastEntry.deadlift - firstEntry.deadlift) / firstEntry.deadlift) * 100 : 0,
      total: 0
    }
    strengthGains.total = (strengthGains.benchPress + strengthGains.squat + strengthGains.deadlift) / 3

    const enduranceGains = {
      runTime5k: lastEntry.runTime5k && firstEntry.runTime5k ? 
        ((firstEntry.runTime5k - lastEntry.runTime5k) / firstEntry.runTime5k) * 100 : 0, // Negative because lower time is better
      pushUps: lastEntry.pushUps && firstEntry.pushUps ? 
        ((lastEntry.pushUps - firstEntry.pushUps) / firstEntry.pushUps) * 100 : 0,
      pullUps: lastEntry.pullUps && firstEntry.pullUps ? 
        ((lastEntry.pullUps - firstEntry.pullUps) / firstEntry.pullUps) * 100 : 0
    }

    const measurementChanges = {
      waist: lastEntry.waist && firstEntry.waist ? 
        ((lastEntry.waist - firstEntry.waist) / firstEntry.waist) * 100 : 0,
      chest: lastEntry.chest && firstEntry.chest ? 
        ((lastEntry.chest - firstEntry.chest) / firstEntry.chest) * 100 : 0,
      arms: lastEntry.arms && firstEntry.arms ? 
        ((lastEntry.arms - firstEntry.arms) / firstEntry.arms) * 100 : 0,
      thighs: lastEntry.thighs && firstEntry.thighs ? 
        ((lastEntry.thighs - firstEntry.thighs) / firstEntry.thighs) * 100 : 0
    }

    // Generate recommendations
    const recommendations = []
    const achievements = []

    if (strengthGains.total > 10) {
      achievements.push('Outstanding strength gains!')
    } else if (strengthGains.total > 5) {
      achievements.push('Great strength improvements!')
    } else if (strengthGains.total < 0) {
      recommendations.push('Focus on progressive overload in strength training')
    }

    if (enduranceGains.runTime5k > 5) {
      achievements.push('Excellent cardiovascular improvement!')
    } else if (enduranceGains.runTime5k < 0) {
      recommendations.push('Increase cardio training frequency and intensity')
    }

    if (bodyFatChange < -5) {
      achievements.push('Significant body fat reduction!')
    } else if (bodyFatChange > 5) {
      recommendations.push('Review nutrition plan and increase cardio')
    }

    if (measurementChanges.waist < -3) {
      achievements.push('Great waist reduction!')
    }

    if (measurementChanges.chest > 2 || measurementChanges.arms > 2) {
      achievements.push('Excellent muscle building progress!')
    }

    // General recommendations
    if (timeSpan > 30) {
      recommendations.push('Consider updating your workout routine for continued progress')
    }
    recommendations.push('Maintain consistent tracking for better insights')
    recommendations.push('Ensure adequate rest and recovery between workouts')
    recommendations.push('Stay hydrated and maintain proper nutrition')

    // Overall progress assessment
    const positiveChanges = [
      strengthGains.total > 0,
      enduranceGains.runTime5k > 0,
      bodyFatChange < 0,
      measurementChanges.chest > 0 || measurementChanges.arms > 0
    ].filter(Boolean).length

    let overallProgress = 'Needs Improvement'
    if (positiveChanges >= 3) overallProgress = 'Excellent Progress'
    else if (positiveChanges >= 2) overallProgress = 'Good Progress'
    else if (positiveChanges >= 1) overallProgress = 'Some Progress'

    setAnalysis({
      weightChange,
      bodyFatChange,
      strengthGains,
      enduranceGains,
      measurementChanges,
      overallProgress,
      recommendations,
      achievements
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Fitness Progress Tracker</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your fitness journey with comprehensive progress monitoring and analysis
            </p>
            <div className="flex items-center justify-center mt-4 text-blue-600">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-semibold">{points} Points</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('add')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'add'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Add Entry
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'progress'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                View Progress
              </button>
            </div>
          </div>

          {activeTab === 'add' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="h-6 w-6 mr-2 text-blue-600" />
                Add Progress Entry
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
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Metric (kg, cm)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="imperial"
                        checked={unit === 'imperial'}
                        onChange={(e) => setUnit(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Imperial (lbs, in)</span>
                    </label>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={currentEntry.date || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Body Composition */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Composition</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.weight || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, weight: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Body Fat (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.bodyFat || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, bodyFat: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Muscle Mass ({unit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.muscleMass || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, muscleMass: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Strength Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Strength Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bench Press ({unit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={currentEntry.benchPress || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, benchPress: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Squat ({unit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={currentEntry.squat || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, squat: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deadlift ({unit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={currentEntry.deadlift || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, deadlift: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Endurance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Endurance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        5K Run Time (minutes)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.runTime5k || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, runTime5k: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Push-ups (max reps)
                      </label>
                      <input
                        type="number"
                        value={currentEntry.pushUps || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, pushUps: parseInt(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pull-ups (max reps)
                      </label>
                      <input
                        type="number"
                        value={currentEntry.pullUps || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, pullUps: parseInt(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Body Measurements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waist ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.waist || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, waist: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chest ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.chest || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, chest: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arms ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.arms || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, arms: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thighs ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentEntry.thighs || ''}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, thighs: parseFloat(e.target.value) || undefined }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={addEntry}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add Progress Entry
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              {/* Progress Analysis */}
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                    Progress Analysis
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Overall Progress */}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {analysis.overallProgress}
                      </div>
                      <div className="text-sm text-gray-600">Overall Progress</div>
                    </div>

                    {/* Weight Change */}
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getProgressCategory(Math.abs(analysis.weightChange)).color}`}>
                        {analysis.weightChange > 0 ? '+' : ''}{analysis.weightChange.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Weight Change</div>
                    </div>

                    {/* Strength Gains */}
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getProgressCategory(analysis.strengthGains.total).color}`}>
                        +{analysis.strengthGains.total.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Strength Gains</div>
                    </div>

                    {/* Body Fat Change */}
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getProgressCategory(-analysis.bodyFatChange).color}`}>
                        {analysis.bodyFatChange > 0 ? '+' : ''}{analysis.bodyFatChange.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Body Fat Change</div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {analysis.achievements.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Achievements
                      </h4>
                      <ul className="text-sm text-green-800 space-y-2">
                        {analysis.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">🏆</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Entries List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Progress Entries ({entries.length})
                </h2>

                {entries.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Entries Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start tracking your fitness progress by adding your first entry
                    </p>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Entry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.slice().reverse().map((entry) => (
                      <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-lg font-semibold text-gray-900">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                          {entry.weight && (
                            <div>
                              <span className="text-gray-600">Weight:</span>
                              <div className="font-medium">{entry.weight} {unit === 'metric' ? 'kg' : 'lbs'}</div>
                            </div>
                          )}
                          {entry.bodyFat && (
                            <div>
                              <span className="text-gray-600">Body Fat:</span>
                              <div className="font-medium">{entry.bodyFat}%</div>
                            </div>
                          )}
                          {entry.benchPress && (
                            <div>
                              <span className="text-gray-600">Bench:</span>
                              <div className="font-medium">{entry.benchPress} {unit === 'metric' ? 'kg' : 'lbs'}</div>
                            </div>
                          )}
                          {entry.squat && (
                            <div>
                              <span className="text-gray-600">Squat:</span>
                              <div className="font-medium">{entry.squat} {unit === 'metric' ? 'kg' : 'lbs'}</div>
                            </div>
                          )}
                          {entry.deadlift && (
                            <div>
                              <span className="text-gray-600">Deadlift:</span>
                              <div className="font-medium">{entry.deadlift} {unit === 'metric' ? 'kg' : 'lbs'}</div>
                            </div>
                          )}
                          {entry.runTime5k && (
                            <div>
                              <span className="text-gray-600">5K Time:</span>
                              <div className="font-medium">{entry.runTime5k} min</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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