'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Calculator, 
  Utensils, 
  Heart, 
  Trophy, 
  Users,
  Zap,
  Target,
  TrendingUp,
  Award,
  Shield,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Health Coach',
    description: 'Get personalized health advice powered by advanced AI algorithms',
    color: 'from-blue-500 to-cyan-500',
    points: '+50 pts',
    popular: true
  },
  {
    icon: Calculator,
    title: '20+ Health Calculators',
    description: 'Calculate BMI, BMR, TDEE, and more with professional-grade tools',
    color: 'from-green-500 to-emerald-500',
    points: '+10 pts each',
    popular: true
  },
  {
    icon: Utensils,
    title: 'AI Meal Planner',
    description: 'Generate personalized meal plans based on your dietary preferences',
    color: 'from-orange-500 to-red-500',
    points: '+25 pts',
    popular: true
  },
  {
    icon: Heart,
    title: 'Health Tracking',
    description: 'Monitor your vitals, mood, energy levels, and wellness metrics',
    color: 'from-pink-500 to-rose-500',
    points: '+15 pts',
    popular: false
  },
  {
    icon: Trophy,
    title: 'Gamification',
    description: 'Earn points, unlock achievements, and maintain streaks',
    color: 'from-yellow-500 to-amber-500',
    points: '+5-100 pts',
    popular: true
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with like-minded health enthusiasts and share progress',
    color: 'from-purple-500 to-violet-500',
    points: '+20 pts',
    popular: false
  },
  {
    icon: Zap,
    title: 'Real-time Insights',
    description: 'Get instant feedback and recommendations based on your data',
    color: 'from-indigo-500 to-blue-500',
    points: '+10 pts',
    popular: false
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set and track personalized health and fitness goals',
    color: 'from-teal-500 to-cyan-500',
    points: '+30 pts',
    popular: false
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visualize your health journey with detailed charts and reports',
    color: 'from-emerald-500 to-green-500',
    points: '+15 pts',
    popular: false
  },
  {
    icon: Award,
    title: 'Achievements',
    description: 'Unlock badges and milestones as you reach your health goals',
    color: 'from-amber-500 to-yellow-500',
    points: '+25-500 pts',
    popular: true
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your health data is encrypted and never shared without consent',
    color: 'from-gray-500 to-slate-500',
    points: 'Trust',
    popular: false
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Available in 10+ languages with localized content',
    color: 'from-violet-500 to-purple-500',
    points: 'Global',
    popular: false
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need for
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {' '}Health Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered tools designed to make your health journey 
            engaging, effective, and rewarding.
          </p>
        </motion.div>

        {/* Popular Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Most Popular Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.filter(feature => feature.popular).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
                onClick={() => {
                  // Navigate to appropriate page based on feature
                  const routes = {
                    'AI Health Coach': '/dashboard',
                    '20+ Health Calculators': '/health-calculators',
                    'AI Meal Planner': '/meal-planner',
                    'Health Tracking': '/dashboard',
                    'Gamification': '/achievements',
                    'Community': '/community',
                    'Real-time Insights': '/analytics',
                    'Goal Setting': '/dashboard',
                    'Progress Analytics': '/analytics',
                    'Achievements': '/achievements',
                    'Privacy First': '/dashboard',
                    'Multilingual': '/dashboard'
                  };
                  const route = routes[feature.title as keyof typeof routes] || '/dashboard';
                  window.location.href = route;
                }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {feature.points}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Complete Feature Set
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group cursor-pointer"
                onClick={() => {
                  // Navigate to appropriate page based on feature
                  const routes = {
                    'AI Health Coach': '/dashboard',
                    '20+ Health Calculators': '/health-calculators',
                    'AI Meal Planner': '/meal-planner',
                    'Health Tracking': '/dashboard',
                    'Gamification': '/achievements',
                    'Community': '/community',
                    'Real-time Insights': '/analytics',
                    'Goal Setting': '/dashboard',
                    'Progress Analytics': '/analytics',
                    'Achievements': '/achievements',
                    'Privacy First': '/dashboard',
                    'Multilingual': '/dashboard'
                  };
                  const route = routes[feature.title as keyof typeof routes] || '/dashboard';
                  window.location.href = route;
                }}
              >
                <Card className="p-4 h-full hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.points}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Health Journey?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already transforming their health with VitaPulse. 
              Start earning points and unlocking achievements today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                onClick={() => window.location.href = '/auth/signup'}
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                onClick={() => window.location.href = '/health-calculators'}
              >
                View All Features
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}