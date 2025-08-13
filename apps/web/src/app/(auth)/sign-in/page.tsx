'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/auth-store'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { signIn } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Mock authentication - replace with real API call
      if (email && password) {
        // Demo users for different roles
        let user
        if (email === 'teacher@demo.com') {
          user = {
            id: '1',
            email: 'teacher@demo.com',
            role: 'TEACHER' as const,
            first_name: 'Sarah',
            last_name: 'Johnson',
            org_id: 'org-1',
            created_at: new Date().toISOString(),
          }
        } else if (email === 'aide@demo.com') {
          user = {
            id: '2',
            email: 'aide@demo.com',
            role: 'AIDE' as const,
            first_name: 'Mike',
            last_name: 'Chen',
            org_id: 'org-1',
            created_at: new Date().toISOString(),
          }
        } else if (email === 'admin@demo.com') {
          user = {
            id: '3',
            email: 'admin@demo.com',
            role: 'ADMIN' as const,
            first_name: 'Dr. Lisa',
            last_name: 'Martinez',
            org_id: 'org-1',
            created_at: new Date().toISOString(),
          }
        } else {
          throw new Error('Invalid credentials')
        }

        await signIn(user, 'mock-token')
        router.push('/dashboard')
      } else {
        throw new Error('Please fill in all fields')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access Accompli
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <div><strong>Teacher:</strong> teacher@demo.com / password</div>
              <div><strong>Aide:</strong> aide@demo.com / password</div>
              <div><strong>Admin:</strong> admin@demo.com / password</div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
