import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// AI Service Configuration
interface AIConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  defaultProvider: 'openai' | 'anthropic';
  fallbackProvider: 'openai' | 'anthropic';
}

const aiConfig: AIConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  defaultProvider: 'openai',
  fallbackProvider: 'anthropic',
};

// Initialize AI clients
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

if (aiConfig.openaiApiKey) {
  openaiClient = new OpenAI({
    apiKey: aiConfig.openaiApiKey,
  });
}

if (aiConfig.anthropicApiKey) {
  anthropicClient = new Anthropic({
    apiKey: aiConfig.anthropicApiKey,
  });
}

// Types
export interface SymptomAnalysisRequest {
  symptoms: string[];
  severity: { [symptom: string]: number }; // 1-10 scale
  duration: string;
  additionalInfo?: string;
  userProfile?: {
    age?: number;
    gender?: string;
    medicalHistory?: string[];
    culturalBackground?: string;
    preferredLanguage?: string;
  };
}

export interface SymptomAnalysisResponse {
  analysis: string;
  possibleConditions: Array<{
    condition: string;
    likelihood: number;
    description: string;
  }>;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  culturalConsiderations?: string[];
  disclaimer: string;
}

export interface MealPlanRequest {
  dietaryRestrictions: string[];
  culturalPreferences: string[];
  healthGoals: string[];
  calorieTarget?: number;
  mealsPerDay: number;
  durationDays: number;
  userProfile?: {
    age?: number;
    gender?: string;
    activityLevel?: string;
    medicalConditions?: string[];
    allergies?: string[];
    preferredLanguage?: string;
  };
}

export interface MealPlanResponse {
  plan: {
    [day: string]: {
      [meal: string]: {
        name: string;
        ingredients: string[];
        instructions: string[];
        nutrition: {
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          fiber: number;
        };
        culturalNotes?: string;
        halalCompliant?: boolean;
      };
    };
  };
  totalNutrition: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFat: number;
    dailyFiber: number;
  };
  culturalConsiderations: string[];
  tips: string[];
}

// Symptom Analysis Service
export class SymptomAnalysisService {
  private static async analyzeWithOpenAI(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    if (!openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const culturalContext = request.userProfile?.culturalBackground 
      ? `Cultural background: ${request.userProfile.culturalBackground}. `
      : '';
    
    const languageContext = request.userProfile?.preferredLanguage 
      ? `Preferred language: ${request.userProfile.preferredLanguage}. `
      : '';

    const prompt = `You are a medical AI assistant providing symptom analysis. ${culturalContext}${languageContext}

Patient Information:
- Age: ${request.userProfile?.age || 'Not specified'}
- Gender: ${request.userProfile?.gender || 'Not specified'}
- Medical History: ${request.userProfile?.medicalHistory?.join(', ') || 'None specified'}

Symptoms:
${request.symptoms.map((symptom, index) => 
  `- ${symptom} (Severity: ${request.severity[symptom] || 'Not specified'}/10)`
).join('\n')}

Duration: ${request.duration}
Additional Information: ${request.additionalInfo || 'None'}

Please provide:
1. A comprehensive analysis of the symptoms
2. Possible conditions with likelihood percentages
3. Recommendations for next steps
4. Urgency level (low/medium/high/emergency)
5. Cultural considerations if applicable

IMPORTANT: Always include a medical disclaimer. Be culturally sensitive and consider dietary, religious, and cultural factors in recommendations.

Respond in JSON format with the following structure:
{
  "analysis": "detailed analysis",
  "possibleConditions": [
    {
      "condition": "condition name",
      "likelihood": percentage,
      "description": "brief description"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "urgencyLevel": "low|medium|high|emergency",
  "culturalConsiderations": ["consideration1", "consideration2"],
  "disclaimer": "medical disclaimer"
}`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a medical AI assistant. Always provide accurate, helpful, and culturally sensitive health information. Include appropriate medical disclaimers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse OpenAI response');
    }
  }

  private static async analyzeWithAnthropic(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    if (!anthropicClient) {
      throw new Error('Anthropic client not initialized');
    }

    const culturalContext = request.userProfile?.culturalBackground 
      ? `Cultural background: ${request.userProfile.culturalBackground}. `
      : '';
    
    const languageContext = request.userProfile?.preferredLanguage 
      ? `Preferred language: ${request.userProfile.preferredLanguage}. `
      : '';

    const prompt = `You are a medical AI assistant providing symptom analysis. ${culturalContext}${languageContext}

Patient Information:
- Age: ${request.userProfile?.age || 'Not specified'}
- Gender: ${request.userProfile?.gender || 'Not specified'}
- Medical History: ${request.userProfile?.medicalHistory?.join(', ') || 'None specified'}

Symptoms:
${request.symptoms.map((symptom, index) => 
  `- ${symptom} (Severity: ${request.severity[symptom] || 'Not specified'}/10)`
).join('\n')}

Duration: ${request.duration}
Additional Information: ${request.additionalInfo || 'None'}

Please provide a comprehensive symptom analysis in JSON format with analysis, possible conditions, recommendations, urgency level, and cultural considerations. Always include a medical disclaimer.`;

    const response = await anthropicClient.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    try {
      return JSON.parse(content.text);
    } catch (error) {
      throw new Error('Failed to parse Anthropic response');
    }
  }

