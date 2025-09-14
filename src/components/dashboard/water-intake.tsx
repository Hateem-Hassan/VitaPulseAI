'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Plus, 
  Minus,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface WaterIntakeProps {
  current: number;
  target: number;
}

export function WaterIntake({ current, target }: WaterIntakeProps) {
  const [waterIntake, setWaterIntake] = useState(current);
  const [isAnimating, setIsAnimating] = useState(false);

  const addWater = (amount: number) => {
    setIsAnimating(true);
    setWaterIntake(prev => Math.min(prev + amount, target * 1.5)); // Allow up to 150% of target
    setTimeout(() => setIsAnimating(false), 300);
  };

  const removeWater = (amount: number) => {
    setWaterIntake(prev => Math.max(prev - amount, 0));
  };

  const getProgressPercentage = () => {
    return Math.min((waterIntake / target) * 100, 100);
  };

  const getStatusColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (percentage >= 75) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const getStatusIcon = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return CheckCircle;
    if (percentage >= 75) return TrendingUp;
    return AlertTriangle;
  };

  const getStatusText = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return 'Goal Achieved!';
    if (percentage >= 75) return 'Almost There!';
    if (percentage >= 50) return 'Good Progress';
    return 'Keep Hydrating';
  };

  const quickAddAmounts = [0.25, 0.5, 1, 1.5];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Water Intake
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay hydrated throughout the day
            </p>
          </div>
        </div>
        <Badge className={getStatusColor()}>
          {getStatusText()}
        </Badge>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-blue-500"
              initial={{ strokeDasharray: '0 314' }}
              animate={{ 
                strokeDasharray: `${(getProgressPercentage() / 100) * 314} 314`,
                stroke: getProgressPercentage() >= 100 ? '#10b981' : '#3b82f6'
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: isAnimating ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {waterIntake}
            </motion.div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              / {target} L
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Daily Progress
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Add
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {quickAddAmounts.map((amount) => (
            <Button
              key={amount}
              size="sm"
              variant="outline"
              onClick={() => addWater(amount)}
              className="flex flex-col items-center py-2"
            >
              <Plus className="h-4 w-4 mb-1" />
              <span className="text-xs">{amount}L</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="flex items-center justify-between mb-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => removeWater(0.25)}
          disabled={waterIntake <= 0}
        >
          <Minus className="h-4 w-4 mr-2" />
          Remove 250ml
        </Button>
        <Button
          size="sm"
          onClick={() => addWater(0.25)}
          disabled={waterIntake >= target * 1.5}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add 250ml
        </Button>
      </div>

      {/* Status and Tips */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          {(() => {
            const StatusIcon = getStatusIcon();
            return <StatusIcon className="h-4 w-4 text-blue-500" />;
          })()}
          <span className="text-gray-600 dark:text-gray-400">
            {waterIntake >= target ? 
              'Great job! You\'ve reached your daily hydration goal.' :
              `You need ${(target - waterIntake).toFixed(1)}L more to reach your goal.`
            }
          </span>
        </div>
        
        {waterIntake < target && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              💡 Hydration Tip
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-200">
              Try drinking a glass of water every hour. Set a reminder on your phone to stay consistent!
            </p>
          </div>
        )}
      </div>

      {/* Daily Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {waterIntake}L
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Consumed Today
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {target}L
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Daily Goal
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}