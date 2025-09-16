/**
 * VitaPulse AI Health Utilities
 * Comprehensive health calculation functions with cultural considerations
 * Includes BMI, TDEE, body fat, pregnancy calculators, and more
 */

// Types for health calculations
export interface BMIResult {
  bmi: number;
  category: string;
  healthyWeightRange: { min: number; max: number };
  recommendations: string[];
  culturalConsiderations?: string[];
}

export interface TDEEResult {
  bmr: number;
  tdee: number;
  activityMultiplier: number;
  calorieGoals: {
    maintain: number;
    mildWeightLoss: number;
    weightLoss: number;
    extremeWeightLoss: number;
    mildWeightGain: number;
    weightGain: number;
    extremeWeightGain: number;
  };
  macroBreakdown: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  };
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  category: string;
  leanBodyMass: number;
  fatMass: number;
  recommendations: string[];
}

export interface PregnancyResult {
  gestationalAge: {
    weeks: number;
    days: number;
  };
  trimester: number;
  dueDate: Date;
  weightGainRecommendation: {
    total: { min: number; max: number };
    weekly: { min: number; max: number };
  };
  developmentalMilestones: string[];
  nutritionalNeeds: {
    calories: number;
    protein: number;
    folate: number;
    iron: number;
    calcium: number;
  };
}

export interface BloodPressureResult {
  systolic: number;
  diastolic: number;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  culturalConsiderations?: string[];
}

export interface HeartRateResult {
  heartRate: number;
  category: string;
  targetZones: {
    fatBurn: { min: number; max: number };
    cardio: { min: number; max: number };
    peak: { min: number; max: number };
  };
  recommendations: string[];
}

export interface HydrationResult {
  dailyWaterNeeds: number; // in liters
  currentIntake: number;
  percentage: number;
  status: string;
  recommendations: string[];
  culturalConsiderations?: string[];
}

export interface SleepResult {
  sleepDuration: number;
  sleepEfficiency: number;
  category: string;
  recommendations: string[];
  culturalConsiderations?: string[];
}

// Activity level multipliers for TDEE calculation
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little or no exercise
  lightly_active: 1.375, // Light exercise 1-3 days/week
  moderately_active: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Hard exercise 6-7 days/week
  extremely_active: 1.9, // Very hard exercise, physical job
} as const;

// BMI categories with cultural considerations
export const BMI_CATEGORIES = {
  underweight: { min: 0, max: 18.5, label: 'Underweight' },
  normal: { min: 18.5, max: 25, label: 'Normal Weight' },
  overweight: { min: 25, max: 30, label: 'Overweight' },
  obese_class_1: { min: 30, max: 35, label: 'Obesity Class I' },
  obese_class_2: { min: 35, max: 40, label: 'Obesity Class II' },
  obese_class_3: { min: 40, max: Infinity, label: 'Obesity Class III' },
} as const;

// Asian BMI categories (different thresholds)
export const ASIAN_BMI_CATEGORIES = {
  underweight: { min: 0, max: 18.5, label: 'Underweight' },
  normal: { min: 18.5, max: 23, label: 'Normal Weight' },
  overweight: { min: 23, max: 27.5, label: 'Overweight' },
  obese: { min: 27.5, max: Infinity, label: 'Obese' },
} as const;

/**
 * Calculate BMI with cultural considerations
 */
