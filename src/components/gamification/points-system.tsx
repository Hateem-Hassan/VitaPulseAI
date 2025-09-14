'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Zap, 
  Target, 
  Award,
  TrendingUp,
  Gift,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PointsSystemProps {
  userId: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-calc',
    name: 'First Calculation',
    description: 'Complete your first health calculation',
    icon: Target,
    points: 10,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'calc-master',
    name: 'Calculation Master',
    description: 'Complete 10 different calculations',
    icon: Trophy,
    points: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'daily-user',
    name: 'Daily User',
    description: 'Use calculators for 7 consecutive days',
    icon: Zap,
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'health-expert',
    name: 'Health Expert',
    description: 'Complete all 20 calculators',
    icon: Crown,
    points: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 30-day streak',
    icon: TrendingUp,
    points: 500,
    unlocked: false,
    progress: 0,
    maxProgress: 30
  }
];

export function PointsSystem({ userId }: PointsSystemProps) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // Load user progress from localStorage or API
    const savedProgress = localStorage.getItem(`vitapulse-progress-${userId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setTotalPoints(progress.totalPoints || 0);
      setLevel(progress.level || 1);
      setUserAchievements(progress.achievements || achievements);
    }
  }, [userId]);

  const addPoints = (points: number, reason: string) => {
    const newTotal = totalPoints + points;
    setTotalPoints(newTotal);
    
    // Check for level up
    const newLevel = Math.floor(newTotal / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      showAchievementNotification(`Level Up! You're now level ${newLevel}!`, 'level-up');
    }

    // Check achievements
    checkAchievements();

    // Save progress
    saveProgress(newTotal, newLevel);

    // Show notification
    showAchievementNotification(`+${points} points for ${reason}`, 'points');
  };

  const checkAchievements = () => {
    const updatedAchievements = userAchievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let newProgress = achievement.progress;
      
      switch (achievement.id) {
        case 'first-calc':
          newProgress = Math.min(1, achievement.progress + 1);
          break;
        case 'calc-master':
          newProgress = Math.min(10, achievement.progress + 1);
          break;
        case 'daily-user':
          // This would be tracked separately
          break;
        case 'health-expert':
          newProgress = Math.min(20, achievement.progress + 1);
          break;
      }

      if (newProgress >= achievement.maxProgress && !achievement.unlocked) {
        achievement.unlocked = true;
        showAchievementNotification(`Achievement Unlocked: ${achievement.name}!`, 'achievement');
        addPoints(achievement.points, `Achievement: ${achievement.name}`);
      }

      return { ...achievement, progress: newProgress };
    });

    setUserAchievements(updatedAchievements);
  };

  const showAchievementNotification = (message: string, type: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const saveProgress = (points: number, userLevel: number) => {
    const progress = {
      totalPoints: points,
      level: userLevel,
      achievements: userAchievements,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`vitapulse-progress-${userId}`, JSON.stringify(progress));
  };

  const getLevelProgress = () => {
    const currentLevelPoints = totalPoints % 100;
    return (currentLevelPoints / 100) * 100;
  };

  const getNextLevelPoints = () => {
    return 100 - (totalPoints % 100);
  };

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{totalPoints} Points</h2>
            <p className="text-blue-100">Level {level}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Next Level</div>
            <div className="text-lg font-semibold">{getNextLevelPoints()} pts</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-blue-300 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${getLevelProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked 
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}>
                    <achievement.icon className={`h-5 w-5 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      achievement.unlocked ? 'text-yellow-800' : 'text-gray-700'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-200 rounded-full h-2 w-20">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                  +{achievement.points}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5" />
              <span className="font-semibold">{notificationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
