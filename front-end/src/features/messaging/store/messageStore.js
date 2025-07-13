import { create } from 'zustand';
import { chatService } from '../services/ChatService';
import { useAuthStore } from '@/features/authentication/store/AuthStore';
import { PORTS } from '@/shared/utils/Ports';

export const useMessageStore = create((set, get) => ({
  // Estado
  conversations: [],
  messages: {},
  selectedConversation: null,
  isLoading: false,
  error: null,
  isConnected: false,
  socket: null,

  // Inicializar WebSocket
  initializeWebSocket: () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      // Importar socket.io-client dinámicamente
      import('socket.io-client').then((io) => {
        const socket = io.default(PORTS.CHAT.BASE_URL, {
          auth: {
            token: useAuthStore.getState().token,
            userId: user.id
          },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        socket.on('connect', () => {
          console.log('WebSocket conectado');
          set({ isConnected: true, socket });
        });

        socket.on('disconnect', () => {
          console.log('WebSocket desconectado');
          set({ isConnected: false });
        });

        socket.on('new_message', (message) => {
          console.log('Nuevo mensaje recibido:', message);
          get().handleNewMessage(message);
        });

        socket.on('message_updated', (message) => {
          console.log('Mensaje actualizado:', message);
          get().handleMessageUpdate(message);
        });

        socket.on('error', (error) => {
          console.error('Error de WebSocket:', error);
          set({ error: error.message });
        });

        set({ socket });
      });
    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
      set({ error: 'Error al conectar con el servidor' });
    }
  },

  // Manejar nuevo mensaje desde WebSocket
  handleNewMessage: (message) => {
    const chatId = message.chat_id;
    const currentMessages = get().messages[chatId] || [];
    
    // Convertir mensaje del backend al formato frontend
    const frontendMessage = {
      id: message.id,
      texto: message.content,
      fecha: new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      enviado: message.sender_id === useAuthStore.getState().user?.id,
      leido: message.status === 'read',
      tipo: message.type
    };

    set(state => ({
      messages: {
        ...state.messages,
        [chatId]: [...currentMessages, frontendMessage]
      }
    }));

    // Actualizar último mensaje en la conversación
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.chatId === chatId
          ? {
              ...conv,
              ultimoMensaje: {
                texto: message.content,
                fecha: frontendMessage.fecha,
                leido: false,
                enviado: frontendMessage.enviado,
              }
            }
          : conv
      )
    }));
  },

  // Manejar actualización de mensaje
  handleMessageUpdate: (message) => {
    const chatId = message.chat_id;
    const messages = get().messages[chatId] || [];
    
    const updatedMessages = messages.map(msg =>
      msg.id === message.id
        ? { ...msg, leido: message.status === 'read' }
        : msg
    );

    set(state => ({
      messages: {
        ...state.messages,
        [chatId]: updatedMessages
      }
    }));
  },

  // Cargar conversaciones del usuario
  loadConversations: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });

    try {
      const chats = await chatService.getUserChats(user.id);
      
      // Convertir chats del backend al formato frontend
      const conversations = chats.map(chat => ({
        id: chat.id,
        chatId: chat.id,
        usuario: {
          nombre: getOtherParticipant(chat.participants, user.id)?.user_id || 'Usuario',
          rol: getOtherParticipant(chat.participants, user.id)?.role || 'comprador',
          avatar: '/placeholder.svg?height=40&width=40',
          online: true,
        },
        producto: {
          id: extractProductId(chat.title),
          nombre: chat.title || 'Producto',
          imagen: '/placeholder.svg?height=60&width=60',
        },
        ultimoMensaje: {
          texto: 'Chat iniciado',
          fecha: new Date(chat.last_message_at || chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          leido: true,
          enviado: false,
        },
        noLeidos: chat.unread_counts[user.id] || 0,
      }));

      set({ conversations, isLoading: false });
    } catch (error) {
      console.error('Error loading conversations:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Refrescar conversaciones
  refreshConversations: async () => {
    await get().loadConversations();
  },

  // Acciones para conversaciones
  setSelectedConversation: (conversation) => {
    set({ selectedConversation: conversation });
    // Cargar mensajes si no están cargados
    if (conversation && !get().messages[conversation.chatId]) {
      get().loadMessages(conversation.chatId);
    }
  },

  searchConversations: (query) => {
    const { conversations } = get();
    if (!query.trim()) return conversations;
    
    return conversations.filter(
      (conv) =>
        conv.usuario.nombre.toLowerCase().includes(query.toLowerCase()) ||
        conv.producto.nombre.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Acciones para mensajes
  loadMessages: async (chatId) => {
    set({ isLoading: true });
    
    try {
      const messages = await chatService.getChatMessages(chatId);
      
      // Convertir mensajes del backend al formato frontend
      const frontendMessages = messages.map(message => ({
        id: message.id,
        texto: message.content,
        fecha: new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        enviado: message.sender_id === useAuthStore.getState().user?.id,
        leido: message.status === 'read',
        tipo: message.type
      }));

      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: frontendMessages
        },
        isLoading: false
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  sendMessage: async (conversationId, text) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const message = await chatService.sendMessage(conversationId, user.id, text);
      
      // El mensaje se agregará automáticamente via WebSocket
      // Pero por si acaso, lo agregamos localmente también
      const newMessage = {
        id: message.id,
        texto: text,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        enviado: true,
        leido: false,
        tipo: "texto",
      };

      set(state => ({
        messages: {
          ...state.messages,
          [conversationId]: [
            ...(state.messages[conversationId] || []),
            newMessage
          ]
        }
      }));

      // Actualizar último mensaje en la conversación
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.chatId === conversationId
            ? {
                ...conv,
                ultimoMensaje: {
                  texto: text,
                  fecha: newMessage.fecha,
                  leido: false,
                  enviado: true,
                }
              }
            : conv
        )
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      set({ error: error.message });
    }
  },

  // Utilidades
  getMessagesForConversation: (conversationId) => {
    return get().messages[conversationId] || [];
  },

  clearError: () => set({ error: null }),

  // Limpiar al cerrar sesión
  cleanup: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      conversations: [],
      messages: {},
      selectedConversation: null,
      isLoading: false,
      error: null,
      isConnected: false,
      socket: null
    });
  }
}));

// Funciones auxiliares
const getOtherParticipant = (participants, currentUserId) => {
  return participants.find(p => p.user_id !== currentUserId);
};

const extractProductId = (title) => {
  // Extraer ID del producto del título si es posible
  const match = title?.match(/ID:(\d+)/);
  return match ? match[1] : Math.random().toString(36).substr(2, 9);
};