export function calculateBMI(
  weight: number, // in kg
  height: number, // in cm
  ethnicity?: string
): BMIResult {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Use Asian BMI categories for Asian populations
  const isAsian = ethnicity && ['asian', 'chinese', 'japanese', 'korean', 'indian', 'southeast_asian'].includes(ethnicity.toLowerCase());
  const categories = isAsian ? ASIAN_BMI_CATEGORIES : BMI_CATEGORIES;
  
  let category = 'Unknown';
  let recommendations: string[] = [];
  let culturalConsiderations: string[] = [];
  
  // Determine BMI category
  for (const [key, value] of Object.entries(categories)) {
    if (bmi >= value.min && bmi < value.max) {
      category = value.label;
      break;
    }
  }
  
  // Calculate healthy weight range
  const normalMin = isAsian ? 18.5 : 18.5;
  const normalMax = isAsian ? 23 : 25;
  const healthyWeightRange = {
    min: Math.round(normalMin * heightInMeters * heightInMeters * 10) / 10,
    max: Math.round(normalMax * heightInMeters * heightInMeters * 10) / 10,
  };
  
  // Generate recommendations based on BMI
  if (bmi < 18.5) {
    recommendations = [
      'Consider consulting a healthcare provider about healthy weight gain',
      'Focus on nutrient-dense foods and regular meals',
      'Include strength training to build muscle mass',
      'Monitor for underlying health conditions',
    ];
  } else if (bmi >= 18.5 && bmi < (isAsian ? 23 : 25)) {
    recommendations = [
      'Maintain your current healthy weight',
      'Continue regular physical activity',
      'Follow a balanced, nutritious diet',
      'Regular health check-ups',
    ];
  } else if (bmi >= (isAsian ? 23 : 25) && bmi < (isAsian ? 27.5 : 30)) {
    recommendations = [
      'Consider gradual weight loss through diet and exercise',
      'Increase physical activity to 150+ minutes per week',
      'Focus on portion control and nutrient-dense foods',
      'Consult healthcare provider for personalized plan',
    ];
  } else {
    recommendations = [
      'Consult healthcare provider for comprehensive weight management plan',
      'Consider supervised weight loss program',
      'Focus on sustainable lifestyle changes',
      'Regular monitoring of health markers',
    ];
  }
  
  // Add cultural considerations
  if (isAsian) {
    culturalConsiderations = [
      'Asian populations may have higher health risks at lower BMI levels',
      'Traditional Asian diets emphasize rice, vegetables, and lean proteins',
      'Consider family and cultural food practices in weight management',
    ];
  }
  
  if (ethnicity === 'middle_eastern' || ethnicity === 'arab') {
    culturalConsiderations = [
      'Consider traditional Middle Eastern dietary patterns',
      'Ramadan fasting may affect weight management strategies',
      'Include culturally appropriate physical activities',
    ];
  }
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    healthyWeightRange,
    recommendations,
    culturalConsiderations: culturalConsiderations.length > 0 ? culturalConsiderations : undefined,
  };
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: 'male' | 'female',
  activityLevel: keyof typeof ACTIVITY_MULTIPLIERS
): TDEEResult {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  const tdee = bmr * activityMultiplier;
  
  // Calculate calorie goals for different objectives
  const calorieGoals = {
    maintain: Math.round(tdee),
    mildWeightLoss: Math.round(tdee - 250), // 0.5 lb/week
    weightLoss: Math.round(tdee - 500), // 1 lb/week
    extremeWeightLoss: Math.round(tdee - 750), // 1.5 lb/week
    mildWeightGain: Math.round(tdee + 250), // 0.5 lb/week
    weightGain: Math.round(tdee + 500), // 1 lb/week
    extremeWeightGain: Math.round(tdee + 750), // 1.5 lb/week
  };
  
  // Calculate macro breakdown (moderate approach)
  const proteinPercentage = 0.25; // 25% protein
  const fatPercentage = 0.30; // 30% fat
  const carbPercentage = 0.45; // 45% carbs
  
  const macroBreakdown = {
    protein: {
      grams: Math.round((tdee * proteinPercentage) / 4),
      calories: Math.round(tdee * proteinPercentage),
      percentage: proteinPercentage * 100,
    },
    carbs: {
      grams: Math.round((tdee * carbPercentage) / 4),
      calories: Math.round(tdee * carbPercentage),
      percentage: carbPercentage * 100,
    },
    fat: {
      grams: Math.round((tdee * fatPercentage) / 9),
      calories: Math.round(tdee * fatPercentage),
      percentage: fatPercentage * 100,
    },
  };
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    activityMultiplier,
    calorieGoals,
    macroBreakdown,
  };
}

/**
 * Calculate body fat percentage using Navy Method
 */
