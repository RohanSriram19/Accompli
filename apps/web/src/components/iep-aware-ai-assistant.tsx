'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MessageSquare, Send, Minimize2, Maximize2, Bot, User, 
  Lightbulb, FileText, BarChart3, Target, X, Home, Brain,
  TrendingUp, AlertTriangle, CheckCircle, BookOpen, Users
} from 'lucide-react'
import { aiService, AIAssistantMessage, AIAssistantContext, StudentIEPData } from '@/lib/enhanced-ai-service'
import { useAuthStore } from '@/lib/auth-store'
import { cn } from '@/lib/utils'

interface IEPAwareAIAssistantProps {
  studentData?: StudentIEPData
  context?: Partial<AIAssistantContext>
  initialPrompt?: string
  className?: string
}

export function IEPAwareAIAssistant({ 
  studentData, 
  context, 
  initialPrompt, 
  className = '' 
}: IEPAwareAIAssistantProps) {
  const { user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<AIAssistantMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationType, setConversationType] = useState<AIAssistantContext['conversationType']>('general')
  const [showQuickActions, setShowQuickActions] = useState(true)
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

  const conversationTypes = [
    { value: 'general', label: 'General Support', icon: MessageSquare },
    { value: 'iep_goals', label: 'IEP Goals', icon: Target },
    { value: 'lesson_planning', label: 'Lesson Planning', icon: BookOpen },
    { value: 'behavior_analysis', label: 'Behavior Analysis', icon: Brain },
    { value: 'progress_review', label: 'Progress Review', icon: TrendingUp },
    { value: 'report_writing', label: 'Report Writing', icon: FileText },
    { value: 'parent_support', label: 'Parent Support', icon: Users }
  ]

  const quickActions = [
    {
      label: "Analyze Current Progress",
      prompt: "Analyze this student's current IEP goal progress and provide specific recommendations for improvement.",
      type: 'progress_review' as const,
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      label: "Suggest Goal Modifications",
      prompt: "Based on the current progress data, suggest specific modifications to underperforming IEP goals.",
      type: 'iep_goals' as const,
      icon: Target,
      color: 'bg-green-500'
    },
    {
      label: "Create Lesson Plan",
      prompt: "Create a lesson plan that targets the student's IEP goals and incorporates their accommodations.",
      type: 'lesson_planning' as const,
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      label: "Analyze Behavior Patterns",
      prompt: "Analyze the recent behavior events and suggest interventions based on the student's IEP.",
      type: 'behavior_analysis' as const,
      icon: Brain,
      color: 'bg-orange-500'
    },
    {
      label: "Generate Progress Report",
      prompt: "Generate a comprehensive progress report for this student's IEP goals.",
      type: 'report_writing' as const,
      icon: FileText,
      color: 'bg-indigo-500'
    }
  ]

  const getAIContext = (): AIAssistantContext => {
    return {
      userRole: (user?.role as any) || 'TEACHER',
      studentData,
      conversationType,
      ...context
    }
  }

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue.trim()
    if (!messageToSend || isLoading) return

    const newUserMessage: AIAssistantMessage = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputValue('')
    setIsLoading(true)
    setShowQuickActions(false)

    try {
      const aiContext = getAIContext()
      const response = await aiService.chat([...messages, newUserMessage], aiContext)
      
      const aiMessage: AIAssistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI Assistant Error:', error)
      const errorMessage: AIAssistantMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try your question again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setConversationType(action.type)
    handleSendMessage(action.prompt)
  }

  const clearConversation = () => {
    setMessages([])
    setShowQuickActions(true)
  }

  const getStudentContext = () => {
    if (!studentData) return null
    
    return (
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md mb-3">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-3 w-3" />
          <span className="font-medium">{studentData.name}</span>
          <Badge variant="outline" className="text-xs">
            Grade {studentData.grade}
          </Badge>
        </div>
        <div className="text-xs">
          {studentData.disability} • {studentData.iep.goals.length} Active Goals
        </div>
      </div>
    )
  }

  const getProgressInsights = () => {
    if (!studentData?.iep.goals.length) return null

    const totalGoals = studentData.iep.goals.length
    const onTrackGoals = studentData.iep.goals.filter(g => g.progress >= 70).length
    const concernGoals = studentData.iep.goals.filter(g => g.progress < 50).length

    return (
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="bg-green-50 p-2 rounded text-center">
          <div className="text-green-700 font-semibold">{onTrackGoals}</div>
          <div className="text-green-600">On Track</div>
        </div>
        <div className="bg-blue-50 p-2 rounded text-center">
          <div className="text-blue-700 font-semibold">{totalGoals}</div>
          <div className="text-blue-600">Total Goals</div>
        </div>
        <div className="bg-orange-50 p-2 rounded text-center">
          <div className="text-orange-700 font-semibold">{concernGoals}</div>
          <div className="text-orange-600">Need Focus</div>
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn("fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg", className)}
        size="icon"
      >
        <Brain className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 w-96 shadow-xl border-2 z-50 transition-all duration-200",
      isMinimized ? "h-14" : "h-[500px]",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          <CardTitle className="text-sm">
            {studentData ? `AI Assistant - ${studentData.name}` : 'AI Assistant'}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-3 flex flex-col h-[calc(500px-60px)]">
          {/* Student Context */}
          {getStudentContext()}
          
          {/* Progress Insights */}
          {getProgressInsights()}

          {/* Conversation Type Selector */}
          <div className="mb-3">
            <Select value={conversationType} onValueChange={(value) => setConversationType(value as any)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {conversationTypes.map(type => {
                  const IconComponent = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value} className="text-xs">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-3 w-3" />
                        {type.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-3 space-y-3">
            {messages.length === 0 && showQuickActions && studentData && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  I have access to {studentData.name}'s IEP data. How can I help?
                </p>
                <div className="grid gap-2">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="flex items-center gap-2 p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors text-left"
                      >
                        <div className={cn("p-1 rounded text-white", action.color)}>
                          <IconComponent className="h-3 w-3" />
                        </div>
                        <span>{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 text-xs",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-blue-600" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] p-2 rounded-lg whitespace-pre-wrap",
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 text-blue-600" />
                </div>
                <div className="bg-muted p-2 rounded-lg rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask about IEP goals, progress, or strategies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="text-xs"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              size="icon"
              className="h-8 w-8 flex-shrink-0"
            >
              <Send className="h-3 w-3" />
            </Button>
            {messages.length > 0 && (
              <Button
                onClick={clearConversation}
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <Home className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default IEPAwareAIAssistant
