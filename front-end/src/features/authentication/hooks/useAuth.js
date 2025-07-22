import { useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/AuthService';

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
      let loginResult;
      try {
        loginResult = await storeLogin(credentials);
      } catch (err) {
        // Si storeLogin lanza un error, puede ser por credenciales o por error de red
        const errorMsg = err?.message || 'Error al iniciar sesión';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const { success, user: loggedUser } = loginResult;

      if (success && loggedUser) {
        const route = loggedUser.role === 'agricultor'
          ? '/farmer/products'
          : loggedUser.role === 'comprador'
            ? '/products'
            : '/home';
        navigate(route);
        return { success: true };
      }

      // Si no fue exitoso, intentar obtener el mensaje de error específico
      const errorMsg = loginResult?.error || 'Credenciales inválidas';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } catch (error) {
      const msg = error?.message || 'Error al iniciar sesión';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await registerUser(formData);
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Error al crear la cuenta',
        };
      }
      navigate('/login');
      return { success: true, email: response.email };
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al crear la cuenta';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated: !!token,
    user,
    login: handleLogin,
    register: handleRegister,
    logout: storeLogout,
    error,
    isLoading,
    clearError: () => setError(null)
  };
};
