'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


interface AnalyticsData {
  nutrition: {
    dailyCalories: number[];
    dailyProtein: number[];
    dailyCarbs: number[];
    dailyFat: number[];
    weeklyAverage: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    goalCompliance: number;
  };
  fitness: {
    dailySteps: number[];
    dailyWorkouts: number[];
    weeklyMinutes: number;
    monthlyProgress: number;
  };
  wellness: {
    sleepHours: number[];
    waterIntake: number[];
    moodScores: number[];
    stressLevels: number[];
  };
  engagement: {
    dailyActiveMinutes: number;
    weeklySessions: number;
    featureUsage: {
      mealLogger: number;
      workoutTracker: number;
      healthCalculators: number;
      aiChat: number;
    };
  };
  trends: {
    weightChange: number;
    bodyFatChange: number;
    muscleGain: number;
    energyLevels: number;
  };
}

const MOCK_DATA: AnalyticsData = {
  nutrition: {
    dailyCalories: [2100, 1950, 2200, 1800, 2050, 2300, 1900],
    dailyProtein: [120, 110, 130, 100, 125, 140, 115],
    dailyCarbs: [250, 230, 270, 200, 240, 280, 220],
    dailyFat: [80, 75, 85, 70, 82, 90, 78],
    weeklyAverage: {
      calories: 2014,
      protein: 120,
      carbs: 241,
      fat: 80
    },
    goalCompliance: 85
  },
  fitness: {
    dailySteps: [8500, 9200, 7800, 10500, 8800, 9500, 8200],
    dailyWorkouts: [1, 1, 0, 1, 1, 1, 0],
    weeklyMinutes: 180,
    monthlyProgress: 12
  },
  wellness: {
    sleepHours: [7.5, 8.0, 6.5, 7.8, 8.2, 7.0, 7.5],
    waterIntake: [8, 7, 9, 6, 8, 7, 8],
    moodScores: [8, 7, 6, 9, 8, 7, 8],
    stressLevels: [3, 4, 6, 2, 3, 4, 3]
  },
  engagement: {
    dailyActiveMinutes: 45,
    weeklySessions: 12,
    featureUsage: {
      mealLogger: 85,
      workoutTracker: 60,
      healthCalculators: 40,
      aiChat: 70
    }
  },
  trends: {
    weightChange: -2.5,
    bodyFatChange: -1.2,
    muscleGain: 1.8,
    energyLevels: 15
  }
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>(MOCK_DATA);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('week');
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  const timeRanges = [
    { id: 'week', name: '7 Days', days: 7 },
    { id: 'month', name: '30 Days', days: 30 },
    { id: 'quarter', name: '90 Days', days: 90 },
    { id: 'year', name: '1 Year', days: 365 }
  ];

  const metrics = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'nutrition', name: 'Nutrition', icon: '🍎' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'engagement', name: 'Engagement', icon: '📱' },
    { id: 'trends', name: 'Trends', icon: '📈' }
  ];

  const getTrendIcon = (value: number) => {
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (value: number, reverse: boolean = false) => {
    const isPositive = reverse ? value < 0 : value > 0;
    return isPositive ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track your progress and gain insights into your health journey
        </p>
      </div>

      {/* Time Range Selector */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as any)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                timeRange === range.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Metric Selector */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedMetric === metric.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{metric.icon}</span>
              {metric.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Overview Metrics */}
      {selectedMetric === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nutrition Score</h3>
              <span className="text-2xl">🍎</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {data.nutrition.goalCompliance}%
            </div>
            <Progress value={data.nutrition.goalCompliance} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">Goal compliance this week</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Fitness Activity</h3>
              <span className="text-2xl">💪</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {data.fitness.weeklyMinutes}min
            </div>
            <p className="text-sm text-gray-600">This week's workout time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Wellness Score</h3>
              <span className="text-2xl">🧘</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(data.wellness.moodScores.reduce((a, b) => a + b, 0) / data.wellness.moodScores.length)}/10
            </div>
            <p className="text-sm text-gray-600">Average mood this week</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Engagement</h3>
              <span className="text-2xl">📱</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {data.engagement.weeklySessions}
            </div>
            <p className="text-sm text-gray-600">Sessions this week</p>
          </Card>
        </div>
      )}

      {/* Nutrition Analytics */}
      {selectedMetric === 'nutrition' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Weekly Nutrition Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.nutrition.weeklyAverage.calories}</div>
                <div className="text-sm text-gray-600">Avg Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{data.nutrition.weeklyAverage.protein}g</div>
                <div className="text-sm text-gray-600">Avg Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{data.nutrition.weeklyAverage.carbs}g</div>
                <div className="text-sm text-gray-600">Avg Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{data.nutrition.weeklyAverage.fat}g</div>
                <div className="text-sm text-gray-600">Avg Fat</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Daily Calorie Intake</h3>
            <div className="space-y-2">
              {data.nutrition.dailyCalories.map((calories, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">Day {index + 1}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(calories / 2500) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{calories}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Fitness Analytics */}
      {selectedMetric === 'fitness' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Fitness Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(data.fitness.dailySteps.reduce((a, b) => a + b, 0) / data.fitness.dailySteps.length)}
                </div>
                <div className="text-sm text-gray-600">Avg Daily Steps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {data.fitness.dailyWorkouts.reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-gray-600">Workouts This Week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{data.fitness.monthlyProgress}%</div>
                <div className="text-sm text-gray-600">Monthly Progress</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Daily Steps</h3>
            <div className="space-y-2">
              {data.fitness.dailySteps.map((steps, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">Day {index + 1}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(steps / 10000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{steps.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Wellness Analytics */}
      {selectedMetric === 'wellness' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Wellness Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {(data.wellness.sleepHours.reduce((a, b) => a + b, 0) / data.wellness.sleepHours.length).toFixed(1)}h
                </div>
                <div className="text-sm text-gray-600">Avg Sleep</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">
                  {(data.wellness.waterIntake.reduce((a, b) => a + b, 0) / data.wellness.waterIntake.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Water (glasses)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {(data.wellness.moodScores.reduce((a, b) => a + b, 0) / data.wellness.moodScores.length).toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-600">Avg Mood</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {(data.wellness.stressLevels.reduce((a, b) => a + b, 0) / data.wellness.stressLevels.length).toFixed(1)}/10
                </div>
                <div className="text-sm text-gray-600">Avg Stress</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Engagement Analytics */}
      {selectedMetric === 'engagement' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Feature Usage</h2>
            <div className="space-y-4">
              {Object.entries(data.engagement.featureUsage).map(([feature, usage]) => (
                <div key={feature} className="flex items-center justify-between">
                  <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${usage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Trends Analytics */}
      {selectedMetric === 'trends' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Health Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">{getTrendIcon(data.trends.weightChange)}</div>
                <div className={`text-2xl font-bold ${getTrendColor(data.trends.weightChange, true)}`}>
                  {data.trends.weightChange > 0 ? '+' : ''}{data.trends.weightChange}kg
                </div>
                <div className="text-sm text-gray-600">Weight Change</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">{getTrendIcon(data.trends.bodyFatChange)}</div>
                <div className={`text-2xl font-bold ${getTrendColor(data.trends.bodyFatChange, true)}`}>
                  {data.trends.bodyFatChange > 0 ? '+' : ''}{data.trends.bodyFatChange}%
                </div>
                <div className="text-sm text-gray-600">Body Fat Change</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">{getTrendIcon(data.trends.muscleGain)}</div>
                <div className={`text-2xl font-bold ${getTrendColor(data.trends.muscleGain)}`}>
                  +{data.trends.muscleGain}kg
                </div>
                <div className="text-sm text-gray-600">Muscle Gain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">{getTrendIcon(data.trends.energyLevels)}</div>
                <div className={`text-2xl font-bold ${getTrendColor(data.trends.energyLevels)}`}>
                  +{data.trends.energyLevels}%
                </div>
                <div className="text-sm text-gray-600">Energy Levels</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
