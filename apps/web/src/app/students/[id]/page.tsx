'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useRequireAuth } from '@/lib/use-require-auth'
import { iepDataService } from '@/lib/iep-data-service'
import { StudentIEPData } from '@/lib/enhanced-ai-service'
import { DashboardHeader } from '@/components/dashboard/header'
import { SimpleResearchChatbot } from '@/components/simple-research-chatbot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, FileText, Target, TrendingUp, Calendar, 
  AlertTriangle, BookOpen, BarChart3, Clock, CheckCircle 
} from 'lucide-react'

interface StudentDetailProps {
  params: { id: string }
}

export default function StudentDetailPage({ params }: StudentDetailProps) {
  const { user } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [studentData, setStudentData] = useState<StudentIEPData | null>(null)
  const [loading, setLoading] = useState(true)

  // Require authentication
  const { isLoading } = useRequireAuth()

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const data = await iepDataService.getStudentIEPData(params.id)
        setStudentData(data)
      } catch (error) {
        console.error('Error loading student data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!isLoading) {
      loadStudentData()
    }
  }, [params.id, isLoading])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Student not found</div>
      </div>
    )
  }

  // Use actual student data from IEP service
  const student = {
    id: studentData.id,
    name: studentData.name,
    grade: studentData.grade,
    disability: studentData.disability,
    placement: 'Resource Room (varies)',
    teacher: 'Current Teacher', // Would come from API
    case_manager: 'Case Manager', // Would come from API
    iep: {
      effective_date: '2024-09-01',
      annual_review: '2025-09-01',
      triennial: '2027-04-15',
      status: 'active'
    },
    present_levels: {
      reading_level: 'Based on current assessments',
      math_level: 'Based on current assessments',
      strengths: studentData.iep.strengths,
      needs: studentData.iep.needs
    },
    goals: studentData.iep.goals.map((goal, index) => ({
      id: goal.id,
      area: goal.domain,
      statement: goal.goalText,
      baseline: 'Initial assessment data', // Would come from actual baseline data
      target: goal.targetDate,
      progress: goal.progress,
      status: goal.status === 'in_progress' ? (goal.progress >= 70 ? 'on-track' : 'needs-attention') : goal.status,
      data_points: [
        { date: '2024-09-15', score: Math.max(0, goal.progress - 30), percentage: Math.max(0, goal.progress - 30) },
        { date: '2024-10-15', score: Math.max(0, goal.progress - 20), percentage: Math.max(0, goal.progress - 20) },
        { date: '2024-11-15', score: Math.max(0, goal.progress - 10), percentage: Math.max(0, goal.progress - 10) },
        { date: '2024-12-15', score: goal.progress, percentage: goal.progress }
      ],
      next_review: goal.targetDate
    })),
    accommodations: Object.values(studentData.iep.accommodations).flat(),
    services: Object.entries(studentData.iep.services).map(([type, details]) => ({
      type,
      frequency: details,
      location: 'Resource Room', // Default location
      provider: 'Service Provider' // Would come from actual provider data
    })),
    recent_behavior: studentData.recentBehaviorEvents?.slice(0, 3).map(event => ({
      date: event.date,
      type: event.type,
      severity: event.severity,
      intervention: event.consequence || 'Standard intervention',
      outcome: 'Positive resolution'
    })) || []
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100'
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200'
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'at-risk': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-lg text-gray-600">Grade {student.grade}</p>
                <p className="text-sm text-gray-500">{student.disability} • {student.placement}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                IEP Active
              </Badge>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Full IEP
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Goals</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">62%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Next Review</p>
                  <p className="text-2xl font-bold text-gray-900">8/31</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Behaviors</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">IEP Goals</TabsTrigger>
            <TabsTrigger value="progress">Progress Data</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Present Levels */}
              <Card>
                <CardHeader>
                  <CardTitle>Present Levels (PLAAFP)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {student.present_levels.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">Areas of Need</h4>
                    <ul className="space-y-1">
                      {student.present_levels.needs.map((need, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <Target className="h-4 w-4 text-orange-500 mr-2" />
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reading Level</p>
                      <p className="text-lg font-semibold">{student.present_levels.reading_level}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Math Level</p>
                      <p className="text-lg font-semibold">{student.present_levels.math_level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accommodations */}
              <Card>
                <CardHeader>
                  <CardTitle>Accommodations & Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {student.accommodations.map((accommodation, index) => (
                      <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm">{accommodation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {student.goals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.area} Goal</CardTitle>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Goal Statement</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {goal.statement}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Baseline</h4>
                        <p className="text-sm text-gray-600">{goal.baseline}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Target</h4>
                        <p className="text-sm text-gray-600">{goal.target}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Current Progress</h4>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getProgressColor(goal.progress)}`}>
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Next Review: {new Date(goal.next_review).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Monitoring Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Progress charts will be displayed here</p>
                    <p className="text-sm text-gray-400">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Behavior Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.recent_behavior.map((event, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{event.type}</h4>
                        <Badge variant={event.severity === 'low' ? 'secondary' : 'destructive'}>
                          {event.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Intervention:</strong> {event.intervention}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Outcome:</strong> {event.outcome}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Special Education Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{service.type}</h4>
                        <span className="text-sm text-gray-500">{service.frequency}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Location:</strong> {service.location}
                        </div>
                        <div>
                          <strong>Provider:</strong> {service.provider}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Research-Aware AI Chatbot with Student Context */}
      <SimpleResearchChatbot studentData={studentData} />
    </div>
  )
}
