'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, Send, Minimize2, Maximize2, Bot, User, 
  Lightbulb, FileText, BarChart3, Target, X 
} from 'lucide-react'
import { aiService, AIAssistantMessage, AIAssistantContext } from '@/lib/ai-service'
import { useAuthStore } from '@/lib/auth-store'

interface AIAssistantProps {
  context?: Partial<AIAssistantContext>
  initialPrompt?: string
  className?: string
}

export function AIAssistant({ context, initialPrompt, className = '' }: AIAssistantProps) {
  const { user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<AIAssistantMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationType, setConversationType] = useState<AIAssistantContext['conversationType']>('general')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialPrompt && isOpen && messages.length === 0) {
      handleSendMessage(initialPrompt)
    }
  }, [isOpen, initialPrompt])

  const aiContext: AIAssistantContext = {
    userRole: user?.role || 'TEACHER',
    conversationType,
    ...context
  }

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue.trim()
    if (!messageToSend || isLoading) return

    const userMessage: AIAssistantMessage = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await aiService.chat([...messages, userMessage], aiContext)
      
      const assistantMessage: AIAssistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Assistant Error:', error)
      const errorMessage: AIAssistantMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { 
      type: 'iep_goals' as const, 
      label: 'IEP Goals', 
      icon: Target,
      prompt: 'Help me create SMART IEP goals for my student.'
    },
    { 
      type: 'lesson_planning' as const, 
      label: 'Lesson Plans', 
      icon: FileText,
      prompt: 'I need help creating an IEP-aligned lesson plan.'
    },
    { 
      type: 'behavior_analysis' as const, 
      label: 'Behavior Analysis', 
      icon: BarChart3,
      prompt: 'Help me analyze behavior data and suggest interventions.'
    },
    { 
      type: 'report_writing' as const, 
      label: 'Report Writing', 
      icon: Lightbulb,
      prompt: 'I need assistance writing progress reports or IEP documentation.'
    }
  ]

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setConversationType(action.type)
    handleSendMessage(action.prompt)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700 ${className}`}
        size="sm"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    )
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 ${className}`}>
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-600" />
                <span>AI Assistant</span>
                <Badge variant="outline" className="text-xs">
                  {conversationType.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="h-6 w-6 p-0"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 ${className}`}>
      <Card className="w-96 h-[600px] shadow-lg flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Bot className="h-4 w-4 text-blue-600" />
              <span>AI Assistant</span>
              <Badge variant="outline" className="text-xs">
                {conversationType.replace('_', ' ')}
              </Badge>
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-600">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="h-auto p-2 flex flex-col items-center space-y-1 text-xs"
                    >
                      <Icon className="h-3 w-3" />
                      <span>{action.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-3 space-y-3">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-500 mt-8">
                <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p>Hi! I'm your AI assistant for special education.</p>
                <p className="mt-1">How can I help you today?</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about special education..."
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
