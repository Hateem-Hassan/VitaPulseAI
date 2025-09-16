'use client';

// Health Calculators - Comprehensive health calculation tools
// BMI, TDEE, Body Fat, Pregnancy, Ideal Weight, Water Intake, and more

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  Heart,
  Activity,
  Scale,
  Target,
  Droplets,
  Baby,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Apple,
  Flame,
  BarChart3,
  Info,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  BookOpen,
  Ruler,
  Weight,
  Calendar,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  calculateBMI,
  calculateTDEE,
  calculateBodyFat,
  calculateIdealWeight,
  calculateWaterIntake,
  calculatePregnancyWeight,
  calculateHealthScore,
  BMICategory,
  ActivityLevel,
  BodyFatCategory,
  PregnancyWeightGain
} from '@/lib/health-utils';
import { toast } from 'sonner';

interface CalculatorResult {
  value: number;
  category: string;
  interpretation: string;
  recommendations: string[];
  healthScore?: number;
  ranges?: { min: number; max: number; label: string }[];
}

interface UserMetrics {
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  neckCircumference?: number;
  hipCircumference?: number;
  pregnancyWeek?: number;
  prePregnancyWeight?: number;
}

const calculatorTypes = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Body Mass Index calculation and interpretation',
    icon: Scale,
    color: 'bg-blue-500',
    fields: ['height', 'weight']
  },
  {
    id: 'tdee',
    name: 'TDEE Calculator',
    description: 'Total Daily Energy Expenditure for calorie planning',
    icon: Flame,
    color: 'bg-orange-500',
    fields: ['age', 'gender', 'height', 'weight', 'activityLevel']
  },
  {
    id: 'bodyFat',
    name: 'Body Fat Calculator',
    description: 'Estimate body fat percentage using measurements',
    icon: Target,
    color: 'bg-purple-500',
    fields: ['age', 'gender', 'height', 'weight', 'waistCircumference', 'neckCircumference', 'hipCircumference']
  },
  {
    id: 'idealWeight',
    name: 'Ideal Weight Calculator',
    description: 'Calculate your ideal weight range',
    icon: TrendingUp,
    color: 'bg-green-500',
    fields: ['height', 'gender', 'age']
  },
  {
    id: 'waterIntake',
    name: 'Water Intake Calculator',
    description: 'Daily water intake recommendations',
    icon: Droplets,
    color: 'bg-cyan-500',
    fields: ['weight', 'activityLevel']
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy Weight Calculator',
    description: 'Healthy weight gain during pregnancy',
    icon: Baby,
    color: 'bg-pink-500',
    fields: ['height', 'prePregnancyWeight', 'pregnancyWeek']
  },
  {
    id: 'healthScore',
    name: 'Health Score Calculator',
    description: 'Overall health assessment score',
    icon: Heart,
    color: 'bg-red-500',
    fields: ['age', 'gender', 'height', 'weight', 'activityLevel', 'bodyFatPercentage']
  }
];

const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
];