export function calculateBodyFat(
  weight: number, // in kg
  height: number, // in cm
  waist: number, // in cm
  neck: number, // in cm
  hip: number, // in cm (for females)
  gender: 'male' | 'female'
): BodyFatResult {
  let bodyFatPercentage: number;
  
  // Convert to inches for Navy formula
  const heightInches = height / 2.54;
  const waistInches = waist / 2.54;
  const neckInches = neck / 2.54;
  const hipInches = hip / 2.54;
  
  if (gender === 'male') {
    bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistInches - neckInches) + 0.15456 * Math.log10(heightInches)) - 450;
  } else {
    bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistInches + hipInches - neckInches) + 0.22100 * Math.log10(heightInches)) - 450;
  }
  
  // Determine category
  let category: string;
  if (gender === 'male') {
    if (bodyFatPercentage < 6) category = 'Essential Fat';
    else if (bodyFatPercentage < 14) category = 'Athletes';
    else if (bodyFatPercentage < 18) category = 'Fitness';
    else if (bodyFatPercentage < 25) category = 'Average';
    else category = 'Obese';
  } else {
    if (bodyFatPercentage < 14) category = 'Essential Fat';
    else if (bodyFatPercentage < 21) category = 'Athletes';
    else if (bodyFatPercentage < 25) category = 'Fitness';
    else if (bodyFatPercentage < 32) category = 'Average';
    else category = 'Obese';
  }
  
  const fatMass = (weight * bodyFatPercentage) / 100;
  const leanBodyMass = weight - fatMass;
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (bodyFatPercentage < (gender === 'male' ? 6 : 14)) {
    recommendations.push('Body fat may be too low for optimal health');
    recommendations.push('Consider consulting a healthcare provider');
    recommendations.push('Focus on maintaining adequate nutrition');
  } else if (bodyFatPercentage > (gender === 'male' ? 25 : 32)) {
    recommendations.push('Consider a structured exercise and nutrition program');
    recommendations.push('Focus on both cardiovascular and strength training');
    recommendations.push('Consult healthcare provider for personalized plan');
  } else {
    recommendations.push('Maintain current fitness level with regular exercise');
    recommendations.push('Continue balanced nutrition and active lifestyle');
  }
  
  return {
    bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
    category,
    leanBodyMass: Math.round(leanBodyMass * 10) / 10,
    fatMass: Math.round(fatMass * 10) / 10,
    recommendations,
  };
}

/**
 * Calculate pregnancy-related metrics
 */
export function calculatePregnancy(
  lastMenstrualPeriod: Date,
  prePregnancyWeight: number, // in kg
  currentWeight: number, // in kg
  height: number // in cm
): PregnancyResult {
  const today = new Date();
  const lmpDate = new Date(lastMenstrualPeriod);
  
  // Calculate gestational age
  const daysDifference = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(daysDifference / 7);
  const days = daysDifference % 7;
  
  // Calculate due date (280 days from LMP)
  const dueDate = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000));
  
  // Determine trimester
  let trimester: number;
  if (weeks < 13) trimester = 1;
  else if (weeks < 27) trimester = 2;
  else trimester = 3;
  
  // Calculate pre-pregnancy BMI for weight gain recommendations
  const heightInMeters = height / 100;
  const prePregnancyBMI = prePregnancyWeight / (heightInMeters * heightInMeters);
  
  // Weight gain recommendations based on pre-pregnancy BMI
  let weightGainRecommendation: { total: { min: number; max: number }; weekly: { min: number; max: number } };
  
  if (prePregnancyBMI < 18.5) {
    // Underweight
    weightGainRecommendation = {
      total: { min: 12.5, max: 18 },
      weekly: { min: 0.5, max: 0.6 },
    };
  } else if (prePregnancyBMI < 25) {
    // Normal weight
    weightGainRecommendation = {
      total: { min: 11.5, max: 16 },
      weekly: { min: 0.4, max: 0.5 },
    };
  } else if (prePregnancyBMI < 30) {
    // Overweight
    weightGainRecommendation = {
      total: { min: 7, max: 11.5 },
      weekly: { min: 0.2, max: 0.3 },
    };
  } else {
    // Obese
    weightGainRecommendation = {
      total: { min: 5, max: 9 },
      weekly: { min: 0.2, max: 0.3 },
    };
  }
  
  // Developmental milestones by trimester
  const developmentalMilestones: string[] = [];
  if (trimester === 1) {
    developmentalMilestones.push('Neural tube development', 'Heart begins beating', 'Major organs forming');
  } else if (trimester === 2) {
    developmentalMilestones.push('Gender can be determined', 'Movement can be felt', 'Hearing develops');
  } else {
    developmentalMilestones.push('Rapid brain development', 'Lungs maturing', 'Preparing for birth');
  }
  
  // Nutritional needs by trimester
  let nutritionalNeeds: {
    calories: number;
    protein: number;
    folate: number;
    iron: number;
    calcium: number;
  };
  
  if (trimester === 1) {
    nutritionalNeeds = {
      calories: 0, // No additional calories needed
      protein: 71, // grams per day
      folate: 600, // mcg per day
      iron: 27, // mg per day
      calcium: 1000, // mg per day
    };
  } else if (trimester === 2) {
    nutritionalNeeds = {
      calories: 340, // Additional calories per day
      protein: 71,
      folate: 600,
      iron: 27,
      calcium: 1000,
    };
  } else {
    nutritionalNeeds = {
      calories: 450, // Additional calories per day
      protein: 71,
      folate: 600,
      iron: 27,
      calcium: 1000,
    };
  }
  
  return {
    gestationalAge: { weeks, days },
    trimester,
    dueDate,
    weightGainRecommendation,
    developmentalMilestones,
    nutritionalNeeds,
  };
}

