'use client';

// Main Dashboard Page with Health Analytics and Quick Actions
// Comprehensive health overview with charts, metrics, and AI insights

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  Heart,
  Scale,
  Utensils,
  Brain,
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  Bell,
  Target,
  Award,
  Clock,
  AlertCircle,
  ChevronRight,
  Zap,
  Droplets,
  Moon,
  Sun
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target?: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  icon: React.ReactNode;
  color: string;
  lastUpdated: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
}

interface HealthInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'reminder';
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
  timestamp: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  // Load dashboard data
  useEffect(() => {
    if (user && userProfile) {
      loadDashboardData();
    }
  }, [user, userProfile]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock health metrics data
      const mockMetrics: HealthMetric[] = [
        {
          id: 'weight',
          name: 'Weight',
          value: 72.5,
          unit: 'kg',
          target: 70,
          trend: 'down',
          trendValue: -0.8,
          icon: <Scale className="h-5 w-5" />,
          color: 'text-blue-600',
          lastUpdated: '2 hours ago'
        },
        {
          id: 'steps',
          name: 'Steps Today',
          value: 8420,
          unit: 'steps',
          target: 10000,
          trend: 'up',
          trendValue: 12,
          icon: <Activity className="h-5 w-5" />,
          color: 'text-green-600',
          lastUpdated: '5 min ago'
        },
        {
          id: 'heart_rate',
          name: 'Resting HR',
          value: 68,
          unit: 'bpm',
          target: 65,
          trend: 'stable',
          trendValue: 0,
          icon: <Heart className="h-5 w-5" />,
          color: 'text-red-600',
          lastUpdated: '1 hour ago'
        },
        {
          id: 'calories',
          name: 'Calories',
          value: 1850,
          unit: 'kcal',
          target: 2200,
          trend: 'up',
          trendValue: 5,
          icon: <Utensils className="h-5 w-5" />,
          color: 'text-orange-600',
          lastUpdated: '30 min ago'
        },
        {
          id: 'water',
          name: 'Water Intake',
          value: 1.8,
          unit: 'L',
          target: 2.5,
          trend: 'up',
          trendValue: 8,
          icon: <Droplets className="h-5 w-5" />,
          color: 'text-cyan-600',
          lastUpdated: '15 min ago'
        },
        {
          id: 'sleep',
          name: 'Sleep',
          value: 7.2,
          unit: 'hours',
          target: 8,
          trend: 'down',
          trendValue: -5,
          icon: <Moon className="h-5 w-5" />,
          color: 'text-purple-600',
          lastUpdated: 'This morning'
        }
      ];
      
      // Mock insights data
      const mockInsights: HealthInsight[] = [
        {
          id: '1',
          type: 'achievement',
          title: 'Weekly Goal Achieved!',
          message: 'You\'ve completed 5 out of 7 workout sessions this week. Great job!',
          action: {
            label: 'View Progress',
            href: '/fitness/progress'
          },
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          type: 'tip',
          title: 'Hydration Reminder',
          message: 'You\'re 28% behind your daily water intake goal. Consider drinking a glass now.',
          action: {
            label: 'Log Water',
            href: '/nutrition/water'
          },
          timestamp: '1 hour ago'
        },
        {
          id: '3',
          type: 'warning',
          title: 'Sleep Pattern Alert',
          message: 'Your sleep duration has decreased by 15% this week. Consider improving your sleep hygiene.',
          action: {
            label: 'Sleep Tips',
            href: '/health/sleep-tips'
          },
          timestamp: '6 hours ago'
        }
      ];
      
      setHealthMetrics(mockMetrics);
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'symptom_checker',
      title: 'AI Symptom Checker',
      description: 'Get instant health insights',
      icon: <Brain className="h-6 w-6" />,
      href: '/health/symptom-checker',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      badge: 'AI'
    },
    {
      id: 'meal_planner',
      title: 'AI Meal Planner',
      description: 'Personalized nutrition plans',
      icon: <Utensils className="h-6 w-6" />,
      href: '/nutrition/meal-planner',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      badge: 'New'
    },
    {
      id: 'food_logger',
      title: 'Food Logger',
      description: 'Track your daily nutrition',
      icon: <Plus className="h-6 w-6" />,
      href: '/nutrition/food-logger',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      id: 'health_calculators',
      title: 'Health Calculators',
      description: 'BMI, TDEE, and more',
      icon: <Target className="h-6 w-6" />,
      href: '/health/calculators',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-neutral-400" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Zap className="h-5 w-5 text-green-600" />;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Welcome back, {userProfile?.first_name || 'User'}!
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Here's your health overview for today
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Today
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.id} href={action.href}>
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`${action.color} p-6 text-white relative`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {action.icon}
                          <div>
                            <h3 className="font-semibold text-sm">{action.title}</h3>
                            <p className="text-xs opacity-90">{action.description}</p>
                          </div>
                        </div>
                        {action.badge && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-0">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <ChevronRight className="absolute bottom-4 right-4 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Metrics */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Health Metrics
              </h2>
              <Link href="/health/metrics">
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthMetrics.map((metric) => (
                <Card key={metric.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={metric.color}>
                          {metric.icon}
                        </div>
                        <CardTitle className="text-sm font-medium">
                          {metric.name}
                        </CardTitle>
                      </div>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                          {metric.value.toLocaleString()}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {metric.unit}
                        </span>
                      </div>
                      
                      {metric.target && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                            <span>Progress</span>
                            <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(metric.value / metric.target) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 dark:text-neutral-400">
                          {metric.lastUpdated}
                        </span>
                        {metric.trendValue !== 0 && (
                          <span className={`font-medium ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 'text-neutral-600'
                          }`}>
                            {metric.trend === 'up' ? '+' : ''}{metric.trendValue}%
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Insights & Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Health Insights
              </h2>
              <Link href="/health/insights">
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                          {insight.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {insight.message}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {insight.timestamp}
                          </span>
                          {insight.action && (
                            <Link href={insight.action.href}>
                              <Button variant="ghost" size="sm" className="text-xs h-7">
                                {insight.action.label}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Today's Goals */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary-600" />
                  Today's Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Steps</span>
                    <span className="text-sm font-medium">8,420 / 10,000</span>
                  </div>
                  <Progress value={84.2} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Water</span>
                    <span className="text-sm font-medium">1.8L / 2.5L</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Calories</span>
                    <span className="text-sm font-medium">1,850 / 2,200</span>
                  </div>
                  <Progress value={84.1} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}