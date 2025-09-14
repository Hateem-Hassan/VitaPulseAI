'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  Clock,
  TrendingUp,
  Heart,
  Utensils,
  Activity,
  Droplets,
  Moon,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'nutrition' | 'exercise' | 'sleep' | 'hydration' | 'general';
  actionText?: string;
  actionUrl?: string;
  estimatedTime?: string;
  impact?: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      type: 'nutrition',
      title: 'Increase Protein Intake',
      description: 'Your protein intake is below the recommended 1.6g per kg body weight. Consider adding lean protein sources to your meals.',
      priority: 'medium',
      category: 'nutrition',
      actionText: 'View Protein Sources',
      actionUrl: '/nutrition/protein',
      estimatedTime: '5 min',
      impact: 'High'
    },
    {
      id: '2',
      type: 'exercise',
      title: 'Cardio Workout Recommended',
      description: 'You haven\'t done cardio in 3 days. A 30-minute walk or jog would help maintain your fitness goals.',
      priority: 'high',
      category: 'exercise',
      actionText: 'Start Workout',
      actionUrl: '/workouts/cardio',
      estimatedTime: '30 min',
      impact: 'Medium'
    },
    {
      id: '3',
      type: 'hydration',
      title: 'Increase Water Intake',
      description: 'You\'re at 60% of your daily hydration goal. Try drinking a glass of water every hour.',
      priority: 'medium',
      category: 'hydration',
      actionText: 'Log Water',
      actionUrl: '/dashboard?action=water',
      estimatedTime: '1 min',
      impact: 'High'
    },
    {
      id: '4',
      type: 'sleep',
      title: 'Optimize Sleep Schedule',
      description: 'Your sleep pattern shows inconsistency. Try going to bed at the same time each night for better recovery.',
      priority: 'low',
      category: 'sleep',
      actionText: 'Set Sleep Goal',
      actionUrl: '/goals/sleep',
      estimatedTime: '2 min',
      impact: 'Medium'
    }
  ];

  const displayRecommendations = recommendations.length > 0 ? recommendations : mockRecommendations;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return Utensils;
      case 'exercise': return Activity;
      case 'sleep': return Moon;
      case 'hydration': return Droplets;
      default: return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'text-orange-500 bg-orange-100 dark:bg-orange-900';
      case 'exercise': return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'sleep': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      case 'hydration': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      default: return 'text-pink-500 bg-pink-100 dark:bg-pink-900';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      case 'low': return CheckCircle;
      default: return Info;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Recommendations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalized health insights
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <Lightbulb className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {displayRecommendations.map((recommendation, index) => {
          const CategoryIcon = getCategoryIcon(recommendation.category);
          const PriorityIcon = getPriorityIcon(recommendation.priority);
          
          return (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${getCategoryColor(recommendation.category)}`}>
                  <CategoryIcon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {recommendation.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        <PriorityIcon className="h-3 w-3 mr-1" />
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      {recommendation.estimatedTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{recommendation.estimatedTime}</span>
                        </div>
                      )}
                      {recommendation.impact && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Impact: {recommendation.impact}</span>
                        </div>
                      )}
                    </div>
                    
                    {recommendation.actionText && (
                      <Button size="sm" variant="outline" className="text-xs">
                        {recommendation.actionText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {displayRecommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your health profile to get personalized AI recommendations
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">AI Analysis:</span>
            <span className="ml-2">Based on your last 7 days of data</span>
          </div>
          <Button size="sm" variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Update Goals
          </Button>
        </div>
      </div>
    </Card>
  );
}