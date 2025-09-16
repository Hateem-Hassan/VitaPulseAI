'use client';

import { useState, useEffect } from 'react';
import { Settings, Check, X, ExternalLink, Key, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOpenSourceLLM, LLMProvider } from '@/services/open-source-llm';
import toast from 'react-hot-toast';

interface LLMSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LLMSettings({ isOpen, onClose }: LLMSettingsProps) {
  const { getAllProviders, setApiKey } = useOpenSourceLLM();
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const allProviders = getAllProviders();
      setProviders(allProviders);
      
      // Load existing API keys
      const keys: Record<string, string> = {};
      allProviders.forEach(provider => {
        if (!provider.isLocal) {
          const key = localStorage.getItem(`${provider.id}-api-key`) || '';
          keys[provider.id] = key;
        }
      });
      setApiKeys(keys);
    }
  }, [isOpen, getAllProviders]);

  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [providerId]: value }));
  };

  const handleSaveApiKey = async (providerId: string) => {
    const apiKey = apiKeys[providerId];
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    setLoading(prev => ({ ...prev, [providerId]: true }));
    
    try {
      setApiKey(providerId, apiKey);
      toast.success(`API key saved for ${providers.find(p => p.id === providerId)?.name}`);
    } catch (error) {
      toast.error('Failed to save API key');
    } finally {
      setLoading(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const getInstallationInstructions = (provider: LLMProvider) => {
    switch (provider.id) {
      case 'ollama':
        return {
          title: 'Install Ollama',
          steps: [
            'Download Ollama from https://ollama.ai',
            'Install and run: ollama serve',
            'Pull a model: ollama pull llama2'
          ],
          link: 'https://ollama.ai'
        };
      case 'lm-studio':
        return {
          title: 'Install LM Studio',
          steps: [
            'Download LM Studio from https://lmstudio.ai',
            'Install and open LM Studio',
            'Start the local server on port 1234'
          ],
          link: 'https://lmstudio.ai'
        };
      case 'huggingface':
        return {
          title: 'Get Hugging Face API Key',
          steps: [
            'Sign up at https://huggingface.co',
            'Go to Settings > Access Tokens',
            'Create a new token with read permissions'
          ],
          link: 'https://huggingface.co/settings/tokens'
        };
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Open Source LLM Settings
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Configure your open-source LLM providers. Local providers run on your machine for privacy,
            while cloud providers require API keys.
          </p>

          <div className="grid gap-6">
            {providers.map(provider => {
              const instructions = getInstallationInstructions(provider);
              
              return (
                <Card key={provider.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {provider.isLocal ? (
                            <Server className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Key className="w-5 h-5 text-green-600" />
                          )}
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                        </div>
                        <Badge 
                          variant={provider.isAvailable ? "default" : "secondary"}
                          className={provider.isAvailable ? "bg-green-100 text-green-800" : ""}
                        >
                          {provider.isAvailable ? (
                            <><Check className="w-3 h-3 mr-1" /> Available</>
                          ) : (
                            <><X className="w-3 h-3 mr-1" /> Not Available</>
                          )}
                        </Badge>
                      </div>
                      
                      {instructions && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(instructions.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Setup Guide
                        </Button>
                      )}
                    </div>
                    <CardDescription>{provider.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Available Models */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Available Models
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {provider.models.map(model => (
                          <Badge key={model} variant="outline" className="text-xs">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* API Key Input for Cloud Providers */}
                    {!provider.isLocal && (
                      <div className="space-y-2">
                        <Label htmlFor={`${provider.id}-api-key`} className="text-sm font-medium">
                          API Key
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`${provider.id}-api-key`}
                            type="password"
                            placeholder="Enter your API key"
                            value={apiKeys[provider.id] || ''}
                            onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleSaveApiKey(provider.id)}
                            disabled={loading[provider.id] || !apiKeys[provider.id]?.trim()}
                            size="sm"
                          >
                            {loading[provider.id] ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Installation Instructions */}
                    {instructions && !provider.isAvailable && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {instructions.title}
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {instructions.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Connection Status */}
                    {provider.isLocal && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Endpoint:</strong> {provider.endpoint}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Pro Tip
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Local providers (Ollama, LM Studio) run entirely on your machine for maximum privacy.
              They don't require internet connection once set up, but may need more powerful hardware.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}