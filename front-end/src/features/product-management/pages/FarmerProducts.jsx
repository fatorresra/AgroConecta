"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/shared/components/templates/Header"
import ProductList from "../components/organisms/ProductList"
import NewProductModal from "../components/organisms/NewProductModal"
import EditProductModal from "../components/organisms/EditProductModal"
import DeleteProductModal from "../components/organisms/DeleteProductModal"

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

export default function FarmerProductsPage() {
  const [activeTab, setActiveTab] = useState("productos")
  const [modalNuevoProducto, setModalNuevoProducto] = useState(false)
  const [modalEditarProducto, setModalEditarProducto] = useState(false)
  const [modalEliminarProducto, setModalEliminarProducto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const handleEditProduct = (producto) => {
    setProductoSeleccionado(producto)
    setModalEditarProducto(true)
  }

  const handleDeleteProduct = (producto) => {
    setProductoSeleccionado(producto)
    setModalEliminarProducto(true)
  }

  const handleViewProduct = (producto) => {
    // TODO: Implementar vista detallada del producto
    console.log("Ver producto:", producto.id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={true}
        userName="Juan Díaz"
        pageTitle="Panel de Agricultor"
        pageDescription="Gestiona tus productos y conecta con compradores"
        showAuthButtons={false}
        userType="farmer"
        notificationCount={3}
      />

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

            <ProductList
              productos={productosRecientes}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </TabsContent>

          <TabsContent value="mensajes" className="space-y-6">
            {/* Contenido de Mensajes */}
          </TabsContent>

          <TabsContent value="ventas" className="space-y-6">
            {/* Contenido de Ventas */}
          </TabsContent>
        </Tabs>
      </div>

      <NewProductModal
        open={modalNuevoProducto}
        onOpenChange={setModalNuevoProducto}
        onSave={() => {
          // TODO: Implementar lógica para guardar nuevo producto
          setModalNuevoProducto(false)
        }}
      />

      <EditProductModal
        producto={productoSeleccionado}
        open={modalEditarProducto}
        onOpenChange={setModalEditarProducto}
        onSave={(id) => {
          // TODO: Implementar lógica para guardar cambios
          console.log("Guardar cambios del producto:", id)
          setModalEditarProducto(false)
        }}
      />

      <DeleteProductModal
        producto={productoSeleccionado}
        open={modalEliminarProducto}
        onOpenChange={setModalEliminarProducto}
        onDelete={(id) => {
          // TODO: Implementar lógica para eliminar producto
          console.log("Eliminar producto:", id)
          setModalEliminarProducto(false)
        }}
      />
    </div>
  )
}