'use client'

interface Student {
  id: string
  first_name?: string
  last_name?: string
  name?: string // For example data compatibility
  grade: string
  age?: number
  disability?: string
  disability_category?: string
  iep_status: string
  last_review?: string
  last_iep_date?: string
  next_review: string
  goals_progress?: number
  goals_count?: number
  goals_on_track?: number
  recent_behaviors?: number
  recent_behavior_events?: number
  placement?: string
  priority_goals?: string[]
  reading_level?: string
  transition_focus?: string
  behavior_plan?: boolean
  crisis_plan?: boolean
  teacher?: string
  present_levels?: {
    reading?: string
    math?: string
    behavior?: string
  }
  photo?: string | null
  user_id: string // Associate student with user
  created_at: string
}

class StudentStorage {
  private storageKey = 'accompli-students'

  // Get all students from localStorage
  private getStoredStudents(): Student[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Save students to localStorage
  private saveStudents(students: Student[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(students))
    } catch (error) {
      console.error('Failed to save students:', error)
    }
  }

  // Get students for a specific user
  getStudentsForUser(userId: string): Student[] {
    const allStudents = this.getStoredStudents()
    return allStudents.filter(student => student.user_id === userId)
  }

  // Add a new student
  addStudent(studentData: Omit<Student, 'id' | 'created_at' | 'user_id'>, userId: string): Student {
    const students = this.getStoredStudents()
    
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    students.push(newStudent)
    this.saveStudents(students)
    
    return newStudent
  }

  // Update a student
  updateStudent(studentId: string, updates: Partial<Student>): Student | null {
    const students = this.getStoredStudents()
    const studentIndex = students.findIndex(s => s.id === studentId)
    
    if (studentIndex === -1) return null
    
    students[studentIndex] = { ...students[studentIndex], ...updates }
    this.saveStudents(students)
    
    return students[studentIndex]
  }

  // Delete a student
  deleteStudent(studentId: string): boolean {
    const students = this.getStoredStudents()
    const filteredStudents = students.filter(s => s.id !== studentId)
    
    if (filteredStudents.length === students.length) return false
    
    this.saveStudents(filteredStudents)
    return true
  }

  // Get student by ID
  getStudentById(studentId: string): Student | null {
    const students = this.getStoredStudents()
    return students.find(s => s.id === studentId) || null
  }

  // Initialize demo students for demo accounts
  initializeDemoStudents(userId: string): void {
    const existingStudents = this.getStudentsForUser(userId)
    
    if (existingStudents.length === 0) {
      const demoStudents: Omit<Student, 'id' | 'created_at' | 'user_id'>[] = [
        {
          first_name: 'Emma',
          last_name: 'Johnson',
          grade: '3rd',
          disability: 'Specific Learning Disability',
          iep_status: 'active',
          last_review: '2024-09-15',
          next_review: '2025-09-15',
          goals_progress: 75,
          recent_behaviors: 2,
          placement: 'General Ed with Support',
          reading_level: '2.5',
          priority_goals: ['Reading Fluency', 'Reading Comprehension'],
          behavior_plan: false,
          crisis_plan: false
        },
        {
          first_name: 'Tyler',
          last_name: 'Brown',
          grade: '5th',
          disability: 'Autism Spectrum Disorder',
          iep_status: 'active',
          last_review: '2024-08-20',
          next_review: '2025-08-20',
          goals_progress: 82,
          recent_behaviors: 1,
          placement: 'Resource Room (40%)',
          priority_goals: ['Math Problem Solving', 'Social Communication'],
          behavior_plan: true,
          crisis_plan: false
        },
        {
          first_name: 'Sophia',
          last_name: 'Chen',
          grade: '2nd',
          disability: 'Other Health Impairment (ADHD)',
          iep_status: 'active',
          last_review: '2024-10-05',
          next_review: '2025-10-05',
          goals_progress: 45,
          recent_behaviors: 5,
          placement: 'General Ed with Accommodations',
          priority_goals: ['Math Computation', 'Attention Skills'],
          behavior_plan: true,
          crisis_plan: false
        },
        {
          first_name: 'Marcus',
          last_name: 'Williams',
          grade: '12th',
          disability: 'Intellectual Disability',
          iep_status: 'active',
          last_review: '2024-11-10',
          next_review: '2025-11-10',
          goals_progress: 88,
          recent_behaviors: 0,
          placement: 'Special Education Class',
          transition_focus: 'Job Skills',
          priority_goals: ['Transition Planning', 'Independent Living'],
          behavior_plan: false,
          crisis_plan: false
        }
      ]

      demoStudents.forEach(student => {
        this.addStudent(student, userId)
      })
    }
  }

  // Clear all students for a user (for testing)
  clearStudentsForUser(userId: string): void {
    const allStudents = this.getStoredStudents()
    const filteredStudents = allStudents.filter(s => s.user_id !== userId)
    this.saveStudents(filteredStudents)
  }
}

export const studentStorage = new StudentStorage()
export type { Student }
