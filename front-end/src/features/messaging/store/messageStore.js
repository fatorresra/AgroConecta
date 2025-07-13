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
          
          // Reunirse a todas las salas de chat activas
          const { conversations, selectedConversation } = get();
          conversations.forEach(conversation => {
            socket.emit('join_chat', { chat_id: conversation.chatId });
          });
          
          // Unirse a la conversación seleccionada si existe
          if (selectedConversation) {
            socket.emit('join_chat', { chat_id: selectedConversation.chatId });
          }
        });

        socket.on('disconnect', () => {
          console.log('WebSocket desconectado');
          set({ isConnected: false });
        });

        socket.on('authenticated', (data) => {
          console.log('Usuario autenticado:', data);
        });

        socket.on('new_message', (message) => {
          console.log('Nuevo mensaje recibido:', message);
          get().handleNewMessage(message);
        });

        socket.on('message_status_updated', (data) => {
          console.log('Estado de mensaje actualizado:', data);
          get().handleMessageStatusUpdate(data);
        });

        socket.on('joined_chat', (data) => {
          console.log('Unido al chat:', data.chat_id);
        });

        socket.on('error', (error) => {
          console.error('Error de WebSocket:', error);
          set({ error: error.message || 'Error de conexión' });
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
    const { user } = useAuthStore.getState();
    
    // Verificar que no sea un mensaje duplicado (por ID real)
    const messageExists = currentMessages.some(msg => 
      msg.id === message.id && !msg.isTemp
    );
    if (messageExists) {
      console.log('Mensaje duplicado ignorado:', message.id);
      return;
    }
    
    // Convertir mensaje del backend al formato frontend
    const frontendMessage = {
      id: message.id,
      texto: message.content,
      fecha: new Date(message.sent_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' }),
      enviado: message.sender_id === user?.id,
      leido: message.status === 'read',
      tipo: message.type || 'texto',
      isTemp: false
    };

    // Si es un mensaje que envié yo, buscar el mensaje temporal correspondiente para reemplazarlo
    if (frontendMessage.enviado) {
      const tempMessageIndex = currentMessages.findIndex(msg => 
        msg.isTemp && 
        msg.texto === message.content && 
        msg.enviado === true
      );
      
      if (tempMessageIndex !== -1) {
        // Reemplazar el mensaje temporal con el real
        const updatedMessages = [...currentMessages];
        updatedMessages[tempMessageIndex] = frontendMessage;
        
        set(state => ({
          messages: {
            ...state.messages,
            [chatId]: updatedMessages
          }
        }));
        
        console.log('Mensaje temporal reemplazado con el real:', message.id);
        return;
      }
    }

    // Si no es un reemplazo de mensaje temporal, agregar normalmente
    set(state => ({
      messages: {
        ...state.messages,
        [chatId]: [...currentMessages, frontendMessage]
      }
    }));

    // Actualizar último mensaje en la conversación solo si no es mi propio mensaje
    // (para mis mensajes ya se actualizó en sendMessage)
    if (!frontendMessage.enviado) {
      set(state => ({
        conversations: state.conversations.map(conv =>
          conv.chatId === chatId
            ? {
                ...conv,
                ultimoMensaje: {
                  texto: message.content,
                  fecha: frontendMessage.fecha,
                  leido: false,
                  enviado: false,
                },
                noLeidos: (conv.noLeidos || 0) + 1
              }
            : conv
        )
      }));
    }
  },

  // Manejar actualización de estado de mensaje
  handleMessageStatusUpdate: (data) => {
    const { message_id, status } = data;
    const { messages } = get();
    
    // Buscar en qué chat está el mensaje
    Object.keys(messages).forEach(chatId => {
      const chatMessages = messages[chatId];
      const messageIndex = chatMessages.findIndex(msg => msg.id === message_id);
      
      if (messageIndex !== -1) {
        const updatedMessages = [...chatMessages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          leido: status === 'read'
        };
        
        set(state => ({
          messages: {
            ...state.messages,
            [chatId]: updatedMessages
          }
        }));
      }
    });
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
          fecha: new Date(chat.last_message_at || chat.created_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' }),
          leido: true,
          enviado: false,
        },
        noLeidos: chat.unread_counts[user.id] || 0,
      }));

      set({ conversations, isLoading: false });
      
      // Unirse a todas las salas de chat si el socket está conectado
      const { socket } = get();
      if (socket && socket.connected) {
        conversations.forEach(conversation => {
          socket.emit('join_chat', { chat_id: conversation.chatId });
        });
      }
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
    const { socket } = get();
    
    set({ selectedConversation: conversation });
    
    // Unirse al chat si el socket está conectado
    if (socket && socket.connected && conversation) {
      socket.emit('join_chat', { chat_id: conversation.chatId });
      console.log('Uniéndose al chat:', conversation.chatId);
    }
    
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
        fecha: new Date(message.sent_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' }),
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

    // Crear mensaje temporal para mostrar inmediatamente (UI optimista)
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tempMessage = {
      id: tempId,
      texto: text,
      fecha: new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' }),
      enviado: true,
      leido: false,
      tipo: "texto",
      isTemp: true, // Marcar como temporal
      sending: true // Marcar como enviándose
    };

    // Agregar mensaje temporal inmediatamente
    set(state => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          tempMessage
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
                fecha: tempMessage.fecha,
                leido: false,
                enviado: true,
              }
            }
          : conv
      )
    }));

    try {
      const message = await chatService.sendMessage(conversationId, user.id, text);
      
      // Marcar el mensaje temporal como enviado exitosamente
      set(state => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map(msg =>
            msg.id === tempId
              ? { ...msg, sending: false, tempId: tempId } // Guardar tempId para poder reemplazarlo después
              : msg
          )
        }
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Marcar el mensaje temporal como fallido
      set(state => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map(msg =>
            msg.id === tempId
              ? { ...msg, sending: false, failed: true }
              : msg
          )
        }
      }));
      
      set({ error: error.message });
    }
  },

  // Reenviar mensaje fallido
  retryMessage: async (conversationId, messageId) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const currentMessages = get().messages[conversationId] || [];
    const messageToRetry = currentMessages.find(msg => msg.id === messageId);
    
    if (!messageToRetry || !messageToRetry.failed) return;

    // Marcar como enviándose de nuevo
    set(state => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map(msg =>
          msg.id === messageId
            ? { ...msg, sending: true, failed: false }
            : msg
        )
      }
    }));

    try {
      const message = await chatService.sendMessage(conversationId, user.id, messageToRetry.texto);
      
      // Marcar como enviado exitosamente
      set(state => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map(msg =>
            msg.id === messageId
              ? { ...msg, sending: false, tempId: messageId }
              : msg
          )
        }
      }));

    } catch (error) {
      console.error('Error retrying message:', error);
      
      // Marcar como fallido de nuevo
      set(state => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map(msg =>
            msg.id === messageId
              ? { ...msg, sending: false, failed: true }
              : msg
          )
        }
      }));
      
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
