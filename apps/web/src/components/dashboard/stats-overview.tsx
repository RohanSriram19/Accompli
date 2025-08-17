'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'

export function StatsOverview() {
  const { user } = useAuthStore()
  
  // Check if this is a demo account or a real account
  const isDemoAccount = user?.email?.includes('@demo.com') || false
  
  // Demo data for demo accounts, empty data for real accounts
  const stats = isDemoAccount ? [
    {
      title: user?.role === 'PARENT' ? "Active Students" : "Active Students",
      value: user?.role === 'PARENT' ? "1" : "24",
      change: user?.role === 'PARENT' ? "Your child" : "+2 this week",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Behavior Events",
      value: user?.role === 'PARENT' ? "3" : "8",
      change: "Today",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      title: "Lesson Plans",
      value: user?.role === 'PARENT' ? "5" : "12",
      change: "Active",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Weekly Progress",
      value: "85%",
      change: "+5% from last week",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ] : [
    // Real accounts start with empty data
    {
      title: user?.role === 'PARENT' ? "Active Students" : "Active Students",
      value: "0",
      change: user?.role === 'PARENT' ? "Add your child" : "Add students to get started",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Behavior Events",
      value: "0",
      change: "No events yet",
      icon: AlertTriangle,
      color: "text-gray-400"
    },
    {
      title: "Lesson Plans",
      value: "0",
      change: "None created",
      icon: BookOpen,
      color: "text-gray-400"
    },
    {
      title: "Weekly Progress",
      value: "0%",
      change: "Start tracking progress",
      icon: TrendingUp,
      color: "text-gray-400"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
