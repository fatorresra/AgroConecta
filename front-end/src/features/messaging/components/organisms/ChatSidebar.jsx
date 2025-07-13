import { useState, useEffect } from "react"
import { Search, ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ConversationItem } from "../molecules/ConversationItem"
import { useMessageStore } from "../../store/messageStore"

export default function ChatSidebar({ 
  conversacionSeleccionada, 
  setConversacionSeleccionada, 
  setMostrarChat,
  mostrarChat 
}) {
  const [busqueda, setBusqueda] = useState("");
  const [conversacionesFiltradas, setConversacionesFiltradas] = useState([]);
  const { conversations, setSelectedConversation } = useMessageStore();

  // Actualizar conversaciones filtradas cuando cambie la búsqueda o las conversaciones
  useEffect(() => {
    if (!busqueda.trim()) {
      setConversacionesFiltradas(conversations);
    } else {
      const filtered = conversations.filter(
        (conv) =>
          conv.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          conv.producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setConversacionesFiltradas(filtered);
    }
  }, [busqueda, conversations]);

  const handleConversacionClick = (conversacion) => {
    setConversacionSeleccionada(conversacion);
    setSelectedConversation(conversacion);
    setMostrarChat(true);
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <div className={`w-full md:w-80 border-r bg-gray-50 flex flex-col ${
      mostrarChat ? 'hidden md:flex' : 'flex'
    }`}>
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar conversaciones..."
            value={busqueda}
            onChange={handleBusquedaChange}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {conversacionesFiltradas.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {busqueda.trim() ? 'No se encontraron conversaciones' : 'No hay conversaciones aún'}
          </div>
        ) : (
          conversacionesFiltradas.map((conversacion) => (
            <ConversationItem
              key={conversacion.id}
              conversation={conversacion}
              isSelected={conversacionSeleccionada?.id === conversacion.id}
              onClick={() => handleConversacionClick(conversacion)}
            />
          ))
        )}
      </div>
    </div>
  );
}
