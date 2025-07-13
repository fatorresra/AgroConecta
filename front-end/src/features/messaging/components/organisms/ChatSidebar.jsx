import { useState } from "react"
import { Search, ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Datos de ejemplo - en el futuro esto vendrá de una API
const conversaciones = [
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

export default function ChatSidebar({ 
  conversacionSeleccionada, 
  setConversacionSeleccionada, 
  setMostrarChat,
  mostrarChat 
}) {
  const [busqueda, setBusqueda] = useState("");

  // Filtrar conversaciones según la búsqueda
  const conversacionesFiltradas = conversaciones.filter(
    (conv) =>
      conv.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      conv.producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleConversacionClick = (conversacion) => {
    setConversacionSeleccionada(conversacion);
    setMostrarChat(true);
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
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {conversacionesFiltradas.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No se encontraron conversaciones
          </div>
        ) : (
          conversacionesFiltradas.map((conversacion) => (
            <div
              key={conversacion.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                conversacionSeleccionada?.id === conversacion.id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white"
              }`}
              onClick={() => handleConversacionClick(conversacion)}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversacion.usuario.avatar} />
                    <AvatarFallback>
                      {conversacion.usuario.nombre.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversacion.usuario.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversacion.usuario.nombre}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {conversacion.ultimoMensaje.fecha}
                      </span>
                      {conversacion.noLeidos > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {conversacion.noLeidos}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    {/* <img
                      src={conversacion.producto.imagen}
                      alt={conversacion.producto.nombre}
                      className="h-6 w-6 rounded object-cover"
                    /> */}
                    <span className="text-xs text-gray-600 truncate">
                      {conversacion.producto.nombre}
                    </span>
                  </div>

                  <p className={`text-sm truncate ${
                    conversacion.ultimoMensaje.leido || conversacion.ultimoMensaje.enviado
                      ? "text-gray-600"
                      : "text-gray-900 font-medium"
                  }`}>
                    {conversacion.ultimoMensaje.enviado && "Tú: "}
                    {conversacion.ultimoMensaje.texto}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
