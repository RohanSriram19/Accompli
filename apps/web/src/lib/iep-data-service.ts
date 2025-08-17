// Service to fetch and transform student IEP data for AI analysis

import { StudentIEPData } from '@/lib/enhanced-ai-service'

// This would typically fetch from your backend API
// For now, using the existing localStorage pattern with enhanced structure

export interface StoredStudent {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gradeLevel: string
  iepStatus: 'active' | 'inactive' | 'pending'
  primaryDisability: string
  additionalInfo: Record<string, any>
  iepGoals?: Array<{
    id: string
    domain: string
    goalText: string
    targetDate: string
    progress: number
    status: string
    notes?: string
  }>
  accommodations?: Record<string, string[]>
  services?: Record<string, string>
  behaviorEvents?: Array<{
    id: string
    date: string
    type: string
    severity: string
    description: string
    antecedent?: string
    consequence?: string
  }>
}

class IEPDataService {
  private getStoredStudents(): StoredStudent[] {
    try {
      const stored = localStorage.getItem('students')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading students:', error)
      return []
    }
  }

  private getBehaviorEvents(studentId: string) {
    try {
      const stored = localStorage.getItem('behaviorEvents')
      const events = stored ? JSON.parse(stored) : []
      return events.filter((event: any) => event.studentId === studentId)
    } catch (error) {
      console.error('Error loading behavior events:', error)
      return []
    }
  }

  async getStudentIEPData(studentId: string): Promise<StudentIEPData | null> {
    const students = this.getStoredStudents()
    const student = students.find(s => s.id === studentId)
    
    if (!student) {
      return null
    }

    // Transform stored data to IEP-aware format
    const iepData: StudentIEPData = {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      grade: student.gradeLevel,
      disability: student.primaryDisability,
      iep: {
        goals: student.iepGoals?.map(goal => ({
          id: goal.id,
          domain: goal.domain,
          goalText: goal.goalText,
          progress: goal.progress,
          targetDate: goal.targetDate,
          status: goal.status
        })) || [],
        accommodations: student.accommodations || {
          testing: ['Extended time', 'Quiet environment'],
          classroom: ['Preferential seating', 'Frequent breaks'],
          assignments: ['Chunked assignments', 'Visual supports']
        },
        services: student.services || {
          'Special Education': '5 hours weekly',
          'Speech Therapy': '2x weekly, 30 min'
        },
        strengths: this.extractStrengths(student),
        needs: this.extractNeeds(student),
        presentLevels: this.generatePresentLevels(student)
      }
    }

    // Add behavior events if available
    const behaviorEvents = this.getBehaviorEvents(studentId)
    if (behaviorEvents.length > 0) {
      iepData.recentBehaviorEvents = behaviorEvents.map((event: any) => ({
        date: event.date,
        type: event.type,
        severity: event.severity,
        description: event.description,
        antecedent: event.antecedent,
        consequence: event.consequence
      }))
    }

    // Add progress data from goal history
    if (student.iepGoals) {
      iepData.progressData = this.generateProgressData(student.iepGoals)
    }

    return iepData
  }

  async getAllStudentsWithIEPData(): Promise<StudentIEPData[]> {
    const students = this.getStoredStudents()
    const iepDataPromises = students.map(student => this.getStudentIEPData(student.id))
    const iepDataArray = await Promise.all(iepDataPromises)
    return iepDataArray.filter(Boolean) as StudentIEPData[]
  }

  private extractStrengths(student: StoredStudent): string[] {
    const strengths = []
    
    // Analyze goal progress to identify strengths
    if (student.iepGoals) {
      const strongDomains = student.iepGoals
        .filter(goal => goal.progress >= 70)
        .map(goal => goal.domain)
      
      if (strongDomains.length > 0) {
        strengths.push(`Strong performance in ${strongDomains.join(', ')}`)
      }
    }

    // Add common strengths based on disability type
    switch (student.primaryDisability.toLowerCase()) {
      case 'autism spectrum disorder':
        strengths.push('Strong memory for details', 'Focused attention on preferred topics')
        break
      case 'learning disability':
        strengths.push('Verbal communication skills', 'Problem-solving creativity')
        break
      case 'adhd':
        strengths.push('High energy and enthusiasm', 'Creative thinking')
        break
      default:
        strengths.push('Eager to learn', 'Responds well to positive reinforcement')
    }

    return strengths.slice(0, 4) // Limit to 4 strengths
  }

