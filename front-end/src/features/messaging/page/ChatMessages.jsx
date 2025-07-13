"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Leaf,
  Search,
  Send,
  Paperclip,
  ImageIcon,
  File,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

// Datos de ejemplo
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
  {
    id: 4,
    usuario: {
      nombre: "Pedro Gómez",
      rol: "comprador",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    producto: {
      id: 104,
      nombre: "Tomate Chonto",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    ultimoMensaje: {
      texto: "Estoy interesado en comprar toda tu cosecha",
      fecha: "Lunes",
      leido: true,
      enviado: false,
    },
    noLeidos: 0,
  },
  {
    id: 5,
    usuario: {
      nombre: "Laura Sánchez",
      rol: "agricultor",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    producto: {
      id: 105,
      nombre: "Cacao Fino",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    ultimoMensaje: {
      texto: "Te envío las fotos de la última cosecha",
      fecha: "23/05",
      leido: true,
      enviado: true,
    },
    noLeidos: 0,
  },
]

// Mensajes de ejemplo para una conversación
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
    texto: "¿Podrías hacerme un descuento por la cantidad?",
    fecha: "10:25",
    enviado: false,
    leido: true,
    tipo: "texto",
  },
  {
    id: 6,
    texto: "Puedo ofrecerte a $14,500 por kg para los 100kg",
    fecha: "10:28",
    enviado: true,
    leido: true,
    tipo: "texto",
  },
  {
    id: 7,
    texto: "¿Tienes disponibilidad para 100kg?",
    fecha: "10:30",
    enviado: false,
    leido: true,
    tipo: "texto",
  },
  {
    id: 8,
    texto: "Aquí te envío algunas fotos de la calidad del café",
    fecha: "10:32",
    enviado: true,
    leido: true,
    tipo: "texto",
  },
  {
    id: 9,
    contenido: "/placeholder.svg?height=300&width=400",
    fecha: "10:32",
    enviado: true,
    leido: true,
    tipo: "imagen",
  },
  {
    id: 10,
    contenido: "/placeholder.svg?height=300&width=400",
    fecha: "10:33",
    enviado: true,
    leido: true,
    tipo: "imagen",
  },
  {
    id: 11,
    texto: "Se ven excelentes. ¿Cuándo podríamos coordinar la entrega?",
    fecha: "10:35",
    enviado: false,
    leido: true,
    tipo: "texto",
  },
  {
    id: 12,
    texto: "Podría tenerlo listo para la próxima semana. ¿Te parece bien?",
    fecha: "10:38",
    enviado: true,
    leido: false,
    tipo: "texto",
  },
]

// Componente principal
export default function MensajesPage() {
  const [conversacionSeleccionada, setConversacionSeleccionada] = useState(conversaciones[0])
  const [mensajes, setMensajes] = useState(mensajesEjemplo)
  const [nuevoMensaje, setNuevoMensaje] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [mostrarChat, setMostrarChat] = useState(false)
  const [adjuntoDialogOpen, setAdjuntoDialogOpen] = useState(false)
  const mensajesFinRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Filtrar conversaciones según la búsqueda
  const conversacionesFiltradas = conversaciones.filter(
    (conv) =>
      conv.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      conv.producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  // Scroll al último mensaje cuando se carga la página o se envía un nuevo mensaje
  useEffect(() => {
    if (mensajesFinRef.current) {
      mensajesFinRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [mensajes])

  // Función para enviar un mensaje
  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === "") return

    const nuevoMsg = {
      id: mensajes.length + 1,
      texto: nuevoMensaje,
      fecha: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      enviado: true,
      leido: false,
      tipo: "texto" as const,
    }

    setMensajes([...mensajes, nuevoMsg])
    setNuevoMensaje("")
  }

  // Función para enviar un archivo adjunto
  const enviarAdjunto = (tipo: string, url: string) => {
    const nuevoMsg = {
      id: mensajes.length + 1,
      contenido: url,
      fecha: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      enviado: true,
      leido: false,
      tipo: tipo as "imagen" | "archivo",
    }

    setMensajes([...mensajes, nuevoMsg])
    setAdjuntoDialogOpen(false)
    toast({
      title: "Archivo enviado",
      description: "Tu archivo ha sido enviado correctamente",
    })
  }

  // Función para manejar la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  // Renderizado condicional para móvil
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">AgroConecta</span>
            </Link>
            <span className="text-lg font-medium">Mensajes</span>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {!mostrarChat ? (
            // Lista de conversaciones (móvil)
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar conversaciones..."
                    className="pl-10"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {conversacionesFiltradas.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setConversacionSeleccionada(conv)
                        setMostrarChat(true)
                      }}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conv.usuario.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{conv.usuario.nombre[0]}</AvatarFallback>
                        </Avatar>
                        {conv.usuario.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{conv.usuario.nombre}</p>
                          <span className="text-xs text-gray-500">{conv.ultimoMensaje.fecha}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.producto.nombre}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">{conv.ultimoMensaje.texto}</p>
                          {conv.noLeidos > 0 && <Badge className="ml-2 bg-green-600">{conv.noLeidos}</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat activo (móvil)
            <div className="flex-1 flex flex-col">
              {/* Cabecera del chat */}
              <div className="bg-white p-3 border-b flex items-center">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => setMostrarChat(false)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversacionSeleccionada.usuario.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conversacionSeleccionada.usuario.nombre[0]}</AvatarFallback>
                  </Avatar>
                  {conversacionSeleccionada.usuario.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium">{conversacionSeleccionada.usuario.nombre}</p>
                  <p className="text-xs text-gray-500">
                    {conversacionSeleccionada.usuario.online ? "En línea" : "Desconectado"}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Ver producto</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Silenciar conversación</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Bloquear usuario</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Producto relacionado */}
              <div className="bg-gray-50 p-3 border-b flex items-center">
                <img
                  src={conversacionSeleccionada.producto.imagen || "/placeholder.svg"}
                  alt={conversacionSeleccionada.producto.nombre}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">{conversacionSeleccionada.producto.nombre}</p>
                  <Link href={`/productos/${conversacionSeleccionada.producto.id}`} className="text-xs text-green-600">
                    Ver producto
                  </Link>
                </div>
              </div>

              {/* Mensajes */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mensajes.map((mensaje) => (
                    <div key={mensaje.id} className={`flex ${mensaje.enviado ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          mensaje.enviado
                            ? "bg-green-600 text-white rounded-br-none"
                            : "bg-white border rounded-bl-none"
                        }`}
                      >
                        {mensaje.tipo === "texto" ? (
                          <p>{mensaje.texto}</p>
                        ) : mensaje.tipo === "imagen" ? (
                          <img
                            src={mensaje.contenido || "/placeholder.svg"}
                            alt="Imagen adjunta"
                            className="rounded-md max-w-full cursor-pointer"
                            onClick={() => {
                              // Abrir imagen en tamaño completo
                            }}
                          />
                        ) : (
                          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                            <File className="h-5 w-5 text-blue-500" />
                            <span className="text-sm">Archivo adjunto</span>
                          </div>
                        )}
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-70">{mensaje.fecha}</span>
                          {mensaje.enviado &&
                            (mensaje.leido ? (
                              <CheckCheck className="h-3 w-3 opacity-70" />
                            ) : (
                              <Check className="h-3 w-3 opacity-70" />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={mensajesFinRef} />
                </div>
              </ScrollArea>

              {/* Formulario de envío */}
              <div className="bg-white p-3 border-t">
                <div className="flex items-center space-x-2">
                  <Dialog open={adjuntoDialogOpen} onOpenChange={setAdjuntoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adjuntar archivo</DialogTitle>
                        <DialogDescription>Selecciona el tipo de archivo que deseas enviar</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center"
                          onClick={() => enviarAdjunto("imagen", "/placeholder.svg?height=300&width=400")}
                        >
                          <ImageIcon className="h-8 w-8 mb-2" />
                          <span>Imagen</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-24 flex flex-col items-center justify-center"
                          onClick={() => enviarAdjunto("archivo", "documento.pdf")}
                        >
                          <File className="h-8 w-8 mb-2" />
                          <span>Documento</span>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    onClick={enviarMensaje}
                    disabled={nuevoMensaje.trim() === ""}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Versión de escritorio
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">AgroConecta</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-lg font-medium text-gray-700">Mensajes</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/agricultor">Volver al Dashboard</Link>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-8rem)] flex overflow-hidden">
          {/* Panel izquierdo - Lista de conversaciones */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar conversaciones..."
                  className="pl-10"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="todos" className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="todos" className="flex-1">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="noLeidos" className="flex-1">
                  No leídos
                </TabsTrigger>
                <TabsTrigger value="archivados" className="flex-1">
                  Archivados
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <ScrollArea className="flex-1 py-2">
              <div className="space-y-1 px-2">
                {conversacionesFiltradas.map((conv) => (
                  <div
                    key={conv.id}
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                      conversacionSeleccionada.id === conv.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setConversacionSeleccionada(conv)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.usuario.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conv.usuario.nombre[0]}</AvatarFallback>
                      </Avatar>
                      {conv.usuario.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{conv.usuario.nombre}</p>
                        <span className="text-xs text-gray-500">{conv.ultimoMensaje.fecha}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.producto.nombre}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {conv.ultimoMensaje.enviado && <span className="mr-1">Tú:</span>}
                          {conv.ultimoMensaje.texto}
                        </p>
                        {conv.noLeidos > 0 && <Badge className="ml-2 bg-green-600">{conv.noLeidos}</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Panel derecho - Chat activo */}
          <div className="flex-1 flex flex-col">
            {/* Cabecera del chat */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversacionSeleccionada.usuario.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conversacionSeleccionada.usuario.nombre[0]}</AvatarFallback>
                  </Avatar>
                  {conversacionSeleccionada.usuario.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{conversacionSeleccionada.usuario.nombre}</p>
                  <p className="text-xs text-gray-500">
                    {conversacionSeleccionada.usuario.online ? "En línea" : "Desconectado"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                    <DropdownMenuItem>Ver producto</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Silenciar conversación</DropdownMenuItem>
                    <DropdownMenuItem>Archivar conversación</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Bloquear usuario</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Producto relacionado */}
            <div className="bg-gray-50 p-3 border-b flex items-center">
              <img
                src={conversacionSeleccionada.producto.imagen || "/placeholder.svg"}
                alt={conversacionSeleccionada.producto.nombre}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="ml-3">
                <p className="font-medium">{conversacionSeleccionada.producto.nombre}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <Link href={`/productos/${conversacionSeleccionada.producto.id}`} className="text-sm text-green-600">
                    Ver producto
                  </Link>
                  <Separator orientation="vertical" className="h-4" />
                  <Button variant="outline" size="sm" className="h-7 text-sm">
                    Iniciar compra
                  </Button>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {mensajes.map((mensaje) => (
                  <div key={mensaje.id} className={`flex ${mensaje.enviado ? "justify-end" : "justify-start"}`}>
                    {!mensaje.enviado && (
                      <Avatar className="mr-2 mt-1">
                        <AvatarImage src={conversacionSeleccionada.usuario.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conversacionSeleccionada.usuario.nombre[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        mensaje.enviado ? "bg-green-600 text-white rounded-br-none" : "bg-white border rounded-bl-none"
                      }`}
                    >
                      {mensaje.tipo === "texto" ? (
                        <p>{mensaje.texto}</p>
                      ) : mensaje.tipo === "imagen" ? (
                        <img
                          src={mensaje.contenido || "/placeholder.svg"}
                          alt="Imagen adjunta"
                          className="rounded-md max-w-full cursor-pointer"
                          onClick={() => {
                            // Abrir imagen en tamaño completo
                          }}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                          <File className="h-5 w-5 text-blue-500" />
                          <span className="text-sm">Archivo adjunto</span>
                        </div>
                      )}
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-70">{mensaje.fecha}</span>
                        {mensaje.enviado &&
                          (mensaje.leido ? (
                            <CheckCheck className="h-3 w-3 opacity-70" />
                          ) : (
                            <Check className="h-3 w-3 opacity-70" />
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={mensajesFinRef} />
              </div>
            </ScrollArea>

            {/* Formulario de envío */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Dialog open={adjuntoDialogOpen} onOpenChange={setAdjuntoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adjuntar archivo</DialogTitle>
                      <DialogDescription>Selecciona el tipo de archivo que deseas enviar</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center"
                        onClick={() => enviarAdjunto("imagen", "/placeholder.svg?height=300&width=400")}
                      >
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span>Imagen</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center"
                        onClick={() => enviarAdjunto("archivo", "documento.pdf")}
                      >
                        <File className="h-8 w-8 mb-2" />
                        <span>Documento</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Input
                  placeholder="Escribe un mensaje..."
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button
                  onClick={enviarMensaje}
                  disabled={nuevoMensaje.trim() === ""}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
