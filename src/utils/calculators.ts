// Health calculator utility functions

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (heightCm === 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

export const calculateBodyFat = (
  waistCm: number,
  neckCm: number,
  heightCm: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    return 495 / (1.29579 - 0.35004 * Math.log10(waistCm + 0.221 * Math.log10(heightCm)) - 0.221 * Math.log10(heightCm)) - 450;
  }
};

export const calculateCalories = (
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
  goal: 'maintain' | 'lose' | 'gain'
): number => {
  // BMR calculation using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * activityMultipliers[activityLevel];

  // Goal adjustments
  const goalMultipliers = {
    maintain: 1,
    lose: 0.8, // 20% deficit
    gain: 1.2, // 20% surplus
  };

  return Math.round(tdee * goalMultipliers[goal]);
};

export const calculateWHR = (waistCm: number, hipCm: number, gender: 'male' | 'female'): number => {
  if (hipCm === 0) return 0;
  return waistCm / hipCm;
};

export const calculateWaterIntake = (
  weightKg: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  // Base water intake: 35ml per kg of body weight
  let baseIntake = weightKg * 35;

  // Activity level adjustments
  const activityMultipliers = {
    sedentary: 1,
    light: 1.2,
    moderate: 1.4,
    active: 1.6,
    very_active: 1.8,
  };

  return Math.round(baseIntake * activityMultipliers[activityLevel] / 250); // Convert to glasses (250ml each)
};

export const calculateIdealWeight = (heightCm: number, gender: 'male' | 'female'): { min: number; max: number } => {
  const heightM = heightCm / 100;
  const bmiMin = 18.5;
  const bmiMax = 24.9;

  return {
    min: Math.round(bmiMin * heightM * heightM),
    max: Math.round(bmiMax * heightM * heightM),
  };
};

export const calculateMetabolicAge = (
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female',
  bodyFatPercent: number
): number => {
  // Simplified metabolic age calculation
  const bmr = calculateBMR(weightKg, heightCm, ageYears, gender);
  const expectedBMR = calculateBMR(weightKg, heightCm, ageYears, gender);
  
  // Adjust based on body fat percentage
  const bodyFatAdjustment = bodyFatPercent > 20 ? 1.1 : 0.9;
  
  return Math.round(ageYears * bodyFatAdjustment);
};

export const calculateBMR = (
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }
};

export const calculateBodyWater = (
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return 2.447 - 0.09156 * ageYears + 0.1074 * heightCm + 0.3362 * weightKg;
  } else {
    return -2.097 + 0.1069 * heightCm + 0.2466 * weightKg;
  }
};

export const calculateLeanBodyMass = (
  weightKg: number,
  bodyFatPercent: number
): number => {
  return weightKg * (1 - bodyFatPercent / 100);
};

export const calculateFatMass = (
  weightKg: number,
  bodyFatPercent: number
): number => {
  return weightKg * (bodyFatPercent / 100);
};

export const calculateMuscleMass = (
  weightKg: number,
  heightCm: number,
  gender: 'male' | 'female'
): number => {
  // Simplified muscle mass calculation
  const bmi = calculateBMI(weightKg, heightCm);
  const leanBodyMass = weightKg * 0.85; // Rough estimate
  
  if (gender === 'male') {
    return leanBodyMass * 0.45; // 45% of lean body mass is muscle
  } else {
    return leanBodyMass * 0.35; // 35% of lean body mass is muscle
  }
};

export const calculateProteinNeeds = (
  weightKg: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  const proteinPerKg = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.4,
    very_active: 1.6,
  };

  return Math.round(weightKg * proteinPerKg[activityLevel]);
};

export const calculateCarbNeeds = (
  weightKg: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  const carbPerKg = {
    sedentary: 3,
    light: 4,
    moderate: 5,
    active: 6,
    very_active: 7,
  };

  return Math.round(weightKg * carbPerKg[activityLevel]);
};

export const calculateFatNeeds = (
  weightKg: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  const fatPerKg = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.4,
    very_active: 1.6,
  };

  return Math.round(weightKg * fatPerKg[activityLevel]);
};

export const calculateHeartRateZones = (ageYears: number): {
  resting: number;
  max: number;
  fatBurn: { min: number; max: number };
  cardio: { min: number; max: number };
  peak: { min: number; max: number };
} => {
  const maxHeartRate = 220 - ageYears;
  const restingHeartRate = 60; // Average resting heart rate

  return {
    resting: restingHeartRate,
    max: maxHeartRate,
    fatBurn: {
      min: Math.round(maxHeartRate * 0.5),
      max: Math.round(maxHeartRate * 0.6),
    },
    cardio: {
      min: Math.round(maxHeartRate * 0.6),
      max: Math.round(maxHeartRate * 0.8),
    },
    peak: {
      min: Math.round(maxHeartRate * 0.8),
      max: maxHeartRate,
    },
  };
};

export const calculateSleepScore = (
  hoursSlept: number,
  sleepEfficiency: number,
  bedtimeConsistency: number
): number => {
  // Sleep score out of 100
  const hoursScore = Math.min(100, (hoursSlept / 8) * 100);
  const efficiencyScore = sleepEfficiency;
  const consistencyScore = bedtimeConsistency;

  return Math.round((hoursScore + efficiencyScore + consistencyScore) / 3);
};

export const calculateStressScore = (
  heartRateVariability: number,
  sleepQuality: number,
  moodScore: number,
  energyLevel: number
): number => {
  // Stress score out of 10 (lower is better)
  const hrvScore = Math.max(0, 10 - (heartRateVariability / 10));
  const sleepScore = 10 - sleepQuality;
  const moodScoreAdjusted = 10 - moodScore;
  const energyScore = 10 - energyLevel;

  return Math.round((hrvScore + sleepScore + moodScoreAdjusted + energyScore) / 4);
};

export const calculateRecoveryScore = (
  sleepHours: number,
  sleepQuality: number,
  stressLevel: number,
  activityLevel: number
): number => {
  // Recovery score out of 100
  const sleepScore = Math.min(100, (sleepHours / 8) * 100);
  const qualityScore = sleepQuality * 10;
  const stressScore = Math.max(0, 100 - (stressLevel * 10));
  const activityScore = Math.min(100, activityLevel * 20);

  return Math.round((sleepScore + qualityScore + stressScore + activityScore) / 4);
};