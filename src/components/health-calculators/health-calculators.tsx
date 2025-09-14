'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Heart, 
  Brain, 
  Activity, 
  Droplets, 
  Scale,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Target,
  Zap,
  Moon,
  Thermometer,
  Shield,
  Stethoscope,
  Pill,
  Eye,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  calculateBMI, 
  calculateBodyFat, 
  calculateCalories, 
  calculateWHR, 
  calculateWaterIntake, 
  calculateIdealWeight, 
  calculateMetabolicAge 
} from '@/utils/calculators';

interface CalculatorResult {
  value: number;
  unit: string;
  category: 'underweight' | 'normal' | 'overweight' | 'obese' | 'low' | 'high' | 'moderate' | 'severe';
  interpretation: string;
  recommendations: string[];
  riskFactors?: string[];
  nextSteps?: string[];
}

const calculators = {
  general: [
    {
      id: 'bmi',
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index',
      icon: Scale,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      inputs: [
        { name: 'weight', label: 'Weight (kg)', type: 'number', required: true },
        { name: 'height', label: 'Height (cm)', type: 'number', required: true },
      ],
      calculate: (data: any): CalculatorResult => {
        const bmi = calculateBMI(parseFloat(data.weight), parseFloat(data.height));
        let category: CalculatorResult['category'] = 'normal';
        let interpretation = '';
        let recommendations: string[] = [];
        
        if (bmi < 18.5) {
          category = 'underweight';
          interpretation = 'You are underweight. Consider gaining weight through healthy eating and exercise.';
          recommendations = ['Increase caloric intake', 'Focus on nutrient-dense foods', 'Consult a nutritionist'];
        } else if (bmi >= 18.5 && bmi < 25) {
          category = 'normal';
          interpretation = 'You have a healthy weight. Maintain your current lifestyle.';
          recommendations = ['Continue balanced diet', 'Regular exercise', 'Monitor weight regularly'];
        } else if (bmi >= 25 && bmi < 30) {
          category = 'overweight';
          interpretation = 'You are overweight. Consider losing weight through diet and exercise.';
          recommendations = ['Reduce caloric intake', 'Increase physical activity', 'Focus on whole foods'];
        } else {
          category = 'obese';
          interpretation = 'You are obese. Consult a healthcare provider for a weight management plan.';
          recommendations = ['Consult healthcare provider', 'Create structured diet plan', 'Regular supervised exercise'];
        }
        
        return {
          value: Math.round(bmi * 10) / 10,
          unit: 'kg/m²',
          category,
          interpretation,
          recommendations
        };
      },
    },
    {
      id: 'body-fat',
      name: 'Body Fat Calculator',
      description: 'Estimate your body fat percentage',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      inputs: [
        { name: 'waist', label: 'Waist (cm)', type: 'number', required: true },
        { name: 'neck', label: 'Neck (cm)', type: 'number', required: true },
        { name: 'height', label: 'Height (cm)', type: 'number', required: true },
        { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['male', 'female'] },
      ],
      calculate: (data: any): CalculatorResult => {
        const bodyFat = calculateBodyFat(
          parseFloat(data.waist), 
          parseFloat(data.neck), 
          parseFloat(data.height), 
          data.gender
        );
        
        let category: CalculatorResult['category'] = 'normal';
        let interpretation = '';
        
        if (data.gender === 'male') {
          if (bodyFat < 6) category = 'low';
          else if (bodyFat <= 24) category = 'normal';
          else category = 'high';
        } else {
          if (bodyFat < 16) category = 'low';
          else if (bodyFat <= 30) category = 'normal';
          else category = 'high';
        }
        
        interpretation = `Your body fat percentage is ${category}.`;
        
        return {
          value: Math.round(bodyFat * 10) / 10,
          unit: '%',
          category,
          interpretation,
          recommendations: ['Maintain balanced diet', 'Regular exercise', 'Monitor body composition']
        };
      },
    },
    {
      id: 'calories',
      name: 'Calorie Calculator',
      description: 'Calculate your daily calorie needs',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-200 dark:border-orange-800',
      inputs: [
        { name: 'weight', label: 'Weight (kg)', type: 'number', required: true },
        { name: 'height', label: 'Height (cm)', type: 'number', required: true },
        { name: 'age', label: 'Age (years)', type: 'number', required: true },
        { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['male', 'female'] },
        { name: 'activityLevel', label: 'Activity Level', type: 'select', required: true, options: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
        { name: 'goal', label: 'Goal', type: 'select', required: true, options: ['maintain', 'lose', 'gain'] },
      ],
      calculate: (data: any): CalculatorResult => {
        const calories = calculateCalories(
          parseFloat(data.weight),
          parseFloat(data.height),
          parseFloat(data.age),
          data.gender,
          data.activityLevel,
          data.goal
        );
        
        return {
          value: calories,
          unit: 'calories/day',
          category: 'normal',
          interpretation: `Your daily calorie needs for ${data.goal} weight.`,
          recommendations: ['Follow balanced macronutrient distribution', 'Eat regular meals', 'Stay hydrated']
        };
      },
    },
    {
      id: 'waist-hip-ratio',
      name: 'Waist-Hip Ratio',
      description: 'Calculate your waist-to-hip ratio',
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      borderColor: 'border-purple-200 dark:border-purple-800',
      inputs: [
        { name: 'waist', label: 'Waist (cm)', type: 'number', required: true },
        { name: 'hip', label: 'Hip (cm)', type: 'number', required: true },
        { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['male', 'female'] },
      ],
      calculate: (data: any): CalculatorResult => {
        const whr = calculateWHR(parseFloat(data.waist), parseFloat(data.hip), data.gender);
        
        let category: CalculatorResult['category'] = 'normal';
        let interpretation = '';
        
        if (data.gender === 'male') {
          if (whr > 0.9) {
            category = 'high';
            interpretation = 'High risk for health complications.';
          } else {
            category = 'normal';
            interpretation = 'Low to moderate risk.';
          }
        } else {
          if (whr > 0.8) {
            category = 'high';
            interpretation = 'High risk for health complications.';
          } else {
            category = 'normal';
            interpretation = 'Low to moderate risk.';
          }
        }
        
        return {
          value: Math.round(whr * 100) / 100,
          unit: 'ratio',
          category,
          interpretation,
          recommendations: ['Maintain healthy weight', 'Regular exercise', 'Balanced diet']
        };
      },
    },
    {
      id: 'water-intake',
      name: 'Water Intake Calculator',
      description: 'Calculate your daily water needs',
      icon: Droplets,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      borderColor: 'border-cyan-200 dark:border-cyan-800',
      inputs: [
        { name: 'weight', label: 'Weight (kg)', type: 'number', required: true },
        { name: 'activityLevel', label: 'Activity Level', type: 'select', required: true, options: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
      ],
      calculate: (data: any): CalculatorResult => {
        const glasses = calculateWaterIntake(parseFloat(data.weight), data.activityLevel);
        
        return {
          value: glasses,
          unit: 'glasses (250ml)',
          category: 'normal',
          interpretation: 'Recommended daily water intake based on your weight and activity level.',
          recommendations: ['Drink water throughout the day', 'Increase intake during exercise', 'Monitor urine color']
        };
      },
    }
  ]
};

export default function HealthCalculators() {
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculate = async () => {
    if (!selectedCalculator) return;

    setIsCalculating(true);
    
    try {
      const calculator = calculators.general.find(calc => calc.id === selectedCalculator);
      if (!calculator) return;

      // Validate required fields
      const missingFields = calculator.inputs
        .filter(input => input.required && !formData[input.name])
        .map(input => input.label);

      if (missingFields.length > 0) {
        alert(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }

      const calculationResult = calculator.calculate(formData);
      setResult(calculationResult);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Error performing calculation. Please check your inputs.');
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculator = () => {
    setSelectedCalculator(null);
    setFormData({});
    setResult(null);
  };

  const renderCalculatorGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.general.map((calculator) => {
          const IconComponent = calculator.icon;
          return (
            <motion.div
              key={calculator.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${calculator.borderColor} ${calculator.bgColor}`}
                onClick={() => setSelectedCalculator(calculator.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${calculator.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${calculator.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{calculator.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {calculator.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderCalculatorForm = () => {
    const calculator = calculators.general.find(calc => calc.id === selectedCalculator);
    if (!calculator) return null;

    const IconComponent = calculator.icon;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${calculator.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${calculator.color}`} />
              </div>
              <div>
                <CardTitle>{calculator.name}</CardTitle>
                <CardDescription>{calculator.description}</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={resetCalculator}>
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculator.inputs.map((input) => (
              <div key={input.name} className="space-y-2">
                <label className="text-sm font-medium">
                  {input.label}
                  {input.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {input.type === 'select' ? (
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData[input.name] || ''}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                  >
                    <option value="">Select {input.label}</option>
                    {input.options?.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={input.type}
                    placeholder={`Enter ${input.label.toLowerCase()}`}
                    value={formData[input.name] || ''}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <Button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  {result.value} {result.unit}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400 capitalize">
                  {result.category}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Interpretation</h4>
                  <p className="text-gray-600 dark:text-gray-400">{result.interpretation}</p>
                </div>
                
                {result.recommendations && result.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {result.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Health Calculators
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate important health metrics and get personalized recommendations
        </p>
      </div>

      {selectedCalculator ? renderCalculatorForm() : renderCalculatorGrid()}
    </div>
  );
}
