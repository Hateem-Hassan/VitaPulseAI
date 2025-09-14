'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Flame, 
  Droplets, 
  Footprints, 
  Moon, 
  Heart, 
  Zap, 
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Stats {
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number;
  steps: number;
  sleepHours: number;
  moodScore: number;
  energyLevel: number;
  stressLevel: number;
}

interface QuickStatsProps {
  stats: Stats;
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statCards = [
    {
      title: 'Calories Consumed',
      value: stats.caloriesConsumed,
      unit: 'kcal',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-200 dark:border-orange-800',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Calories Burned',
      value: stats.caloriesBurned,
      unit: 'kcal',
      icon: Zap,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Water Intake',
      value: stats.waterIntake,
      unit: 'glasses',
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      trend: '+2%',
      trendUp: true
    },
    {
      title: 'Steps',
      value: stats.steps.toLocaleString(),
      unit: 'steps',
      icon: Footprints,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Sleep',
      value: stats.sleepHours,
      unit: 'hours',
      icon: Moon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      borderColor: 'border-purple-200 dark:border-purple-800',
      trend: '-3%',
      trendUp: false
    },
    {
      title: 'Mood Score',
      value: stats.moodScore,
      unit: '/10',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      borderColor: 'border-pink-200 dark:border-pink-800',
      trend: '+1%',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className={`p-6 border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex items-center space-x-1">
                {stat.trendUp ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.unit}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}