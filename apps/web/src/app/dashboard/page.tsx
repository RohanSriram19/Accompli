'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { iepDataService } from '@/lib/iep-data-service'
import { StudentIEPData } from '@/lib/enhanced-ai-service'
import { DashboardHeader } from '@/components/dashboard/header'
import { StudentList } from '@/components/dashboard/student-list'
import { BehaviorEventFeed } from '@/components/dashboard/behavior-event-feed'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { SimpleResearchChatbot } from '@/components/simple-research-chatbot'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [allStudentData, setAllStudentData] = useState<StudentIEPData[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in')
    } else {
      // Load all student data for dashboard-level AI assistance
      loadStudentData()
    }
  }, [isAuthenticated, router])

  const loadStudentData = async () => {
    try {
      const students = await iepDataService.getAllStudentsWithIEPData()
      setAllStudentData(students)
    } catch (error) {
      console.error('Error loading student data:', error)
    }
  }

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-600">
            {user.role === 'TEACHER' && "Manage your students and track their progress"}
            {user.role === 'AIDE' && "Log behavior events and support your students"}
            {user.role === 'ADMIN' && "Oversee programs and generate reports"}
            {user.role === 'PARENT' && "Stay connected with your child's IEP progress and team"}
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <QuickActions userRole={user.role} />
            
            {/* Student List - Show for Teachers and Admins */}
            {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
              <StudentList />
            )}
            
            {/* Parent's Children - Show for Parents */}
            {user.role === 'PARENT' && (
              <StudentList />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Behavior Event Feed */}
            <BehaviorEventFeed />
          </div>
        </div>
      </main>
      
      {/* Research-Aware AI Chatbot - Always visible */}
      <SimpleResearchChatbot />
    </div>
  )
}
