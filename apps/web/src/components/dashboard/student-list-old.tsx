'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, GraduationCap, AlertTriangle, FileText, Calendar, Users, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AddStudentDialog } from '@/components/add-student-dialog'
import { useAuthStore } from '@/lib/auth-store'
import { Student, studentStorage } from '@/lib/student-storage'

export function StudentList() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [students, setStudents] = useState<Student[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  // Check if this is a demo account
  const isDemoAccount = user?.email?.includes('@demo.com') || false

  // Load students from storage
  useEffect(() => {
    if (user?.id) {
      // Initialize demo data for demo accounts
      if (isDemoAccount) {
        studentStorage.initializeDemoStudents(user.id)
      }
      
      // Load students for this user
      const userStudents = studentStorage.getStudentsForUser(user.id)
      setStudents(userStudents)
    }
  }, [user?.id, isDemoAccount])

  const handleAddStudent = (newStudent: Student) => {
    console.log('Adding student to list:', newStudent) // Debug log
    setStudents(prevStudents => [...prevStudents, newStudent])
  }

  const studentDisplayText = user?.role === 'PARENT' ? 'children' : 'students'
  const addButtonText = user?.role === 'PARENT' ? 'Add Child' : 'Add Student'

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
        <CardTitle>
          {user?.role === 'PARENT' ? 'My Children' : 'Student Caseload'}
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            console.log('Add Student button clicked')
            setShowAddDialog(true)
          }}>
            <Plus className="h-4 w-4 mr-1" />
            {user?.role === 'PARENT' ? 'Add Child' : 'Add Student'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/students')}>
            <Eye className="h-4 w-4 mr-1" />
            {user?.role === 'PARENT' ? 'View All Info' : 'View All IEPs'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {user?.role === 'PARENT' ? 'No children added yet' : 'No students in caseload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {user?.role === 'PARENT' 
                ? 'Add your children to track their IEP progress and goals'
                : 'Add students to your caseload or view examples to get started'
              }
            </p>
            <div className="flex justify-center space-x-2 mt-4">
              <Button onClick={() => {
                console.log('Add Your Child/Student button clicked')
                setShowAddDialog(true)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                {user?.role === 'PARENT' ? 'Add Your Child' : 'Add Your First Student'}
              </Button>
              <Button variant="outline" onClick={() => console.log('View examples')}>
                <Eye className="h-4 w-4 mr-2" />
                View Examples
              </Button>
            </div>
          </div>
        ) : (
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
                        className={`h-2 rounded-full ${getProgressColor(student.goals_progress || 0)}`}
                        style={{ width: `${student.goals_progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{student.goals_progress}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Recent Behaviors</p>
                  <div className="flex items-center space-x-1">
                    {(student.recent_behaviors || 0) > 10 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      (student.recent_behaviors || 0) > 10 ? 'text-red-600' : 
                      (student.recent_behaviors || 0) > 5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {student.recent_behaviors || 0} this week
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Priority IEP Goals</p>
                <div className="flex flex-wrap gap-1">
                  {(student.priority_goals || []).map((goal, index) => (
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
                    <span>Last Review: {student.last_review ? new Date(student.last_review).toLocaleDateString() : 'Not set'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Next: {new Date(student.next_review).toLocaleDateString()}</span>
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/students/${student.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          </div>
        )}

        <AddStudentDialog 
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddStudent={() => console.log('Add student')}
        />
      </CardContent>
    </Card>
  )
}
