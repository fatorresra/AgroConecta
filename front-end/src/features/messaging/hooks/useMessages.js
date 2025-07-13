import { useMessageStore } from '../store/messageStore';

export const useMessages = () => {
  const {
    conversations,
    messages,
    selectedConversation,
    isLoading,
    error,
    isConnected,
    setSelectedConversation,
    searchConversations,
    loadMessages,
    sendMessage,
    getMessagesForConversation,
    loadConversations,
    initializeWebSocket,
    clearError
  } = useMessageStore();

  return {
    // Estado
    conversations,
    selectedConversation,
    isLoading,
    error,
    isConnected,
    
    // Mensajes de la conversación actual
    currentMessages: selectedConversation 
      ? getMessagesForConversation(selectedConversation.chatId || selectedConversation.id)
      : [],

    // Acciones
    selectConversation: setSelectedConversation,
    searchConversations,
    sendMessage: (text) => {
      if (selectedConversation) {
        sendMessage(selectedConversation.chatId || selectedConversation.id, text);
      }
    },
    loadConversations,
    initializeWebSocket,
    clearError,

    // Utilidades
    hasMessages: (conversationId) => {
      return messages[conversationId] && messages[conversationId].length > 0;
    },

    // Buscar conversaciones
    searchConversations: (query) => {
      return searchConversations(query);
    }
  };
};

export default useMessages;
