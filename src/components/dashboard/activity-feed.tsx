'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Heart,
  Utensils,
  Dumbbell,
  Calculator,
  Trophy,
  Users,
  Brain,
  Droplets,
  Moon,
  Target
} from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  icon?: string;
  points?: number;
  category?: 'achievement' | 'meal' | 'exercise' | 'calculation' | 'goal' | 'social' | 'ai' | 'health';
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'achievement',
      message: 'Completed BMI Calculator',
      timestamp: '2 hours ago',
      category: 'achievement',
      points: 10
    },
    {
      id: '2',
      type: 'meal',
      message: 'Logged lunch: Grilled Chicken Salad',
      timestamp: '4 hours ago',
      category: 'meal',
      points: 5
    },
    {
      id: '3',
      type: 'exercise',
      message: 'Completed 30-minute cardio workout',
      timestamp: '6 hours ago',
      category: 'exercise',
      points: 15
    },
    {
      id: '4',
      type: 'goal',
      message: 'Reached daily water intake goal',
      timestamp: '8 hours ago',
      category: 'goal',
      points: 20
    },
    {
      id: '5',
      type: 'calculation',
      message: 'Used BMR Calculator',
      timestamp: '1 day ago',
      category: 'calculation',
      points: 8
    },
    {
      id: '6',
      type: 'social',
      message: 'Shared progress in community',
      timestamp: '1 day ago',
      category: 'social',
      points: 5
    },
    {
      id: '7',
      type: 'ai',
      message: 'Received AI health recommendation',
      timestamp: '2 days ago',
      category: 'ai',
      points: 3
    },
    {
      id: '8',
      type: 'health',
      message: 'Updated health metrics',
      timestamp: '3 days ago',
      category: 'health',
      points: 5
    }
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return Trophy;
      case 'meal': return Utensils;
      case 'exercise': return Dumbbell;
      case 'calculation': return Calculator;
      case 'goal': return Target;
      case 'social': return Users;
      case 'ai': return Brain;
      case 'health': return Heart;
      default: return Activity;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'meal': return 'text-orange-500 bg-orange-100 dark:bg-orange-900';
      case 'exercise': return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'calculation': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      case 'goal': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      case 'social': return 'text-pink-500 bg-pink-100 dark:bg-pink-900';
      case 'ai': return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900';
      case 'health': return 'text-red-500 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return CheckCircle;
      case 'meal': return Utensils;
      case 'exercise': return Dumbbell;
      case 'calculation': return Calculator;
      case 'goal': return Target;
      case 'social': return Users;
      case 'ai': return Brain;
      case 'health': return Heart;
      default: return Activity;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-green-600';
      case 'meal': return 'text-orange-600';
      case 'exercise': return 'text-green-600';
      case 'calculation': return 'text-blue-600';
      case 'goal': return 'text-purple-600';
      case 'social': return 'text-pink-600';
      case 'ai': return 'text-indigo-600';
      case 'health': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Activity Feed
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your recent health activities
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => {
          const CategoryIcon = getCategoryIcon(activity.category || '');
          const TypeIcon = getTypeIcon(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getCategoryColor(activity.category || '')}`}>
                <CategoryIcon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  {activity.points && (
                    <Badge variant="outline" className="text-xs">
                      +{activity.points} pts
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp}</span>
                  <span className="flex items-center space-x-1">
                    <TypeIcon className={`h-3 w-3 ${getTypeColor(activity.type)}`} />
                    <span className="capitalize">{activity.type}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {displayActivities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No activities yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start using VitaPulse to see your activity feed here
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Today's Activities:</span>
            <span className="ml-2">{displayActivities.filter(a => a.timestamp.includes('hours ago')).length} items</span>
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