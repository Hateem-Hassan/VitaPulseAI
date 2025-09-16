// AI Service Integration - OpenAI and Claude APIs with fallback strategies
// Cultural sensitivity engine for health advice
// Multi-language support with medical terminology

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface AIProvider {
  name: string;
  available: boolean;
  priority: number;
}

interface CulturalContext {
  culturalBackground?: string;
  language: string;
  dietaryRestrictions?: string[];
  religiousConsiderations?: string[];
  region?: string;
}

interface SymptomAnalysisRequest {
  symptoms: string[];
  duration: string;
  severity: number; // 1-10
  age: number;
  gender: string;
  medicalHistory?: string[];
  currentMedications?: string[];
  culturalContext: CulturalContext;
}

interface SymptomAnalysisResponse {
  riskLevel: 'low' | 'moderate' | 'high' | 'emergency';
  possibleConditions: {
    condition: string;
    probability: number;
    description: string;
    culturalNotes?: string;
  }[];
  recommendations: {
    immediate: string[];
    followUp: string[];
    lifestyle: string[];
    culturalConsiderations: string[];
  };
  whenToSeekCare: {
    immediate: string[];
    within24Hours: string[];
    withinWeek: string[];
  };
  disclaimer: string;
  culturalSensitivity: {
    dietaryConsiderations: string[];
    culturalPractices: string[];
    languageNotes: string[];
  };
}

interface MealPlanRequest {
  dietaryGoals: string[];
  restrictions: string[];
  culturalPreferences: string[];
  healthConditions?: string[];
  calorieTarget?: number;
  mealsPerDay: number;
  duration: number; // days
  culturalContext: CulturalContext;
}

interface MealPlanResponse {
  plan: {
    day: number;
    meals: {
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
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
      halalCertified?: boolean;
      kosherCertified?: boolean;
      preparationTime: number;
      difficulty: 'easy' | 'medium' | 'hard';
    }[];
  }[];
  nutritionSummary: {
    dailyAverages: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    weeklyGoals: {
      achieved: string[];
      needsImprovement: string[];
    };
  };
  culturalAdaptations: {
    substitutions: { original: string; replacement: string; reason: string }[];
    cookingMethods: string[];
    seasonalConsiderations: string[];
  };
  shoppingList: {
    category: string;
    items: { name: string; quantity: string; culturalSource?: string }[];
  }[];
}

interface HealthEducationRequest {
  topic: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  culturalContext: CulturalContext;
  specificQuestions?: string[];
}

interface HealthEducationResponse {
  content: {
    overview: string;
    keyPoints: string[];
    detailedExplanation: string;
    culturalConsiderations: string[];
    practicalTips: string[];
  };
  resources: {
    articles: { title: string; url: string; culturalRelevance?: string }[];
    videos: { title: string; url: string; language: string }[];
    localResources: { name: string; contact: string; type: string }[];
  };
  relatedTopics: string[];
  culturalAdaptations: {
    traditionalPractices: string[];
    modernIntegration: string[];
    respectfulApproach: string[];
  };
}

