'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  Activity, 
  Heart, 
  Scale, 
  Target, 
  TrendingUp,
  Baby,
  Zap,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface BMIResult {
  bmi: number;
  category: string;
  healthyRange: string;
  recommendations: string[];
  color: string;
}

interface TDEEResult {
  bmr: number;
  tdee: number;
  activityLevel: string;
  weightGoal: {
    maintain: number;
    mildLoss: number;
    moderateLoss: number;
    extremeLoss: number;
    mildGain: number;
    moderateGain: number;
  };
}

interface BodyFatResult {
  bodyFat: number;
  category: string;
  recommendations: string[];
  color: string;
}

interface PregnancyResult {
  dueDate: string;
  weeksPregnant: number;
  trimester: number;
  recommendations: string[];
  milestones: string[];
}

export default function HealthCalculatorsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bmi');

  // BMI Calculator State
  const [bmiData, setBmiData] = useState({
    weight: '',
    height: '',
    unit: 'metric'
  });
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);

  // TDEE Calculator State
  const [tdeeData, setTdeeData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    unit: 'metric'
  });
  const [tdeeResult, setTdeeResult] = useState<TDEEResult | null>(null);

  // Body Fat Calculator State
  const [bodyFatData, setBodyFatData] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    neck: '',
    waist: '',
    hip: '',
    unit: 'metric'
  });
  const [bodyFatResult, setBodyFatResult] = useState<BodyFatResult | null>(null);

  // Pregnancy Calculator State
  const [pregnancyData, setPregnancyData] = useState({
    lastPeriod: '',
    cycleLength: '28'
  });
  const [pregnancyResult, setPregnancyResult] = useState<PregnancyResult | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/health-calculators');
    }
  }, [user, loading, router]);

  // BMI Calculator Functions
  const calculateBMI = () => {
    const weight = parseFloat(bmiData.weight);
    const height = parseFloat(bmiData.height);

    if (!weight || !height) {
      toast.error('Please enter valid weight and height');
      return;
    }

    let bmi: number;
    if (bmiData.unit === 'metric') {
      bmi = weight / ((height / 100) ** 2);
    } else {
      bmi = (weight / (height ** 2)) * 703;
    }

    let category: string;
    let color: string;
    let recommendations: string[];

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600';
      recommendations = [
        'Consider consulting a healthcare provider',
        'Focus on nutrient-dense foods',
        'Include healthy fats and proteins',
        'Consider strength training'
      ];
    } else if (bmi < 25) {
      category = 'Normal weight';
      color = 'text-green-600';
      recommendations = [
        'Maintain current healthy lifestyle',
        'Continue balanced diet and exercise',
        'Regular health check-ups',
        'Stay hydrated and get adequate sleep'
      ];
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-600';
      recommendations = [
        'Consider gradual weight loss',
        'Increase physical activity',
        'Focus on portion control',
        'Consult healthcare provider for guidance'
      ];
    } else {
      category = 'Obese';
      color = 'text-red-600';
      recommendations = [
        'Consult healthcare provider immediately',
        'Consider structured weight loss program',
        'Focus on sustainable lifestyle changes',
        'Regular monitoring of health markers'
      ];
    }

    setBmiResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      healthyRange: '18.5 - 24.9',
      recommendations,
      color
    });

    toast.success('BMI calculated successfully!');
  };

  // TDEE Calculator Functions
  const calculateTDEE = () => {
    const weight = parseFloat(tdeeData.weight);
    const height = parseFloat(tdeeData.height);
    const age = parseFloat(tdeeData.age);

    if (!weight || !height || !age || !tdeeData.gender || !tdeeData.activityLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    let weightKg = weight;
    let heightCm = height;

    if (tdeeData.unit === 'imperial') {
      weightKg = weight * 0.453592;
      heightCm = height * 2.54;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (tdeeData.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };

    const tdee = bmr * activityMultipliers[tdeeData.activityLevel];

    setTdeeResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      activityLevel: tdeeData.activityLevel,
      weightGoal: {
        maintain: Math.round(tdee),
        mildLoss: Math.round(tdee - 250),
        moderateLoss: Math.round(tdee - 500),
        extremeLoss: Math.round(tdee - 750),
        mildGain: Math.round(tdee + 250),
        moderateGain: Math.round(tdee + 500)
      }
    });

    toast.success('TDEE calculated successfully!');
  };

  // Body Fat Calculator Functions
  const calculateBodyFat = () => {
    const age = parseFloat(bodyFatData.age);
    const weight = parseFloat(bodyFatData.weight);
    const height = parseFloat(bodyFatData.height);
    const neck = parseFloat(bodyFatData.neck);
    const waist = parseFloat(bodyFatData.waist);
    const hip = parseFloat(bodyFatData.hip);

    if (!age || !weight || !height || !neck || !waist || !bodyFatData.gender) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (bodyFatData.gender === 'female' && !hip) {
      toast.error('Hip measurement is required for females');
      return;
    }

    let heightCm = height;
    let neckCm = neck;
    let waistCm = waist;
    let hipCm = hip;

    if (bodyFatData.unit === 'imperial') {
      heightCm = height * 2.54;
      neckCm = neck * 2.54;
      waistCm = waist * 2.54;
      hipCm = hip * 2.54;
    }

    // US Navy Method
    let bodyFat: number;
    if (bodyFatData.gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }

    let category: string;
    let color: string;
    let recommendations: string[];

    if (bodyFatData.gender === 'male') {
      if (bodyFat < 6) {
        category = 'Essential Fat';
        color = 'text-red-600';
        recommendations = ['Consult healthcare provider', 'May be too low for health'];
      } else if (bodyFat < 14) {
        category = 'Athletic';
        color = 'text-green-600';
        recommendations = ['Excellent fitness level', 'Maintain current routine'];
      } else if (bodyFat < 18) {
        category = 'Fitness';
        color = 'text-blue-600';
        recommendations = ['Good fitness level', 'Continue healthy habits'];
      } else if (bodyFat < 25) {
        category = 'Average';
        color = 'text-yellow-600';
        recommendations = ['Consider increasing exercise', 'Focus on strength training'];
      } else {
        category = 'Obese';
        color = 'text-red-600';
        recommendations = ['Consult healthcare provider', 'Focus on fat loss'];
      }
    } else {
      if (bodyFat < 16) {
        category = 'Athletic';
        color = 'text-green-600';
        recommendations = ['Excellent fitness level', 'Maintain current routine'];
      } else if (bodyFat < 20) {
        category = 'Fitness';
        color = 'text-blue-600';
        recommendations = ['Good fitness level', 'Continue healthy habits'];
      } else if (bodyFat < 25) {
        category = 'Average';
        color = 'text-yellow-600';
        recommendations = ['Consider increasing exercise', 'Focus on strength training'];
      } else {
        category = 'Obese';
        color = 'text-red-600';
        recommendations = ['Consult healthcare provider', 'Focus on fat loss'];
      }
    }

    setBodyFatResult({
      bodyFat: Math.round(bodyFat * 10) / 10,
      category,
      recommendations,
      color
    });

    toast.success('Body fat percentage calculated!');
  };

  // Pregnancy Calculator Functions
  const calculatePregnancy = () => {
    if (!pregnancyData.lastPeriod) {
      toast.error('Please enter your last menstrual period date');
      return;
    }

    const lmp = new Date(pregnancyData.lastPeriod);
    const cycleLength = parseInt(pregnancyData.cycleLength);
    const today = new Date();

    // Calculate due date (280 days from LMP)
    const dueDate = new Date(lmp.getTime() + (280 * 24 * 60 * 60 * 1000));
    
    // Calculate weeks pregnant
    const daysDiff = Math.floor((today.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000));
    const weeksPregnant = Math.floor(daysDiff / 7);
    
    // Determine trimester
    let trimester: number;
    if (weeksPregnant <= 12) {
      trimester = 1;
    } else if (weeksPregnant <= 27) {
      trimester = 2;
    } else {
      trimester = 3;
    }

    const recommendations = [
      'Take prenatal vitamins with folic acid',
      'Attend regular prenatal appointments',
      'Maintain a healthy, balanced diet',
      'Stay hydrated and get adequate rest',
      'Avoid alcohol, smoking, and harmful substances'
    ];

    const milestones = [
      `Week ${weeksPregnant}: Current stage`,
      `Week 12: End of first trimester`,
      `Week 20: Anatomy scan`,
      `Week 28: Third trimester begins`,
      `Week 36: Baby considered full-term soon`
    ];

    setPregnancyResult({
      dueDate: dueDate.toLocaleDateString(),
      weeksPregnant,
      trimester,
      recommendations,
      milestones
    });

    toast.success('Pregnancy information calculated!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
                <Calculator className="h-8 w-8 mr-3 text-blue-600" />
                Health Calculators
              </h1>
              <p className="text-gray-600 mt-1">
                Calculate BMI, TDEE, body fat percentage, and more
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Target className="h-3 w-3 mr-1" />
              Precision Tools
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bmi" className="flex items-center">
              <Scale className="h-4 w-4 mr-2" />
              BMI
            </TabsTrigger>
            <TabsTrigger value="tdee" className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              TDEE
            </TabsTrigger>
            <TabsTrigger value="body-fat" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Body Fat
            </TabsTrigger>
            <TabsTrigger value="pregnancy" className="flex items-center">
              <Baby className="h-4 w-4 mr-2" />
              Pregnancy
            </TabsTrigger>
          </TabsList>

          {/* BMI Calculator */}
          <TabsContent value="bmi" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="h-5 w-5 mr-2 text-blue-600" />
                    BMI Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate your Body Mass Index to assess your weight status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Unit System</Label>
                    <Select value={bmiData.unit} onValueChange={(value) => setBmiData({...bmiData, unit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Weight ({bmiData.unit === 'metric' ? 'kg' : 'lbs'})</Label>
                    <Input
                      type="number"
                      value={bmiData.weight}
                      onChange={(e) => setBmiData({...bmiData, weight: e.target.value})}
                      placeholder={bmiData.unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                    />
                  </div>
                  <div>
                    <Label>Height ({bmiData.unit === 'metric' ? 'cm' : 'inches'})</Label>
                    <Input
                      type="number"
                      value={bmiData.height}
                      onChange={(e) => setBmiData({...bmiData, height: e.target.value})}
                      placeholder={bmiData.unit === 'metric' ? 'e.g., 175' : 'e.g., 69'}
                    />
                  </div>
                  <Button onClick={calculateBMI} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate BMI
                  </Button>
                </CardContent>
              </Card>

              {bmiResult && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Your BMI Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${bmiResult.color}`}>
                        {bmiResult.bmi}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mt-2">
                        {bmiResult.category}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Healthy range: {bmiResult.healthyRange}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {bmiResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* TDEE Calculator */}
          <TabsContent value="tdee" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-orange-600" />
                    TDEE Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate your Total Daily Energy Expenditure for weight management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Unit System</Label>
                    <Select value={tdeeData.unit} onValueChange={(value) => setTdeeData({...tdeeData, unit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Weight ({tdeeData.unit === 'metric' ? 'kg' : 'lbs'})</Label>
                      <Input
                        type="number"
                        value={tdeeData.weight}
                        onChange={(e) => setTdeeData({...tdeeData, weight: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Height ({tdeeData.unit === 'metric' ? 'cm' : 'in'})</Label>
                      <Input
                        type="number"
                        value={tdeeData.height}
                        onChange={(e) => setTdeeData({...tdeeData, height: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={tdeeData.age}
                        onChange={(e) => setTdeeData({...tdeeData, age: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={tdeeData.gender} onValueChange={(value) => setTdeeData({...tdeeData, gender: value})}>
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
                    <Label>Activity Level</Label>
                    <Select value={tdeeData.activityLevel} onValueChange={(value) => setTdeeData({...tdeeData, activityLevel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                        <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={calculateTDEE} className="w-full bg-gradient-to-r from-orange-600 to-red-600">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate TDEE
                  </Button>
                </CardContent>
              </Card>

              {tdeeResult && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-orange-600" />
                      Your TDEE Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {tdeeResult.bmr}
                        </div>
                        <div className="text-sm text-gray-600">BMR (calories/day)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {tdeeResult.tdee}
                        </div>
                        <div className="text-sm text-gray-600">TDEE (calories/day)</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Calorie Goals:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Maintain weight:</span>
                          <span className="font-semibold">{tdeeResult.weightGoal.maintain} cal/day</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Mild weight loss (0.5 lb/week):</span>
                          <span className="font-semibold">{tdeeResult.weightGoal.mildLoss} cal/day</span>
                        </div>
                        <div className="flex justify-between text-green-700">
                          <span>Moderate weight loss (1 lb/week):</span>
                          <span className="font-semibold">{tdeeResult.weightGoal.moderateLoss} cal/day</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                          <span>Mild weight gain (0.5 lb/week):</span>
                          <span className="font-semibold">{tdeeResult.weightGoal.mildGain} cal/day</span>
                        </div>
                        <div className="flex justify-between text-blue-700">
                          <span>Moderate weight gain (1 lb/week):</span>
                          <span className="font-semibold">{tdeeResult.weightGoal.moderateGain} cal/day</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Body Fat Calculator */}
          <TabsContent value="body-fat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                    Body Fat Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate body fat percentage using the US Navy method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Unit System</Label>
                    <Select value={bodyFatData.unit} onValueChange={(value) => setBodyFatData({...bodyFatData, unit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Gender</Label>
                      <Select value={bodyFatData.gender} onValueChange={(value) => setBodyFatData({...bodyFatData, gender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={bodyFatData.age}
                        onChange={(e) => setBodyFatData({...bodyFatData, age: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Weight ({bodyFatData.unit === 'metric' ? 'kg' : 'lbs'})</Label>
                      <Input
                        type="number"
                        value={bodyFatData.weight}
                        onChange={(e) => setBodyFatData({...bodyFatData, weight: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Height ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})</Label>
                      <Input
                        type="number"
                        value={bodyFatData.height}
                        onChange={(e) => setBodyFatData({...bodyFatData, height: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Neck ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})</Label>
                      <Input
                        type="number"
                        value={bodyFatData.neck}
                        onChange={(e) => setBodyFatData({...bodyFatData, neck: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Waist ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})</Label>
                      <Input
                        type="number"
                        value={bodyFatData.waist}
                        onChange={(e) => setBodyFatData({...bodyFatData, waist: e.target.value})}
                      />
                    </div>
                  </div>
                  {bodyFatData.gender === 'female' && (
                    <div>
                      <Label>Hip ({bodyFatData.unit === 'metric' ? 'cm' : 'in'})</Label>
                      <Input
                        type="number"
                        value={bodyFatData.hip}
                        onChange={(e) => setBodyFatData({...bodyFatData, hip: e.target.value})}
                      />
                    </div>
                  )}
                  <Button onClick={calculateBodyFat} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Body Fat
                  </Button>
                </CardContent>
              </Card>

              {bodyFatResult && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-purple-600" />
                      Your Body Fat Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${bodyFatResult.color}`}>
                        {bodyFatResult.bodyFat}%
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mt-2">
                        {bodyFatResult.category}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {bodyFatResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Pregnancy Calculator */}
          <TabsContent value="pregnancy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Baby className="h-5 w-5 mr-2 text-pink-600" />
                    Pregnancy Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate due date and pregnancy milestones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Last Menstrual Period (LMP)</Label>
                    <Input
                      type="date"
                      value={pregnancyData.lastPeriod}
                      onChange={(e) => setPregnancyData({...pregnancyData, lastPeriod: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Average Cycle Length (days)</Label>
                    <Select value={pregnancyData.cycleLength} onValueChange={(value) => setPregnancyData({...pregnancyData, cycleLength: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="21">21 days</SelectItem>
                        <SelectItem value="28">28 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="35">35 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Alert className="border-pink-200 bg-pink-50">
                    <Info className="h-4 w-4 text-pink-600" />
                    <AlertDescription className="text-pink-800">
                      This calculator provides estimates. Always consult your healthcare provider for accurate pregnancy information.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={calculatePregnancy} className="w-full bg-gradient-to-r from-pink-600 to-rose-600">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Pregnancy Info
                  </Button>
                </CardContent>
              </Card>

              {pregnancyResult && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-pink-600" />
                      Your Pregnancy Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-pink-600">
                          {pregnancyResult.weeksPregnant}
                        </div>
                        <div className="text-sm text-gray-600">Weeks Pregnant</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {pregnancyResult.trimester}
                        </div>
                        <div className="text-sm text-gray-600">Trimester</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        Due Date: {pregnancyResult.dueDate}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {pregnancyResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Milestones:</h4>
                      <ul className="space-y-1">
                        {pregnancyResult.milestones.map((milestone, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <Baby className="h-4 w-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}