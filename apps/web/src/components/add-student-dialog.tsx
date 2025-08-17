'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import { Student, studentStorage } from '@/lib/student-storage'
import { useAuthStore } from '@/lib/auth-store'

interface AddStudentDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddStudent: (student: Student) => void
}

export function AddStudentDialog({ isOpen, onClose, onAddStudent }: AddStudentDialogProps) {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    grade: '',
    disability: '',
    placement: '',
    priority_goals: ''
  })

  console.log('AddStudentDialog isOpen:', isOpen) // Debug log

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      console.error('No user ID available')
      return
    }

    const studentData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      grade: formData.grade,
      disability: formData.disability,
      iep_status: 'active' as const,
      last_review: new Date().toISOString().split('T')[0],
      next_review: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals_progress: 0,
      recent_behaviors: 0,
      placement: formData.placement,
      priority_goals: formData.priority_goals.split(',').map(goal => goal.trim()).filter(goal => goal)
    }

    // Save to persistent storage
    const newStudent = studentStorage.addStudent(studentData, user.id)
    
    // Call the parent callback
    onAddStudent(newStudent)
    
    // Reset form
    setFormData({
      first_name: '',
      last_name: '',
      grade: '',
      disability: '',
      placement: '',
      priority_goals: ''
    })
    
    onClose()
  }

  const gradeOptions = [
    'Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', 
    '7th', '8th', '9th', '10th', '11th', '12th'
  ]

  const disabilityOptions = [
    'Specific Learning Disability',
    'Autism Spectrum Disorder',
    'Other Health Impairment (ADHD)',
    'Emotional Disturbance',
    'Intellectual Disability',
    'Multiple Disabilities',
    'Hearing Impairment',
    'Visual Impairment',
    'Speech or Language Impairment',
    'Orthopedic Impairment',
    'Traumatic Brain Injury',
    'Deaf-Blindness',
    'Developmental Delay'
  ]

  const placementOptions = [
    'General Ed with Accommodations',
    'General Ed with Support',
    'Resource Room (20%)',
    'Resource Room (40%)',
    'Resource Room (60%)',
    'Special Education Class',
    'Separate School',
    'Homebound/Hospital'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>Add a child to your caseload or family</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disability">Primary Disability</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, disability: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select disability category" />
                </SelectTrigger>
                <SelectContent>
                  {disabilityOptions.map((disability) => (
                    <SelectItem key={disability} value={disability}>
                      {disability}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placement">Educational Placement</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, placement: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  {placementOptions.map((placement) => (
                    <SelectItem key={placement} value={placement}>
                      {placement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority_goals">Priority IEP Goals</Label>
              <Input
                id="priority_goals"
                placeholder="e.g., Reading Fluency, Math Computation, Social Skills (comma-separated)"
                value={formData.priority_goals}
                onChange={(e) => setFormData(prev => ({ ...prev, priority_goals: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                Enter goals separated by commas
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
