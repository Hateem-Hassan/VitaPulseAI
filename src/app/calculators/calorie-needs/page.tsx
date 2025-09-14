'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Target, TrendingUp, Heart, Utensils, Scale } from 'lucide-react';

export default function CalorieNeedsCalculatorPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [macroBreakdown, setMacroBreakdown] = useState<any>(null);
  const [interpretation, setInterpretation] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  const activityLevels = {
    sedentary: { multiplier: 1.2, label: 'Sedentary (little/no exercise)' },
    light: { multiplier: 1.375, label: 'Light (light exercise 1-3 days/week)' },
    moderate: { multiplier: 1.55, label: 'Moderate (moderate exercise 3-5 days/week)' },
    active: { multiplier: 1.725, label: 'Active (hard exercise 6-7 days/week)' },
    very_active: { multiplier: 1.9, label: 'Very Active (very hard exercise, physical job)' }
  };

  const goals = {
    maintain: { deficit: 0, label: 'Maintain Weight', color: 'bg-green-500' },
    lose_slow: { deficit: -250, label: 'Lose Weight (Slow)', color: 'bg-blue-500' },
    lose_moderate: { deficit: -500, label: 'Lose Weight (Moderate)', color: 'bg-orange-500' },
    lose_fast: { deficit: -750, label: 'Lose Weight (Fast)', color: 'bg-red-500' },
    gain_slow: { deficit: 250, label: 'Gain Weight (Slow)', color: 'bg-purple-500' },
    gain_moderate: { deficit: 500, label: 'Gain Weight (Moderate)', color: 'bg-indigo-500' }
  };

  const timeframes = {
    '4': '4 weeks',
    '8': '8 weeks',
    '12': '12 weeks',
    '16': '16 weeks',
    '24': '24 weeks'
  };

  const calculateCalorieNeeds = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    if (weightNum && heightNum && ageNum && gender && activityLevel && goal) {
      // Calculate BMR using Mifflin-St Jeor Equation
      let bmrValue;
      if (gender === 'male') {
        bmrValue = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
      } else {
        bmrValue = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
      }

      // Calculate TDEE
      const activityMultiplier = activityLevels[activityLevel as keyof typeof activityLevels].multiplier;
      const tdeeValue = bmrValue * activityMultiplier;

      // Calculate target calories based on goal
      const goalDeficit = goals[goal as keyof typeof goals].deficit;
      const targetCaloriesValue = tdeeValue + goalDeficit;

      setBmr(bmrValue);
      setTdee(tdeeValue);
      setTargetCalories(targetCaloriesValue);

      // Calculate macro breakdown (40% carbs, 30% protein, 30% fat)
      const macros = {
        protein: {
          grams: Math.round((targetCaloriesValue * 0.3) / 4),
          calories: Math.round(targetCaloriesValue * 0.3)
        },
        carbs: {
          grams: Math.round((targetCaloriesValue * 0.4) / 4),
          calories: Math.round(targetCaloriesValue * 0.4)
        },
        fat: {
          grams: Math.round((targetCaloriesValue * 0.3) / 9),
          calories: Math.round(targetCaloriesValue * 0.3)
        }
      };

      setMacroBreakdown(macros);

      // Generate interpretation
      let calorieInterpretation = `Based on your goal to ${goals[goal as keyof typeof goals].label.toLowerCase()}, you should consume ${Math.round(targetCaloriesValue)} calories per day. `;
      
      if (goal.includes('lose')) {
        const weeklyLoss = Math.abs(goalDeficit) * 7 / 3500;
        calorieInterpretation += `This creates a deficit that should result in approximately ${weeklyLoss.toFixed(1)} lbs of weight loss per week.`;
      } else if (goal.includes('gain')) {
        const weeklyGain = goalDeficit * 7 / 3500;
        calorieInterpretation += `This creates a surplus that should result in approximately ${weeklyGain.toFixed(1)} lbs of weight gain per week.`;
      } else {
        calorieInterpretation += 'This will help you maintain your current weight while supporting your activity level.';
      }

      if (timeframe) {
        const weeks = parseInt(timeframe);
        if (goal.includes('lose')) {
          const totalLoss = Math.abs(goalDeficit) * 7 * weeks / 3500;
          calorieInterpretation += ` Over ${weeks} weeks, you could expect to lose approximately ${totalLoss.toFixed(1)} lbs.`;
        } else if (goal.includes('gain')) {
          const totalGain = goalDeficit * 7 * weeks / 3500;
          calorieInterpretation += ` Over ${weeks} weeks, you could expect to gain approximately ${totalGain.toFixed(1)} lbs.`;
        }
      }

      setInterpretation(calorieInterpretation);
      setPointsEarned(20);

      // Award points
      const currentPoints = parseInt(localStorage.getItem('vitapulse-points') || '0');
      localStorage.setItem('vitapulse-points', (currentPoints + 20).toString());
    }
  };

  const getGoalColor = (goalKey: string) => {
    return goals[goalKey as keyof typeof goals]?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Utensils className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Calorie Needs Calculator
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate your daily calorie needs based on your goals and get personalized recommendations
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Enter Your Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Height (cm)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age (years)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Activity Level
                  </label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(activityLevels).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal
                  </label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(goals).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeframe (Optional)
                  </label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(timeframes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={calculateCalorieNeeds}
                  className="w-full"
                  disabled={!weight || !height || !age || !gender || !activityLevel || !goal}
                >
                  Calculate Calorie Needs
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Your Results
              </h2>
              
              {targetCalories ? (
                <div className="space-y-6">
                  {/* Main Calorie Target */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {targetCalories.toFixed(0)}
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                      Daily Calorie Target
                    </div>
                    <Badge className={`${getGoalColor(goal)} text-white px-4 py-2`}>
                      {goals[goal as keyof typeof goals]?.label}
                    </Badge>
                  </div>

                  {/* BMR and TDEE */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {bmr?.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        BMR
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {tdee?.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        TDEE
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Recommendation
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {interpretation}
                    </p>
                  </div>

                  {/* Points Earned */}
                  {pointsEarned > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center"
                    >
                      <div className="text-green-600 dark:text-green-400 font-semibold">
                        +{pointsEarned} Points Earned! 🎉
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Enter your details to calculate your calorie needs
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Macro Breakdown */}
        {macroBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Scale className="h-5 w-5 mr-2 text-purple-600" />
                Recommended Macro Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {macroBreakdown.protein.grams}g
                  </div>
                  <div className="text-lg font-semibold text-blue-600">Protein</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {macroBreakdown.protein.calories} calories (30%)
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {macroBreakdown.carbs.grams}g
                  </div>
                  <div className="text-lg font-semibold text-green-600">Carbs</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {macroBreakdown.carbs.calories} calories (40%)
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {macroBreakdown.fat.grams}g
                  </div>
                  <div className="text-lg font-semibold text-orange-600">Fat</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {macroBreakdown.fat.calories} calories (30%)
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}