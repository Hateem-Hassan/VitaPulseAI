import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Calculator, Stethoscope, UtensilsCrossed, ArrowRight } from 'lucide-react'

export const GetStarted: React.FC = () => {
  const features = [
    {
      title: 'Health Calculators',
      description: 'Calculate BMI, TDEE, and body fat percentage with our advanced tools',
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
      description: 'Track your meals and nutrition intake easily',
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
            <Link 
              to="/dashboard"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Get Started with VitaPulse AI
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your comprehensive health companion powered by artificial intelligence.
            Track, analyze, and improve your health journey.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Health Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Health Tools
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access a comprehensive suite of health tools designed to help you make informed decisions about your wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 group"
                >
                  <div className={`inline-flex p-3 ${feature.color} rounded-lg mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-green-600 font-medium">
                    Try it now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose VitaPulse AI?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-gray-600">Advanced algorithms provide personalized health insights</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Accurate Calculations</h4>
              <p className="text-gray-600">Precise health metrics using proven formulas</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UtensilsCrossed className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nutrition Tracking</h4>
              <p className="text-gray-600">Comprehensive food logging and meal planning</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Health Monitoring</h4>
              <p className="text-gray-600">Track symptoms and get AI-powered recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Health?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using VitaPulse AI to improve their health and wellness.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default GetStarted