export default function HealthCalculatorsPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();
  
  const [selectedCalculator, setSelectedCalculator] = useState<string>('bmi');
  const [metrics, setMetrics] = useState<UserMetrics>({
    age: userProfile?.age || 30,
    gender: (userProfile?.gender as 'male' | 'female') || 'male',
    height: userProfile?.height || 170,
    weight: userProfile?.weight || 70,
    activityLevel: 'moderately_active'
  });
  const [results, setResults] = useState<Record<string, CalculatorResult>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate results for selected calculator
  const calculateResult = async (calculatorId: string) => {
    setIsCalculating(true);
    
    try {
      let result: CalculatorResult;
      
      switch (calculatorId) {
        case 'bmi':
          const bmiResult = calculateBMI(metrics.height, metrics.weight);
          result = {
            value: bmiResult.bmi,
            category: bmiResult.category,
            interpretation: getBMIInterpretation(bmiResult.category),
            recommendations: getBMIRecommendations(bmiResult.category),
            ranges: [
              { min: 0, max: 18.5, label: 'Underweight' },
              { min: 18.5, max: 25, label: 'Normal' },
              { min: 25, max: 30, label: 'Overweight' },
              { min: 30, max: 100, label: 'Obese' }
            ]
          };
          break;
          
        case 'tdee':
          const tdeeResult = calculateTDEE(
            metrics.age,
            metrics.gender,
            metrics.height,
            metrics.weight,
            metrics.activityLevel
          );
          result = {
            value: tdeeResult.tdee,
            category: getTDEECategory(tdeeResult.tdee),
            interpretation: getTDEEInterpretation(tdeeResult.tdee, metrics.gender),
            recommendations: getTDEERecommendations(tdeeResult.tdee)
          };
          break;
          
        case 'bodyFat':
          if (!metrics.waistCircumference || !metrics.neckCircumference) {
            throw new Error('Waist and neck measurements are required');
          }
          const bodyFatResult = calculateBodyFat(
            metrics.age,
            metrics.gender,
            metrics.height,
            metrics.weight,
            metrics.waistCircumference,
            metrics.neckCircumference,
            metrics.hipCircumference
          );
          result = {
            value: bodyFatResult.bodyFatPercentage,
            category: bodyFatResult.category,
            interpretation: getBodyFatInterpretation(bodyFatResult.category, metrics.gender),
            recommendations: getBodyFatRecommendations(bodyFatResult.category)
          };
          break;
          
        case 'idealWeight':
          const idealWeightResult = calculateIdealWeight(metrics.height, metrics.gender, metrics.age);
          result = {
            value: idealWeightResult.idealWeight,
            category: getIdealWeightCategory(metrics.weight, idealWeightResult.idealWeight),
            interpretation: getIdealWeightInterpretation(metrics.weight, idealWeightResult.idealWeight),
            recommendations: getIdealWeightRecommendations(metrics.weight, idealWeightResult.idealWeight),
            ranges: [
              { min: idealWeightResult.minWeight, max: idealWeightResult.maxWeight, label: 'Healthy Range' }
            ]
          };
          break;
          
        case 'waterIntake':
          const waterResult = calculateWaterIntake(metrics.weight, metrics.activityLevel);
          result = {
            value: waterResult.dailyIntake,
            category: 'Recommended',
            interpretation: `Based on your weight and activity level, you should drink ${waterResult.dailyIntake.toFixed(1)} liters of water daily.`,
            recommendations: getWaterIntakeRecommendations(waterResult.dailyIntake)
          };
          break;
          
        case 'pregnancy':
          if (!metrics.prePregnancyWeight || !metrics.pregnancyWeek) {
            throw new Error('Pre-pregnancy weight and pregnancy week are required');
          }
          const pregnancyResult = calculatePregnancyWeight(
            metrics.height,
            metrics.prePregnancyWeight,
            metrics.pregnancyWeek
          );
          result = {
            value: pregnancyResult.recommendedGain,
            category: pregnancyResult.category,
            interpretation: getPregnancyInterpretation(pregnancyResult),
            recommendations: getPregnancyRecommendations(pregnancyResult.category)
          };
          break;
          
        case 'healthScore':
          const healthScoreResult = calculateHealthScore({
            age: metrics.age,
            gender: metrics.gender,
            bmi: calculateBMI(metrics.height, metrics.weight).bmi,
            bodyFatPercentage: metrics.bodyFatPercentage,
            activityLevel: metrics.activityLevel
          });
          result = {
            value: healthScoreResult.score,
            category: healthScoreResult.category,
            interpretation: getHealthScoreInterpretation(healthScoreResult.score),
            recommendations: getHealthScoreRecommendations(healthScoreResult.score),
            healthScore: healthScoreResult.score
          };
          break;
          
        default:
          throw new Error('Unknown calculator type');
      }
      
      setResults(prev => ({ ...prev, [calculatorId]: result }));
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error(error instanceof Error ? error.message : 'Calculation failed');
    } finally {
      setIsCalculating(false);
    }
  };

  // Helper functions for interpretations and recommendations
  const getBMIInterpretation = (category: BMICategory): string => {
    const interpretations = {
      underweight: 'Your BMI indicates you are underweight. This may increase risk of nutritional deficiencies.',
      normal: 'Your BMI is in the healthy range. Maintain your current lifestyle.',
      overweight: 'Your BMI indicates you are overweight. Consider lifestyle changes to reach a healthier weight.',
      obese: 'Your BMI indicates obesity. Consult with healthcare professionals for a weight management plan.'
    };
    return interpretations[category];
  };

  const getBMIRecommendations = (category: BMICategory): string[] => {
    const recommendations = {
      underweight: [
        'Increase caloric intake with nutrient-dense foods',
        'Include healthy fats like nuts, avocados, and olive oil',
        'Consider strength training to build muscle mass',
        'Consult a nutritionist for a personalized meal plan'
      ],
      normal: [
        'Maintain a balanced diet with variety',
        'Continue regular physical activity',
        'Monitor weight changes over time',
        'Focus on overall health, not just weight'
      ],
      overweight: [
        'Create a moderate caloric deficit (300-500 calories)',
        'Increase physical activity to 150+ minutes per week',
        'Focus on whole foods and reduce processed foods',
        'Consider working with a healthcare provider'
      ],
      obese: [
        'Consult with healthcare professionals immediately',
        'Consider medically supervised weight loss programs',
        'Focus on gradual, sustainable lifestyle changes',
        'Address any underlying health conditions'
      ]
    };
    return recommendations[category];
  };

  const getTDEECategory = (tdee: number): string => {
    if (tdee < 1500) return 'Low';
    if (tdee < 2000) return 'Moderate';
    if (tdee < 2500) return 'High';
    return 'Very High';
  };

  const getTDEEInterpretation = (tdee: number, gender: string): string => {
    const avgTDEE = gender === 'female' ? 2000 : 2500;
    const diff = tdee - avgTDEE;
    
    if (Math.abs(diff) < 200) {
      return `Your TDEE is close to the average for ${gender}s. This is a good baseline for calorie planning.`;
    } else if (diff > 0) {
      return `Your TDEE is ${Math.abs(diff)} calories above average, likely due to higher activity levels or muscle mass.`;
    } else {
      return `Your TDEE is ${Math.abs(diff)} calories below average, which may be due to lower activity or smaller body size.`;
    }
  };

  const getTDEERecommendations = (tdee: number): string[] => [
    `Eat around ${Math.round(tdee)} calories daily to maintain weight`,
    `For weight loss, aim for ${Math.round(tdee - 500)} calories daily`,
    `For weight gain, aim for ${Math.round(tdee + 300)} calories daily`,
    'Adjust based on your progress and goals',
    'Focus on nutrient timing around workouts'
  ];

  const getBodyFatInterpretation = (category: BodyFatCategory, gender: string): string => {
    const interpretations = {
      essential: `You're at essential body fat levels. This is the minimum needed for basic physiological functions.`,
      athletic: `You have athletic-level body fat. This is typical for competitive athletes.`,
      fitness: `You're in the fitness range. This indicates good physical conditioning.`,
      average: `You're in the average range for ${gender}s. This is considered acceptable.`,
      obese: `Your body fat percentage indicates obesity. Consider a comprehensive health plan.`
    };
    return interpretations[category];
  };

  const getBodyFatRecommendations = (category: BodyFatCategory): string[] => {
    const recommendations = {
      essential: [
        'Maintain current body composition carefully',
        'Ensure adequate nutrition for health',
        'Monitor for signs of overtraining',
        'Consider working with sports nutritionist'
      ],
      athletic: [
        'Maintain through consistent training',
        'Focus on performance nutrition',
        'Monitor recovery and adaptation',
        'Periodize training appropriately'
      ],
      fitness: [
        'Continue current fitness routine',
        'Maintain balanced nutrition',
        'Consider strength training progression',
        'Monitor body composition changes'
      ],
      average: [
        'Increase physical activity gradually',
        'Focus on strength training',
        'Improve dietary quality',
        'Set realistic body composition goals'
      ],
      obese: [
        'Consult healthcare professionals',
        'Start with low-impact activities',
        'Focus on sustainable lifestyle changes',
        'Consider professional guidance'
      ]
    };
    return recommendations[category];
  };

  const getIdealWeightCategory = (currentWeight: number, idealWeight: number): string => {
    const diff = Math.abs(currentWeight - idealWeight);
    if (diff <= 2) return 'Ideal';
    if (diff <= 5) return 'Close to Ideal';
    if (currentWeight > idealWeight) return 'Above Ideal';
    return 'Below Ideal';
  };

  const getIdealWeightInterpretation = (currentWeight: number, idealWeight: number): string => {
    const diff = currentWeight - idealWeight;
    if (Math.abs(diff) <= 2) {
      return 'Your current weight is very close to your ideal weight range.';
    } else if (diff > 0) {
      return `You are ${diff.toFixed(1)} kg above your ideal weight range.`;
    } else {
      return `You are ${Math.abs(diff).toFixed(1)} kg below your ideal weight range.`;
    }
  };

  const getIdealWeightRecommendations = (currentWeight: number, idealWeight: number): string[] => {
    const diff = currentWeight - idealWeight;
    
    if (Math.abs(diff) <= 2) {
      return [
        'Maintain your current weight',
        'Focus on body composition over weight',
        'Continue healthy lifestyle habits',
        'Monitor changes over time'
      ];
    } else if (diff > 0) {
      return [
        `Aim to lose ${diff.toFixed(1)} kg gradually`,
        'Create a moderate caloric deficit',
        'Increase physical activity',
        'Focus on sustainable changes'
      ];
    } else {
      return [
        `Consider gaining ${Math.abs(diff).toFixed(1)} kg safely`,
        'Increase caloric intake with healthy foods',
        'Include strength training',
        'Consult with a nutritionist'
      ];
    }
  };

  const getWaterIntakeRecommendations = (intake: number): string[] => [
    `Drink ${intake.toFixed(1)} liters (${Math.round(intake * 33.8)} fl oz) daily`,
    'Increase intake during hot weather or illness',
    'Monitor urine color as hydration indicator',
    'Spread intake throughout the day',
    'Include water-rich foods in your diet'
  ];

  const getPregnancyInterpretation = (result: PregnancyWeightGain): string => {
    return `Based on your pre-pregnancy BMI category (${result.category}), you should gain ${result.minGain}-${result.maxGain} kg total during pregnancy. At week ${result.currentWeek || 0}, aim for ${result.recommendedGain.toFixed(1)} kg gained so far.`;
  };

  const getPregnancyRecommendations = (category: string): string[] => {
    const recommendations = {
      underweight: [
        'Aim for higher end of weight gain range',
        'Focus on nutrient-dense foods',
        'Take prenatal vitamins as prescribed',
        'Regular prenatal check-ups'
      ],
      normal: [
        'Follow standard pregnancy nutrition guidelines',
        'Maintain regular, moderate exercise',
        'Monitor weight gain monthly',
        'Stay hydrated and eat balanced meals'
      ],
      overweight: [
        'Aim for lower end of weight gain range',
        'Focus on nutrient quality over quantity',
        'Discuss exercise plan with healthcare provider',
        'Monitor for gestational diabetes'
      ],
      obese: [
        'Work closely with healthcare team',
        'Focus on healthy eating patterns',
        'Monitor for pregnancy complications',
        'Consider nutritionist consultation'
      ]
    };
    return recommendations[category as keyof typeof recommendations] || recommendations.normal;
  };

  const getHealthScoreInterpretation = (score: number): string => {
    if (score >= 90) return 'Excellent health profile! You\'re doing great with your health management.';
    if (score >= 80) return 'Good health profile with room for some improvements.';
    if (score >= 70) return 'Fair health profile. Consider making some lifestyle changes.';
    if (score >= 60) return 'Below average health profile. Focus on key health improvements.';
    return 'Poor health profile. Consider consulting with healthcare professionals.';
  };

  const getHealthScoreRecommendations = (score: number): string[] => {
    if (score >= 90) {
      return [
        'Maintain your excellent health habits',
        'Continue regular health screenings',
        'Stay consistent with exercise routine',
        'Keep monitoring your health metrics'
      ];
    } else if (score >= 70) {
      return [
        'Increase physical activity levels',
        'Improve dietary quality',
        'Focus on stress management',
        'Get adequate sleep (7-9 hours)'
      ];
    } else {
      return [
        'Consult with healthcare professionals',
        'Start with small, sustainable changes',
        'Focus on one health goal at a time',
        'Consider professional health coaching'
      ];
    }
  };

  // Get current calculator
  const currentCalculator = calculatorTypes.find(calc => calc.id === selectedCalculator);
  const currentResult = results[selectedCalculator];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Health Calculators
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Comprehensive health assessment and calculation tools
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Choose Calculator</CardTitle>
                <CardDescription>
                  Select a health calculator to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calculatorTypes.map((calculator) => {
                    const Icon = calculator.icon;
                    return (
                      <Button
                        key={calculator.id}
                        variant={selectedCalculator === calculator.id ? 'default' : 'ghost'}
                        className="w-full justify-start h-auto p-4"
                        onClick={() => setSelectedCalculator(calculator.id)}
                      >
                        <div className={`p-2 rounded-md mr-3 ${calculator.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{calculator.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {calculator.description}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculator Input & Results */}
          <div className="lg:col-span-2 space-y-6">
            {currentCalculator && (
              <>
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <currentCalculator.icon className="h-5 w-5 mr-2" />
                      {currentCalculator.name}
                    </CardTitle>
                    <CardDescription>
                      {currentCalculator.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Basic Fields */}
                      {currentCalculator.fields.includes('age') && (
                        <div className="space-y-2">
                          <Label htmlFor="age">Age (years)</Label>
                          <Input
                            id="age"
                            type="number"
                            value={metrics.age}
                            onChange={(e) => setMetrics(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                            min="1"
                            max="120"
                          />
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('gender') && (
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select
                            id="gender"
                            className="w-full p-2 border rounded-md bg-background"
                            value={metrics.gender}
                            onChange={(e) => setMetrics(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('height') && (
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={metrics.height}
                            onChange={(e) => setMetrics(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                            min="100"
                            max="250"
                          />
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('weight') && (
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={metrics.weight}
                            onChange={(e) => setMetrics(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                            min="20"
                            max="300"
                            step="0.1"
                          />
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('prePregnancyWeight') && (
                        <div className="space-y-2">
                          <Label htmlFor="prePregnancyWeight">Pre-pregnancy Weight (kg)</Label>
                          <Input
                            id="prePregnancyWeight"
                            type="number"
                            value={metrics.prePregnancyWeight || ''}
                            onChange={(e) => setMetrics(prev => ({ ...prev, prePregnancyWeight: parseFloat(e.target.value) || undefined }))}
                            min="20"
                            max="300"
                            step="0.1"
                          />
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('pregnancyWeek') && (
                        <div className="space-y-2">
                          <Label htmlFor="pregnancyWeek">Pregnancy Week</Label>
                          <Input
                            id="pregnancyWeek"
                            type="number"
                            value={metrics.pregnancyWeek || ''}
                            onChange={(e) => setMetrics(prev => ({ ...prev, pregnancyWeek: parseInt(e.target.value) || undefined }))}
                            min="1"
                            max="42"
                          />
                        </div>
                      )}
                      
                      {/* Body Measurements */}
                      {currentCalculator.fields.includes('waistCircumference') && (
                        <div className="space-y-2">
                          <Label htmlFor="waist">Waist Circumference (cm)</Label>
                          <Input
                            id="waist"
                            type="number"
                            value={metrics.waistCircumference || ''}
                            onChange={(e) => setMetrics(prev => ({ ...prev, waistCircumference: parseFloat(e.target.value) || undefined }))}
                            min="50"
                            max="200"
                            step="0.1"
                          />
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('neckCircumference') && (
                        <div className="space-y-2">
                          <Label htmlFor="neck">Neck Circumference (cm)</Label>
                          <Input
                            id="neck"
                            type="number"
                            value={metrics.neckCircumference || ''}
                            onChange={(e) => setMetrics(prev => ({ ...prev, neckCircumference: parseFloat(e.target.value) || undefined }))}
                            min="20"
                            max="60"
                            step="0.1"
                          />
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('hipCircumference') && metrics.gender === 'female' && (
                        <div className="space-y-2">
                          <Label htmlFor="hip">Hip Circumference (cm)</Label>
                          <Input
                            id="hip"
                            type="number"
                            value={metrics.hipCircumference || ''}
                            onChange={(e) => setMetrics(prev => ({ ...prev, hipCircumference: parseFloat(e.target.value) || undefined }))}
                            min="60"
                            max="200"
                            step="0.1"
                          />
                        </div>
                      )}
                      
                      {currentCalculator.fields.includes('bodyFatPercentage') && (
                        <div className="space-y-2">
                          <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                          <Input
                            id="bodyFat"
                            type="number"
                            value={metrics.bodyFatPercentage || ''}
                            onChange={(e) => setMetrics(prev => ({ ...prev, bodyFatPercentage: parseFloat(e.target.value) || undefined }))}
                            min="3"
                            max="50"
                            step="0.1"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Activity Level */}
                    {currentCalculator.fields.includes('activityLevel') && (
                      <div className="space-y-2">
                        <Label>Activity Level</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {activityLevels.map((level) => (
                            <Button
                              key={level.value}
                              variant={metrics.activityLevel === level.value ? 'default' : 'outline'}
                              className="h-auto p-3 text-left"
                              onClick={() => setMetrics(prev => ({ ...prev, activityLevel: level.value }))}
                            >
                              <div>
                                <div className="font-medium">{level.label}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {level.description}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Calculate Button */}
                    <Button
                      onClick={() => calculateResult(selectedCalculator)}
                      disabled={isCalculating}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isCalculating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Results */}
                {currentResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Results</span>
                        <Badge className={`${
                          currentResult.category.includes('Normal') || currentResult.category.includes('Ideal') || currentResult.category.includes('Good') || currentResult.category.includes('Excellent')
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20'
                            : currentResult.category.includes('Average') || currentResult.category.includes('Fair')
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20'
                        }`}>
                          {currentResult.category}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Main Result */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {selectedCalculator === 'waterIntake' 
                            ? `${currentResult.value.toFixed(1)} L`
                            : selectedCalculator === 'tdee'
                            ? `${Math.round(currentResult.value)} cal`
                            : selectedCalculator === 'bodyFat' || selectedCalculator === 'healthScore'
                            ? `${currentResult.value.toFixed(1)}%`
                            : `${currentResult.value.toFixed(1)}`
                          }
                        </div>
                        <div className="text-lg text-neutral-600 dark:text-neutral-400">
                          {currentCalculator.name.replace(' Calculator', '')}
                        </div>
                      </div>
                      
                      {/* Health Score Progress */}
                      {currentResult.healthScore && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Health Score</span>
                            <span>{currentResult.healthScore}/100</span>
                          </div>
                          <Progress value={currentResult.healthScore} className="h-3" />
                        </div>
                      )}
                      
                      {/* Ranges */}
                      {currentResult.ranges && (
                        <div className="space-y-2">
                          <Label>Reference Ranges</Label>
                          <div className="space-y-1">
                            {currentResult.ranges.map((range, index) => (
                              <div key={index} className="flex justify-between text-sm p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
                                <span>{range.label}</span>
                                <span>{range.min} - {range.max}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Interpretation */}
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          {currentResult.interpretation}
                        </AlertDescription>
                      </Alert>
                      
                      {/* Recommendations */}
                      <div className="space-y-2">
                        <Label>Recommendations</Label>
                        <ul className="space-y-2">
                          {currentResult.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={() => {
                            // Save results logic here
                            toast.success('Results saved to your health profile');
                          }}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Save Results
                        </Button>
                        <Button
                          onClick={() => {
                            // Share results logic here
                            toast.success('Results copied to clipboard');
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}