  static async analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    try {
      // Try default provider first
      if (aiConfig.defaultProvider === 'openai' && openaiClient) {
        return await this.analyzeWithOpenAI(request);
      } else if (aiConfig.defaultProvider === 'anthropic' && anthropicClient) {
        return await this.analyzeWithAnthropic(request);
      }
    } catch (error) {
      console.error(`Error with ${aiConfig.defaultProvider}:`, error);
      
      // Try fallback provider
      try {
        if (aiConfig.fallbackProvider === 'openai' && openaiClient) {
          return await this.analyzeWithOpenAI(request);
        } else if (aiConfig.fallbackProvider === 'anthropic' && anthropicClient) {
          return await this.analyzeWithAnthropic(request);
        }
      } catch (fallbackError) {
        console.error(`Error with fallback ${aiConfig.fallbackProvider}:`, fallbackError);
      }
    }

    // Return mock response if all AI services fail
    return {
      analysis: 'AI services are currently unavailable. Please consult with a healthcare professional for proper medical advice.',
      possibleConditions: [
        {
          condition: 'Unable to analyze',
          likelihood: 0,
          description: 'AI analysis unavailable'
        }
      ],
      recommendations: [
        'Consult with a healthcare professional',
        'Monitor symptoms and seek medical attention if they worsen',
        'Keep a symptom diary for your doctor'
      ],
      urgencyLevel: 'medium',
      culturalConsiderations: [],
      disclaimer: 'This service is currently unavailable. Please consult with a qualified healthcare professional for medical advice.'
    };
  }
}

// Meal Planning Service
export class MealPlanningService {
  private static async generateWithOpenAI(request: MealPlanRequest): Promise<MealPlanResponse> {
    if (!openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const culturalContext = request.userProfile?.preferredLanguage 
      ? `Preferred language: ${request.userProfile.preferredLanguage}. `
      : '';

    const halalRequirement = request.culturalPreferences.some(pref => 
      pref.toLowerCase().includes('halal') || pref.toLowerCase().includes('islamic')
    ) ? 'IMPORTANT: All meals must be Halal-compliant. ' : '';

    const prompt = `You are a nutrition AI assistant creating personalized meal plans. ${culturalContext}${halalRequirement}

User Profile:
- Age: ${request.userProfile?.age || 'Not specified'}
- Gender: ${request.userProfile?.gender || 'Not specified'}
- Activity Level: ${request.userProfile?.activityLevel || 'Not specified'}
- Medical Conditions: ${request.userProfile?.medicalConditions?.join(', ') || 'None'}
- Allergies: ${request.userProfile?.allergies?.join(', ') || 'None'}

Requirements:
- Dietary Restrictions: ${request.dietaryRestrictions.join(', ')}
- Cultural Preferences: ${request.culturalPreferences.join(', ')}
- Health Goals: ${request.healthGoals.join(', ')}
- Calorie Target: ${request.calorieTarget || 'Not specified'}
- Meals per Day: ${request.mealsPerDay}
- Duration: ${request.durationDays} days

Create a comprehensive meal plan that:
1. Respects all dietary restrictions and cultural preferences
2. Meets nutritional requirements
3. Includes diverse, flavorful meals
4. Provides cooking instructions
5. Considers cultural food traditions
6. Ensures Halal compliance if required

Respond in JSON format with detailed meal plans, nutrition information, and cultural considerations.`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a nutrition AI assistant. Create culturally sensitive, nutritionally balanced meal plans that respect dietary restrictions and cultural preferences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse OpenAI response');
    }
  }

  private static async generateWithAnthropic(request: MealPlanRequest): Promise<MealPlanResponse> {
    if (!anthropicClient) {
      throw new Error('Anthropic client not initialized');
    }

    const culturalContext = request.userProfile?.preferredLanguage 
      ? `Preferred language: ${request.userProfile.preferredLanguage}. `
      : '';

    const halalRequirement = request.culturalPreferences.some(pref => 
      pref.toLowerCase().includes('halal') || pref.toLowerCase().includes('islamic')
    ) ? 'IMPORTANT: All meals must be Halal-compliant. ' : '';

    const prompt = `Create a personalized meal plan. ${culturalContext}${halalRequirement}

User requirements: ${request.durationDays} days, ${request.mealsPerDay} meals per day, ${request.calorieTarget || 'flexible'} calories.
Dietary restrictions: ${request.dietaryRestrictions.join(', ')}
Cultural preferences: ${request.culturalPreferences.join(', ')}
Health goals: ${request.healthGoals.join(', ')}

Provide a comprehensive meal plan in JSON format with recipes, nutrition data, and cultural considerations.`;

    const response = await anthropicClient.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 3000,
      temperature: 0.4,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    try {
      return JSON.parse(content.text);
    } catch (error) {
      throw new Error('Failed to parse Anthropic response');
    }
  }

