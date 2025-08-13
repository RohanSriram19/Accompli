'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useRequireAuth } from '@/lib/use-require-auth'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, Calendar, Target, User, BookOpen, CheckCircle,
  AlertTriangle, BarChart3, Download, Filter, Plus, Search,
  Clock, Award, ArrowUp, ArrowDown, Minus, Eye, Edit
} from 'lucide-react'

export default function AssessmentsPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('assessments')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('all')
  const [selectedGoal, setSelectedGoal] = useState('all')

  // Require authentication
  const { isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Mock assessment data
  const assessments = [
    {
      id: '1',
      student: 'Emma Johnson',
      goal: 'Reading Fluency',
      assessment_type: 'Curriculum-Based Measurement',
      date: '2024-12-12',
      score: 85,
      target: 80,
      status: 'met',
      notes: 'Reading at grade level with 85 words per minute. Excellent progress!',
      assessor: 'Sarah Johnson',
      next_assessment: '2024-12-19'
    },
    {
      id: '2',
      student: 'Emma Johnson',
      goal: 'Reading Comprehension',
      assessment_type: 'Running Record',
      date: '2024-12-10',
      score: 75,
      target: 80,
      status: 'approaching',
      notes: 'Good understanding of main ideas, needs work on inferencing.',
      assessor: 'Sarah Johnson',
      next_assessment: '2024-12-17'
    },
    {
      id: '3',
      student: 'Tyler Brown',
      goal: 'Math Problem Solving',
      assessment_type: 'Work Sample Analysis',
      date: '2024-12-11',
      score: 70,
      target: 75,
      status: 'approaching',
      notes: 'Shows understanding of multi-step problems but needs support with organization.',
      assessor: 'Sarah Johnson',
      next_assessment: '2024-12-18'
    },
    {
      id: '4',
      student: 'Tyler Brown',
      goal: 'Social Communication',
      assessment_type: 'Behavioral Observation',
      date: '2024-12-09',
      score: 90,
      target: 85,
      status: 'exceeded',
      notes: 'Excellent progress in peer interactions and turn-taking during group activities.',
      assessor: 'Sarah Johnson',
      next_assessment: '2024-12-16'
    },
    {
      id: '5',
      student: 'Sophia Chen',
      goal: 'Math Computation',
      assessment_type: 'Timed Assessment',
      date: '2024-12-08',
      score: 60,
      target: 70,
      status: 'below',
      notes: 'Accuracy is good but speed needs improvement. Consider additional practice.',
      assessor: 'Sarah Johnson',
      next_assessment: '2024-12-15'
    },
    {
      id: '6',
      student: 'Marcus Williams',
      goal: 'Transition Planning',
      assessment_type: 'Portfolio Review',
      date: '2024-12-07',
      score: 88,
      target: 80,
      status: 'met',
      notes: 'Strong progress on job application skills and interview preparation.',
      assessor: 'Sarah Johnson',
      next_assessment: '2024-12-21'
    }
  ]

  // Mock progress tracking data
  const progressData = [
    {
      student: 'Emma Johnson',
      goal: 'Reading Fluency',
      baseline: 45,
      current: 85,
      target: 80,
      trend: 'increasing',
      data_points: [
        { date: '2024-10-01', score: 45 },
        { date: '2024-10-15', score: 52 },
        { date: '2024-11-01', score: 58 },
        { date: '2024-11-15', score: 65 },
        { date: '2024-12-01', score: 75 },
        { date: '2024-12-12', score: 85 }
      ]
    },
    {
      student: 'Tyler Brown',
      goal: 'Social Communication',
      baseline: 30,
      current: 90,
      target: 85,
      trend: 'increasing',
      data_points: [
        { date: '2024-10-01', score: 30 },
        { date: '2024-10-15', score: 45 },
        { date: '2024-11-01', score: 60 },
        { date: '2024-11-15', score: 75 },
        { date: '2024-12-01', score: 85 },
        { date: '2024-12-09', score: 90 }
      ]
    }
  ]

  const students = ['Emma Johnson', 'Tyler Brown', 'Sophia Chen', 'Marcus Williams']
  const goals = ['Reading Fluency', 'Reading Comprehension', 'Math Problem Solving', 'Social Communication', 'Math Computation', 'Transition Planning']

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.assessment_type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStudent = selectedStudent === 'all' || assessment.student === selectedStudent
    const matchesGoal = selectedGoal === 'all' || assessment.goal === selectedGoal
    
    return matchesSearch && matchesStudent && matchesGoal
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'bg-green-100 text-green-800 border-green-200'
      case 'met': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'approaching': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'below': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded': return <ArrowUp className="h-4 w-4" />
      case 'met': return <CheckCircle className="h-4 w-4" />
      case 'approaching': return <Minus className="h-4 w-4" />
      case 'below': return <ArrowDown className="h-4 w-4" />
      default: return <Minus className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'decreasing': return <ArrowDown className="h-4 w-4 text-red-600" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const calculateProgress = (baseline: number, current: number, target: number) => {
    const totalProgress = target - baseline
    const currentProgress = current - baseline
    return Math.min(Math.max((currentProgress / totalProgress) * 100, 0), 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span>Assessment & Progress Monitoring</span>
              </h1>
              <p className="text-gray-600">Track student progress toward IEP goals with data-driven assessments</p>
            </div>
            <Button onClick={() => router.push('/assessments/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assessments">Recent Assessments</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search assessments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Students</option>
                      {students.map(student => (
                        <option key={student} value={student}>{student}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Goals</option>
                      {goals.map(goal => (
                        <option key={goal} value={goal}>{goal}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Assessments List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{assessment.student}</h3>
                          <Badge className={getStatusColor(assessment.status)}>
                            {getStatusIcon(assessment.status)}
                            <span className="ml-1 capitalize">{assessment.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">IEP Goal</p>
                            <p className="text-gray-900">{assessment.goal}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700">Assessment Type</p>
                            <p className="text-gray-900">{assessment.assessment_type}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700">Score</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">{assessment.score}</span>
                              <span className="text-gray-500">/ {assessment.target}</span>
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    assessment.status === 'exceeded' ? 'bg-green-500' :
                                    assessment.status === 'met' ? 'bg-blue-500' :
                                    assessment.status === 'approaching' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min((assessment.score / assessment.target) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700">Date</p>
                            <p className="text-gray-900">{new Date(assessment.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {assessment.notes && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700">Notes</p>
                            <p className="text-gray-600 mt-1">{assessment.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            <span>Assessed by {assessment.assessor}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Next: {new Date(assessment.next_assessment).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {progressData.map((progress, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{progress.student}</h3>
                        <p className="text-sm text-gray-600">{progress.goal}</p>
                      </div>
                      {getTrendIcon(progress.trend)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress toward goal</span>
                          <span>{Math.round(calculateProgress(progress.baseline, progress.current, progress.target))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${calculateProgress(progress.baseline, progress.current, progress.target)}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Baseline</p>
                          <p className="text-xl font-bold text-gray-900">{progress.baseline}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Current</p>
                          <p className="text-xl font-bold text-blue-600">{progress.current}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Target</p>
                          <p className="text-xl font-bold text-green-600">{progress.target}</p>
                        </div>
                      </div>
                      
                      {/* Mini Chart */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Progress Over Time</p>
                        <div className="h-20 flex items-end space-x-1">
                          {progress.data_points.map((point, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-blue-500 rounded-t"
                                style={{ 
                                  height: `${(point.score / progress.target) * 80}px`,
                                  minHeight: '4px'
                                }}
                              />
                              <span className="text-xs text-gray-500 mt-1">
                                {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Goals Met</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {assessments.filter(a => a.status === 'met' || a.status === 'exceeded').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {assessments.filter(a => a.status === 'approaching').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Needs Support</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {assessments.filter(a => a.status === 'below').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Exceeded</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {assessments.filter(a => a.status === 'exceeded').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goal Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Goal Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map(goal => {
                    const goalAssessments = assessments.filter(a => a.goal === goal)
                    const avgScore = goalAssessments.length > 0 
                      ? goalAssessments.reduce((sum, a) => sum + a.score, 0) / goalAssessments.length 
                      : 0
                    const avgTarget = goalAssessments.length > 0 
                      ? goalAssessments.reduce((sum, a) => sum + a.target, 0) / goalAssessments.length 
                      : 0
                    
                    return (
                      <div key={goal} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{goal}</h4>
                          <p className="text-sm text-gray-600">{goalAssessments.length} assessments</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Avg Score</p>
                            <p className="font-semibold">{avgScore.toFixed(1)} / {avgTarget.toFixed(1)}</p>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min((avgScore / avgTarget) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
