'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Target, TrendingUp, Heart, Thermometer, Activity, Clock } from 'lucide-react';

export default function HydrationCalculatorPage() {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [climate, setClimate] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [caffeineIntake, setCaffeineIntake] = useState('');
  const [alcoholIntake, setAlcoholIntake] = useState('');
  const [baseWaterNeeds, setBaseWaterNeeds] = useState<number | null>(null);
  const [totalWaterNeeds, setTotalWaterNeeds] = useState<number | null>(null);
  const [hydrationSchedule, setHydrationSchedule] = useState<any[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  const activityLevels = {
    sedentary: { multiplier: 1.0, label: 'Sedentary (desk job, minimal activity)' },
    light: { multiplier: 1.2, label: 'Light Activity (walking, light exercise)' },
    moderate: { multiplier: 1.4, label: 'Moderate Activity (regular workouts)' },
    active: { multiplier: 1.6, label: 'Active (intense exercise, physical job)' },
    very_active: { multiplier: 1.8, label: 'Very Active (athlete, heavy physical work)' }
  };

  const climates = {
    temperate: { adjustment: 0, label: 'Temperate (15-25°C / 59-77°F)' },
    warm: { adjustment: 500, label: 'Warm (25-30°C / 77-86°F)' },
    hot: { adjustment: 1000, label: 'Hot (30°C+ / 86°F+)' },
    humid: { adjustment: 750, label: 'Humid (high humidity)' },
    cold: { adjustment: -200, label: 'Cold (below 15°C / 59°F)' }
  };

  const calculateHydration = () => {
    const weightNum = parseFloat(weight);
    const exerciseMin = parseFloat(exerciseDuration) || 0;
    const caffeineML = parseFloat(caffeineIntake) || 0;
    const alcoholML = parseFloat(alcoholIntake) || 0;

    if (weightNum && activityLevel && climate) {
      // Base water needs: 35ml per kg of body weight
      const baseNeeds = weightNum * 35;
      
      // Activity level adjustment
      const activityMultiplier = activityLevels[activityLevel as keyof typeof activityLevels].multiplier;
      let adjustedNeeds = baseNeeds * activityMultiplier;
      
      // Climate adjustment
      const climateAdjustment = climates[climate as keyof typeof climates].adjustment;
      adjustedNeeds += climateAdjustment;
      
      // Exercise adjustment (500ml per 30 minutes of exercise)
      const exerciseAdjustment = (exerciseMin / 30) * 500;
      adjustedNeeds += exerciseAdjustment;
      
      // Caffeine adjustment (need extra 100ml per 100mg caffeine)
      const caffeineAdjustment = (caffeineML / 100) * 100;
      adjustedNeeds += caffeineAdjustment;
      
      // Alcohol adjustment (need extra 250ml per standard drink)
      const alcoholAdjustment = (alcoholML / 14) * 250; // 14ml = 1 standard drink
      adjustedNeeds += alcoholAdjustment;
      
      setBaseWaterNeeds(baseNeeds);
      setTotalWaterNeeds(adjustedNeeds);
      
      // Create hydration schedule
      const schedule = [
        { time: '6:00 AM', amount: Math.round(adjustedNeeds * 0.15), activity: 'Wake up hydration' },
        { time: '8:00 AM', amount: Math.round(adjustedNeeds * 0.10), activity: 'Pre-breakfast' },
        { time: '10:00 AM', amount: Math.round(adjustedNeeds * 0.10), activity: 'Mid-morning' },
        { time: '12:00 PM', amount: Math.round(adjustedNeeds * 0.15), activity: 'Pre-lunch' },
        { time: '2:00 PM', amount: Math.round(adjustedNeeds * 0.10), activity: 'Afternoon' },
        { time: '4:00 PM', amount: Math.round(adjustedNeeds * 0.10), activity: 'Pre-workout' },
        { time: '6:00 PM', amount: Math.round(adjustedNeeds * 0.15), activity: 'Evening' },
        { time: '8:00 PM', amount: Math.round(adjustedNeeds * 0.10), activity: 'Dinner time' },
        { time: '10:00 PM', amount: Math.round(adjustedNeeds * 0.05), activity: 'Before bed' }
      ];
      
      setHydrationSchedule(schedule);
      
      // Generate interpretation
      let hydrationInterpretation = `Your daily water intake should be ${Math.round(adjustedNeeds)}ml (${(adjustedNeeds / 1000).toFixed(1)} liters). `;
      
      if (adjustedNeeds > 3500) {
        hydrationInterpretation += 'This is a high intake due to your activity level and environmental factors. ';
      } else if (adjustedNeeds < 2000) {
        hydrationInterpretation += 'This is a moderate intake suitable for your lifestyle. ';
      }
      
      if (exerciseMin > 60) {
        hydrationInterpretation += 'Remember to drink extra water during and after exercise. ';
      }
      
      if (climate === 'hot' || climate === 'humid') {
        hydrationInterpretation += 'Hot/humid conditions increase your hydration needs significantly. ';
      }
      
      hydrationInterpretation += 'Spread your intake throughout the day for optimal hydration.';
      
      setInterpretation(hydrationInterpretation);
      setPointsEarned(15);
      
      // Award points
      const currentPoints = parseInt(localStorage.getItem('vitapulse-points') || '0');
      localStorage.setItem('vitapulse-points', (currentPoints + 15).toString());
    }
  };

  const getHydrationLevel = (amount: number) => {
    if (amount < 2000) return { level: 'Low', color: 'bg-red-500' };
    if (amount < 2500) return { level: 'Adequate', color: 'bg-yellow-500' };
    if (amount < 3500) return { level: 'Good', color: 'bg-green-500' };
    return { level: 'High', color: 'bg-blue-500' };
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
              <Droplets className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Hydration Calculator
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate your daily water intake needs based on your lifestyle and environment
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full"
                  />
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
                    Climate/Environment
                  </label>
                  <Select value={climate} onValueChange={setClimate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select climate" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(climates).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exercise Duration (minutes/day)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Caffeine (mg/day)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={caffeineIntake}
                      onChange={(e) => setCaffeineIntake(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alcohol (ml/day)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={alcoholIntake}
                      onChange={(e) => setAlcoholIntake(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={calculateHydration}
                  className="w-full"
                  disabled={!weight || !activityLevel || !climate}
                >
                  Calculate Hydration Needs
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
              
              {totalWaterNeeds ? (
                <div className="space-y-6">
                  {/* Main Water Intake */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {totalWaterNeeds.toFixed(0)}ml
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                      Daily Water Intake
                    </div>
                    <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                      {(totalWaterNeeds / 1000).toFixed(1)} Liters
                    </div>
                  </div>

                  {/* Hydration Level Badge */}
                  <div className="text-center">
                    <Badge className={`${getHydrationLevel(totalWaterNeeds).color} text-white px-4 py-2`}>
                      {getHydrationLevel(totalWaterNeeds).level} Hydration Level
                    </Badge>
                  </div>

                  {/* Base vs Total */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {baseWaterNeeds?.toFixed(0)}ml
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Base Needs
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-xl font-bold text-blue-600 mb-1">
                        +{(totalWaterNeeds - (baseWaterNeeds || 0)).toFixed(0)}ml
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Adjustments
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Hydration Guidance
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
                        +{pointsEarned} Points Earned! 💧
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Enter your details to calculate your hydration needs
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Hydration Schedule */}
        {hydrationSchedule.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Suggested Hydration Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hydrationSchedule.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-blue-700 dark:text-blue-300">
                        {item.time}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {item.amount}ml
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.activity}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 <strong>Tip:</strong> Adjust timing based on your schedule. The key is consistent intake throughout the day.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}