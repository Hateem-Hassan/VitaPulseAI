// Cost-optimized AI integration for VitaPulse
// Using the most cost-effective models while maintaining accuracy

import { AIRequest, AIResponse, AIMessage } from '@/types';

// Cost-effective AI provider configurations
const AI_PROVIDERS = {
  // Most cost-effective options
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: {
      chat: 'deepseek-chat', // $0.14/1M input, $0.28/1M output
      coder: 'deepseek-coder', // $0.14/1M input, $0.28/1M output
    },
    maxTokens: 4000,
    temperature: 0.7,
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: {
      gpt4: 'gpt-4-turbo-preview', // $10/1M input, $30/1M output
      gpt35: 'gpt-3.5-turbo', // $0.5/1M input, $1.5/1M output
      gpt4o: 'gpt-4o-mini', // $0.15/1M input, $0.6/1M output (most cost-effective)
    },
    maxTokens: 4000,
    temperature: 0.7,
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    models: {
      claude3: 'claude-3-sonnet-20240229', // $3/1M input, $15/1M output
      claude3haiku: 'claude-3-haiku-20240307', // $0.25/1M input, $1.25/1M output
    },
    maxTokens: 4000,
    temperature: 0.7,
  },
};

// Cost-optimized AI service
export class CostOptimizedAiService {
  private static instance: CostOptimizedAiService;
  private currentProvider: keyof typeof AI_PROVIDERS = 'deepseek';
  private fallbackProvider: keyof typeof AI_PROVIDERS = 'openai';

  private constructor() {}

  static getInstance(): CostOptimizedAiService {
    if (!CostOptimizedAiService.instance) {
      CostOptimizedAiService.instance = new CostOptimizedAiService();
    }
    return CostOptimizedAiService.instance;
  }

  // Select the most cost-effective model for the task
  private selectModel(taskType: 'meal_planning' | 'health_advice' | 'recipe_generation' | 'food_analysis' | 'general'): string {
    switch (taskType) {
      case 'meal_planning':
      case 'recipe_generation':
        // Use DeepSeek for complex meal planning (most cost-effective)
        if (this.currentProvider === 'deepseek') {
          return AI_PROVIDERS.deepseek.models.chat;
        } else if (this.currentProvider === 'openai') {
          return AI_PROVIDERS.openai.models.gpt4o;
        } else {
          return AI_PROVIDERS.anthropic.models.claude3haiku;
        }
      
      case 'health_advice':
        // Use GPT-4o-mini for health advice (good balance of cost and accuracy)
        return AI_PROVIDERS.openai.models.gpt4o;
      
      case 'food_analysis':
        // Use Claude Haiku for food analysis (fast and accurate)
        return AI_PROVIDERS.anthropic.models.claude3haiku;
      
      default:
        if (this.currentProvider === 'deepseek') {
          return AI_PROVIDERS.deepseek.models.chat;
        } else if (this.currentProvider === 'openai') {
          return AI_PROVIDERS.openai.models.gpt4o;
        } else {
          return AI_PROVIDERS.anthropic.models.claude3haiku;
        }
    }
  }

  // Generate response with cost optimization
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const model = this.selectModel(request.context?.taskType || 'general');
      const provider = this.currentProvider;
      
