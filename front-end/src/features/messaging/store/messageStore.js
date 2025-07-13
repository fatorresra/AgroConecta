import { create } from 'zustand';

// Datos de ejemplo - en el futuro esto vendrá de una API
const conversacionesEjemplo = [
  {
    id: 1,
    usuario: {
      nombre: "María López",
      rol: "comprador",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    producto: {
      id: 101,
      nombre: "Café Orgánico Premium",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    ultimoMensaje: {
      texto: "¿Tienes disponibilidad para 100kg?",
      fecha: "10:30",
      leido: true,
      enviado: false,
    },
    noLeidos: 0,
  },
  {
    id: 2,
    usuario: {
      nombre: "Carlos Rodríguez",
      rol: "comprador",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    producto: {
      id: 102,
      nombre: "Aguacate Hass",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    ultimoMensaje: {
      texto: "Perfecto, entonces acordamos 50kg a $3,500 por kg.",
      fecha: "Ayer",
      leido: false,
      enviado: true,
    },
    noLeidos: 0,
  },
  {
    id: 3,
    usuario: {
      nombre: "Ana Martínez",
      rol: "agricultor",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    producto: {
      id: 103,
      nombre: "Plátano Hartón",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    ultimoMensaje: {
      texto: "¿Cuál es el precio mínimo por tonelada?",
      fecha: "Ayer",
      leido: true,
      enviado: false,
    },
    noLeidos: 2,
  },
];

const mensajesEjemplo = [
  {
    id: 1,
    texto: "Hola, estoy interesado en tu Café Orgánico Premium",
    fecha: "10:15",
    enviado: false,
    leido: true,
    tipo: "texto",
  },
  {
    id: 2,
    texto: "¡Hola! Gracias por tu interés. ¿Qué cantidad necesitas?",
    fecha: "10:18",
    enviado: true,
    leido: true,
    tipo: "texto",
  },
  {
    id: 3,
    texto: "Estoy buscando aproximadamente 100kg para mi cafetería",
    fecha: "10:20",
    enviado: false,
    leido: true,
    tipo: "texto",
  },
  {
    id: 4,
    texto: "Perfecto, tengo disponibilidad. El precio es de $15,000 por kg",
    fecha: "10:22",
    enviado: true,
    leido: true,
    tipo: "texto",
  },
  {
    id: 5,
    texto: "¿Tienes disponibilidad para 100kg?",
    fecha: "10:30",
    enviado: false,
    leido: true,
    tipo: "texto",
  },
];

export const useMessageStore = create((set, get) => ({
  // Estado
  conversations: conversacionesEjemplo,
  messages: {},
  selectedConversation: null,
  isLoading: false,
  error: null,

  // Acciones para conversaciones
  setSelectedConversation: (conversation) => {
    set({ selectedConversation: conversation });
    // Cargar mensajes si no están cargados
    if (conversation && !get().messages[conversation.id]) {
      get().loadMessages(conversation.id);
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
  loadMessages: (conversationId) => {
    set(state => ({
      messages: {
        ...state.messages,
        [conversationId]: mensajesEjemplo // En el futuro será una API call
      }
    }));
  },

  sendMessage: (conversationId, text) => {
    const newMessage = {
      id: Date.now(),
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
        conv.id === conversationId
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
  },

  // Utilidades
  getMessagesForConversation: (conversationId) => {
    return get().messages[conversationId] || [];
  },

  clearError: () => set({ error: null }),
}));
