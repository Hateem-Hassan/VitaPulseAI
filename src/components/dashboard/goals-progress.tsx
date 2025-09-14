'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Award,
  Zap,
  Heart,
  Dumbbell,
  Utensils,
  Droplets
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  current: number;
  unit: string;
  category: 'fitness' | 'nutrition' | 'health' | 'wellness' | 'social';
  deadline?: string;
  status: 'active' | 'completed' | 'paused';
  streak?: number;
}

interface GoalsProgressProps {
  goals: Goal[];
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Daily Steps',
      progress: 85,
      target: 10000,
      current: 8500,
      unit: 'steps',
      category: 'fitness',
      status: 'active',
      streak: 7
    },
    {
      id: '2',
      title: 'Water Intake',
      progress: 60,
      target: 8,
      current: 6,
      unit: 'glasses',
      category: 'wellness',
      status: 'active',
      streak: 3
    },
    {
      id: '3',
      title: 'Weekly Workouts',
      progress: 100,
      target: 4,
      current: 4,
      unit: 'sessions',
      category: 'fitness',
      status: 'completed',
      streak: 12
    },
    {
      id: '4',
      title: 'Sleep Hours',
      progress: 75,
      target: 8,
      current: 6,
      unit: 'hours',
      category: 'wellness',
      status: 'active',
      streak: 2
    },
    {
      id: '5',
      title: 'Protein Intake',
      progress: 90,
      target: 120,
      current: 108,
      unit: 'grams',
      category: 'nutrition',
      status: 'active',
      streak: 5
    },
    {
      id: '6',
      title: 'Meditation',
      progress: 40,
      target: 30,
      current: 12,
      unit: 'minutes',
      category: 'wellness',
      status: 'active',
      streak: 1
    }
  ];

  const displayGoals = goals.length > 0 ? goals : mockGoals;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return Dumbbell;
      case 'nutrition': return Utensils;
      case 'health': return Heart;
      case 'wellness': return Droplets;
      case 'social': return Award;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'nutrition': return 'text-orange-500 bg-orange-100 dark:bg-orange-900';
      case 'health': return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'wellness': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'social': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const activeGoals = displayGoals.filter(goal => goal.status === 'active');
  const completedGoals = displayGoals.filter(goal => goal.status === 'completed');
  const overallProgress = activeGoals.length > 0 ? 
    activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Goals Progress
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your health and fitness goals
            </p>
          </div>
        </div>
        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{activeGoals.length} active goals</span>
          <span>{completedGoals.length} completed</span>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {displayGoals.map((goal, index) => {
          const CategoryIcon = getCategoryIcon(goal.category);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(goal.category)}`}>
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{goal.current} / {goal.target} {goal.unit}</span>
                      {goal.streak && (
                        <span className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>{goal.streak} day streak</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                  {goal.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {goal.progress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(goal.progress, 100)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
                
                {goal.deadline && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>Deadline: {goal.deadline}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
                
                {goal.status === 'active' && (
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="h-3 w-3 mr-1" />
                    Log Progress
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {displayGoals.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No goals set yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Set your first health goal to start tracking your progress
          </p>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">This Week:</span>
            <span className="ml-2">{completedGoals.length} goals completed</span>
          </div>
          <Button size="sm" variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>
    </Card>
  );
}