      const response = await this.callProvider(provider, model, request);
      return response;
    } catch (error) {
      console.error('Primary AI provider failed, trying fallback:', error);
      
      // Try fallback provider
      try {
        const fallbackModel = this.selectModel(request.context?.taskType || 'general');
        const response = await this.callProvider(this.fallbackProvider, fallbackModel, request);
        return response;
      } catch (fallbackError) {
        console.error('Fallback AI provider also failed:', fallbackError);
        throw new Error('All AI providers are currently unavailable');
      }
    }
  }

  // Call specific provider
  private async callProvider(provider: keyof typeof AI_PROVIDERS, model: string, request: AIRequest): Promise<AIResponse> {
    const config = AI_PROVIDERS[provider];
    const apiKey = this.getApiKey(provider);
    
    if (!apiKey) {
      throw new Error(`API key not found for ${provider}`);
    }

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: request.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: request.temperature || config.temperature,
        max_tokens: request.maxTokens || config.maxTokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`${provider} API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      model: data.model,
      provider: provider,
      timestamp: new Date().toISOString(),
    };
  }

  // Get API key for provider
  private getApiKey(provider: keyof typeof AI_PROVIDERS): string | null {
    switch (provider) {
      case 'deepseek':
        return process.env.DEEPSEEK_API_KEY || null;
      case 'openai':
        return process.env.OPENAI_API_KEY || null;
      case 'anthropic':
        return process.env.ANTHROPIC_API_KEY || null;
      default:
        return null;
    }
  }

  // Set provider
  setProvider(provider: keyof typeof AI_PROVIDERS): void {
    this.currentProvider = provider;
  }

  // Get current provider
  getCurrentProvider(): string {
    return this.currentProvider;
  }

  // Cost estimation
  estimateCost(tokens: number, provider: keyof typeof AI_PROVIDERS = this.currentProvider): number {
    const config = AI_PROVIDERS[provider];
    // This is a simplified cost estimation
    // In production, you'd want more accurate pricing
    const inputTokens = Math.floor(tokens * 0.7);
    const outputTokens = Math.floor(tokens * 0.3);
    
    let cost = 0;
    switch (provider) {
      case 'deepseek':
        cost = (inputTokens * 0.14 + outputTokens * 0.28) / 1000000;
        break;
      case 'openai':
        cost = (inputTokens * 0.5 + outputTokens * 1.5) / 1000000;
        break;
      case 'anthropic':
        cost = (inputTokens * 3 + outputTokens * 15) / 1000000;
        break;
    }
    
    return cost;
  }

  // Meal planning with cost optimization
  async generateMealPlan(userProfile: any): Promise<any> {
    const prompt = this.buildMealPlanPrompt(userProfile);
    
    const request: AIRequest = {
      provider: this.currentProvider,
      model: this.selectModel('meal_planning'),
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'You are a professional nutritionist and chef. Create detailed, practical meal plans with accurate nutritional information.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
      ],
      context: { taskType: 'meal_planning' },
      temperature: 0.7,
      maxTokens: 3000,
    };

    const response = await this.generateResponse(request);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error parsing meal plan response:', error);
      throw new Error('Failed to parse meal plan response');
    }
  }

  // Health advice with cost optimization
  async generateHealthAdvice(query: string, userContext: any): Promise<string> {
    const prompt = this.buildHealthAdvicePrompt(query, userContext);
    
    const request: AIRequest = {
      provider: this.currentProvider,
      model: this.selectModel('health_advice'),
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'You are a professional health coach and nutritionist. Provide evidence-based, practical advice while always recommending professional medical consultation for serious health concerns.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
      ],
      context: { taskType: 'health_advice' },
      temperature: 0.7,
      maxTokens: 1500,
    };

    const response = await this.generateResponse(request);
    return response.content;
  }

  // Recipe generation with cost optimization
  async generateRecipe(ingredients: string[], dietaryRestrictions: string[], cuisine: string): Promise<any> {
    const prompt = this.buildRecipePrompt(ingredients, dietaryRestrictions, cuisine);
    
    const request: AIRequest = {
      provider: this.currentProvider,
      model: this.selectModel('recipe_generation'),
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'You are a professional chef and nutritionist. Create delicious, practical recipes with accurate nutritional information.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
      ],
      context: { taskType: 'recipe_generation' },
      temperature: 0.8,
      maxTokens: 2000,
    };

    const response = await this.generateResponse(request);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error parsing recipe response:', error);
      throw new Error('Failed to parse recipe response');
    }
  }

  // Food analysis with cost optimization
  async analyzeFood(foodName: string, quantity: number, unit: string): Promise<any> {
    const prompt = this.buildFoodAnalysisPrompt(foodName, quantity, unit);
    
    const request: AIRequest = {
      provider: this.currentProvider,
      model: this.selectModel('food_analysis'),
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'You are a professional nutritionist. Provide accurate nutritional analysis and evidence-based health recommendations.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
      ],
      context: { taskType: 'food_analysis' },
      temperature: 0.7,
      maxTokens: 1000,
    };

    const response = await this.generateResponse(request);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error parsing food analysis response:', error);
      throw new Error('Failed to parse food analysis response');
    }
  }

  // Prompt builders
  private buildMealPlanPrompt(userProfile: any): string {
    return `Create a personalized 7-day meal plan for:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activityLevel}
