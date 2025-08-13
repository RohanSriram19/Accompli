'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore, UserRole } from '@/lib/auth-store'
import { BookOpen, Users, Shield } from 'lucide-react'

interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole | ''
  organizationName: string
  organizationCode?: string
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    organizationName: '',
    organizationCode: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // Multi-step form
  
  const router = useRouter()
  const { signIn } = useAuthStore()

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.role) {
      setError('Please select your role')
      return false
    }
    if (!formData.organizationName.trim()) {
      setError('Please enter your organization name')
      return false
    }
    if (formData.role !== 'ADMIN' && !formData.organizationCode?.trim()) {
      setError('Please enter your organization code (provided by your administrator)')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError('')
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateStep2()) {
      return
    }

    setIsLoading(true)

    try {
      // Mock signup process - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

      // Generate mock user
      const newUser = {
        id: `user-${Date.now()}`,
        email: formData.email,
        role: formData.role as UserRole,
        first_name: formData.firstName,
        last_name: formData.lastName,
        org_id: formData.role === 'ADMIN' ? `org-${Date.now()}` : 'org-1',
        created_at: new Date().toISOString(),
      }

      await signIn(newUser, 'mock-signup-token')
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions = [
    {
      value: 'TEACHER' as UserRole,
      label: 'Special Education Teacher',
      description: 'Create IEPs, lesson plans, and track student progress',
      icon: BookOpen
    },
    {
      value: 'AIDE' as UserRole,
      label: 'Teacher Aide/Paraprofessional',
      description: 'Log behavior data and assist with student support',
      icon: Users
    },
    {
      value: 'ADMIN' as UserRole,
      label: 'Administrator/Principal',
      description: 'Manage organization settings and oversee programs',
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
          <CardDescription className="text-center">
            {step === 1 
              ? 'Start your journey with Accompli - Special Education Made Simple' 
              : 'Tell us about your role and organization'
            }
          </CardDescription>
          <div className="flex justify-center space-x-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Sarah"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Johnson"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah.johnson@school.edu"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password (8+ characters)"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">What's your role?</Label>
                {roleOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <div
                      key={option.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.role === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, role: option.value }))}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.role === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.role === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">
                    {formData.role === 'ADMIN' ? 'School/Organization Name' : 'Your School/Organization'}
                  </Label>
                  <Input
                    id="organizationName"
                    placeholder="Lincoln Elementary School"
                    value={formData.organizationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                    required
                  />
                </div>

                {formData.role !== 'ADMIN' && (
                  <div className="space-y-2">
                    <Label htmlFor="organizationCode">Organization Code</Label>
                    <Input
                      id="organizationCode"
                      placeholder="Enter code provided by your administrator"
                      value={formData.organizationCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, organizationCode: e.target.value }))}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Contact your administrator if you don't have this code
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>

          {step === 1 && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <p className="text-sm font-medium text-green-900 mb-2">FERPA Compliant & Secure</p>
              <p className="text-xs text-green-700">
                Your data is protected with enterprise-grade security and complies with all 
                student privacy regulations including FERPA and COPPA.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
