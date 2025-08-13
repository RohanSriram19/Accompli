'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, GraduationCap, AlertTriangle, FileText, Calendar } from 'lucide-react'

interface Student {
  id: string
  first_name: string
  last_name: string
  grade: string
  disability: string
  iep_status: string
  last_review: string
  next_review: string
  goals_progress: number
  recent_behaviors: number
  placement: string
  reading_level?: string
  transition_focus?: string
  priority_goals: string[]
  behavior_plan?: boolean
  crisis_plan?: boolean
}

export function StudentList() {
  // Real IEP-aligned student data
  const students: Student[] = [
    {
      id: '1',
      first_name: 'Emma',
      last_name: 'Johnson',
      grade: '3rd',
      disability: 'Specific Learning Disability',
      iep_status: 'active',
      last_review: '2024-09-01',
      next_review: '2025-09-01',
      goals_progress: 75,
      recent_behaviors: 2,
      placement: 'Resource Room (20%)',
      reading_level: '2.1 grade equivalent',
      priority_goals: ['Reading Fluency', 'Written Expression']
    },
    {
      id: '2',
      first_name: 'Marcus',
      last_name: 'Williams',
      grade: '11th',
      disability: 'Autism Spectrum Disorder',
      iep_status: 'active',
      last_review: '2024-08-15',
      next_review: '2025-08-15',
      goals_progress: 85,
      recent_behaviors: 0,
      placement: 'General Ed with Support',
      transition_focus: 'Automotive Technology',
      priority_goals: ['Transition Planning', 'Social Communication']
    },
    {
      id: '3',
      first_name: 'Sophia',
      last_name: 'Chen',
      grade: '5th',
      disability: 'Other Health Impairment (ADHD)',
      iep_status: 'active',
      last_review: '2024-10-01',
      next_review: '2025-10-01',
      goals_progress: 60,
      recent_behaviors: 8,
      placement: 'General Ed with Accommodations',
      behavior_plan: true,
      priority_goals: ['Attention/Focus', 'Organization Skills']
    },
    {
      id: '4',
      first_name: 'Tyler',
      last_name: 'Brown',
      grade: '4th',
      disability: 'Emotional Disturbance',
      iep_status: 'active',
      last_review: '2024-07-20',
      next_review: '2025-07-20',
      goals_progress: 45,
      recent_behaviors: 15,
      placement: 'Special Education Class',
      crisis_plan: true,
      priority_goals: ['Behavioral Regulation', 'Coping Strategies']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'review-needed': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student Caseload</CardTitle>
        <Button variant="outline" size="sm">
          View All IEPs
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {student.first_name} {student.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">Grade {student.grade} • {student.disability}</p>
                    <p className="text-xs text-gray-500">{student.placement}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(student.iep_status)}>
                    IEP {student.iep_status.toUpperCase()}
                  </Badge>
                  {student.behavior_plan && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      BIP
                    </Badge>
                  )}
                  {student.crisis_plan && (
                    <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                      Crisis Plan
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Goals Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(student.goals_progress)}`}
                        style={{ width: `${student.goals_progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{student.goals_progress}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Recent Behaviors</p>
                  <div className="flex items-center space-x-1">
                    {student.recent_behaviors > 10 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      student.recent_behaviors > 10 ? 'text-red-600' : 
                      student.recent_behaviors > 5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {student.recent_behaviors} this week
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Priority IEP Goals</p>
                <div className="flex flex-wrap gap-1">
                  {student.priority_goals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              {student.reading_level && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500">Current Reading Level</p>
                  <p className="text-sm font-medium">{student.reading_level}</p>
                </div>
              )}

              {student.transition_focus && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500">Transition Focus</p>
                  <p className="text-sm font-medium">{student.transition_focus}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>Last Review: {new Date(student.last_review).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Next: {new Date(student.next_review).toLocaleDateString()}</span>
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