- Health Goals: ${userProfile.healthGoals?.join(', ') || 'General wellness'}
- Dietary Restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None'}
- Preferred Cuisines: ${userProfile.preferredCuisines?.join(', ') || 'Any'}
- Daily Calorie Target: ${userProfile.calorieTarget} calories

Provide detailed meal plans with:
1. Breakfast, lunch, dinner, and 2 snacks per day
2. Complete nutritional breakdown for each meal
3. Preparation instructions
4. Shopping list
5. Meal prep tips

Format as JSON with the structure:
{
  "mealPlan": {
    "days": [
      {
        "day": 1,
        "meals": [
          {
            "type": "breakfast",
            "name": "Meal Name",
            "ingredients": ["ingredient1", "ingredient2"],
            "instructions": ["step1", "step2"],
            "nutrition": {
              "calories": 400,
              "protein": 20,
              "carbs": 45,
              "fat": 15,
              "fiber": 5,
              "sugar": 10,
              "sodium": 600
            },
            "prepTime": 15,
            "cookTime": 20,
            "servings": 1
          }
        ]
      }
    ],
    "shoppingList": ["item1", "item2"],
    "mealPrepTips": ["tip1", "tip2"]
  }
}`;
  }

  private buildHealthAdvicePrompt(query: string, userContext: any): string {
    return `Provide health advice for: "${query}"

User Context:
- Age: ${userContext.age}
- Gender: ${userContext.gender}
- Weight: ${userContext.weight}kg
- Height: ${userContext.height}cm
- Health Goals: ${userContext.healthGoals?.join(', ') || 'General wellness'}
- Medical Conditions: ${userContext.medicalConditions?.join(', ') || 'None reported'}

Please provide:
1. Practical, actionable advice
2. Evidence-based recommendations
3. Safety considerations
4. When to consult a healthcare provider
5. Additional resources or next steps

Remember to always recommend consulting with healthcare providers for medical concerns.`;
  }

  private buildRecipePrompt(ingredients: string[], dietaryRestrictions: string[], cuisine: string): string {
    return `Create a ${cuisine} recipe using these ingredients: ${ingredients.join(', ')}

Dietary Restrictions: ${dietaryRestrictions.join(', ')}

Provide a complete recipe in JSON format:
{
  "name": "Recipe Name",
  "description": "Brief description",
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "1 cup",
      "notes": "optional notes"
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "nutrition": {
    "calories": 400,
    "protein": 20,
    "carbs": 45,
    "fat": 15,
    "fiber": 5,
    "sugar": 10,
    "sodium": 600
  },
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "difficulty": "easy|medium|hard",
  "tags": ["tag1", "tag2"]
}`;
  }

  private buildFoodAnalysisPrompt(foodName: string, quantity: number, unit: string): string {
    return `Analyze the nutritional value and health impact of ${quantity} ${unit} of ${foodName}.

Provide:
1. Detailed nutritional breakdown
2. Health benefits
3. Potential health concerns
4. Suggestions for healthier alternatives or preparation methods

Format as JSON:
{
  "nutrition": {
    "calories": 100,
    "protein": 5,
    "carbs": 20,
    "fat": 2,
    "fiber": 3,
    "sugar": 8,
    "sodium": 200,
    "vitamins": ["vitamin C", "folate"],
    "minerals": ["iron", "potassium"]
  },
  "healthBenefits": ["benefit1", "benefit2"],
  "concerns": ["concern1", "concern2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;
  }
}

// Export singleton instance
export const costOptimizedAiService = CostOptimizedAiService.getInstance();