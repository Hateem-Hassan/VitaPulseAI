import { AIRequest, AIResponse, AIMessage } from '@/types';

// AI Provider configurations
const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: {
      gpt4: 'gpt-4-turbo-preview',
      gpt35: 'gpt-3.5-turbo',
      gpt4o: 'gpt-4o-mini',
    },
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    models: {
      claude3: 'claude-3-sonnet-20240229',
      claude3haiku: 'claude-3-haiku-20240307',
    },
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: {
      chat: 'deepseek-chat',
      coder: 'deepseek-coder',
    },
  },
};

// AI Provider interface
interface AIProviderInterface {
  name: string;
  generateResponse: (request: AIRequest) => Promise<AIResponse>;
}

// OpenAI Provider
class OpenAIProvider implements AIProviderInterface {
  name = 'OpenAI';

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(`${AI_PROVIDERS.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const choice = data.choices[0];
      if (!choice || !choice.message) {
        throw new Error('No response from OpenAI');
      }

      return {
        id: data.id,
        content: choice.message.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: request.model,
        provider: 'openai',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Anthropic Provider
class AnthropicProvider implements AIProviderInterface {
  name = 'Anthropic';

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(`${AI_PROVIDERS.anthropic.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: request.model,
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7,
          messages: request.messages.map(msg => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0];
      if (!content || content.type !== 'text') {
        throw new Error('No text response from Anthropic');
      }

      return {
        id: data.id,
        content: content.text,
        usage: {
          promptTokens: data.usage?.input_tokens || 0,
          completionTokens: data.usage?.output_tokens || 0,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        },
        model: request.model,
        provider: 'anthropic',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// DeepSeek Provider
class DeepSeekProvider implements AIProviderInterface {
  name = 'DeepSeek';

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(`${AI_PROVIDERS.deepseek.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const choice = data.choices[0];
      if (!choice || !choice.message) {
        throw new Error('No response from DeepSeek');
      }

      return {
        id: data.id,
        content: choice.message.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: request.model,
        provider: 'deepseek',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error(`DeepSeek API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Provider registry
const providers: Record<string, AIProviderInterface> = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  deepseek: new DeepSeekProvider(),
};

// Main AI service
export class AIService {
  private static instance: AIService;
  private currentProvider: string = 'openai';

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setProvider(provider: 'openai' | 'anthropic' | 'deepseek'): void {
    this.currentProvider = provider;
  }

  getProvider(): string {
    return this.currentProvider;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const provider = providers[request.provider];
    if (!provider) {
      throw new Error(`Unsupported AI provider: ${request.provider}`);
    }

    return await provider.generateResponse(request);
  }

  // Meal planning specific methods
  async generateMealPlan(
    userProfile: {
      age: number;
      gender: 'male' | 'female';
      weight: number;
      height: number;
      activityLevel: string;
      healthGoals: string[];
      dietaryRestrictions: string[];
      preferredCuisines: string[];
      calorieTarget: number;
    }
  ): Promise<any> {
    const prompt = `Create a personalized 7-day meal plan for:
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activityLevel}
- Health Goals: ${userProfile.healthGoals.join(', ')}
- Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}
- Preferred Cuisines: ${userProfile.preferredCuisines.join(', ')}
- Daily Calorie Target: ${userProfile.calorieTarget} calories

Provide a detailed meal plan with nutritional information in JSON format.`;

    const request: AIRequest = {
      provider: this.currentProvider,
      model: AI_PROVIDERS.openai.models.gpt4o,
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'You are a professional nutritionist. Create detailed meal plans with accurate nutritional information.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
      ],
      temperature: 0.7,
      maxTokens: 3000,
    };

    const response = await this.generateResponse(request);
    return response.content;
  }

  // Health advice generation
  async generateHealthAdvice(query: string, userContext: any): Promise<string> {
    const prompt = `Provide health advice for: "${query}"

User Context:
- Age: ${userContext.age}
- Gender: ${userContext.gender}
- Weight: ${userContext.weight}kg
- Height: ${userContext.height}cm
- Health Goals: ${userContext.healthGoals?.join(', ') || 'General wellness'}

Provide practical, evidence-based advice.`;

    const request: AIRequest = {
      provider: this.currentProvider,
      model: AI_PROVIDERS.openai.models.gpt4o,
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'You are a professional health coach. Provide evidence-based advice and always recommend consulting healthcare providers for medical concerns.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
      ],
      temperature: 0.7,
      maxTokens: 1500,
    };

    const response = await this.generateResponse(request);
    return response.content;
  }

  // Recipe generation
  async generateRecipe(
    ingredients: string[],
    dietaryRestrictions: string[],
    cuisine: string
  ): Promise<any> {
    const prompt = `Create a ${cuisine} recipe using these ingredients: ${ingredients.join(', ')}

Dietary Restrictions: ${dietaryRestrictions.join(', ')}

Provide a complete recipe with ingredients, instructions, and nutritional information in JSON format.`;

    const request: AIRequest = {
      provider: this.currentProvider,
      model: AI_PROVIDERS.openai.models.gpt4o,
      messages: [
        {
          id: '1',
          role: 'system',
          content: 'You are a professional chef. Create detailed recipes with accurate nutritional information.',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString(),
        },
      ],
      temperature: 0.8,
      maxTokens: 2000,
    };

    const response = await this.generateResponse(request);
    return response.content;
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

// Export for backward compatibility
export default aiService;
