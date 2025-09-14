'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface HealthData {
  id: string;
  type: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  target?: number;
}

interface HealthOverviewProps {
  data: HealthData[];
}

export function HealthOverview({ data }: HealthOverviewProps) {
  const mockHealthData: HealthData[] = [
    {
      id: '1',
      type: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      status: 'good',
      trend: 'stable',
      lastUpdated: '2 hours ago',
      target: 70
    },
    {
      id: '2',
      type: 'Blood Pressure',
      value: 120,
      unit: 'mmHg',
      status: 'good',
      trend: 'down',
      lastUpdated: '1 hour ago',
      target: 120
    },
    {
      id: '3',
      type: 'Weight',
      value: 70.5,
      unit: 'kg',
      status: 'warning',
      trend: 'up',
      lastUpdated: '1 day ago',
      target: 68
    },
    {
      id: '4',
      type: 'BMI',
      value: 22.5,
      unit: '',
      status: 'good',
      trend: 'stable',
      lastUpdated: '1 day ago',
      target: 22
    },
    {
      id: '5',
      type: 'Body Fat',
      value: 18.5,
      unit: '%',
      status: 'good',
      trend: 'down',
      lastUpdated: '3 days ago',
      target: 15
    },
    {
      id: '6',
      type: 'Hydration',
      value: 85,
      unit: '%',
      status: 'good',
      trend: 'up',
      lastUpdated: '30 minutes ago',
      target: 100
    }
  ];

  const healthData = data.length > 0 ? data : mockHealthData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string, type: string) => {
    if (trend === 'stable') return 'text-gray-500';
    
    // For weight and body fat, down is good, up is bad
    if (type === 'Weight' || type === 'Body Fat') {
      return trend === 'down' ? 'text-green-500' : 'text-red-500';
    }
    
    // For other metrics, up is generally good
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Health Overview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your current health metrics
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          <Target className="h-4 w-4 mr-2" />
          Set Goals
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthData.map((metric, index) => {
          const StatusIcon = getStatusIcon(metric.status);
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(metric.status).split(' ')[0]}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metric.type}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`h-3 w-3 ${getTrendColor(metric.trend, metric.type)}`} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.unit}
                  </span>
                </div>
                
                {metric.target && (
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Target: {metric.target}{metric.unit}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{metric.lastUpdated}</span>
                    </span>
                  </div>
                )}
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: metric.target ? 
                        `${Math.min((metric.value / metric.target) * 100, 100)}%` : 
                        '100%' 
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Overall Health Score:</span>
            <span className="ml-2 text-lg font-bold text-green-600">85/100</span>
          </div>
          <Button size="sm" variant="outline">
            View Detailed Report
          </Button>
        </div>
      </div>
    </Card>
  );
}