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
  BookOpen, Plus, Search, Calendar, Target, Users, 
  Clock, CheckCircle, AlertCircle, Filter, Edit, Copy, Trash2 
} from 'lucide-react'

export default function LessonPlansPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('my-plans')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')

  // Require authentication
  const { isLoading } = useRequireAuth()

  // Check if this is a demo account
  const isDemoAccount = user?.email?.includes('@demo.com') || false

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Mock lesson plans data - only show for demo accounts
  const lessonPlans = isDemoAccount ? [
    {
      id: '1',
      title: 'Reading Comprehension: Main Idea and Details',
      subject: 'Reading',
      grade: '3rd',
      duration: 45,
      iep_goals: ['Reading Fluency', 'Reading Comprehension'],
      students: ['Emma Johnson', 'Tyler Brown'],
      standards: ['CCSS.ELA-LITERACY.RL.3.2'],
      status: 'active',
      last_used: '2024-12-10',
      effectiveness_rating: 4.2,
      accommodations: ['Extended time', 'Graphic organizers', 'Read aloud'],
      created_by: 'Sarah Johnson',
      created_at: '2024-11-15'
    },
    {
      id: '2',
      title: 'Two-Step Word Problems with Addition and Subtraction',
      subject: 'Math',
      grade: '3rd',
      duration: 30,
      iep_goals: ['Math Problem Solving', 'Math Computation'],
      students: ['Emma Johnson', 'Sophia Chen'],
      standards: ['CCSS.MATH.CONTENT.3.OA.D.8'],
      status: 'draft',
      last_used: null,
      effectiveness_rating: null,
      accommodations: ['Calculator for computation', 'Visual supports', 'Step-by-step checklist'],
      created_by: 'Sarah Johnson',
      created_at: '2024-12-12'
    },
    {
      id: '3',
      title: 'Paragraph Writing with Topic Sentences',
      subject: 'Writing',
      grade: '3rd-4th',
      duration: 50,
      iep_goals: ['Written Expression', 'Organization Skills'],
      students: ['Emma Johnson', 'Tyler Brown'],
      standards: ['CCSS.ELA-LITERACY.W.3.1'],
      status: 'active',
      last_used: '2024-12-08',
      effectiveness_rating: 3.8,
      accommodations: ['Graphic organizer', 'Word bank', 'Speech-to-text'],
      created_by: 'Sarah Johnson',
      created_at: '2024-11-20'
    },
    {
      id: '4',
      title: 'Social Skills: Taking Turns and Sharing',
      subject: 'Social Skills',
      grade: 'K-5th',
      duration: 25,
      iep_goals: ['Social Communication', 'Behavioral Regulation'],
      students: ['Marcus Williams', 'Tyler Brown'],
      standards: ['Social-Emotional Learning Standards'],
      status: 'active',
      last_used: '2024-12-11',
      effectiveness_rating: 4.5,
      accommodations: ['Visual cues', 'Role-play activities', 'Peer support'],
      created_by: 'Sarah Johnson',
      created_at: '2024-10-30'
    },
    {
      id: '5',
      title: 'Transition Planning: Job Application Skills',
      subject: 'Transition',
      grade: '11th-12th',
      duration: 60,
      iep_goals: ['Transition Planning', 'Communication Skills'],
      students: ['Marcus Williams'],
      standards: ['Transition Standards'],
      status: 'active',
      last_used: '2024-12-09',
      effectiveness_rating: 4.0,
      accommodations: ['Template provided', 'Practice interviews', 'Real-world examples'],
      created_by: 'Sarah Johnson',
      created_at: '2024-11-01'
    }
  ] : [] // Empty array for non-demo accounts

  const subjects = ['Reading', 'Math', 'Writing', 'Social Skills', 'Transition', 'Science', 'Social Studies']
  const grades = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']

  const filteredPlans = lessonPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.iep_goals.some(goal => goal.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSubject = selectedSubject === 'all' || plan.subject === selectedSubject
    const matchesGrade = selectedGrade === 'all' || plan.grade.includes(selectedGrade)
    
    return matchesSearch && matchesSubject && matchesGrade
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span>IEP-Aligned Lesson Plans</span>
              </h1>
              <p className="text-gray-600">Create and manage lessons aligned to individual student IEP goals</p>
            </div>
            <Button onClick={() => router.push('/lesson-plans/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Lesson Plan
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search lesson plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
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
              
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{plan.title}</CardTitle>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{plan.subject}</span>
                  <span>•</span>
                  <span>Grade {plan.grade}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {plan.duration}min
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* IEP Goals */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Aligned IEP Goals</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.iep_goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Students */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Target Students</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {plan.students.length} student{plan.students.length !== 1 ? 's' : ''}
                    {plan.students.length <= 2 && (
                      <span className="ml-1">({plan.students.join(', ')})</span>
                    )}
                  </div>
                </div>

                {/* Accommodations */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Key Accommodations</p>
                  <div className="text-sm text-gray-600">
                    {plan.accommodations.slice(0, 2).join(', ')}
                    {plan.accommodations.length > 2 && (
                      <span className="text-gray-500"> +{plan.accommodations.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Effectiveness & Usage */}
                {plan.effectiveness_rating && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600">Effectiveness:</span>
                      <span className={`ml-1 font-medium ${getRatingColor(plan.effectiveness_rating)}`}>
                        {plan.effectiveness_rating}/5.0
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {plan.last_used ? new Date(plan.last_used).toLocaleDateString() : 'Not used'}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lesson plans found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedSubject !== 'all' || selectedGrade !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Create your first IEP-aligned lesson plan to get started.'
                }
              </p>
              <Button onClick={() => router.push('/lesson-plans/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Lesson Plan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{lessonPlans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lessonPlans.filter(p => p.status === 'active').length}
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
                  <p className="text-sm font-medium text-gray-600">IEP Goals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(lessonPlans.flatMap(p => p.iep_goals)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Students Served</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(lessonPlans.flatMap(p => p.students)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
