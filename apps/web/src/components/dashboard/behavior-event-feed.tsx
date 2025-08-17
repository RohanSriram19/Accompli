'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, User, Eye, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

interface BehaviorEvent {
  id: string
  student_name: string
  behavior: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  created_by: string
}

export function BehaviorEventFeed() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [events, setEvents] = useState<BehaviorEvent[]>([])
  const [showingExamples, setShowingExamples] = useState(false)
  
  // Check if this is a demo account
  const isDemoAccount = user?.email?.includes('@demo.com') || false

  // Auto-load examples for demo accounts
  useEffect(() => {
    if (isDemoAccount && events.length === 0) {
      // Automatically load examples for demo accounts
      if (user?.role === 'PARENT') {
        // For parents, show limited events related to their child
        setEvents([exampleEvents[1]]) // Emma Johnson event
        setShowingExamples(true)
      } else {
        // For teachers/aides/admins, show all recent events
        setEvents(exampleEvents)
        setShowingExamples(true)
      }
    }
  }, [isDemoAccount, user?.role, events.length])
  
  // Example data
  const exampleEvents: BehaviorEvent[] = [
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

  const loadExamples = () => {
    setEvents(exampleEvents)
    setShowingExamples(true)
  }

  const clearEvents = () => {
    setEvents([])
    setShowingExamples(false)
  }

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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Recent Events</span>
          </CardTitle>
          {events.length === 0 && (
            <Button variant="outline" size="sm" onClick={loadExamples}>
              <Eye className="h-4 w-4 mr-1" />
              Examples
            </Button>
          )}
          {showingExamples && (
            <Button variant="outline" size="sm" onClick={clearEvents}>
              Clear Examples
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No recent behavior events</p>
            <p className="text-sm text-gray-500 mt-1">
              Events will appear here when logged or you can view examples
            </p>
            <Button variant="outline" className="mt-4" onClick={loadExamples}>
              <Eye className="h-4 w-4 mr-2" />
              View Examples
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
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
        )}
        
        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => router.push('/log-behavior')}
            >
              View all events →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
