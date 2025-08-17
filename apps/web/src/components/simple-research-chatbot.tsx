'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Book, Sparkles, Send, Minimize2, Maximize2 } from 'lucide-react'
import aiService from '@/lib/enhanced-ai-service'
import { researchKnowledgeService } from '@/lib/research-knowledge-service'
import type { AIAssistantMessage } from '@/lib/enhanced-ai-service'

interface SimpleChatbotProps {
  studentData?: any
}

export function SimpleResearchChatbot({ studentData }: SimpleChatbotProps) {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      role: 'assistant',
      content: `👋 Hi! I'm your **research-informed AI assistant** for special education. 

🔬 **I'm enhanced with evidence-based research from:**
• What Works Clearinghouse
• Cochrane Reviews  
• National Center on Intensive Intervention
• Council for Exceptional Children
• And more peer-reviewed sources

${studentData ? `I can provide research-backed recommendations specifically for ${studentData.name} with ${studentData.disability}.` : 'Ask me about evidence-based interventions, IEP strategies, or implementation guidance!'}

**Try asking me:**
"What interventions work best for autism?"
"How do I implement self-monitoring strategies?"
"What does research say about reading interventions?"`,
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: AIAssistantMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Add research context to the conversation
      const researchContext = studentData 
        ? researchKnowledgeService.buildResearchContext(studentData)
        : ''

      const response = await aiService.chat(
        [...messages, userMessage],
        {
          userRole: 'TEACHER',
          studentData: studentData,
          conversationType: 'general',
          currentTask: `research_informed_consultation${researchContext ? '\n\n' + researchContext : ''}`
        }
      )

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "What evidence-based interventions work for ADHD?",
    "How effective is peer tutoring according to research?", 
    "Show me implementation steps for self-monitoring",
    "What does research say about visual supports?",
    "Find interventions with strong research evidence"
  ]

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <div className="flex flex-col items-center">
            <MessageCircle className="h-5 w-5" />
            <Book className="h-3 w-3 -mt-1" />
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="shadow-xl border-blue-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5" />
                <Book className="h-4 w-4 -ml-1" />
              </div>
              <CardTitle className="text-lg">Research AI Assistant</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20 p-1"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Sparkles className="h-4 w-4" />
            <span>Enhanced with peer-reviewed research</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-4 text-blue-900'
                    : 'bg-gray-100 mr-4 text-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-xs">
                    {message.role === 'user' ? 'You' : '🔬 Research AI'}
                  </span>
                  <span className="text-xs opacity-60">{message.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="bg-gray-100 mr-4 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  <span>🔍 Consulting research database...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="text-xs text-gray-500 mb-2">Quick research questions:</div>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.slice(0, 2).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => setInput(question)}
                >
                  {question.split(' ').slice(0, 3).join(' ')}...
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about research-backed interventions..."
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
                className="text-sm"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
