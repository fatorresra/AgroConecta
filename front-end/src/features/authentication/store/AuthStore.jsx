import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (token, user) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ 
          token: token,
          user: user // No necesitamos parsear el token, ya tenemos el objeto user
        });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage' // Nombre para persistir en localStorage
    }
  )
);