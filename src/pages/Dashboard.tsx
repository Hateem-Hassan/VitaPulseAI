import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Activity, 
  Calculator, 
  Stethoscope, 
  UtensilsCrossed, 
  User,
  Heart,
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react'

export const Dashboard: React.FC = () => {

  const quickStats = [
    { label: 'BMI', value: '22.5', status: 'Normal', color: 'text-green-600' },
    { label: 'Daily Steps', value: '8,432', status: 'Goal: 10,000', color: 'text-blue-600' },
    { label: 'Water Intake', value: '1.8L', status: 'Goal: 2.5L', color: 'text-orange-600' },
    { label: 'Sleep', value: '7.2h', status: 'Good', color: 'text-purple-600' }
  ]

  const quickActions = [
    {
      title: 'Health Calculators',
      description: 'Calculate BMI, TDEE, and body fat percentage',
      icon: Calculator,
      link: '/health-calculators',
      color: 'bg-blue-500'
    },
    {
      title: 'AI Symptom Checker',
      description: 'Get AI-powered health insights and recommendations',
      icon: Stethoscope,
      link: '/ai-symptom-checker',
      color: 'bg-green-500'
    },
    {
      title: 'Food Logger',
      description: 'Track your meals and nutrition intake',
      icon: UtensilsCrossed,
      link: '/food-logger',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-green-600">VitaPulse AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome to VitaPulse AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Dashboard</h2>
          <p className="text-gray-600">Track your health metrics and access AI-powered tools</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.status}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full">
                  <Activity className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 group"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 ${action.color} rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">BMI calculated</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Daily step goal achieved</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Meal logged</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard