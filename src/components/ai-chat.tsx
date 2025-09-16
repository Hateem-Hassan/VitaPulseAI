'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Settings, Zap, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useOpenSourceLLM } from '@/services/open-source-llm'
import { ProFeatureGuard } from '@/components/pro-feature-guard'
import { LLMSettings } from '@/components/llm-settings'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  provider?: string
}

interface AIChatProps {
  title?: string
  placeholder?: string
  systemPrompt?: string
  requiresPro?: boolean
}

export function AIChat({ 
  title = 'AI Health Assistant', 
  placeholder = 'Ask me anything about your health...',
  systemPrompt = 'You are a helpful health and wellness assistant.',
  requiresPro = true 
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic' | 'ollama' | 'lmstudio' | 'huggingface'>('openai')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()
  const { 
    sendMessage: sendOpenSourceMessage, 
    availableProviders, 
    checkAvailability 
  } = useOpenSourceLLM()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check availability of open-source providers on mount
    checkAvailability()
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response: string
      let provider: string

      // Use open-source providers if available and selected
      if (['ollama', 'lmstudio', 'huggingface'].includes(selectedProvider)) {
        const result = await sendOpenSourceMessage(
          input.trim(),
          selectedProvider as 'ollama' | 'lmstudio' | 'huggingface',
          systemPrompt
        )
        response = result.content
        provider = selectedProvider
      } else {
        // Use traditional cloud providers (OpenAI, Anthropic)
        response = await sendCloudMessage(input.trim(), selectedProvider, systemPrompt)
        provider = selectedProvider
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        provider
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const sendCloudMessage = async (message: string, provider: 'openai' | 'anthropic', systemPrompt: string): Promise<string> => {
    // This would integrate with your existing cloud LLM services
    // For now, return a placeholder response
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `This is a simulated response from ${provider}. In a real implementation, this would call the ${provider} API with your message: "${message}"`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getProviderBadgeColor = (provider?: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-500'
      case 'anthropic': return 'bg-orange-500'
      case 'ollama': return 'bg-blue-500'
      case 'lmstudio': return 'bg-purple-500'
      case 'huggingface': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const chatContent = (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {requiresPro && (
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Pro Feature
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {showSettings && (
        <div className="px-6 pb-4">
          <LLMSettings />
        </div>
      )}

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Start a conversation with your AI assistant!</p>
              <p className="text-sm mt-2">Choose from cloud providers or local open-source models.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.provider && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className={`w-2 h-2 rounded-full ${getProviderBadgeColor(message.provider)}`}></div>
                        <span className="text-xs opacity-70 capitalize">{message.provider}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-6">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Provider Selection */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-600">Provider:</span>
            <div className="flex gap-1">
              {(['openai', 'anthropic', 'ollama', 'lmstudio', 'huggingface'] as const).map((provider) => {
                const isAvailable = ['openai', 'anthropic'].includes(provider) || 
                  availableProviders.some(p => p.name === provider && p.available)
                
                return (
                  <Button
                    key={provider}
                    variant={selectedProvider === provider ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedProvider(provider)}
                    disabled={!isAvailable}
                    className="text-xs capitalize"
                  >
                    {provider}
                    {!isAvailable && <Download className="w-3 h-3 ml-1" />}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (requiresPro && !isAuthenticated) {
    return (
      <ProFeatureGuard featureName="AI Chat Assistant">
        {chatContent}
      </ProFeatureGuard>
    )
  }

  return chatContent
}