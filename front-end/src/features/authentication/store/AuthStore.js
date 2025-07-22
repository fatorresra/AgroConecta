import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser } from '../services/AuthService';
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (credentials) => {
        try {
          const response = await loginUser(credentials);
          
          if (!response.success) {
            throw new Error(response.message);
          }

          const { res } = response;

          if (!res.token || !res.user || !res.user.role) {
            throw new Error('Respuesta del servidor incompleta');
          }

          // Establecer el estado y esperar a que se complete
          await new Promise(resolve => {
            set({ 
              token: res.token,
              user: res.user
            }, false, 'auth/login');
            resolve();
          });

          console.log('Usuario autenticado:', res.user);
          return { success: true, user: res.user };

        } catch (error) {
          console.error('Error en login:', error);
          set({ token: null, user: null });
          throw error;
        }
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