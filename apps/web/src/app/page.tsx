'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/auth-store'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Accompli
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering educators with tools for IEP management, behavior tracking, 
            and progress monitoring in special education.
          </p>
        </header>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>IEP Management</CardTitle>
              <CardDescription>
                View and manage Individual Education Plans with goals and accommodations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Track student goals and progress</li>
                <li>• Manage accommodations and services</li>
                <li>• Generate compliant reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Behavior Tracking</CardTitle>
              <CardDescription>
                Real-time ABC behavior logging with offline support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Log antecedent-behavior-consequence events</li>
                <li>• Real-time updates across devices</li>
                <li>• Offline-first mobile app</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Planning</CardTitle>
              <CardDescription>
                Create lessons aligned to IEP goals with evidence collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• IEP-aligned lesson objectives</li>
                <li>• Scaffold and resource management</li>
                <li>• Evidence and file attachments</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/sign-in">Get Started</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