  private extractNeeds(student: StoredStudent): string[] {
    const needs = []

    // Analyze goal progress to identify needs
    if (student.iepGoals) {
      const strugglingDomains = student.iepGoals
        .filter(goal => goal.progress < 50)
        .map(goal => goal.domain)
      
      if (strugglingDomains.length > 0) {
        needs.push(`Additional support in ${strugglingDomains.join(', ')}`)
      }
    }

    // Add common needs based on disability type
    switch (student.primaryDisability.toLowerCase()) {
      case 'autism spectrum disorder':
        needs.push('Social communication skills', 'Flexibility with changes in routine')
        break
      case 'learning disability':
        needs.push('Structured learning approach', 'Multi-sensory instruction')
        break
      case 'adhd':
        needs.push('Attention and focus strategies', 'Organization skills')
        break
      default:
        needs.push('Individualized instruction', 'Consistent feedback')
    }

    return needs.slice(0, 4) // Limit to 4 needs
  }

  private generatePresentLevels(student: StoredStudent): string {
    const grade = student.gradeLevel
    const disability = student.primaryDisability
    
    let presentLevels = `${student.firstName} is a ${grade} grade student with ${disability}. `
    
    if (student.iepGoals && student.iepGoals.length > 0) {
      const avgProgress = student.iepGoals.reduce((sum, goal) => sum + goal.progress, 0) / student.iepGoals.length
      
      if (avgProgress >= 70) {
        presentLevels += `Current assessment shows good progress toward IEP goals with an average of ${Math.round(avgProgress)}% completion. `
      } else if (avgProgress >= 40) {
        presentLevels += `Current assessment shows moderate progress toward IEP goals with an average of ${Math.round(avgProgress)}% completion. `
      } else {
        presentLevels += `Current assessment indicates the need for additional support, with an average of ${Math.round(avgProgress)}% completion on IEP goals. `
      }
    }

    presentLevels += `${student.firstName} benefits from structured learning environments and consistent routines.`
    
    return presentLevels
  }

  private generateProgressData(goals: StoredStudent['iepGoals'] = []) {
    // Generate simulated progress data points for demonstration
    // In a real app, this would come from stored progress tracking
    const progressData = []
    const now = new Date()
    
    for (const goal of goals) {
      // Generate 3-5 progress points over the last 60 days
      const numPoints = Math.floor(Math.random() * 3) + 3
      
      for (let i = 0; i < numPoints; i++) {
        const daysAgo = (numPoints - i) * 15 // Every 15 days
        const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
        
        // Simulate progress growth over time
        const progressIncrement = goal.progress / numPoints
        const currentProgress = Math.max(0, progressIncrement * (i + 1) + (Math.random() * 10 - 5))
        
        progressData.push({
          goalId: goal.id,
          date: date.toISOString().split('T')[0],
          progress: Math.min(100, Math.round(currentProgress)),
          notes: this.generateProgressNote(goal.domain, currentProgress)
        })
      }
    }

    return progressData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  private generateProgressNote(domain: string, progress: number): string {
    const notes = {
      'Communication': [
        'Improved eye contact during conversations',
        'Using more complex sentence structures',
        'Initiating conversations with peers',
        'Following multi-step directions better'
      ],
      'Academic - Math': [
        'Solving word problems with visual supports',
        'Demonstrating improved number sense',
        'Using manipulatives effectively',
        'Showing work more consistently'
      ],
      'Academic - Reading': [
        'Increased reading fluency',
        'Better comprehension of grade-level text',
        'Using reading strategies independently',
        'Expanding vocabulary'
      ],
      'Behavioral': [
        'Improved self-regulation strategies',
        'Fewer disruptions during instruction',
        'Using coping strategies when frustrated',
        'Better transitions between activities'
      ],
      'Social Skills': [
        'Participating in group activities',
        'Showing empathy toward peers',
        'Resolving conflicts appropriately',
        'Making appropriate social choices'
      ]
    }

    const domainNotes = notes[domain as keyof typeof notes] || notes['Communication']
    const randomNote = domainNotes[Math.floor(Math.random() * domainNotes.length)]
    
    if (progress >= 80) {
      return `Excellent progress: ${randomNote}`
    } else if (progress >= 60) {
      return `Good improvement: ${randomNote}`
    } else if (progress >= 40) {
      return `Steady progress: ${randomNote}`
    } else {
      return `Needs support: Working on ${randomNote.toLowerCase()}`
    }
  }

  // Method to enhance stored student data with IEP structure
  async enrichStudentData(studentId: string, iepData: Partial<StudentIEPData['iep']>) {
    const students = this.getStoredStudents()
    const studentIndex = students.findIndex(s => s.id === studentId)
    
    if (studentIndex === -1) return

    const student = students[studentIndex]
    
    // Update student with enhanced IEP data
    student.accommodations = iepData.accommodations || student.accommodations
    student.services = iepData.services || student.services
    
    if (iepData.goals) {
      student.iepGoals = iepData.goals.map(goal => ({
        id: goal.id,
        domain: goal.domain,
        goalText: goal.goalText,
        targetDate: goal.targetDate,
        progress: goal.progress,
        status: goal.status
      }))
    }

    // Save back to localStorage
    localStorage.setItem('students', JSON.stringify(students))
  }
}

export const iepDataService = new IEPDataService()
export default iepDataService
