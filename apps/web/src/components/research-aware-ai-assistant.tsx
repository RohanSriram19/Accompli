// Research-Aware AI Assistant Component
// Integrates publicly available special education research into AI recommendations

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Book, TrendingUp, Users, Lightbulb, ExternalLink, Search } from 'lucide-react'
import aiService from '@/lib/enhanced-ai-service'
import { AIAssistantMessage } from '@/lib/enhanced-ai-service'
import { researchKnowledgeService, ResearchEvidence, InterventionGuide } from '@/lib/research-knowledge-service'

interface ResearchAwareAIAssistantProps {
  studentData?: any
  className?: string
}

export function ResearchAwareAIAssistant({ studentData, className = '' }: ResearchAwareAIAssistantProps) {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [recommendedInterventions, setRecommendedInterventions] = useState<ResearchEvidence[]>([])
  const [researchDashboard, setResearchDashboard] = useState<any>(null)

  useEffect(() => {
    // Load research dashboard and get interventions for this student
    const dashboard = researchKnowledgeService.getResearchDashboard();
    setResearchDashboard(dashboard);

    if (studentData?.disability) {
      const interventions = researchKnowledgeService.getInterventionsForCondition(studentData.disability);
      setRecommendedInterventions(interventions.slice(0, 5)); // Top 5 interventions
    }

    // Initial greeting with research context
    setMessages([{
      role: 'assistant' as const,
      content: `Hello! I'm your research-informed AI assistant. I have access to evidence-based practices from sources like What Works Clearinghouse, Cochrane Reviews, and other peer-reviewed research.

${studentData ? `For ${studentData.name}, I can recommend interventions with proven effectiveness for ${studentData.disability}. I see ${recommendedInterventions.length} evidence-based interventions that might be helpful.` : 'Please share what you\'d like help with, and I\'ll provide research-backed recommendations.'}

Ask me about:
• Evidence-based interventions for specific conditions
• Implementation guides for research-proven strategies  
• Progress monitoring approaches from the literature
• Adapting interventions based on research findings`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, [studentData]);

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await aiService.chat(
        [...messages, userMessage],
        {
          userRole: 'TEACHER',
          studentData: studentData,
          conversationType: 'general',
          currentTask: 'research_consultation'
        }
      )

      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: response,
        timestamp: new Date().toLocaleTimeString()
      }])
    } catch (error) {
      console.error('Error generating response:', error)
      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterventionSelect = (interventionName: string) => {
    setSelectedIntervention(interventionName);
    const summary = researchKnowledgeService.getInterventionResearchSummary(interventionName);
    const guide = researchKnowledgeService.getImplementationGuide(interventionName);
    
    let message = summary;
    if (guide) {
      message += `\n\nImplementation Steps:\n${guide.implementationSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
    }
    
    setMessages(prev => [...prev, {
      role: 'assistant' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }

  const quickResearchQuestions = [
    "What interventions have the strongest research evidence for this student?",
    "How should I implement and monitor this intervention?",
    "What does the research say about progress expectations?",
    "Are there any contraindications or concerns in the literature?",
    "What adaptations have been studied for this population?"
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Research Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Research Evidence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {researchDashboard && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {researchDashboard.strongEvidence?.length || 0}
                </div>
                <div className="text-sm text-green-700">Strong Evidence Interventions</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {researchDashboard.topInterventions?.length || 0}
                </div>
                <div className="text-sm text-blue-700">High-Effectiveness (80%+)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {researchDashboard.implementationGuides?.length || 0}
                </div>
                <div className="text-sm text-purple-700">Implementation Guides</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Interventions for Student */}
      {recommendedInterventions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evidence-Based Interventions for {studentData?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendedInterventions.map((intervention, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleInterventionSelect(intervention.intervention)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold">{intervention.intervention}</div>
                      <div className="text-sm text-gray-600 mt-1">{intervention.summary}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={intervention.evidenceLevel === 'strong' ? 'default' : 'secondary'}>
                          {intervention.evidenceLevel} evidence
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(intervention.effectiveness * 100)}% effective
                        </Badge>
                        <span className="text-xs text-gray-500">{intervention.source}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Research Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quick Research Consultations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickResearchQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3 whitespace-normal"
                onClick={() => setInput(question)}
              >
                <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Research-Informed AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-50 ml-8' 
                    : 'bg-gray-50 mr-8'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">
                    {message.role === 'user' ? 'You' : 'Research AI Assistant'}
                  </span>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-50 mr-8 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  <span className="text-sm">Consulting research database...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about evidence-based practices, research findings, or implementation guidance..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              Send
            </Button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            This assistant provides recommendations based on publicly available research from sources like 
            What Works Clearinghouse, Cochrane Reviews, NCII, and peer-reviewed journals.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
