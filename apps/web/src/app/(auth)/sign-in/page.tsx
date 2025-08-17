'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/auth-store'
import { userStorage } from '@/lib/user-storage'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDebug, setShowDebug] = useState(false)
  
  const router = useRouter()
  const { signIn } = useAuthStore()

  // Get stored accounts for debugging
  const storedAccounts = userStorage.getAllAccountsForDebug()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields')
      }

      // Debug: Log all stored accounts
      console.log('Attempting sign in for:', email)
      console.log('All stored accounts:', userStorage.debugShowAllAccounts())
      
      // Authenticate user with stored accounts
      const user = userStorage.authenticateUser(email, password)
      
      console.log('Authentication result:', user)
      
      if (!user) {
        // Check if email exists first to give better error message
        const emailExists = userStorage.emailExists(email)
        if (emailExists) {
          throw new Error('Incorrect password. Please check your password and try again.')
        } else {
          throw new Error('No account found with this email. Please check your email or create a new account.')
        }
      }

      await signIn(user, `token-${user.id}`)
      router.push('/dashboard')
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
              <div><strong>Teacher:</strong> teacher@demo.com / demo123</div>
              <div><strong>Aide:</strong> aide@demo.com / demo123</div>
              <div><strong>Admin:</strong> admin@demo.com / demo123</div>
              <div><strong>Parent:</strong> parent@demo.com / demo123</div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Or create your own account and sign in with those credentials!
            </p>
          </div>

          {/* Debug Panel */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showDebug ? 'Hide' : 'Show'} stored accounts
            </button>
            {showDebug && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  All Stored Accounts ({storedAccounts.length}):
                </p>
                <div className="space-y-1 text-xs text-gray-600 max-h-32 overflow-y-auto">
                  {storedAccounts.map((account, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{account.email}</span>
                      <span className="text-gray-400">{account.role}</span>
                    </div>
                  ))}
                  {storedAccounts.length === 0 && (
                    <p className="text-gray-500 italic">No accounts found</p>
                  )}
                </div>
              </div>
            )}
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
