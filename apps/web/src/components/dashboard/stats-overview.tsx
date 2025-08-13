'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react'

export function StatsOverview() {
  // Mock data - replace with real API calls
  const stats = [
    {
      title: "Active Students",
      value: "24",
      change: "+2 this week",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Behavior Events",
      value: "8",
      change: "Today",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      title: "Lesson Plans",
      value: "12",
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
