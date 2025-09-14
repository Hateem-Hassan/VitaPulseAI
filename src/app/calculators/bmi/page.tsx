'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Target, TrendingUp, Heart } from 'lucide-react';

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // Convert cm to meters

    if (weightNum && heightNum) {
      const bmiValue = weightNum / (heightNum * heightNum);
      setBmi(bmiValue);

      let bmiCategory = '';
      let bmiInterpretation = '';

      if (bmiValue < 18.5) {
        bmiCategory = 'Underweight';
        bmiInterpretation = 'You may need to gain weight. Consult a healthcare provider for personalized advice.';
      } else if (bmiValue < 25) {
        bmiCategory = 'Normal weight';
        bmiInterpretation = 'Great! Your weight is in the healthy range. Keep maintaining your current lifestyle.';
      } else if (bmiValue < 30) {
        bmiCategory = 'Overweight';
        bmiInterpretation = 'Consider lifestyle changes to reach a healthier weight. Focus on balanced diet and regular exercise.';
      } else {
        bmiCategory = 'Obese';
        bmiInterpretation = 'Consult a healthcare provider for weight management guidance and support.';
      }

      setCategory(bmiCategory);
      setInterpretation(bmiInterpretation);
      setPointsEarned(10);

      // Award points
      const currentPoints = parseInt(localStorage.getItem('vitapulse-points') || '0');
      localStorage.setItem('vitapulse-points', (currentPoints + 10).toString());
    }
  };

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'Underweight': return 'bg-blue-500';
      case 'Normal weight': return 'bg-green-500';
      case 'Overweight': return 'bg-yellow-500';
      case 'Obese': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                BMI Calculator
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate your Body Mass Index and get personalized health insights
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
                    Height (cm)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  onClick={calculateBMI}
                  className="w-full"
                  disabled={!weight || !height}
                >
                  Calculate BMI
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
              
              {bmi ? (
                <div className="space-y-6">
                  {/* BMI Value */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {bmi.toFixed(1)}
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      BMI Score
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-center">
                    <Badge className={`${getBMIColor(category)} text-white px-4 py-2 text-lg`}>
                      {category}
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
                  Enter your weight and height to calculate your BMI
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* BMI Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">BMI Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Underweight</div>
                <div className="text-sm text-gray-600">Below 18.5</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Normal</div>
                <div className="text-sm text-gray-600">18.5 - 24.9</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">Overweight</div>
                <div className="text-sm text-gray-600">25 - 29.9</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">Obese</div>
                <div className="text-sm text-gray-600">30 and above</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
