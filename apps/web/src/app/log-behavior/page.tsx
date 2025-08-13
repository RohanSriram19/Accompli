'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useRequireAuth } from '@/lib/use-require-auth'
import { DashboardHeader } from '@/components/dashboard/header'
import { BehaviorAnalyzer } from '@/components/behavior-analyzer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Save } from 'lucide-react'

export default function LogBehaviorPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  
  const [selectedStudent, setSelectedStudent] = useState('')
  const [antecedent, setAntecedent] = useState('')
  const [behavior, setBehavior] = useState('')
  const [consequence, setConsequence] = useState('')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium')
  const [duration, setDuration] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  // Require authentication
  const { isLoading } = useRequireAuth()

  useEffect(() => {
    if (user && user.role !== 'AIDE') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Real IEP-aligned students with disability categories and behavior goals
  const students = [
    { 
      id: '1', 
      name: 'Emma Johnson', 
      grade: '3rd',
      disability: 'Specific Learning Disability',
      behaviorGoals: ['Increase task completion', 'Reduce task avoidance behaviors']
    },
    { 
      id: '2', 
      name: 'Marcus Williams', 
      grade: '11th',
      disability: 'Autism Spectrum Disorder',
      behaviorGoals: ['Improve social communication', 'Reduce repetitive behaviors']
    },
    { 
      id: '3', 
      name: 'Sophia Chen', 
      grade: '5th',
      disability: 'ADHD (Other Health Impairment)',
      behaviorGoals: ['Increase attention to task', 'Improve impulse control']
    },
    { 
      id: '4', 
      name: 'Tyler Brown', 
      grade: '4th',
      disability: 'Emotional Disturbance',
      behaviorGoals: ['Use coping strategies', 'Reduce verbal outbursts', 'Improve emotional regulation']
    }
  ]

  const startTimer = () => {
    setStartTime(new Date())
  }

  const stopTimer = () => {
    if (startTime) {
      const endTime = new Date()
      const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      setDuration(durationInSeconds)
      setStartTime(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call - replace with real implementation
      const behaviorEvent = {
        student_id: selectedStudent,
        abc: { antecedent, behavior, consequence },
        severity,
        duration_seconds: duration,
        timestamp: new Date().toISOString(),
      }

      console.log('Submitting behavior event:', behaviorEvent)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form
      setSelectedStudent('')
      setAntecedent('')
      setBehavior('')
      setConsequence('')
      setSeverity('medium')
      setDuration(0)
      
      alert('Behavior event logged successfully!')
      
    } catch (error) {
      console.error('Error submitting behavior event:', error)
      alert('Error logging behavior event')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <span>Log Behavior Event</span>
          </h1>
          <p className="text-gray-600">Record ABC behavior data for real-time tracking</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Behavior Event Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Selection */}
              <div>
                <Label htmlFor="student">Student *</Label>
                <select
                  id="student"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - Grade {student.grade} ({student.disability})
                    </option>
                  ))}
                </select>
              </div>

              {/* ABC Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="antecedent">Antecedent *</Label>
                  <Input
                    id="antecedent"
                    value={antecedent}
                    onChange={(e) => setAntecedent(e.target.value)}
                    placeholder="What happened before?"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="behavior">Behavior *</Label>
                  <Input
                    id="behavior"
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value)}
                    placeholder="What did the student do?"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="consequence">Consequence *</Label>
                  <Input
                    id="consequence"
                    value={consequence}
                    onChange={(e) => setConsequence(e.target.value)}
                    placeholder="What happened after?"
                    required
                  />
                </div>
              </div>

              {/* Environmental Factors */}
              <div>
                <Label>Environmental Factors</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Noisy classroom', 'Unexpected schedule change', 'Peer conflict', 
                    'Difficult task demand', 'Transition period', 'Low staff ratio',
                    'Hunger/thirst', 'Fatigue', 'Overstimulation', 'Understimulation'
                  ].map((factor) => (
                    <label key={factor} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{factor}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Interventions Used */}
              <div>
                <Label>Interventions Used</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    'Verbal redirection', 'Visual cue', 'Break offered', 'Choice provided',
                    'Task modified', 'Proximity/support', 'Sensory tool', 'Movement break',
                    'Peer support', 'Environmental change', 'Calm down strategy', 'Replacement behavior'
                  ].map((intervention) => (
                    <label key={intervention} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{intervention}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Function of Behavior */}
              <div>
                <Label>Hypothesized Function</Label>
                <select className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select function...</option>
                  <option value="attention">Attention seeking</option>
                  <option value="escape">Escape/avoidance</option>
                  <option value="tangible">Access to tangible</option>
                  <option value="sensory">Sensory stimulation</option>
                  <option value="communication">Communication need</option>
                  <option value="medical">Medical/biological</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <Label>Severity Level *</Label>
                <div className="flex space-x-4 mt-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium ${
                        severity === level
                          ? level === 'high'
                            ? 'bg-red-100 border-red-300 text-red-800'
                            : level === 'medium'
                            ? 'bg-orange-100 border-orange-300 text-orange-800'
                            : 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Low: Minor disruption • Medium: Moderate impact • High: Significant safety concern
                </p>
              </div>
              <div>
                <Label>Severity Level *</Label>
                <div className="flex space-x-4 mt-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium ${
                        severity === level
                          ? level === 'high'
                            ? 'bg-red-100 border-red-300 text-red-800'
                            : level === 'medium'
                            ? 'bg-orange-100 border-orange-300 text-orange-800'
                            : 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Timer */}
              <div>
                <Label>Duration</Label>
                <div className="flex items-center space-x-4 mt-2">
                  {!startTime ? (
                    <Button type="button" onClick={startTimer} variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Start Timer
                    </Button>
                  ) : (
                    <Button type="button" onClick={stopTimer} variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Stop Timer ({formatTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))})
                    </Button>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-20"
                      min="0"
                    />
                    <span className="text-sm text-gray-500">seconds</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AI Behavior Analysis */}
        <div className="mt-8">
          <BehaviorAnalyzer 
            behaviorEvents={[
              // Mock recent behavior events for analysis
              {
                id: '1',
                antecedent: 'Transition from preferred activity to non-preferred task',
                behavior: 'Verbal protest and refusal to comply',
                consequence: 'Given 2-minute break, then completed task',
                date: '2024-12-12',
                severity: 'medium' as const
              },
              {
                id: '2',
                antecedent: 'Noise level increased in classroom',
                behavior: 'Covered ears and moved to quiet corner',
                consequence: 'Allowed to use noise-canceling headphones',
                date: '2024-12-11',
                severity: 'low' as const
              },
              {
                id: '3',
                antecedent: 'Peer took preferred seating spot',
                behavior: 'Physical push and raised voice',
                consequence: 'Conflict resolution discussion held',
                date: '2024-12-10',
                severity: 'high' as const
              }
            ]}
          />
        </div>
      </main>
    </div>
  )
}
