'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Brain, Loader2, TrendingUp } from 'lucide-react'
import { aiService } from '@/lib/ai-service'

interface BehaviorEvent {
  id: string
  antecedent: string
  behavior: string
  consequence: string
  date: string
  severity: 'low' | 'medium' | 'high'
}

interface BehaviorAnalyzerProps {
  behaviorEvents: BehaviorEvent[]
  className?: string
}

export function BehaviorAnalyzer({ behaviorEvents, className = '' }: BehaviorAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleAnalyze = async () => {
    if (behaviorEvents.length === 0) return

    setIsAnalyzing(true)
    try {
      const result = await aiService.analyzeBehaviorData(behaviorEvents)
      setAnalysis(result)
      setShowAnalysis(true)
    } catch (error) {
      console.error('Error analyzing behavior data:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (behaviorEvents.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No behavior data available for analysis</p>
          <p className="text-sm text-gray-500 mt-1">Log some behavior events to enable AI analysis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Behavior Analysis</span>
            <Badge variant="outline" className="text-xs">
              {behaviorEvents.length} events
            </Badge>
          </CardTitle>
          {!showAnalysis && (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="sm"
              className="flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Patterns'}</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!showAnalysis ? (
          <div className="text-center py-8">
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">AI Analysis includes:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Pattern identification in antecedents</li>
                  <li>• Behavior function hypothesis</li>
                  <li>• Intervention strategy recommendations</li>
                  <li>• Environmental modification suggestions</li>
                  <li>• Data collection recommendations</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {behaviorEvents.filter(e => e.severity === 'high').length}
                  </p>
                  <p className="text-sm text-red-600">High Severity</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {behaviorEvents.filter(e => e.severity === 'medium').length}
                  </p>
                  <p className="text-sm text-yellow-600">Medium Severity</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {behaviorEvents.filter(e => e.severity === 'low').length}
                  </p>
                  <p className="text-sm text-green-600">Low Severity</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-purple-700 border-purple-300">
                AI Analysis Results
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalysis(false)}
              >
                New Analysis
              </Button>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="whitespace-pre-wrap text-sm text-gray-800">{analysis}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