  static async generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse> {
    try {
      // Try default provider first
      if (aiConfig.defaultProvider === 'openai' && openaiClient) {
        return await this.generateWithOpenAI(request);
      } else if (aiConfig.defaultProvider === 'anthropic' && anthropicClient) {
        return await this.generateWithAnthropic(request);
      }
    } catch (error) {
      console.error(`Error with ${aiConfig.defaultProvider}:`, error);
      
      // Try fallback provider
      try {
        if (aiConfig.fallbackProvider === 'openai' && openaiClient) {
          return await this.generateWithOpenAI(request);
        } else if (aiConfig.fallbackProvider === 'anthropic' && anthropicClient) {
          return await this.generateWithAnthropic(request);
        }
      } catch (fallbackError) {
        console.error(`Error with fallback ${aiConfig.fallbackProvider}:`, fallbackError);
      }
    }

    // Return mock response if all AI services fail
    const mockMeals: any = {};
    for (let day = 1; day <= request.durationDays; day++) {
      mockMeals[`Day ${day}`] = {
        breakfast: {
          name: 'Healthy Breakfast Option',
          ingredients: ['Oats', 'Fruits', 'Nuts'],
          instructions: ['Mix ingredients', 'Serve fresh'],
          nutrition: { calories: 300, protein: 10, carbs: 45, fat: 8, fiber: 6 },
          halalCompliant: true
        },
        lunch: {
          name: 'Nutritious Lunch',
          ingredients: ['Vegetables', 'Protein source', 'Whole grains'],
          instructions: ['Prepare ingredients', 'Cook and serve'],
          nutrition: { calories: 450, protein: 25, carbs: 50, fat: 12, fiber: 8 },
          halalCompliant: true
        },
        dinner: {
          name: 'Balanced Dinner',
          ingredients: ['Lean protein', 'Vegetables', 'Complex carbs'],
          instructions: ['Cook protein', 'Steam vegetables', 'Serve together'],
          nutrition: { calories: 500, protein: 30, carbs: 40, fat: 15, fiber: 10 },
          halalCompliant: true
        }
      };
    }

    return {
      plan: mockMeals,
      totalNutrition: {
        dailyCalories: 1250,
        dailyProtein: 65,
        dailyCarbs: 135,
        dailyFat: 35,
        dailyFiber: 24
      },
      culturalConsiderations: [
        'AI services are currently unavailable',
        'Please consult with a nutritionist for personalized meal planning'
      ],
      tips: [
        'Stay hydrated throughout the day',
        'Include a variety of colorful vegetables',
        'Choose whole grains over refined options'
      ]
    };
  }
}

// Health Education Content Service
export class HealthEducationService {
  static async generateHealthContent(topic: string, culturalContext?: string, language?: string): Promise<{
    title: string;
    content: string;
    keyPoints: string[];
    culturalConsiderations?: string[];
  }> {
    // This would integrate with AI services to generate educational content
    // For now, return a mock response
    return {
      title: `Understanding ${topic}`,
      content: `Comprehensive information about ${topic} will be available when AI services are configured.`,
      keyPoints: [
        'Consult healthcare professionals for accurate information',
        'Consider cultural and personal factors in health decisions',
        'Stay informed with reliable medical sources'
      ],
      culturalConsiderations: culturalContext ? [
        `Content adapted for ${culturalContext} cultural context`
      ] : undefined
    };
  }
}

// Utility functions
export const isAIServiceAvailable = (): boolean => {
  return !!(openaiClient || anthropicClient);
};

export const getAvailableAIServices = (): string[] => {
  const services: string[] = [];
  if (openaiClient) services.push('OpenAI');
  if (anthropicClient) services.push('Anthropic');
  return services;
};

export const validateAIConfiguration = (): {
  isValid: boolean;
  missingServices: string[];
  availableServices: string[];
} => {
  const missingServices: string[] = [];
  const availableServices: string[] = [];

  if (!aiConfig.openaiApiKey) {
    missingServices.push('OpenAI');
  } else {
    availableServices.push('OpenAI');
  }

  if (!aiConfig.anthropicApiKey) {
    missingServices.push('Anthropic');
  } else {
    availableServices.push('Anthropic');
  }

  return {
    isValid: availableServices.length > 0,
    missingServices,
    availableServices
  };
};

export { aiConfig };