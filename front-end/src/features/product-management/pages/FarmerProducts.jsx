"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Leaf,
  Plus,
  MessageSquare,
  Package,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const productosRecientes = [
  {
    id: 1,
    nombre: "Café Orgánico Premium",
    precio: 15000,
    cantidad: "500 kg",
    estado: "Activo",
    visitas: 45,
    fechaPublicacion: "2024-01-15",
    imagen: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    nombre: "Aguacate Hass",
    precio: 3500,
    cantidad: "200 kg",
    estado: "Vendido",
    visitas: 32,
    fechaPublicacion: "2024-01-10",
    imagen: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    nombre: "Plátano Hartón",
    precio: 2200,
    cantidad: "1000 kg",
    estado: "Activo",
    visitas: 28,
    fechaPublicacion: "2024-01-08",
    imagen: "/placeholder.svg?height=80&width=80",
  },
]

export default function DashboardAgricultor() {
  const [activeTab, setActiveTab] = useState("productos")
  const [modalNuevoProducto, setModalNuevoProducto] = useState(false)
  const [modalEditarProducto, setModalEditarProducto] = useState(false)
  const [modalEliminarProducto, setModalEliminarProducto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">AgroConecta</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-lg font-medium text-gray-700">Panel de Agricultor</span>
            <span className="text-gray-400">|</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">¡Bienvenido, Juan Díaz!</h1>
              <p className="text-sm text-gray-600">Gestiona tus productos y conecta con compradores</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/mensajes">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensajes (3)
              </Link>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="productos">Mis Productos</TabsTrigger>
            <TabsTrigger value="mensajes">Mensajes</TabsTrigger>
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
          </TabsList>

          <TabsContent value="productos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mis Productos</h2>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setModalNuevoProducto(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>

            <div className="grid gap-6">
              {productosRecientes.map((producto) => (
                <Card key={producto.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={producto.imagen || "/placeholder.svg"}
                        alt={producto.nombre}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                          <Badge variant={producto.estado === "Activo" ? "default" : "secondary"}>
                            {producto.estado}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />${producto.precio.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            {producto.cantidad}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {producto.visitas} visitas
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {producto.fechaPublicacion}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProductoSeleccionado(producto)
                            setModalEditarProducto(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setProductoSeleccionado(producto)
                            setModalEliminarProducto(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mensajes" className="space-y-6">
            {/* Contenido de Mensajes eliminado */}
          </TabsContent>

          <TabsContent value="ventas" className="space-y-6">
            {/* Contenido de Ventas eliminado */}
          </TabsContent>
        </Tabs>
      </div>
      {/* Modal Nuevo Producto */}
      <Dialog open={modalNuevoProducto} onOpenChange={setModalNuevoProducto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publicar Nuevo Producto</DialogTitle>
            <DialogDescription>
              Completa la información de tu producto para publicarlo en la plataforma
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input id="nombre" placeholder="Ej: Café Orgánico Premium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frutas">Frutas</SelectItem>
                    <SelectItem value="verduras">Verduras</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="cacao">Cacao</SelectItem>
                    <SelectItem value="tuberculos">Tubérculos</SelectItem>
                    <SelectItem value="granos">Granos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio por kg</Label>
                <Input id="precio" type="number" placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad Disponible</Label>
                <Input id="cantidad" type="number" placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="kg" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramos</SelectItem>
                    <SelectItem value="ton">Toneladas</SelectItem>
                    <SelectItem value="bultos">Bultos</SelectItem>
                    <SelectItem value="cajas">Cajas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe tu producto, métodos de cultivo, certificaciones..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cosecha">Fecha de Cosecha</Label>
                <Input id="cosecha" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificacion">Certificación</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona certificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organico">Orgánico</SelectItem>
                    <SelectItem value="fairtrade">Fair Trade</SelectItem>
                    <SelectItem value="convencional">Convencional</SelectItem>
                    <SelectItem value="bpa">Buenas Prácticas Agrícolas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imágenes del Producto</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Arrastra imágenes aquí o haz clic para seleccionar</p>
                <p className="text-xs text-gray-500 mt-1">Máximo 5 imágenes, formato JPG o PNG</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insumos">Insumos Utilizados</Label>
              <Textarea
                id="insumos"
                placeholder="Lista los fertilizantes, pesticidas u otros insumos utilizados..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNuevoProducto(false)}>
              Cancelar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">Publicar Producto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Producto */}
      <Dialog open={modalEditarProducto} onOpenChange={setModalEditarProducto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Modifica la información de tu producto</DialogDescription>
          </DialogHeader>
          {productoSeleccionado && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nombre">Nombre del Producto</Label>
                    <Input id="edit-nombre" defaultValue={productoSeleccionado.nombre} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-categoria">Categoría</Label>
                    <Select defaultValue="cafe">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frutas">Frutas</SelectItem>
                        <SelectItem value="verduras">Verduras</SelectItem>
                        <SelectItem value="cafe">Café</SelectItem>
                        <SelectItem value="cacao">Cacao</SelectItem>
                        <SelectItem value="tuberculos">Tubérculos</SelectItem>
                        <SelectItem value="granos">Granos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-precio">Precio por kg</Label>
                    <Input id="edit-precio" type="number" defaultValue={productoSeleccionado.precio} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-cantidad">Cantidad Disponible</Label>
                    <Input id="edit-cantidad" type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-unidad">Unidad</Label>
                    <Select defaultValue="kg">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogramos</SelectItem>
                        <SelectItem value="ton">Toneladas</SelectItem>
                        <SelectItem value="bultos">Bultos</SelectItem>
                        <SelectItem value="cajas">Cajas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-descripcion">Descripción</Label>
                  <Textarea
                    id="edit-descripcion"
                    defaultValue="Café orgánico de alta calidad cultivado en las montañas de Huila..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cosecha">Fecha de Cosecha</Label>
                    <Input id="edit-cosecha" type="date" defaultValue="2024-12-01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-certificacion">Certificación</Label>
                    <Select defaultValue="organico">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organico">Orgánico</SelectItem>
                        <SelectItem value="fairtrade">Fair Trade</SelectItem>
                        <SelectItem value="convencional">Convencional</SelectItem>
                        <SelectItem value="bpa">Buenas Prácticas Agrícolas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalEditarProducto(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal Eliminar Producto */}
      <Dialog open={modalEliminarProducto} onOpenChange={setModalEliminarProducto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el producto "{productoSeleccionado?.nombre}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end space-x-2">
            <Button variant="outline" onClick={() => setModalEliminarProducto(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Aquí se implementaría la lógica para eliminar el producto
                console.log("Producto a eliminar:", productoSeleccionado?.id)
                setModalEliminarProducto(false)
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}