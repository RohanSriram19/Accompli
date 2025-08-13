'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Target, Loader2, Copy, Check } from 'lucide-react'
import { aiService } from '@/lib/ai-service'

interface IEPGoalGeneratorProps {
  studentId?: string
  className?: string
}

export function IEPGoalGenerator({ studentId, className = '' }: IEPGoalGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedGoal, setGeneratedGoal] = useState('')
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    disability: '',
    currentLevel: '',
    targetArea: '',
    timeframe: '1 academic year'
  })

  const handleGenerate = async () => {
    if (!formData.currentLevel || !formData.targetArea) return

    setIsGenerating(true)
    try {
      const goal = await aiService.generateIEPGoal({
        name: formData.studentName,
        grade: formData.grade,
        disability: formData.disability,
        currentLevel: formData.currentLevel,
        targetArea: formData.targetArea,
        timeframe: formData.timeframe
      })
      setGeneratedGoal(goal)
    } catch (error) {
      console.error('Error generating IEP goal:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (generatedGoal) {
      await navigator.clipboard.writeText(generatedGoal)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const disabilityOptions = [
    'Autism',
    'Specific Learning Disability',
    'Intellectual Disability',
    'Multiple Disabilities',
    'Emotional Disturbance',
    'Speech or Language Impairment',
    'Other Health Impairment',
    'Orthopedic Impairment',
    'Hearing Impairment',
    'Visual Impairment',
    'Traumatic Brain Injury',
    'Deaf-Blindness',
    'Deafness'
  ]

  const targetAreas = [
    'Reading Fluency',
    'Reading Comprehension',
    'Written Expression',
    'Mathematics Calculation',
    'Mathematics Problem Solving',
    'Social Communication',
    'Behavioral Regulation',
    'Fine Motor Skills',
    'Gross Motor Skills',
    'Social Skills',
    'Life Skills',
    'Transition Skills',
    'Assistive Technology'
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className={`flex items-center space-x-2 ${className}`}
      >
        <Lightbulb className="h-4 w-4" />
        <span>AI Goal Generator</span>
      </Button>
    )
  }

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>AI IEP Goal Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
              placeholder="Enter student name"
            />
          </div>
          <div>
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              placeholder="e.g., 3rd grade"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="disability">Primary Disability Category</Label>
          <Select value={formData.disability} onValueChange={(value: string) => setFormData(prev => ({ ...prev, disability: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select disability category" />
            </SelectTrigger>
            <SelectContent>
              {disabilityOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="targetArea">Target Area</Label>
          <Select value={formData.targetArea} onValueChange={(value: string) => setFormData(prev => ({ ...prev, targetArea: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select target area" />
            </SelectTrigger>
            <SelectContent>
              {targetAreas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="currentLevel">Current Performance Level</Label>
          <Textarea
            id="currentLevel"
            value={formData.currentLevel}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, currentLevel: e.target.value }))}
            placeholder="Describe the student's current performance level in this area..."
            rows={3}
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleGenerate}
            disabled={!formData.currentLevel || !formData.targetArea || isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate Goal'}</span>
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>

        {generatedGoal && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Generated IEP Goal
              </Badge>
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                className="text-blue-600"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="whitespace-pre-wrap text-sm text-gray-800">{generatedGoal}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