class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private providers: AIProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });
        this.providers.push({ name: 'openai', available: true, priority: 1 });
      } catch (error) {
        console.error('Failed to initialize OpenAI:', error);
        this.providers.push({ name: 'openai', available: false, priority: 1 });
      }
    }

    // Initialize Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
          dangerouslyAllowBrowser: true
        });
        this.providers.push({ name: 'anthropic', available: true, priority: 2 });
      } catch (error) {
        console.error('Failed to initialize Anthropic:', error);
        this.providers.push({ name: 'anthropic', available: false, priority: 2 });
      }
    }

    // Sort providers by priority
    this.providers.sort((a, b) => a.priority - b.priority);
  }

  private getAvailableProvider(): AIProvider | null {
    return this.providers.find(p => p.available) || null;
  }

  private buildCulturalPrompt(culturalContext: CulturalContext): string {
    let prompt = `\nCultural Context:\n`;
    
    if (culturalContext.culturalBackground) {
      prompt += `- Cultural Background: ${culturalContext.culturalBackground}\n`;
    }
    
    prompt += `- Language: ${culturalContext.language}\n`;
    
    if (culturalContext.dietaryRestrictions?.length) {
      prompt += `- Dietary Restrictions: ${culturalContext.dietaryRestrictions.join(', ')}\n`;
    }
    
    if (culturalContext.religiousConsiderations?.length) {
      prompt += `- Religious Considerations: ${culturalContext.religiousConsiderations.join(', ')}\n`;
    }
    
    if (culturalContext.region) {
      prompt += `- Region: ${culturalContext.region}\n`;
    }
    
    prompt += `\nPlease provide culturally sensitive advice that respects these considerations and adapts recommendations accordingly.\n`;
    
    return prompt;
  }

  private async callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not available');

    const messages: any[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0]?.message?.content || '';
  }

  private async callAnthropic(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.anthropic) throw new Error('Anthropic not available');

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: 'user', content: fullPrompt }]
    });

    return response.content[0]?.type === 'text' ? response.content[0].text : '';
  }

  private async callAI(prompt: string, systemPrompt?: string): Promise<string> {
    const provider = this.getAvailableProvider();
    
    if (!provider) {
      throw new Error('No AI providers available');
    }

    try {
      switch (provider.name) {
        case 'openai':
          return await this.callOpenAI(prompt, systemPrompt);
        case 'anthropic':
          return await this.callAnthropic(prompt, systemPrompt);
        default:
          throw new Error(`Unknown provider: ${provider.name}`);
      }
    } catch (error) {
      // Mark provider as unavailable and try next one
      provider.available = false;
      
      const nextProvider = this.getAvailableProvider();
      if (nextProvider) {
        console.warn(`Provider ${provider.name} failed, trying ${nextProvider.name}`);
        return await this.callAI(prompt, systemPrompt);
      }
      
      throw error;
    }
  }

  async analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    const systemPrompt = `You are a culturally-sensitive AI health assistant. Provide symptom analysis while being respectful of cultural backgrounds, dietary restrictions, and religious considerations. Always include appropriate disclaimers and emphasize the importance of professional medical consultation.

IMPORTANT: This is for educational purposes only and should not replace professional medical advice.`;

    const culturalPrompt = this.buildCulturalPrompt(request.culturalContext);

    const prompt = `Analyze the following symptoms and provide a structured response:

Symptoms: ${request.symptoms.join(', ')}
Duration: ${request.duration}
Severity (1-10): ${request.severity}
Age: ${request.age}
Gender: ${request.gender}
Medical History: ${request.medicalHistory?.join(', ') || 'None provided'}
Current Medications: ${request.currentMedications?.join(', ') || 'None provided'}

${culturalPrompt}

Please provide a JSON response with the following structure:
{
  "riskLevel": "low|moderate|high|emergency",
  "possibleConditions": [
    {
      "condition": "condition name",
      "probability": 0.0-1.0,
      "description": "brief description",
      "culturalNotes": "any cultural considerations"
    }
  ],
  "recommendations": {
    "immediate": ["immediate actions"],
    "followUp": ["follow-up recommendations"],
    "lifestyle": ["lifestyle modifications"],
    "culturalConsiderations": ["cultural adaptations"]
  },
  "whenToSeekCare": {
    "immediate": ["emergency situations"],
    "within24Hours": ["urgent situations"],
    "withinWeek": ["routine follow-up"]
  },
  "disclaimer": "medical disclaimer",
  "culturalSensitivity": {
    "dietaryConsiderations": ["dietary advice"],
    "culturalPractices": ["relevant practices"],
    "languageNotes": ["language-specific notes"]
  }
}`;

    try {
      const response = await this.callAI(prompt, systemPrompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      
      // Fallback response
      return {
        riskLevel: 'moderate',
        possibleConditions: [
          {
            condition: 'Unable to analyze',
            probability: 0,
            description: 'AI service temporarily unavailable'
          }
        ],
        recommendations: {
          immediate: ['Consult with a healthcare professional'],
          followUp: ['Schedule a medical appointment'],
          lifestyle: ['Monitor symptoms closely'],
          culturalConsiderations: ['Seek culturally appropriate care']
        },
        whenToSeekCare: {
          immediate: ['If symptoms worsen or new symptoms appear'],
          within24Hours: ['For persistent or concerning symptoms'],
          withinWeek: ['For routine evaluation']
        },
        disclaimer: 'This analysis is not available due to technical issues. Please consult a healthcare professional.',
        culturalSensitivity: {
          dietaryConsiderations: ['Follow your cultural dietary guidelines'],
          culturalPractices: ['Incorporate traditional healing practices as appropriate'],
          languageNotes: ['Seek care in your preferred language']
        }
      };
    }
  }

  async generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse> {
    const systemPrompt = `You are a culturally-aware nutritionist AI. Create meal plans that respect cultural dietary restrictions, religious requirements (especially Halal and Kosher), and regional food preferences. Ensure all recommendations are nutritionally balanced and culturally appropriate.`;

    const culturalPrompt = this.buildCulturalPrompt(request.culturalContext);

    const prompt = `Create a ${request.duration}-day meal plan with the following requirements:

Dietary Goals: ${request.dietaryGoals.join(', ')}
Restrictions: ${request.restrictions.join(', ')}
Cultural Preferences: ${request.culturalPreferences.join(', ')}
Health Conditions: ${request.healthConditions?.join(', ') || 'None'}
Calorie Target: ${request.calorieTarget || 'Not specified'}
Meals per Day: ${request.mealsPerDay}

${culturalPrompt}

Ensure all meals are:
- Culturally appropriate and respectful
- Nutritionally balanced
- Halal/Kosher certified if required
- Use traditional cooking methods when possible
- Include seasonal and regional ingredients

Provide a detailed JSON response with meal plans, nutrition information, cultural adaptations, and shopping lists.`;

    try {
      const response = await this.callAI(prompt, systemPrompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      
      // Fallback response
      return {
        plan: [
          {
            day: 1,
            meals: [
              {
                type: 'breakfast',
                name: 'Culturally Appropriate Breakfast',
                ingredients: ['Please consult a nutritionist'],
                instructions: ['AI service temporarily unavailable'],
                nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
                preparationTime: 0,
                difficulty: 'easy'
              }
            ]
          }
        ],
        nutritionSummary: {
          dailyAverages: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          weeklyGoals: { achieved: [], needsImprovement: ['Consult a nutritionist'] }
        },
        culturalAdaptations: {
          substitutions: [],
          cookingMethods: ['Traditional methods recommended'],
          seasonalConsiderations: ['Use seasonal ingredients']
        },
        shoppingList: [
          {
            category: 'Notice',
            items: [{ name: 'AI service unavailable', quantity: 'Please consult a nutritionist' }]
          }
        ]
      };
    }
  }

  async getHealthEducation(request: HealthEducationRequest): Promise<HealthEducationResponse> {
    const systemPrompt = `You are a culturally-sensitive health educator. Provide accurate, evidence-based health information while respecting cultural backgrounds, traditional practices, and language preferences. Always acknowledge traditional healing practices where appropriate and explain how they can complement modern medicine.`;

    const culturalPrompt = this.buildCulturalPrompt(request.culturalContext);

    const prompt = `Provide comprehensive health education on: ${request.topic}

User Level: ${request.userLevel}
Specific Questions: ${request.specificQuestions?.join(', ') || 'None'}

${culturalPrompt}

Please provide:
1. Clear, culturally-appropriate explanation
2. Respect for traditional practices
3. Integration with modern medicine
4. Practical, culturally-relevant tips
5. Local resources when possible
6. Multi-language considerations

Structure the response as detailed JSON with educational content, resources, and cultural adaptations.`;

    try {
      const response = await this.callAI(prompt, systemPrompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error getting health education:', error);
      
      // Fallback response
      return {
        content: {
          overview: 'Health education content temporarily unavailable.',
          keyPoints: ['Consult healthcare professionals', 'Seek culturally appropriate care'],
          detailedExplanation: 'AI service is currently unavailable. Please consult with healthcare professionals or educational resources.',
          culturalConsiderations: ['Respect traditional practices', 'Seek culturally competent care'],
          practicalTips: ['Consult local healthcare providers', 'Use trusted health resources']
        },
        resources: {
          articles: [],
          videos: [],
          localResources: []
        },
        relatedTopics: [],
        culturalAdaptations: {
          traditionalPractices: ['Honor traditional healing methods'],
          modernIntegration: ['Combine with evidence-based medicine'],
          respectfulApproach: ['Seek culturally competent healthcare']
        }
      };
    }
  }

  async getCulturalHealthAdvice(topic: string, culturalContext: CulturalContext): Promise<string> {
    const systemPrompt = `You are a culturally-competent health advisor. Provide health advice that is sensitive to cultural backgrounds, religious practices, and traditional healing methods. Always be respectful and inclusive.`;

    const culturalPrompt = this.buildCulturalPrompt(culturalContext);

    const prompt = `Provide culturally-sensitive health advice on: ${topic}

${culturalPrompt}

Please ensure the advice:
- Respects cultural and religious practices
- Acknowledges traditional healing methods
- Provides practical, culturally-appropriate recommendations
- Is sensitive to language and communication preferences
- Includes relevant cultural considerations`;

    try {
      return await this.callAI(prompt, systemPrompt);
    } catch (error) {
      console.error('Error getting cultural health advice:', error);
      return 'Cultural health advice is temporarily unavailable. Please consult with culturally-competent healthcare providers who understand your background and can provide appropriate guidance.';
    }
  }

  async translateHealthContent(content: string, targetLanguage: string): Promise<string> {
    const systemPrompt = `You are a medical translator specializing in culturally-appropriate health content translation. Maintain medical accuracy while ensuring cultural sensitivity and appropriate terminology.`;

    const prompt = `Translate the following health content to ${targetLanguage}, ensuring:
- Medical accuracy
- Cultural appropriateness
- Proper medical terminology
- Respectful tone

Content to translate:
${content}`;

    try {
      return await this.callAI(prompt, systemPrompt);
    } catch (error) {
      console.error('Error translating health content:', error);
      return content; // Return original content if translation fails
    }
  }

  getProviderStatus(): { available: AIProvider[], unavailable: AIProvider[] } {
    return {
      available: this.providers.filter(p => p.available),
      unavailable: this.providers.filter(p => !p.available)
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const testPrompt = 'Respond with "OK" if you can process this message.';
      const response = await this.callAI(testPrompt);
      return response.toLowerCase().includes('ok');
    } catch (error) {
      console.error('AI service connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export types
export type {
  SymptomAnalysisRequest,
  SymptomAnalysisResponse,
  MealPlanRequest,
  MealPlanResponse,
  HealthEducationRequest,
  HealthEducationResponse,
  CulturalContext
};

// Export utility functions
export const createCulturalContext = (
  language: string = 'en',
  culturalBackground?: string,
  dietaryRestrictions?: string[],
  religiousConsiderations?: string[],
  region?: string
): CulturalContext => {
  return {
    language,
    culturalBackground,
    dietaryRestrictions,
    religiousConsiderations,
    region
  };
};

export const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'ar': 'العربية',
    'ja': '日本語',
    'zh': '中文',
    'hi': 'हिन्दी'
  };
  
  return languages[code] || code;
};

export const isRTLLanguage = (language: string): boolean => {
  return ['ar', 'he', 'fa', 'ur'].includes(language);
};

export const getCulturalDietaryGuidelines = (culturalBackground: string): string[] => {
  const guidelines: Record<string, string[]> = {
    'middle_eastern': [
      'Halal dietary requirements',
      'Traditional spices and herbs',
      'Seasonal eating patterns',
      'Family-style meals'
    ],
    'south_asian': [
      'Vegetarian options',
      'Spice tolerance considerations',
      'Traditional cooking methods',
      'Religious dietary restrictions'
    ],
    'east_asian': [
      'Balance of flavors',
      'Seasonal ingredients',
      'Traditional medicine integration',
      'Tea culture considerations'
    ],
    'mediterranean': [
      'Fresh, seasonal ingredients',
      'Olive oil usage',
      'Traditional cooking methods',
      'Social eating customs'
    ]
  };
  
  return guidelines[culturalBackground.toLowerCase()] || [
    'Respect cultural food preferences',
    'Consider traditional cooking methods',
    'Honor dietary restrictions',
    'Maintain cultural food practices'
  ];
};