/**
 * Analyze blood pressure readings
 */
export function analyzeBloodPressure(
  systolic: number,
  diastolic: number,
  age?: number,
  ethnicity?: string
): BloodPressureResult {
  let category: string;
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  const recommendations: string[] = [];
  const culturalConsiderations: string[] = [];
  
  // Determine blood pressure category
  if (systolic < 120 && diastolic < 80) {
    category = 'Normal';
    riskLevel = 'low';
    recommendations.push('Maintain healthy lifestyle', 'Regular exercise', 'Balanced diet');
  } else if (systolic < 130 && diastolic < 80) {
    category = 'Elevated';
    riskLevel = 'medium';
    recommendations.push('Lifestyle modifications', 'Reduce sodium intake', 'Increase physical activity');
  } else if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
    category = 'High Blood Pressure Stage 1';
    riskLevel = 'medium';
    recommendations.push('Consult healthcare provider', 'Lifestyle changes', 'Monitor regularly');
  } else if ((systolic >= 140 && systolic < 180) || (diastolic >= 90 && diastolic < 120)) {
    category = 'High Blood Pressure Stage 2';
    riskLevel = 'high';
    recommendations.push('Immediate medical attention', 'Medication may be needed', 'Strict lifestyle modifications');
  } else {
    category = 'Hypertensive Crisis';
    riskLevel = 'critical';
    recommendations.push('SEEK IMMEDIATE MEDICAL ATTENTION', 'Call emergency services', 'Do not wait');
  }
  
  // Add age-specific considerations
  if (age && age > 65) {
    recommendations.push('Regular monitoring important for older adults');
    recommendations.push('Consider medication interactions');
  }
  
  // Add cultural considerations
  if (ethnicity === 'african_american') {
    culturalConsiderations.push('African Americans have higher risk of hypertension');
    culturalConsiderations.push('Earlier and more aggressive treatment may be needed');
    culturalConsiderations.push('Traditional foods may be high in sodium - consider modifications');
  }
  
  if (ethnicity === 'hispanic' || ethnicity === 'latino') {
    culturalConsiderations.push('Hispanic populations may have increased diabetes risk with hypertension');
    culturalConsiderations.push('Consider traditional dietary patterns in management');
  }
  
  return {
    systolic,
    diastolic,
    category,
    riskLevel,
    recommendations,
    culturalConsiderations: culturalConsiderations.length > 0 ? culturalConsiderations : undefined,
  };
}

/**
 * Calculate target heart rate zones
 */
