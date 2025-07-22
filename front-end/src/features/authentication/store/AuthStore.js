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
            // Retornar el error del backend para que useAuth lo procese
            return { success: false, error: response.error };
          }

          const { res } = response;

          if (!res.token || !res.user || !res.user.role) {
            return { success: false, error: 'Respuesta del servidor incompleta' };
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
          return { success: false, error: error.message || 'Error al iniciar sesión' };
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