import { useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user, login: storeLogin, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Esperar a que el login se complete y obtener el usuario
      const { success, user: loggedUser } = await storeLogin(credentials);
       
      if (success && loggedUser) {
        console.log('Login successful, user:', loggedUser);
        
        // Usar el usuario devuelto por el login en lugar del estado
        const route = loggedUser.role === 'agricultor' 
          ? '/farmer/products' 
          : loggedUser.role === 'comprador' 
            ? '/products' 
            : '/home';

        console.log('Redirecting to:', route);
        navigate(route);
        return { success: true };
      }
      
      setError('Credenciales inválidas');
      return { success: false, error: 'Credenciales inválidas' };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Error al iniciar sesión');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated: !!token,
    user,
    login: handleLogin,
    logout: storeLogout,
    error,
    isLoading,
    clearError: () => setError(null)
  };
};
