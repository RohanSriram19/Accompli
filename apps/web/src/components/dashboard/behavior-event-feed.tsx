'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, User } from 'lucide-react'

interface BehaviorEvent {
  id: string
  student_name: string
  behavior: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  created_by: string
}

export function BehaviorEventFeed() {
  // Mock data - replace with real API calls
  const recentEvents: BehaviorEvent[] = [
    {
      id: '1',
      student_name: 'Tyler Brown',
      behavior: 'Verbal protest during transition',
      severity: 'medium',
      timestamp: '15 minutes ago',
      created_by: 'Mike Chen'
    },
    {
      id: '2',
      student_name: 'Emma Johnson',
      behavior: 'Completed task independently',
      severity: 'low',
      timestamp: '1 hour ago',
      created_by: 'Sarah Johnson'
    },
    {
      id: '3',
      student_name: 'Sophia Chen',
      behavior: 'Requested break appropriately',
      severity: 'low',
      timestamp: '2 hours ago',
      created_by: 'Mike Chen'
    },
    {
      id: '4',
      student_name: 'Marcus Williams',
      behavior: 'Physical aggression during group work',
      severity: 'high',
      timestamp: '3 hours ago',
      created_by: 'Sarah Johnson'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-orange-100 text-orange-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'high' || severity === 'medium') {
      return <AlertTriangle className="h-3 w-3" />
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Recent Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEvents.map((event) => (
            <div
              key={event.id}
              className="border-l-4 border-gray-200 pl-4 pb-4 last:pb-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{event.student_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{event.behavior}</p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getSeverityColor(event.severity)}`}
                    >
                      {getSeverityIcon(event.severity)}
                      <span className="ml-1 capitalize">{event.severity}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{event.created_by}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View all events →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
