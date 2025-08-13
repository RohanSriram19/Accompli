'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useRequireAuth } from '@/lib/use-require-auth'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Download, Calendar, Users, TrendingUp, 
  Target, AlertTriangle, BarChart3, PieChart, Filter 
} from 'lucide-react'

export default function ReportsPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [selectedReport, setSelectedReport] = useState('progress-summary')
  const [dateRange, setDateRange] = useState('current-quarter')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  // Require authentication
  const { isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const reportTypes = [
    {
      id: 'progress-summary',
      name: 'IEP Progress Summary',
      description: 'Quarterly progress reports for all IEP goals',
      icon: TrendingUp,
      frequency: 'Quarterly',
      compliance: 'Required'
    },
    {
      id: 'behavior-analytics',
      name: 'Behavior Analytics',
      description: 'ABC data trends and intervention effectiveness',
      icon: BarChart3,
      frequency: 'Monthly',
      compliance: 'Recommended'
    },
    {
      id: 'service-delivery',
      name: 'Service Delivery Report',
      description: 'Documentation of special education minutes provided',
      icon: FileText,
      frequency: 'Monthly',
      compliance: 'Required'
    },
    {
      id: 'goal-mastery',
      name: 'Goal Mastery Analysis',
      description: 'Students approaching goal mastery and next steps',
      icon: Target,
      frequency: 'Bi-weekly',
      compliance: 'Recommended'
    },
    {
      id: 'compliance-audit',
      name: 'Compliance Audit',
      description: 'IEP timeline compliance and required documentation',
      icon: AlertTriangle,
      frequency: 'Annual',
      compliance: 'Required'
    },
    {
      id: 'assessment-summary',
      name: 'Assessment Summary',
      description: 'Standardized and curriculum-based assessment results',
      icon: PieChart,
      frequency: 'Tri-annual',
      compliance: 'Required'
    }
  ]

  const students = [
    { id: '1', name: 'Emma Johnson', grade: '3rd', goals_count: 3, progress_avg: 75 },
    { id: '2', name: 'Marcus Williams', grade: '11th', goals_count: 4, progress_avg: 85 },
    { id: '3', name: 'Sophia Chen', grade: '5th', goals_count: 3, progress_avg: 60 },
    { id: '4', name: 'Tyler Brown', grade: '4th', goals_count: 5, progress_avg: 45 }
  ]

  const sampleProgressData = {
    summary: {
      total_students: 24,
      goals_on_track: 65,
      goals_needs_attention: 12,
      goals_at_risk: 8,
      avg_progress: 72
    },
    by_area: [
      { area: 'Reading', students: 18, avg_progress: 78, on_track: 14, needs_attention: 3, at_risk: 1 },
      { area: 'Math', students: 15, avg_progress: 71, on_track: 11, needs_attention: 3, at_risk: 1 },
      { area: 'Writing', students: 12, avg_progress: 65, on_track: 8, needs_attention: 3, at_risk: 1 },
      { area: 'Behavior', students: 8, avg_progress: 68, on_track: 5, needs_attention: 2, at_risk: 1 },
      { area: 'Communication', students: 6, avg_progress: 82, on_track: 5, needs_attention: 1, at_risk: 0 }
    ]
  }

  const generateReport = () => {
    // Mock report generation
    const reportData = {
      type: selectedReport,
      date_range: dateRange,
      students: selectedStudents.length || students.length,
      generated_at: new Date().toISOString(),
      data: sampleProgressData
    }
    
    console.log('Generating report:', reportData)
    alert('Report generated successfully! (This is a demo - real implementation would generate PDF/Excel)')
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>IEP Reports & Analytics</span>
          </h1>
          <p className="text-gray-600">Generate compliance reports and analyze student progress data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Report Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Report Type Selection */}
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <div className="mt-2 space-y-2">
                    {reportTypes.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => setSelectedReport(report.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedReport === report.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <report.icon className="h-5 w-5 text-gray-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{report.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {report.frequency}
                              </Badge>
                              <Badge 
                                variant={report.compliance === 'Required' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {report.compliance}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <select
                    id="date-range"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="current-quarter">Current Quarter</option>
                    <option value="previous-quarter">Previous Quarter</option>
                    <option value="current-year">Current School Year</option>
                    <option value="previous-year">Previous School Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {/* Student Selection */}
                <div>
                  <Label>Students to Include</Label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={selectedStudents.length === 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([])
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">All Students ({students.length})</span>
                    </label>
                    {students.map((student) => (
                      <label key={student.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id])
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{student.name} - Grade {student.grade}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={generateReport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-xl font-bold text-gray-900">{sampleProgressData.summary.total_students}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                      <p className="text-xl font-bold text-gray-900">{sampleProgressData.summary.avg_progress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Target className="h-6 w-6 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">On Track</p>
                      <p className="text-xl font-bold text-gray-900">{sampleProgressData.summary.goals_on_track}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">At Risk</p>
                      <p className="text-xl font-bold text-gray-900">{sampleProgressData.summary.goals_at_risk}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress by Area */}
            <Card>
              <CardHeader>
                <CardTitle>Progress by IEP Goal Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleProgressData.by_area.map((area) => (
                    <div key={area.area} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{area.area}</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">{area.students} students</span>
                          <span className={`font-medium ${getProgressColor(area.avg_progress)}`}>
                            {area.avg_progress}% avg
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div className="bg-green-50 rounded p-2">
                          <p className="font-medium text-green-700">{area.on_track}</p>
                          <p className="text-green-600">On Track</p>
                        </div>
                        <div className="bg-yellow-50 rounded p-2">
                          <p className="font-medium text-yellow-700">{area.needs_attention}</p>
                          <p className="text-yellow-600">Needs Attention</p>
                        </div>
                        <div className="bg-red-50 rounded p-2">
                          <p className="font-medium text-red-700">{area.at_risk}</p>
                          <p className="text-red-600">At Risk</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(area.on_track / area.students) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Student Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Student</th>
                        <th className="text-left p-2">Grade</th>
                        <th className="text-center p-2">Active Goals</th>
                        <th className="text-center p-2">Avg Progress</th>
                        <th className="text-center p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{student.name}</td>
                          <td className="p-2">{student.grade}</td>
                          <td className="p-2 text-center">{student.goals_count}</td>
                          <td className="p-2 text-center">
                            <span className={`font-medium ${getProgressColor(student.progress_avg)}`}>
                              {student.progress_avg}%
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            <Badge 
                              variant={
                                student.progress_avg >= 80 ? 'default' :
                                student.progress_avg >= 60 ? 'secondary' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {student.progress_avg >= 80 ? 'On Track' :
                               student.progress_avg >= 60 ? 'Needs Attention' : 'At Risk'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
