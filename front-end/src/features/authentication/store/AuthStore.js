import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser } from '../services/AuthService';
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: async (credentials) => {
        const { email, password } = credentials;
        
        // if (!email || !password) {
        //   throw new Error('Email y contraseña son requeridos');
        // }

        const response = await loginUser({ email, password });
        
        if (!response.success) {
          throw new Error(response.message);
        }

        // const { user } = response;

        set({ 
          token: response.token,
          user: response.user
        });

        return true;
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      })
    }
  )
);