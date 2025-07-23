import axios from 'axios';
import { PORTS } from '@/shared/utils/Ports';
import { useAuthStore } from '@/features/authentication/store/AuthStore';

const CHAT_API_URL = PORTS.CHAT.BASE_URL;

// Configurar axios para incluir el token de autorización
const chatApi = axios.create({
  baseURL: CHAT_API_URL,
  timeout: 10000,
});

// Interceptor para agregar el token de autorización
chatApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autorización
chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chatService = {
  // Crear un nuevo chat
  createChat: async (userData, productData) => {
    try {
      const response = await chatApi.post('/api/chats', {
        user_ids: [userData.id, productData.farmer_id],
        description: `Chat sobre ${productData.name} - ${productData.category}`
      });
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Obtener chats del usuario
  getUserChats: async (userId) => {
    try {
      const response = await chatApi.get(`/api/users/${userId}/chats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user chats:', error);
      throw error;
    }
  },

  // Obtener mensajes de un chat
  getChatMessages: async (chatId, limit = 50) => {
    try {
      const response = await chatApi.get(`/api/chats/${chatId}/messages`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  },

  // Enviar un mensaje
  sendMessage: async (chatId, userId, content, attachments = null) => {
    try {
      const response = await chatApi.post('/api/messages', {
        chat_id: chatId,
        user_id: userId,
        content,
        attachments,
        type: 'text'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Obtener estadísticas del servicio
  getStats: async () => {
    try {
      const response = await chatApi.get('/api/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Verificar salud del servicio
  healthCheck: async () => {
    try {
      const response = await chatApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
};

export default chatService; 