export function calculateHeartRate(
  age: number,
  restingHeartRate?: number
): HeartRateResult {
  const maxHeartRate = 220 - age;
  const heartRate = restingHeartRate || 70; // Default resting HR if not provided
  
  // Calculate target zones using Karvonen method if RHR provided
  let targetZones: {
    fatBurn: { min: number; max: number };
    cardio: { min: number; max: number };
    peak: { min: number; max: number };
  };
  
  if (restingHeartRate) {
    const heartRateReserve = maxHeartRate - restingHeartRate;
    targetZones = {
      fatBurn: {
        min: Math.round(restingHeartRate + heartRateReserve * 0.5),
        max: Math.round(restingHeartRate + heartRateReserve * 0.7),
      },
      cardio: {
        min: Math.round(restingHeartRate + heartRateReserve * 0.7),
        max: Math.round(restingHeartRate + heartRateReserve * 0.85),
      },
      peak: {
        min: Math.round(restingHeartRate + heartRateReserve * 0.85),
        max: Math.round(restingHeartRate + heartRateReserve * 1.0),
      },
    };
  } else {
    // Use percentage of max HR method
    targetZones = {
      fatBurn: {
        min: Math.round(maxHeartRate * 0.5),
        max: Math.round(maxHeartRate * 0.7),
      },
      cardio: {
        min: Math.round(maxHeartRate * 0.7),
        max: Math.round(maxHeartRate * 0.85),
      },
      peak: {
        min: Math.round(maxHeartRate * 0.85),
        max: Math.round(maxHeartRate * 1.0),
      },
    };
  }
  
  // Determine category based on resting heart rate
  let category: string;
  if (heartRate < 60) {
    category = 'Bradycardia (Low)';
  } else if (heartRate <= 100) {
    category = 'Normal';
  } else {
    category = 'Tachycardia (High)';
  }
  
  const recommendations = [
    'Monitor heart rate during exercise',
    'Stay within target zones for optimal benefits',
    'Consult healthcare provider if experiencing irregular heartbeat',
    'Regular cardiovascular exercise can improve heart health',
  ];
  
  return {
    heartRate,
    category,
    targetZones,
    recommendations,
  };
}

/**
 * Calculate daily hydration needs
 */
export function calculateHydration(
  weight: number, // in kg
  activityLevel: keyof typeof ACTIVITY_MULTIPLIERS,
  climate: 'temperate' | 'hot' | 'cold' = 'temperate',
  currentIntake: number = 0, // in liters
  culturalBackground?: string
): HydrationResult {
  // Base water needs: 35ml per kg of body weight
  let baseWaterNeeds = (weight * 35) / 1000; // Convert to liters
  
  // Adjust for activity level
  const activityMultiplier = {
    sedentary: 1.0,
    lightly_active: 1.1,
    moderately_active: 1.2,
    very_active: 1.4,
    extremely_active: 1.6,
  };
  
  baseWaterNeeds *= activityMultiplier[activityLevel];
  
  // Adjust for climate
  if (climate === 'hot') {
    baseWaterNeeds *= 1.2; // 20% increase in hot weather
  } else if (climate === 'cold') {
    baseWaterNeeds *= 0.95; // 5% decrease in cold weather
  }
  
  const dailyWaterNeeds = Math.round(baseWaterNeeds * 10) / 10;
  const percentage = Math.min(Math.round((currentIntake / dailyWaterNeeds) * 100), 100);
  
  // Determine hydration status
  let status: string;
  if (percentage < 50) {
    status = 'Severely Dehydrated';
  } else if (percentage < 75) {
    status = 'Mildly Dehydrated';
  } else if (percentage < 100) {
    status = 'Adequately Hydrated';
  } else {
    status = 'Well Hydrated';
  }
  
  const recommendations = [
    'Drink water regularly throughout the day',
    'Monitor urine color as hydration indicator',
    'Increase intake during exercise and hot weather',
    'Include water-rich foods in your diet',
  ];
  
  const culturalConsiderations: string[] = [];
  if (culturalBackground === 'middle_eastern' || culturalBackground === 'arab') {
    culturalConsiderations.push('Consider Ramadan fasting periods for hydration planning');
    culturalConsiderations.push('Traditional teas and beverages can contribute to hydration');
  }
  
  if (culturalBackground === 'asian') {
    culturalConsiderations.push('Green tea and herbal teas are excellent hydration sources');
    culturalConsiderations.push('Warm beverages are culturally preferred and equally hydrating');
  }
  
  return {
    dailyWaterNeeds,
    currentIntake,
    percentage,
    status,
    recommendations,
    culturalConsiderations: culturalConsiderations.length > 0 ? culturalConsiderations : undefined,
  };
}

/**
 * Analyze sleep quality and duration
 */
