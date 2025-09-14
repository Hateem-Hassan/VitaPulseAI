'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'nutrition' | 'fitness' | 'wellness' | 'streak' | 'social';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  requirements: string[];
}

interface UserStats {
  totalPoints: number;
  level: number;
  streak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
}

const ACHIEVEMENTS: Achievement[] = [
  // Nutrition Achievements
  {
    id: 'first_meal',
    title: 'First Bite',
    description: 'Log your first meal',
    icon: '🍽️',
    category: 'nutrition',
    points: 10,
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    requirements: ['Log 1 meal']
  },
  {
    id: 'week_logger',
    title: 'Consistent Logger',
    description: 'Log meals for 7 consecutive days',
    icon: '📅',
    category: 'nutrition',
    points: 50,
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    requirements: ['Log meals for 7 days']
  },
  {
    id: 'calorie_master',
    title: 'Calorie Master',
    description: 'Stay within your calorie goal for 30 days',
    icon: '🎯',
    category: 'nutrition',
    points: 200,
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    requirements: ['Meet calorie goal for 30 days']
  },
  {
    id: 'protein_power',
    title: 'Protein Power',
    description: 'Meet your protein goal for 14 consecutive days',
    icon: '💪',
    category: 'nutrition',
    points: 100,
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 14,
    requirements: ['Meet protein goal for 14 days']
  },

  // Fitness Achievements
  {
    id: 'first_workout',
    title: 'First Steps',
    description: 'Complete your first workout',
    icon: '🏃',
    category: 'fitness',
    points: 25,
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    requirements: ['Complete 1 workout']
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Work out 5 times in a week',
    icon: '⚔️',
    category: 'fitness',
    points: 75,
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    requirements: ['Complete 5 workouts in a week']
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Work out 20 times in a month',
    icon: '👑',
    category: 'fitness',
    points: 300,
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    requirements: ['Complete 20 workouts in a month']
  },

  // Streak Achievements
  {
    id: 'week_streak',
    title: 'Week Streak',
    description: 'Maintain a 7-day activity streak',
    icon: '🔥',
    category: 'streak',
    points: 100,
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    requirements: ['7-day activity streak']
  },
  {
    id: 'month_streak',
    title: 'Month Streak',
    description: 'Maintain a 30-day activity streak',
    icon: '🔥🔥',
    category: 'streak',
    points: 500,
    rarity: 'legendary',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    requirements: ['30-day activity streak']
  },

  // Wellness Achievements
  {
    id: 'water_champion',
    title: 'Water Champion',
    description: 'Drink 8 glasses of water for 7 days',
    icon: '💧',
    category: 'wellness',
    points: 50,
    rarity: 'rare',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    requirements: ['Drink 8 glasses daily for 7 days']
  },
  {
    id: 'sleep_master',
    title: 'Sleep Master',
    description: 'Get 7-9 hours of sleep for 14 days',
    icon: '😴',
    category: 'wellness',
    points: 150,
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 14,
    requirements: ['Good sleep for 14 days']
  },

  // Social Achievements
  {
    id: 'first_friend',
    title: 'Social Butterfly',
    description: 'Add your first friend',
    icon: '👥',
    category: 'social',
    points: 25,
    rarity: 'common',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    requirements: ['Add 1 friend']
  },
  {
    id: 'community_leader',
    title: 'Community Leader',
    description: 'Help 10 friends with their goals',
    icon: '🌟',
    category: 'social',
    points: 200,
    rarity: 'epic',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    requirements: ['Help 10 friends']
  }
];

export default function Achievements() {

  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    streak: 0,
    achievementsUnlocked: 0,
    totalAchievements: ACHIEVEMENTS.length
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'nutrition', name: 'Nutrition', icon: '🍎' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'streak', name: 'Streaks', icon: '🔥' },
    { id: 'social', name: 'Social', icon: '👥' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '🏆';
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Achievements
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Unlock achievements and earn points for your health journey
        </p>
      </div>

      {/* User Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{userStats.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">Level {userStats.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{userStats.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {userStats.achievementsUnlocked}/{userStats.totalAchievements}
            </div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Unlocked Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements
              .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
              .map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">{achievement.icon}</div>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      +{achievement.points} points
                    </span>
                    <span className="text-xs text-gray-500">
                      {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Locked Achievements */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-2">🔒</span>
          Available Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements
            .filter(a => !a.unlocked)
            .map((achievement) => (
              <div key={achievement.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl opacity-50">{achievement.icon}</div>
                  <Badge className={getRarityColor(achievement.rarity)}>
                    {achievement.rarity}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-1">
                  {achievement.requirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <span className="mr-2">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    +{achievement.points} points
                  </span>
                  <span className="text-xs text-gray-500">
                    {getCategoryIcon(achievement.category)} {achievement.category}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
