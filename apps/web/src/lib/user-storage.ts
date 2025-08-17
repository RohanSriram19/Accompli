'use client'

import { User, UserRole } from './auth-store'

interface StoredUser {
  id: string
  email: string
  password: string // In a real app, this would be hashed
  role: UserRole
  first_name: string
  last_name: string
  org_id: string
  created_at: string
}

class UserStorage {
  private storageKey = 'accompli-users'

  // Get all users from localStorage
  private getUsers(): StoredUser[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Save users to localStorage
  private saveUsers(users: StoredUser[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users))
    } catch (error) {
      console.error('Failed to save users:', error)
    }
  }

  // Create a new user account
  createUser(userData: {
    email: string
    password: string
    role: UserRole
    firstName: string
    lastName: string
    organizationCode?: string
  }): User {
    const users = this.getUsers()
    
    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase())
    if (existingUser) {
      throw new Error('An account with this email already exists')
    }

    // Generate org_id based on role
    let orgId: string
    if (userData.role === 'ADMIN') {
      orgId = `org-${Date.now()}`
    } else if (userData.role === 'PARENT') {
      orgId = 'parent-access'
    } else {
      // For TEACHER and AIDE, use the organization code or default
      orgId = userData.organizationCode || 'org-1'
    }

    // Create new user
    const newStoredUser: StoredUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.toLowerCase(),
      password: userData.password, // In production, this should be hashed
      role: userData.role,
      first_name: userData.firstName,
      last_name: userData.lastName,
      org_id: orgId,
      created_at: new Date().toISOString(),
    }

    // Save to storage
    users.push(newStoredUser)
    this.saveUsers(users)

    // Return user without password
    const { password, ...userWithoutPassword } = newStoredUser
    return userWithoutPassword
  }

  // Authenticate user
  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers()
    
    console.log('=== Authentication Debug ===')
    console.log('Attempting login for:', email)
    console.log('Password provided:', password ? '[PROVIDED]' : '[EMPTY]')
    console.log('Total stored users:', users.length)
    
    // First check if email exists
    const emailExists = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    console.log('Email exists:', !!emailExists)
    
    if (emailExists) {
      console.log('Stored password for this email:', emailExists.password)
      console.log('Password match:', emailExists.password === password)
    }
    
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    console.log('Authentication result:', user ? 'SUCCESS' : 'FAILED')

    if (!user) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // Check if email exists
  emailExists(email: string): boolean {
    const users = this.getUsers()
    return users.some(user => user.email.toLowerCase() === email.toLowerCase())
  }

  // Get user by email (without password)
  getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      return null
    }

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // Initialize with demo users if storage is empty
  initializeWithDemoUsers(): void {
    const users = this.getUsers()
    
    if (users.length === 0) {
      const demoUsers: StoredUser[] = [
        {
          id: 'demo-teacher',
          email: 'teacher@demo.com',
          password: 'demo123',
          role: 'TEACHER',
          first_name: 'Sarah',
          last_name: 'Johnson',
          org_id: 'org-1',
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-aide',
          email: 'aide@demo.com',
          password: 'demo123',
          role: 'AIDE',
          first_name: 'Mike',
          last_name: 'Chen',
          org_id: 'org-1',
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-admin',
          email: 'admin@demo.com',
          password: 'demo123',
          role: 'ADMIN',
          first_name: 'Dr. Lisa',
          last_name: 'Martinez',
          org_id: 'org-1',
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-parent',
          email: 'parent@demo.com',
          password: 'demo123',
          role: 'PARENT',
          first_name: 'Maria',
          last_name: 'Rodriguez',
          org_id: 'parent-access',
          created_at: new Date().toISOString(),
        }
      ]
      
      this.saveUsers(demoUsers)
    }
  }

  // Debug helper - view all stored accounts (use in browser console)
  debugShowAllAccounts(): void {
    const users = this.getUsers()
    console.log('=== All Stored Accounts ===')
    console.table(users.map(u => ({
      email: u.email,
      role: u.role,
      first_name: u.first_name,
      last_name: u.last_name,
      created_at: u.created_at
    })))
    console.log('Total accounts:', users.length)
  }

  // Get all accounts for debugging (returns safe data without passwords)
  getAllAccountsForDebug() {
    const users = this.getUsers()
    return users.map(u => ({
      email: u.email,
      role: u.role,
      first_name: u.first_name,
      last_name: u.last_name,
      created_at: u.created_at
    }))
  }
}

export const userStorage = new UserStorage()

// Initialize demo users on first load
if (typeof window !== 'undefined') {
  userStorage.initializeWithDemoUsers()
  
  // Expose debug function globally for console use
  ;(window as any).debugAccounts = () => userStorage.debugShowAllAccounts()
}
