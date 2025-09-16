import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft,
  Heart,
  Send,
  AlertTriangle,
  CheckCircle,
  Info,
  Stethoscope
} from 'lucide-react'
import { toast } from 'sonner'

interface SymptomAnalysis {
  severity: 'low' | 'medium' | 'high'
  recommendations: string[]
  possibleConditions: string[]
  disclaimer: string
}

export const AISymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('')
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null)
  const [loading, setLoading] = useState(false)



  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms')
      return
    }

    setLoading(true)
    
    // Simulate AI analysis with mock data
    setTimeout(() => {
      const mockAnalysis: SymptomAnalysis = {
        severity: symptoms.toLowerCase().includes('severe') || symptoms.toLowerCase().includes('pain') ? 'high' : 
                 symptoms.toLowerCase().includes('mild') ? 'low' : 'medium',
        recommendations: [
          'Stay hydrated and get adequate rest',
          'Monitor symptoms for any changes',
          'Consider over-the-counter pain relief if needed',
          'Consult a healthcare provider if symptoms persist'
        ],
        possibleConditions: [
          'Common cold or flu',
          'Stress-related symptoms',
          'Minor viral infection',
          'Seasonal allergies'
        ],
        disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.'
      }
      
      setAnalysis(mockAnalysis)
      setLoading(false)
      toast.success('Symptom analysis completed')
    }, 2000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return CheckCircle
      case 'medium': return Info
      case 'high': return AlertTriangle
      default: return Info
    }
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
              <span className="text-gray-700">AI Symptom Checker</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">AI Symptom Checker</h2>
          </div>
          <p className="text-gray-600">Describe your symptoms and get AI-powered health insights</p>
        </div>

        {/* Symptom Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Describe Your Symptoms</h3>
          <div className="space-y-4">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe your symptoms in detail. Include when they started, their severity, and any other relevant information..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={analyzeSymptoms}
              disabled={loading || !symptoms.trim()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span>{loading ? 'Analyzing...' : 'Analyze Symptoms'}</span>
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Severity Assessment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Assessment</h3>
              <div className="flex items-center space-x-3">
                {React.createElement(getSeverityIcon(analysis.severity), {
                  className: `h-6 w-6 ${getSeverityColor(analysis.severity).split(' ')[0]}`
                })}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
                  {analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)} Priority
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Possible Conditions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Possible Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.possibleConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
                  <p className="text-yellow-700">{analysis.disclaimer}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Situations</h3>
              <p className="text-red-700 mb-2">
                If you are experiencing a medical emergency, please call emergency services immediately.
              </p>
              <p className="text-red-700">
                Seek immediate medical attention for: chest pain, difficulty breathing, severe bleeding, 
                loss of consciousness, or any life-threatening symptoms.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AISymptomChecker