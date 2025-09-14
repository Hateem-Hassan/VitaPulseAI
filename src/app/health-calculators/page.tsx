'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Heart, 
  Droplets, 
  Moon, 
  Target, 
  Activity,
  TrendingUp,
  Zap,
  Award,
  Star
} from 'lucide-react';

const calculators = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index',
    icon: Calculator,
    href: '/calculators/bmi',
    color: 'bg-blue-500',
    points: 10,
    popular: true
  },
  {
    id: 'calorie-needs',
    name: 'Calorie Needs',
    description: 'Calculate daily calorie requirements',
    icon: Target,
    href: '/calculators/calorie-needs',
    color: 'bg-green-500',
    points: 15,
    popular: true
  },
  {
    id: 'hydration',
    name: 'Hydration Calculator',
    description: 'Calculate daily water intake',
    icon: Droplets,
    href: '/calculators/hydration',
    color: 'bg-cyan-500',
    points: 8
  },
  {
    id: 'sleep-needs',
    name: 'Sleep Needs',
    description: 'Calculate optimal sleep duration',
    icon: Moon,
    href: '/calculators/sleep-needs',
    color: 'bg-purple-500',
    points: 12
  },
  {
    id: 'macro-splitter',
    name: 'Macro Splitter',
    description: 'Calculate macronutrient ratios',
    icon: TrendingUp,
    href: '/calculators/macro-splitter',
    color: 'bg-orange-500',
    points: 20,
    popular: true
  },
  {
    id: 'heart-rate-zone',
    name: 'Heart Rate Zone',
    description: 'Calculate target heart rate zones',
    icon: Heart,
    href: '/calculators/heart-rate-zone',
    color: 'bg-red-500',
    points: 18
  },
  {
    id: 'body-fat',
    name: 'Body Fat %',
    description: 'Estimate body fat percentage',
    icon: Activity,
    href: '/calculators/body-fat',
    color: 'bg-pink-500',
    points: 25
  },
  {
    id: 'step-goal',
    name: 'Step Goal',
    description: 'Calculate daily step targets',
    icon: Zap,
    href: '/calculators/step-goal',
    color: 'bg-yellow-500',
    points: 10
  },
  {
    id: 'stress-estimator',
    name: 'Stress Estimator',
    description: 'Assess stress levels',
    icon: Award,
    href: '/calculators/stress-estimator',
    color: 'bg-indigo-500',
    points: 15
  },
  {
    id: 'fitness-progress',
    name: 'Fitness Progress',
    description: 'Track fitness improvements',
    icon: Star,
    href: '/calculators/fitness-progress',
    color: 'bg-emerald-500',
    points: 30,
    popular: true
  }
];

export default function HealthCalculatorsPage() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access calculators</h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with Points */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Health Calculators
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Calculate your health metrics and earn points for each calculation
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{userPoints}</div>
                  <div className="text-sm text-gray-500">Points Earned</div>
                </div>
              </div>
            </div>

            {/* Popular Calculators */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Popular Calculators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calculators.filter(calc => calc.popular).map((calculator) => (
                  <motion.div
                    key={calculator.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${calculator.color} text-white`}>
                          <calculator.icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          +{calculator.points} pts
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {calculator.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {calculator.description}
                      </p>
                      <Button 
                        className="w-full"
                        onClick={() => window.location.href = calculator.href}
                      >
                        Calculate Now
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All Calculators */}
            <div>
              <h2 className="text-xl font-semibold mb-4">All Calculators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {calculators.map((calculator) => (
                  <motion.div
                    key={calculator.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${calculator.color} text-white`}>
                          <calculator.icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          +{calculator.points}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                        {calculator.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
                        {calculator.description}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.location.href = calculator.href}
                      >
                        Use Calculator
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}