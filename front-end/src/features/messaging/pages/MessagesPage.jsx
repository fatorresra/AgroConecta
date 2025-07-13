"use client"

import { useState, useEffect } from "react"
import Header from "@/shared/components/templates/Header"
import DashboardTabs from "@/shared/components/organisms/DashboardTabs"
import ChatSidebar from "../components/organisms/ChatSidebar"
import ChatWindow from "../components/organisms/ChatWindow"
import ConnectionStatus from "../components/atoms/ConnectionStatus"
import { useAuthStore } from "../../authentication/store/AuthStore"
import { useMessageStore } from "../store/messageStore"

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { 
    selectedConversation, 
    loadConversations, 
    initializeWebSocket,
    isLoading,
    error 
  } = useMessageStore();
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState(null);
  const [mostrarChat, setMostrarChat] = useState(false);

  // Inicializar WebSocket y cargar conversaciones cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      initializeWebSocket();
      loadConversations();
    }
  }, [user, initializeWebSocket, loadConversations]);

  // Sincronizar con el store cuando cambie la conversación seleccionada
  useEffect(() => {
    if (selectedConversation) {
      setConversacionSeleccionada(selectedConversation);
    }
  }, [selectedConversation]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      // El cleanup se maneja automáticamente en el store
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Debes iniciar sesión para acceder a los mensajes
          </h2>
          <p className="text-gray-600">
            Por favor, inicia sesión para poder chatear con otros usuarios.
          </p>
        </div>
      </div>
    );
  }

  const userType = user.role === 'agricultor' ? 'farmer' : 'buyer';
  const pageTitle = user.role === 'agricultor' ? 'Panel de Agricultor' : 'Panel de Comprador';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={true}
        userName={user.name || user.nombre || 'Usuario'}
        pageTitle={pageTitle}
        pageDescription="Gestiona tus conversaciones y negocia con otros usuarios"
        showAuthButtons={false}
        userType={userType}
        notificationCount={3}
      />

      <div className="container mx-auto px-4 py-8">
        <DashboardTabs />
        
        {/* Mostrar estado de carga o error */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando conversaciones...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <ConnectionStatus />
          <div className="flex h-[600px]">
            <ChatSidebar
              conversacionSeleccionada={conversacionSeleccionada}
              setConversacionSeleccionada={setConversacionSeleccionada}
              setMostrarChat={setMostrarChat}
              mostrarChat={mostrarChat}
            />
            
            <ChatWindow
              conversacionSeleccionada={conversacionSeleccionada}
              mostrarChat={mostrarChat}
              setMostrarChat={setMostrarChat}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
