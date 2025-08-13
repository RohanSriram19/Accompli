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
import { 
  BookOpen, Save, X, Plus, Target, Users, Clock, 
  AlignLeft, CheckSquare, Star, AlertCircle, Info 
} from 'lucide-react'

interface Student {
  id: string
  name: string
  grade: string
  goals: string[]
}

interface Activity {
  step: number
  activity: string
  duration: number
  type: string
}

interface FormData {
  title: string
  subject: string
  grade: string
  duration: number
  description: string
  objectives: string[]
  materials: string[]
  activities: Activity[]
  assessment: string
  accommodations: string[]
  standards: string[]
  iep_goals: string[]
  target_students: string[]
  notes: string
}

export default function NewLessonPlanPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  
  // Require authentication
  const { isLoading } = useRequireAuth()

  const [formData, setFormData] = useState<FormData>({
    title: '',
    subject: '',
    grade: '',
    duration: 30,
    description: '',
    objectives: [''],
    materials: [''],
    activities: [{ step: 1, activity: '', duration: 10, type: 'instruction' }],
    assessment: '',
    accommodations: [''],
    standards: [''],
    iep_goals: [],
    target_students: [],
    notes: ''
  })

  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const [availableGoals, setAvailableGoals] = useState<string[]>([])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Mock data for students and IEP goals
  const students: Student[] = [
    { id: '1', name: 'Emma Johnson', grade: '3rd', goals: ['Reading Fluency', 'Reading Comprehension', 'Written Expression'] },
    { id: '2', name: 'Tyler Brown', grade: '3rd', goals: ['Math Problem Solving', 'Social Communication', 'Behavioral Regulation'] },
    { id: '3', name: 'Sophia Chen', grade: '4th', goals: ['Math Computation', 'Organization Skills', 'Reading Comprehension'] },
    { id: '4', name: 'Marcus Williams', grade: '11th', goals: ['Transition Planning', 'Communication Skills', 'Social Communication'] }
  ]

  const allIepGoals = [
    'Reading Fluency', 'Reading Comprehension', 'Written Expression', 'Math Problem Solving',
    'Math Computation', 'Social Communication', 'Behavioral Regulation', 'Organization Skills',
    'Transition Planning', 'Communication Skills', 'Self-Advocacy', 'Daily Living Skills',
    'Motor Skills', 'Sensory Processing'
  ]

  const subjects = ['Reading', 'Math', 'Writing', 'Science', 'Social Studies', 'Social Skills', 'Transition', 'Art', 'Music', 'PE']
  const grades = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']
  const activityTypes = ['instruction', 'practice', 'assessment', 'discussion', 'independent', 'group']

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayInputChange = (field: keyof FormData, index: number, value: string) => {
    if (field === 'objectives' || field === 'materials' || field === 'accommodations' || field === 'standards' || field === 'iep_goals' || field === 'target_students') {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
      }))
    }
  }

  const addArrayItem = (field: keyof FormData, defaultValue = '') => {
    if (field === 'objectives' || field === 'materials' || field === 'accommodations' || field === 'standards') {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), defaultValue]
      }))
    }
  }

  const removeArrayItem = (field: keyof FormData, index: number) => {
    if (field === 'objectives' || field === 'materials' || field === 'accommodations' || field === 'standards') {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index)
      }))
    }
  }

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, {
        step: prev.activities.length + 1,
        activity: '',
        duration: 10,
        type: 'instruction'
      }]
    }))
  }

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index).map((activity, i) => ({
        ...activity,
        step: i + 1
      }))
    }))
  }

  const handleStudentSelection = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (!student) return
    
    if (selectedStudents.find(s => s.id === studentId)) {
      setSelectedStudents(prev => prev.filter(s => s.id !== studentId))
      setAvailableGoals(prev => prev.filter(goal => !student.goals.includes(goal)))
    } else {
      setSelectedStudents(prev => [...prev, student])
      setAvailableGoals(prev => Array.from(new Set([...prev, ...student.goals])))
    }
  }

  const handleGoalToggle = (goal: string) => {
    if (formData.iep_goals.includes(goal)) {
      setFormData(prev => ({
        ...prev,
        iep_goals: prev.iep_goals.filter(g => g !== goal)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        iep_goals: [...prev.iep_goals, goal]
      }))
    }
  }

  const handleSave = (isDraft = false) => {
    console.log('Saving lesson plan:', { ...formData, status: isDraft ? 'draft' : 'active' })
    // Here you would typically send to your API
    router.push('/lesson-plans')
  }

  const totalDuration = formData.activities.reduce((sum, activity) => sum + activity.duration, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span>Create New IEP-Aligned Lesson Plan</span>
              </h1>
              <p className="text-gray-600">Design a lesson plan tailored to your students' IEP goals</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => router.push('/lesson-plans')}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button variant="outline" onClick={() => handleSave(true)}>
                Save Draft
              </Button>
              <Button onClick={() => handleSave(false)}>
                <Save className="h-4 w-4 mr-2" />
                Save & Activate
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Lesson Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter lesson title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="grade">Grade Level *</Label>
                  <select
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="5"
                    max="120"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Lesson Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of what this lesson covers"
                  rows={3}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Target Students & IEP Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>Target Students & IEP Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Students</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {students.map(student => (
                    <div
                      key={student.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedStudents.find(s => s.id === student.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => handleStudentSelection(student.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">Grade {student.grade}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{student.goals.length} goals</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {availableGoals.length > 0 && (
                <div>
                  <Label>Available IEP Goals (from selected students)</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableGoals.map(goal => (
                      <Badge
                        key={goal}
                        variant={formData.iep_goals.includes(goal) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleGoalToggle(goal)}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={objective}
                    onChange={(e) => handleArrayInputChange('objectives', index, e.target.value)}
                    placeholder="Enter learning objective"
                    className="flex-1"
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('objectives', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('objectives')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Objective
              </Button>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lesson Activities</span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Total: {totalDuration} min
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.activities.map((activity, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Step {activity.step}</h4>
                    {formData.activities.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <Label>Activity Description</Label>
                      <textarea
                        value={activity.activity}
                        onChange={(e) => {
                          const newActivities = [...formData.activities]
                          newActivities[index].activity = e.target.value
                          setFormData(prev => ({ ...prev, activities: newActivities }))
                        }}
                        placeholder="Describe the activity"
                        rows={2}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Duration (min)</Label>
                        <Input
                          type="number"
                          value={activity.duration}
                          onChange={(e) => {
                            const newActivities = [...formData.activities]
                            newActivities[index].duration = parseInt(e.target.value) || 0
                            setFormData(prev => ({ ...prev, activities: newActivities }))
                          }}
                          min="1"
                          max="60"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Type</Label>
                        <select
                          value={activity.type}
                          onChange={(e) => {
                            const newActivities = [...formData.activities]
                            newActivities[index].type = e.target.value
                            setFormData(prev => ({ ...prev, activities: newActivities }))
                          }}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {activityTypes.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addActivity}>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>

          {/* Materials & Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Materials & Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={material}
                    onChange={(e) => handleArrayInputChange('materials', index, e.target.value)}
                    placeholder="Enter material or resource needed"
                    className="flex-1"
                  />
                  {formData.materials.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('materials', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('materials')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </CardContent>
          </Card>

          {/* Accommodations */}
          <Card>
            <CardHeader>
              <CardTitle>IEP Accommodations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.accommodations.map((accommodation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={accommodation}
                    onChange={(e) => handleArrayInputChange('accommodations', index, e.target.value)}
                    placeholder="Enter accommodation"
                    className="flex-1"
                  />
                  {formData.accommodations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('accommodations', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('accommodations')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Accommodation
              </Button>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment & Progress Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="assessment">How will you assess student progress toward IEP goals?</Label>
              <textarea
                id="assessment"
                value={formData.assessment}
                onChange={(e) => handleInputChange('assessment', e.target.value)}
                placeholder="Describe assessment methods, criteria for success, data collection procedures..."
                rows={4}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </CardContent>
          </Card>

          {/* Standards Alignment */}
          <Card>
            <CardHeader>
              <CardTitle>Standards Alignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.standards.map((standard, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={standard}
                    onChange={(e) => handleArrayInputChange('standards', index, e.target.value)}
                    placeholder="Enter relevant academic standard (e.g., CCSS.ELA-LITERACY.RL.3.2)"
                    className="flex-1"
                  />
                  {formData.standards.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('standards', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('standards')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Standard
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes">Notes for Implementation</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes, modifications, or considerations..."
                rows={3}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </CardContent>
          </Card>

          {/* Summary Card */}
          {(formData.title || selectedStudents.length > 0 || formData.iep_goals.length > 0) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>Lesson Plan Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Title:</strong> {formData.title || 'Untitled Lesson'}</p>
                    <p><strong>Subject:</strong> {formData.subject || 'Not specified'}</p>
                    <p><strong>Duration:</strong> {formData.duration} minutes</p>
                  </div>
                  <div>
                    <p><strong>Students:</strong> {selectedStudents.length} selected</p>
                    <p><strong>IEP Goals:</strong> {formData.iep_goals.length} aligned</p>
                    <p><strong>Activities:</strong> {formData.activities.length} steps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pb-8">
          <Button variant="outline" onClick={() => router.push('/lesson-plans')}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave(true)}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSave(false)}>
            <Save className="h-4 w-4 mr-2" />
            Save & Activate
          </Button>
        </div>
      </main>
    </div>
  )
}
