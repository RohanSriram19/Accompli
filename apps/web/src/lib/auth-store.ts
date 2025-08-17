'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'TEACHER' | 'AIDE' | 'ADMIN' | 'PARENT'

export interface User {
  id: string
  email: string
  role: UserRole
  first_name: string
  last_name: string
  org_id: string
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (user: User, token: string) => Promise<void>
  signOut: () => void
  updateUser: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      signIn: async (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      signOut: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          })
        }
      },
    }),
    {
      name: 'accompli-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false)
      },
    }
  )
)