export function analyzeSleep(
  bedtime: Date,
  wakeTime: Date,
  age: number,
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'good',
  culturalBackground?: string
): SleepResult {
  // Calculate sleep duration
  const sleepDuration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
  
  // Calculate sleep efficiency (assuming 85% is good)
  const sleepEfficiency = sleepQuality === 'excellent' ? 95 : 
                         sleepQuality === 'good' ? 85 : 
                         sleepQuality === 'fair' ? 75 : 60;
  
  // Determine sleep category based on age and duration
  let category: string;
  let recommendedSleep: { min: number; max: number };
  
  if (age >= 18 && age <= 25) {
    recommendedSleep = { min: 7, max: 9 };
  } else if (age >= 26 && age <= 64) {
    recommendedSleep = { min: 7, max: 9 };
  } else if (age >= 65) {
    recommendedSleep = { min: 7, max: 8 };
  } else {
    recommendedSleep = { min: 8, max: 10 }; // Teens
  }
  
  if (sleepDuration < recommendedSleep.min) {
    category = 'Insufficient Sleep';
  } else if (sleepDuration > recommendedSleep.max) {
    category = 'Excessive Sleep';
  } else {
    category = 'Adequate Sleep';
  }
  
  const recommendations = [
    'Maintain consistent sleep schedule',
    'Create a relaxing bedtime routine',
    'Avoid screens 1 hour before bedtime',
    'Keep bedroom cool, dark, and quiet',
    'Limit caffeine intake after 2 PM',
  ];
  
  const culturalConsiderations: string[] = [];
  if (culturalBackground === 'mediterranean') {
    culturalConsiderations.push('Siesta culture: short afternoon naps can be beneficial');
    culturalConsiderations.push('Later dinner times may affect sleep schedule');
  }
  
  if (culturalBackground === 'asian') {
    culturalConsiderations.push('Traditional practices like meditation can improve sleep quality');
    culturalConsiderations.push('Consider cultural work schedules and family obligations');
  }
  
  return {
    sleepDuration: Math.round(sleepDuration * 10) / 10,
    sleepEfficiency,
    category,
    recommendations,
    culturalConsiderations: culturalConsiderations.length > 0 ? culturalConsiderations : undefined,
  };
}

/**
 * Utility function to convert units
 */
export const convertUnits = {
  // Weight conversions
  lbsToKg: (lbs: number) => lbs * 0.453592,
  kgToLbs: (kg: number) => kg * 2.20462,
  
  // Height conversions
  inchesToCm: (inches: number) => inches * 2.54,
  cmToInches: (cm: number) => cm / 2.54,
  feetAndInchesToCm: (feet: number, inches: number) => (feet * 12 + inches) * 2.54,
  
  // Temperature conversions
  fahrenheitToCelsius: (f: number) => (f - 32) * 5/9,
  celsiusToFahrenheit: (c: number) => (c * 9/5) + 32,
  
  // Volume conversions
  ozToMl: (oz: number) => oz * 29.5735,
  mlToOz: (ml: number) => ml / 29.5735,
  cupsToMl: (cups: number) => cups * 236.588,
  litersToOz: (liters: number) => liters * 33.814,
};

/**
 * Validate health input data
 */
export const validateHealthInputs = {
  weight: (weight: number, unit: 'kg' | 'lbs' = 'kg') => {
    const weightInKg = unit === 'lbs' ? convertUnits.lbsToKg(weight) : weight;
    return weightInKg > 0 && weightInKg < 1000;
  },
  
  height: (height: number, unit: 'cm' | 'inches' = 'cm') => {
    const heightInCm = unit === 'inches' ? convertUnits.inchesToCm(height) : height;
    return heightInCm > 0 && heightInCm < 300;
  },
  
  age: (age: number) => {
    return age > 0 && age < 150;
  },
  
  bloodPressure: (systolic: number, diastolic: number) => {
    return systolic > 0 && systolic < 300 && diastolic > 0 && diastolic < 200 && systolic > diastolic;
  },
  
  heartRate: (heartRate: number) => {
    return heartRate > 0 && heartRate < 300;
  },
};

export default {
  calculateBMI,
  calculateTDEE,
  calculateBodyFat,
  calculatePregnancy,
  analyzeBloodPressure,
  calculateHeartRate,
  calculateHydration,
  analyzeSleep,
  convertUnits,
  validateHealthInputs,
  ACTIVITY_MULTIPLIERS,
  BMI_CATEGORIES,
  ASIAN_BMI_CATEGORIES,
};