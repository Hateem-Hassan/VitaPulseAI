'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Target, TrendingUp, Heart, Activity } from 'lucide-react';

export default function TDEECalculatorPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [calorieGoals, setCalorieGoals] = useState<any>(null);
  const [interpretation, setInterpretation] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  const activityLevels = {
    sedentary: { multiplier: 1.2, label: 'Sedentary (little/no exercise)' },
    light: { multiplier: 1.375, label: 'Light (light exercise 1-3 days/week)' },
    moderate: { multiplier: 1.55, label: 'Moderate (moderate exercise 3-5 days/week)' },
    active: { multiplier: 1.725, label: 'Active (hard exercise 6-7 days/week)' },
    very_active: { multiplier: 1.9, label: 'Very Active (very hard exercise, physical job)' }
  };

  const calculateTDEE = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    if (weightNum && heightNum && ageNum && gender && activityLevel) {
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

      setBmr(bmrValue);
      setTdee(tdeeValue);

      // Calculate calorie goals
      const goals = {
        maintenance: Math.round(tdeeValue),
        mildWeightLoss: Math.round(tdeeValue - 250), // 0.5 lbs/week
        moderateWeightLoss: Math.round(tdeeValue - 500), // 1 lb/week
        extremeWeightLoss: Math.round(tdeeValue - 750), // 1.5 lbs/week
        mildWeightGain: Math.round(tdeeValue + 250), // 0.5 lbs/week
        moderateWeightGain: Math.round(tdeeValue + 500) // 1 lb/week
      };

      setCalorieGoals(goals);

      // Generate interpretation
      let tdeeInterpretation = `Your Total Daily Energy Expenditure is ${Math.round(tdeeValue)} calories per day. `;
      if (activityLevel === 'sedentary') {
        tdeeInterpretation += 'Consider increasing your activity level for better health outcomes.';
      } else if (activityLevel === 'very_active') {
        tdeeInterpretation += 'Great job maintaining a very active lifestyle!';
      } else {
        tdeeInterpretation += 'Your activity level is contributing well to your overall health.';
      }

      setInterpretation(tdeeInterpretation);
      setPointsEarned(15);

      // Award points
      const currentPoints = parseInt(localStorage.getItem('vitapulse-points') || '0');
      localStorage.setItem('vitapulse-points', (currentPoints + 15).toString());
    }
  };

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'sedentary': return 'bg-red-500';
      case 'light': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'very_active': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
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
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                TDEE Calculator
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate your Total Daily Energy Expenditure and get personalized calorie recommendations
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
                
                <Button 
                  onClick={calculateTDEE}
                  className="w-full"
                  disabled={!weight || !height || !age || !gender || !activityLevel}
                >
                  Calculate TDEE
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
              
              {tdee ? (
                <div className="space-y-6">
                  {/* BMR and TDEE Values */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {bmr?.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        BMR (calories/day)
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {tdee.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        TDEE (calories/day)
                      </div>
                    </div>
                  </div>

                  {/* Activity Level Badge */}
                  <div className="text-center">
                    <Badge className={`${getActivityColor(activityLevel)} text-white px-4 py-2`}>
                      {activityLevels[activityLevel as keyof typeof activityLevels]?.label}
                    </Badge>
                  </div>

                  {/* Interpretation */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Health Insight
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
                  Enter your details to calculate your TDEE
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Calorie Goals */}
        {calorieGoals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Calorie Goals</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">Maintenance</div>
                  <div className="text-2xl font-bold">{calorieGoals.maintenance}</div>
                  <div className="text-xs text-gray-600">calories/day</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">Mild Loss</div>
                  <div className="text-2xl font-bold">{calorieGoals.mildWeightLoss}</div>
                  <div className="text-xs text-gray-600">0.5 lbs/week</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">Moderate Loss</div>
                  <div className="text-2xl font-bold">{calorieGoals.moderateWeightLoss}</div>
                  <div className="text-xs text-gray-600">1 lb/week</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-600">Extreme Loss</div>
                  <div className="text-2xl font-bold">{calorieGoals.extremeWeightLoss}</div>
                  <div className="text-xs text-gray-600">1.5 lbs/week</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">Mild Gain</div>
                  <div className="text-2xl font-bold">{calorieGoals.mildWeightGain}</div>
                  <div className="text-xs text-gray-600">0.5 lbs/week</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-lg font-bold text-indigo-600">Moderate Gain</div>
                  <div className="text-2xl font-bold">{calorieGoals.moderateWeightGain}</div>
                  <div className="text-xs text-gray-600">1 lb/week</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}