'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/lib/auth-store'
import { Plus, FileText, AlertCircle, Users, BarChart3 } from 'lucide-react'

interface QuickActionsProps {
  userRole: UserRole
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const getActions = () => {
    switch (userRole) {
      case 'TEACHER':
        return [
          {
            title: "New Lesson Plan",
            description: "Create an IEP-aligned lesson",
            icon: Plus,
            action: () => console.log('Create lesson plan'),
            color: "bg-blue-600 hover:bg-blue-700"
          },
          {
            title: "Generate Report",
            description: "Create progress reports",
            icon: FileText,
            action: () => console.log('Generate report'),
            color: "bg-green-600 hover:bg-green-700"
          },
          {
            title: "View All Students",
            description: "Manage student profiles",
            icon: Users,
            action: () => window.location.href = '/students',
            color: "bg-purple-600 hover:bg-purple-700"
          }
        ]
      case 'AIDE':
        return [
          {
            title: "Log Behavior Event",
            description: "Quick ABC event logging",
            icon: AlertCircle,
            action: () => console.log('Log behavior'),
            color: "bg-orange-600 hover:bg-orange-700"
          },
          {
            title: "View Student Plans",
            description: "Check today's lesson plans",
            icon: FileText,
            action: () => console.log('View plans'),
            color: "bg-blue-600 hover:bg-blue-700"
          }
        ]
      case 'ADMIN':
        return [
          {
            title: "Analytics Dashboard",
            description: "View program metrics",
            icon: BarChart3,
            action: () => console.log('View analytics'),
            color: "bg-purple-600 hover:bg-purple-700"
          },
          {
            title: "Generate Reports",
            description: "System-wide reporting",
            icon: FileText,
            action: () => console.log('Generate reports'),
            color: "bg-green-600 hover:bg-green-700"
          },
          {
            title: "Manage Users",
            description: "User and org management",
            icon: Users,
            action: () => console.log('Manage users'),
            color: "bg-blue-600 hover:bg-blue-700"
          }
        ]
      default:
        return []
    }
  }

  const actions = getActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
                onClick={action.action}
              >
                <div className={`p-2 rounded-md ${action.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
