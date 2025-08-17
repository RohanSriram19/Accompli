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
    console.log('Adding student to list:', newStudent)
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {user?.role === 'PARENT' ? 'My Children' : 'Student Caseload'}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="sm"
              onClick={() => {
                console.log('Add student button clicked')
                setShowAddDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              {addButtonText}
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/students')}>
              <Eye className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {studentDisplayText} yet
              </h3>
              <p className="text-gray-600 mb-4">
                {user?.role === 'PARENT' 
                  ? "Add your child's information to get started."
                  : "Add students to your caseload to get started."
                }
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {students.slice(0, 4).map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <GraduationCap className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Grade {student.grade}</span>
                        <span>•</span>
                        <span>{student.disability}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(student.iep_status)}>
                          {student.iep_status}
                        </Badge>
                        {(student.recent_behaviors || 0) > 5 && (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Progress: {student.goals_progress || 0}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${getProgressColor(student.goals_progress || 0)}`}
                          style={{ width: `${student.goals_progress || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/students/${student.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push('/goals')}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {students.length > 4 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => router.push('/students')}>
                    View All {students.length} {studentDisplayText}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AddStudentDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddStudent={handleAddStudent}
      />
    </>
  )
}
