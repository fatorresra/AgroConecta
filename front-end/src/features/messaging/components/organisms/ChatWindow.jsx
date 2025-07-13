import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Phone, Video, MoreVertical, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserAvatar from "@/shared/components/atoms/UserAvatar"
import { useMessages } from "../../hooks/useMessages"

export default function ChatWindow({ 
  conversacionSeleccionada, 
  mostrarChat, 
  setMostrarChat 
}) {
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const mensajesFinRef = useRef(null);
  const { currentMessages, sendMessage } = useMessages();

  // Scroll al último mensaje
  useEffect(() => {
    mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // Función para enviar un mensaje
  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === "") return;
    
    sendMessage(nuevoMensaje);
    setNuevoMensaje("");
  };

  // Función para manejar Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  if (!conversacionSeleccionada) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
          <p className="text-sm">Elige una conversación para comenzar a chatear</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-white ${
      mostrarChat ? 'flex' : 'hidden md:flex'
    }`}>
      {/* Header del chat */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMostrarChat(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <UserAvatar
            user={conversacionSeleccionada.usuario}
            showOnlineStatus={true}
            size="md"
          />

          <div>
            <h3 className="font-medium text-gray-900">
              {conversacionSeleccionada.usuario.nombre}
            </h3>
            <div className="flex items-center space-x-2">
              {/* <img
                src={conversacionSeleccionada.producto.imagen}
                alt={conversacionSeleccionada.producto.nombre}
                className="h-4 w-4 rounded object-cover"
              /> */}
              <span className="text-sm text-gray-600">
                {conversacionSeleccionada.producto.nombre}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${mensaje.enviado ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                mensaje.enviado
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm">{mensaje.texto}</p>
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className={`text-xs ${
                  mensaje.enviado ? "text-green-100" : "text-gray-500"
                }`}>
                  {mensaje.fecha}
                </span>
                {mensaje.enviado && (
                  <div className="text-green-100">
                    {mensaje.leido ? "✓✓" : "✓"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={mensajesFinRef} />
      </div>

      {/* Input de mensaje */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-12"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={enviarMensaje}
              disabled={nuevoMensaje.trim() === ""}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
