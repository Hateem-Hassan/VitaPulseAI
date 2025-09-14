'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Zap,
  Calendar,
  Activity,
  Heart,
  Brain,
  Droplets,
  Footprints,
  Moon,
  Smile
} from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  type: string;
  calories: number;
  time: string;
}

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  current: number;
  unit: string;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

interface DashboardData {
  stats: {
    caloriesConsumed: number;
    caloriesBurned: number;
    waterIntake: number;
    steps: number;
    sleepHours: number;
    moodScore: number;
    energyLevel: number;
    stressLevel: number;
  };
  recentMeals: Meal[];
  recommendations: Recommendation[];
  goals: Goal[];
  activities: Activity[];
}

// Simple Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Simple Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Simple Meal Card Component
const MealCard = ({ meal }: { meal: Meal }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{meal.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{meal.type}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{meal.time}</p>
      </div>
      <span className="text-sm font-medium text-blue-600">{meal.calories} cal</span>
    </div>
  </div>
);

// Simple Recommendation Card Component
const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{recommendation.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[recommendation.priority]}`}>
          {recommendation.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.description}</p>
    </div>
  );
};

// Simple Goal Progress Component
const GoalCard = ({ goal }: { goal: Goal }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
      <span className="text-sm text-gray-600 dark:text-gray-400">{goal.progress}%</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${goal.progress}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {goal.current} / {goal.target} {goal.unit}
    </p>
  </div>
);

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      caloriesConsumed: 0,
      caloriesBurned: 0,
      waterIntake: 0,
      steps: 0,
      sleepHours: 0,
      moodScore: 0,
      energyLevel: 0,
      stressLevel: 0,
    },
    recentMeals: [],
    recommendations: [],
    goals: [],
    activities: [],
  });

  // Allow access without mandatory signin - show limited features for non-authenticated users
  const isAuthenticated = !!user;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        stats: {
          caloriesConsumed: 1850,
          caloriesBurned: 450,
          waterIntake: 6,
          steps: 8500,
          sleepHours: 7.5,
          moodScore: 8,
          energyLevel: 7,
          stressLevel: 3,
        },
        recentMeals: [
          {
            id: '1',
            name: 'Grilled Chicken Salad',
            type: 'lunch',
            calories: 350,
            time: '12:30 PM'
          },
          {
            id: '2',
            name: 'Greek Yogurt with Berries',
            type: 'snack',
            calories: 150,
            time: '3:00 PM'
          }
        ],
        recommendations: [
          {
            id: '1',
            type: 'nutrition',
            title: 'Increase Protein Intake',
            description: 'Consider adding more lean protein to your meals',
            priority: 'medium'
          },
          {
            id: '2',
            type: 'exercise',
            title: 'Cardio Workout',
            description: 'You haven\'t done cardio in 3 days',
            priority: 'high'
          }
        ],
        goals: [
          {
            id: '1',
            title: 'Daily Steps',
            progress: 85,
            target: 10000,
            current: 8500,
            unit: 'steps'
          },
          {
            id: '2',
            title: 'Water Intake',
            progress: 75,
            target: 8,
            current: 6,
            unit: 'glasses'
          }
        ],
        activities: [
          {
            id: '1',
            type: 'achievement',
            message: 'Completed BMI Calculator',
            timestamp: '2 hours ago'
          },
          {
            id: '2',
            type: 'meal',
            message: 'Logged lunch: Grilled Chicken Salad',
            timestamp: '4 hours ago'
          }
        ]
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple sidebar - only show for authenticated users */}
      {isAuthenticated && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">VitaPulse</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li><a href="/dashboard" className="block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Dashboard</a></li>
              <li><a href="/calculators" className="block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Calculators</a></li>
              <li><a href="/profile" className="block p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Profile</a></li>
            </ul>
          </nav>
        </div>
      )}
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={isAuthenticated ? "lg:pl-64" : ""}>
        {/* Simple header for both authenticated and guest users */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            {isAuthenticated && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">VitaPulse Dashboard</h1>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.email?.split('@')[0]}</span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Sign Out</button>
                </div>
              ) : (
                <a href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-800">Sign In</a>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome{isAuthenticated ? ` back, ${user?.email?.split('@')[0]}` : ' to VitaPulse'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isAuthenticated ? "Here's your health overview for today" : "Explore health tools and calculators - sign in for personalized features"}
              </p>
            </motion.div>

            {/* Guest User CTA */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center"
              >
                <h2 className="text-2xl font-bold mb-2">Unlock Your Full Potential</h2>
                <p className="mb-4">Sign in with Google to track progress, earn points, and get personalized recommendations</p>
                <a href="/auth/signin" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Sign In with Google
                </a>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Health Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  title="Calories Consumed" 
                  value={dashboardData.stats.caloriesConsumed} 
                  icon={TrendingUp} 
                  color="bg-blue-500" 
                />
                <StatsCard 
                  title="Steps Today" 
                  value={dashboardData.stats.steps.toLocaleString()} 
                  icon={Footprints} 
                  color="bg-green-500" 
                />
                <StatsCard 
                  title="Water Intake" 
                  value={`${dashboardData.stats.waterIntake}/8`} 
                  icon={Droplets} 
                  color="bg-cyan-500" 
                />
                <StatsCard 
                  title="Sleep Hours" 
                  value={`${dashboardData.stats.sleepHours}h`} 
                  icon={Moon} 
                  color="bg-purple-500" 
                />
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Meals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Meals</h2>
                  <div className="space-y-3">
                    {dashboardData.recentMeals.map((meal) => (
                      <MealCard key={meal.id} meal={meal} />
                    ))}
                  </div>
                </motion.div>

                {/* Goals Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Goals Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.goals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* AI Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h2>
                  <div className="space-y-3">
                    {dashboardData.recommendations.map((recommendation) => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      {dashboardData.activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}