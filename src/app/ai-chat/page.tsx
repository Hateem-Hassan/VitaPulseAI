'use client'

import { AIChat } from '@/components/ai-chat'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Zap, Shield, Globe } from 'lucide-react'

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Health Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get personalized health insights powered by advanced AI. Choose from cloud providers or run models locally.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced AI models analyze your health data and provide personalized recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Use local open-source models to keep your health data completely private and secure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Multiple Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Choose from OpenAI, Anthropic, or run Ollama, LM Studio, and Hugging Face models locally.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Provider Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Available AI Providers
            </CardTitle>
            <CardDescription>
              VitaPulse supports both cloud-based and local AI models for maximum flexibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Cloud Providers</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>OpenAI (GPT-4, GPT-3.5)</span>
                    <Badge variant="outline">Pro</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>Anthropic (Claude)</span>
                    <Badge variant="outline">Pro</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Local/Open Source</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>Ollama (Local Models)</span>
                    <Badge className="bg-green-500">Free</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>LM Studio</span>
                    <Badge className="bg-green-500">Free</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>Hugging Face</span>
                    <Badge className="bg-green-500">Free</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Component */}
        <AIChat 
          title="Health & Wellness Assistant"
          placeholder="Ask about nutrition, exercise, symptoms, or general health advice..."
          systemPrompt="You are a knowledgeable health and wellness assistant. Provide helpful, evidence-based information about health, nutrition, exercise, and wellness. Always remind users to consult healthcare professionals for serious medical concerns."
          requiresPro={true}
        />
      </div>
    </div>
  )
}