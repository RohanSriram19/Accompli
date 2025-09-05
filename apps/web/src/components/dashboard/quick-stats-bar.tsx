'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, Users, TrendingUp } from 'lucide-react'

interface QuickStat {
  label: string
  value: string
  icon: React.ReactNode
  trend?: string
  color: string
}

export function QuickStatsBar() {
  const stats: QuickStat[] = [
    {
      label: 'Active Students',
      value: '24',
      icon: <Users className="h-4 w-4" />,
      trend: '+2 this week',
      color: 'text-blue-600'
    },
    {
      label: 'Today\'s Sessions',
      value: '8',
      icon: <Calendar className="h-4 w-4" />,
      trend: '3 completed',
      color: 'text-green-600'
    },
    {
      label: 'Avg. Progress',
      value: '87%',
      icon: <TrendingUp className="h-4 w-4" />,
      trend: '+5% this month',
      color: 'text-purple-600'
    },
    {
      label: 'Time Today',
      value: '4.2h',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              {stat.trend && (
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              )}
            </div>
            <div className={`${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
