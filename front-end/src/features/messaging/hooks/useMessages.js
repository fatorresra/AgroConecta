import { useMessageStore } from '../store/messageStore';

export const useMessages = () => {
  const {
    conversations,
    messages,
    selectedConversation,
    isLoading,
    error,
    setSelectedConversation,
    searchConversations,
    loadMessages,
    sendMessage,
    getMessagesForConversation,
    clearError
  } = useMessageStore();

  return {
    // Estado
    conversations,
    selectedConversation,
    isLoading,
    error,
    
    // Mensajes de la conversación actual
    currentMessages: selectedConversation 
      ? getMessagesForConversation(selectedConversation.id)
      : [],

    // Acciones
    selectConversation: setSelectedConversation,
    searchConversations,
    sendMessage: (text) => {
      if (selectedConversation) {
        sendMessage(selectedConversation.id, text);
      }
    },
    clearError,

    // Utilidades
    hasMessages: (conversationId) => {
      return messages[conversationId] && messages[conversationId].length > 0;
    }
  };
};
