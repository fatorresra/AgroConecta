import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * User data consists of:
 * - "id"
 * - "email"
 * - "name"
 * - "role": "agricultor" | "productor"
 * - "created_at"
 */

export const useAuthStore = create(
  persist(
    (set) => ({
      token: localStorage.getItem('auth_token') || null,
      user: JSON.parse(localStorage.getItem('user')) || null,

      login: (token, user) => {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ token, user })
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        set({ token: null, user: null })
      },
    }),
  )
)