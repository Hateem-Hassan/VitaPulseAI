'use client';

import toast from 'react-hot-toast';

// Types for different LLM providers
export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  isLocal: boolean;
  isAvailable: boolean;
  endpoint?: string;
  models: string[];
}

export interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Available open-source LLM providers
export const OPEN_SOURCE_PROVIDERS: LLMProvider[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run large language models locally with Ollama',
    isLocal: true,
    isAvailable: false,
    endpoint: 'http://localhost:11434',
    models: ['llama2', 'codellama', 'mistral', 'neural-chat', 'starcode']
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    description: 'Local LLM inference with LM Studio',
    isLocal: true,
    isAvailable: false,
    endpoint: 'http://localhost:1234',
    models: ['local-model']
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Transformers',
    description: 'Access open-source models via Hugging Face API',
    isLocal: false,
    isAvailable: false,
    endpoint: 'https://api-inference.huggingface.co',
    models: [
      'microsoft/DialoGPT-medium',
      'facebook/blenderbot-400M-distill',
      'microsoft/DialoGPT-large',
      'EleutherAI/gpt-neo-2.7B'
    ]
  },
  {
    id: 'local-api',
    name: 'Custom Local API',
    description: 'Connect to your custom local LLM API',
    isLocal: true,
    isAvailable: false,
    endpoint: 'http://localhost:8000',
    models: ['custom-model']
  }
];

class OpenSourceLLMService {
  private providers: Map<string, LLMProvider> = new Map();

  constructor() {
    OPEN_SOURCE_PROVIDERS.forEach(provider => {
      this.providers.set(provider.id, { ...provider });
    });
    this.checkProviderAvailability();
  }

  // Check which providers are available
  async checkProviderAvailability() {
    for (const [id, provider] of this.providers) {
      try {
        if (provider.isLocal && provider.endpoint) {
          // Check local endpoints
          const response = await fetch(`${provider.endpoint}/api/tags`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000) // 3 second timeout
          });
          
          if (response.ok) {
            provider.isAvailable = true;
            console.log(`✅ ${provider.name} is available`);
          }
        } else if (!provider.isLocal) {
          // For cloud providers, check if API key is available
          const apiKey = this.getApiKey(id);
          provider.isAvailable = !!apiKey;
        }
      } catch (error) {
        provider.isAvailable = false;
        console.log(`❌ ${provider.name} is not available:`, error);
      }
    }
  }

  // Get API key for cloud providers
  private getApiKey(providerId: string): string | null {
    switch (providerId) {
      case 'huggingface':
        return process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || 
               localStorage.getItem('huggingface-api-key') || null;
      default:
        return null;
    }
  }

  // Get available providers
  getAvailableProviders(): LLMProvider[] {
    return Array.from(this.providers.values()).filter(p => p.isAvailable);
  }

  // Get all providers (including unavailable ones)
  getAllProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  // Send request to Ollama
  private async sendOllamaRequest(request: LLMRequest): Promise<LLMResponse> {
    const provider = this.providers.get('ollama');
    if (!provider?.isAvailable) {
      throw new Error('Ollama is not available. Please install and run Ollama locally.');
    }

    const response = await fetch(`${provider.endpoint}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'llama2',
        prompt: request.prompt,
        stream: false,
        options: {
          temperature: request.temperature || 0.7,
          num_predict: request.maxTokens || 500
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.response,
      model: request.model || 'llama2',
      provider: 'ollama'
    };
  }

  // Send request to Hugging Face
  private async sendHuggingFaceRequest(request: LLMRequest): Promise<LLMResponse> {
    const provider = this.providers.get('huggingface');
    const apiKey = this.getApiKey('huggingface');
    
    if (!provider?.isAvailable || !apiKey) {
      throw new Error('Hugging Face API key is required. Please add your API key in settings.');
    }

    const model = request.model || 'microsoft/DialoGPT-medium';
    const response = await fetch(`${provider.endpoint}/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.prompt,
        parameters: {
          temperature: request.temperature || 0.7,
          max_new_tokens: request.maxTokens || 500
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '';
    
    return {
      content: content.replace(request.prompt, '').trim(), // Remove the original prompt
      model,
      provider: 'huggingface'
    };
  }

  // Send request to LM Studio
  private async sendLMStudioRequest(request: LLMRequest): Promise<LLMResponse> {
    const provider = this.providers.get('lm-studio');
    if (!provider?.isAvailable) {
      throw new Error('LM Studio is not available. Please start LM Studio server.');
    }

    const response = await fetch(`${provider.endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model || 'local-model',
        messages: [{ role: 'user', content: request.prompt }],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 500
      })
    });

    if (!response.ok) {
      throw new Error(`LM Studio request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      model: request.model || 'local-model',
      provider: 'lm-studio',
      usage: data.usage
    };
  }

  // Main method to send LLM request
  async sendRequest(providerId: string, request: LLMRequest): Promise<LLMResponse> {
    try {
      switch (providerId) {
        case 'ollama':
          return await this.sendOllamaRequest(request);
        case 'huggingface':
          return await this.sendHuggingFaceRequest(request);
        case 'lm-studio':
          return await this.sendLMStudioRequest(request);
        default:
          throw new Error(`Unsupported provider: ${providerId}`);
      }
    } catch (error) {
      console.error(`LLM request failed for ${providerId}:`, error);
      toast.error(`Failed to get response from ${providerId}: ${error}`);
      throw error;
    }
  }

  // Set API key for cloud providers
  setApiKey(providerId: string, apiKey: string) {
    switch (providerId) {
      case 'huggingface':
        localStorage.setItem('huggingface-api-key', apiKey);
        break;
    }
    this.checkProviderAvailability();
  }
}

// Export singleton instance
export const openSourceLLMService = new OpenSourceLLMService();

// React hook for using open-source LLMs
export function useOpenSourceLLM() {
  const sendRequest = async (providerId: string, request: LLMRequest): Promise<LLMResponse> => {
    return openSourceLLMService.sendRequest(providerId, request);
  };

  const getAvailableProviders = (): LLMProvider[] => {
    return openSourceLLMService.getAvailableProviders();
  };

  const getAllProviders = (): LLMProvider[] => {
    return openSourceLLMService.getAllProviders();
  };

  const setApiKey = (providerId: string, apiKey: string) => {
    openSourceLLMService.setApiKey(providerId, apiKey);
  };

  return {
    sendRequest,
    getAvailableProviders,
    getAllProviders,
    setApiKey
  };
}