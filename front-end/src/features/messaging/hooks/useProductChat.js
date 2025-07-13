import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../services/ChatService';
import { useAuthStore } from '@/features/authentication/store/AuthStore';
import { useMessageStore } from '../store/messageStore';

export const useProductChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setSelectedConversation, refreshConversations } = useMessageStore();

  const createProductChat = async (product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar datos del producto para el chat
      const productData = {
        name: product.nombre || product.name,
        category: product.categoria || product.category || 'Producto',
        farmer_id: product.farmer_id || product.agricultor_id || 'farmer_123', // TODO: Obtener ID real del agricultor
        price: product.precio || product.price,
        unit: product.unidad || product.unit
      };

      // Crear el chat
      const chatResponse = await chatService.createChat(user, productData);
      
      // Actualizar la lista de conversaciones
      await refreshConversations();
      
      // Convertir la respuesta del backend al formato esperado por el frontend
      const conversation = {
        id: chatResponse.id,
        usuario: {
          nombre: product.agricultor || product.farmer || 'Agricultor',
          rol: 'agricultor',
          avatar: '/placeholder.svg?height=40&width=40',
          online: true,
        },
        producto: {
          id: product.id,
          nombre: productData.name,
          imagen: product.imagen || '/placeholder.svg?height=60&width=60',
          precio: productData.price,
          unidad: productData.unit
        },
        ultimoMensaje: {
          texto: 'Chat iniciado',
          fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          leido: false,
          enviado: false,
        },
        noLeidos: 0,
        chatId: chatResponse.id
      };

      // Seleccionar la conversación
      setSelectedConversation(conversation);
      
      // Navegar a la página de mensajes
      navigate('/messages');
      
      return chatResponse;
    } catch (err) {
      console.error('Error creating product chat:', err);
      setError(err.message || 'Error al crear el chat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startChatWithProduct = async (product) => {
    try {
      await createProductChat(product);
    } catch (err) {
      // El error ya fue manejado en createProductChat
      console.error('Failed to start chat with product:', err);
    }
  };

  return {
    loading,
    error,
    startChatWithProduct,
    clearError: () => setError(null)
  };
};

export default useProductChat; 