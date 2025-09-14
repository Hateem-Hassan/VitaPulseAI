'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Calendar, 
  Target, 
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivity: string;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

export function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivity: '',
    weeklyGoal: 7,
    weeklyProgress: 0,
    monthlyGoal: 30,
    monthlyProgress: 0
  });

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('vitapulse-streak');
    if (savedStreak) {
      setStreakData(JSON.parse(savedStreak));
    }
  }, []);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = new Date(streakData.lastActivity);
    const todayDate = new Date(today);
    
    let newStreak = streakData.currentStreak;
    let newLongestStreak = streakData.longestStreak;
    
    // Check if user was active yesterday or today
    const daysDiff = Math.floor((todayDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      newStreak += 1;
      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak;
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      // Streak broken, reset
      newStreak = 1;
    }

    const updatedStreak = {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActivity: today,
      weeklyProgress: Math.min(7, streakData.weeklyProgress + 1),
      monthlyProgress: Math.min(30, streakData.monthlyProgress + 1)
    };

    setStreakData(updatedStreak);
    localStorage.setItem('vitapulse-streak', JSON.stringify(updatedStreak));
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Incredible! You\'re a health champion!';
    if (streak >= 14) return 'Amazing consistency! Keep it up!';
    if (streak >= 7) return 'Great job! You\'re building a strong habit!';
    if (streak >= 3) return 'Nice start! Keep the momentum going!';
    return 'Start your health journey today!';
  };

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Flame className="h-6 w-6" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <div className="text-4xl font-bold">
                {streakData.currentStreak} {getStreakEmoji(streakData.currentStreak)}
              </div>
              <p className="text-orange-100 text-sm mt-1">
                {getStreakMessage(streakData.currentStreak)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-orange-100">Longest Streak</div>
              <div className="text-2xl font-bold">{streakData.longestStreak}</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Goals Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Goal */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Weekly Goal</span>
            </div>
            <Badge variant="outline">
              {streakData.weeklyProgress}/{streakData.weeklyGoal}
            </Badge>
          </div>
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(streakData.weeklyProgress / streakData.weeklyGoal) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {streakData.weeklyGoal - streakData.weeklyProgress} days to go
          </p>
        </Card>

        {/* Monthly Goal */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Monthly Goal</span>
            </div>
            <Badge variant="outline">
              {streakData.monthlyProgress}/{streakData.monthlyGoal}
            </Badge>
          </div>
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(streakData.monthlyProgress / streakData.monthlyGoal) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {streakData.monthlyGoal - streakData.monthlyProgress} days to go
          </p>
        </Card>
      </div>

      {/* Streak Actions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Keep Your Streak Alive
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={updateStreak}
            className="text-xs"
          >
            Use Calculator
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={updateStreak}
            className="text-xs"
          >
            Log Meal
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={updateStreak}
            className="text-xs"
          >
            Track Workout
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={updateStreak}
            className="text-xs"
          >
            Check Progress
          </Button>
        </div>
      </Card>

      {/* Celebration Modal */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Card className="p-8 text-center max-w-md mx-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">New Record! 🎉</h2>
            <p className="text-gray-600 mb-4">
              You've achieved your longest streak of {streakData.longestStreak} days!
            </p>
            <Button onClick={() => setShowCelebration(false)}>
              Awesome!
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
