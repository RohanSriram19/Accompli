'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useRequireAuth } from '@/lib/use-require-auth'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, Search, Plus, Eye, Edit, FileText, Target,
  Calendar, AlertTriangle, CheckCircle, Clock, BarChart3
} from 'lucide-react'

export default function StudentsPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [students, setStudents] = useState<any[]>([])
  const [showingExamples, setShowingExamples] = useState(false)

  // Require authentication
  const { isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Example students data
  const exampleStudents = [
    {
      id: '1',
      name: 'Emma Johnson',
      grade: '3rd',
      age: 8,
      disability_category: 'specific-learning-disability',
      iep_status: 'active',
      last_iep_date: '2024-09-01',
      next_review: '2025-03-01',
      goals_count: 3,
      goals_on_track: 2,
      recent_behavior_events: 1,
      teacher: 'Sarah Johnson',
      present_levels: {
        reading: 'Grade 2 level',
        math: 'Grade 3 level',
        behavior: 'Responds well to positive reinforcement'
      },
      photo: null
    },
    {
      id: '2',
      name: 'Tyler Brown',
      grade: '3rd',
      age: 9,
      disability_category: 'autism',
      iep_status: 'active',
      last_iep_date: '2024-08-15',
      next_review: '2025-02-15',
      goals_count: 4,
      goals_on_track: 3,
      recent_behavior_events: 3,
      teacher: 'Sarah Johnson',
      present_levels: {
        reading: 'Grade 2 level',
        math: 'Grade 3 level',
        behavior: 'Benefits from structured environment and visual supports'
      },
      photo: null
    },
    {
      id: '3',
      name: 'Sophia Chen',
      grade: '4th',
      age: 10,
      disability_category: 'intellectual-disability',
      iep_status: 'active',
      last_iep_date: '2024-09-10',
      next_review: '2025-03-10',
      goals_count: 3,
      goals_on_track: 1,
      recent_behavior_events: 0,
      teacher: 'Sarah Johnson',
      present_levels: {
        reading: 'Grade 1 level',
        math: 'Grade 2 level',
        behavior: 'Cooperative and eager to please'
      },
      photo: null
    },
    {
      id: '4',
      name: 'Marcus Williams',
      grade: '11th',
      age: 17,
      disability_category: 'multiple-disabilities',
      iep_status: 'active',
      last_iep_date: '2024-08-20',
      next_review: '2025-02-20',
      goals_count: 5,
      goals_on_track: 4,
      recent_behavior_events: 0,
      teacher: 'Sarah Johnson',
      present_levels: {
        reading: 'Grade 4 level',
        math: 'Grade 3 level',
        behavior: 'Demonstrates good work habits and social skills'
      },
      photo: null
    }
  ]

  const loadExampleData = () => {
    setStudents(exampleStudents)
    setShowingExamples(true)
  }

  const clearData = () => {
    setStudents([])
    setShowingExamples(false)
  }

  const addNewStudent = () => {
    // For now, navigate to a form (we'll create this later)
    alert('Add New Student form would open here. This will be implemented next.')
  }

  const grades = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade
    return matchesSearch && matchesGrade
  })

  const getDisabilityLabel = (category: string) => {
    const labels: Record<string, string> = {
      'autism': 'Autism',
      'specific-learning-disability': 'Specific Learning Disability',
      'intellectual-disability': 'Intellectual Disability',
      'multiple-disabilities': 'Multiple Disabilities',
      'emotional-disturbance': 'Emotional Disturbance',
      'speech-language-impairment': 'Speech/Language Impairment',
      'other-health-impairment': 'Other Health Impairment',
      'orthopedic-impairment': 'Orthopedic Impairment',
      'hearing-impairment': 'Hearing Impairment',
      'visual-impairment': 'Visual Impairment',
      'traumatic-brain-injury': 'Traumatic Brain Injury',
      'deaf-blindness': 'Deaf-Blindness',
      'deafness': 'Deafness'
    }
    return labels[category] || category
  }

  const getGoalsStatusColor = (onTrack: number, total: number) => {
    const percentage = (onTrack / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getIEPStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span>Students</span>
              </h1>
              <p className="text-gray-600">Manage student profiles and IEP information</p>
            </div>
            <div className="flex space-x-3">
              {students.length === 0 && (
                <Button 
                  variant="outline" 
                  onClick={loadExampleData}
                  className="text-gray-600 border-gray-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Example
                </Button>
              )}
              {showingExamples && (
                <Button 
                  variant="outline" 
                  onClick={clearData}
                  className="text-red-600 border-red-300"
                >
                  Clear Data
                </Button>
              )}
              {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                <Button onClick={addNewStudent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active IEPs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.iep_status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Goals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.reduce((sum, s) => sum + s.goals_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.reduce((sum, s) => sum + s.recent_behavior_events, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Grades</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>
              
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600 mb-6">
                {students.length === 0 
                  ? "Get started by adding your first student or viewing example data."
                  : "No students match your current filters."
                }
              </p>
              {students.length === 0 && (
                <div className="flex justify-center space-x-3">
                  <Button onClick={loadExampleData} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Example Data
                  </Button>
                  {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                    <Button onClick={addNewStudent}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Student
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">Grade {student.grade} • Age {student.age}</p>
                      </div>
                    </div>
                  <Badge className={getIEPStatusColor(student.iep_status)}>
                    {student.iep_status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Disability Category */}
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Disability</p>
                  <p className="text-sm text-gray-900">{getDisabilityLabel(student.disability_category)}</p>
                </div>

                {/* Goals Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">IEP Goals</p>
                    <span className={`text-sm font-medium ${getGoalsStatusColor(student.goals_on_track, student.goals_count)}`}>
                      {student.goals_on_track}/{student.goals_count} on track
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(student.goals_on_track / student.goals_count) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Key Information */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Teacher:</span>
                    <span className="text-gray-900">{student.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next Review:</span>
                    <span className="text-gray-900">{new Date(student.next_review).toLocaleDateString()}</span>
                  </div>
                  {student.recent_behavior_events > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Recent Events:</span>
                      <span className="text-orange-600 font-medium">{student.recent_behavior_events}</span>
                    </div>
                  )}
                </div>

                {/* Present Levels Summary */}
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Present Levels</p>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p><strong>Reading:</strong> {student.present_levels.reading}</p>
                    <p><strong>Math:</strong> {student.present_levels.math}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/students/${student.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <Button size="sm" onClick={() => router.push(`/students/${student.id}`)}>
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </main>
    </div>
  )
}
