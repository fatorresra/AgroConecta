"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FarmerHeader from "../components/templates/FarmerHeader"
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

export default function DashboardAgricultor() {
  const [activeTab, setActiveTab] = useState("productos")
  const [modalNuevoProducto, setModalNuevoProducto] = useState(false)
  const [modalEditarProducto, setModalEditarProducto] = useState(false)
  const [modalEliminarProducto, setModalEliminarProducto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const handleViewProduct = (producto) => {
    // TODO: Implementar vista de detalle del producto
    console.log("Ver producto:", producto.id)
  }

  const handleEditProduct = (producto) => {
    setProductoSeleccionado(producto)
    setModalEditarProducto(true)
  }

  const handleDeleteProduct = (producto) => {
    setProductoSeleccionado(producto)
    setModalEliminarProducto(true)
  }

  const handleSaveProduct = (productData) => {
    // TODO: Implementar guardado de producto
    console.log("Guardar producto:", productData)
    setModalNuevoProducto(false)
  }

  const handleUpdateProduct = (productId) => {
    // TODO: Implementar actualización de producto
    console.log("Actualizar producto:", productId)
    setModalEditarProducto(false)
  }

  const handleDeleteConfirm = (productId) => {
    // TODO: Implementar eliminación de producto
    console.log("Eliminar producto:", productId)
    setModalEliminarProducto(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerHeader nombreAgricultor="Juan Díaz" />

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
            {/* Contenido de Mensajes eliminado */}
          </TabsContent>

          <TabsContent value="ventas" className="space-y-6">
            {/* Contenido de Ventas eliminado */}
          </TabsContent>
        </Tabs>
      </div>

      <NewProductModal
        open={modalNuevoProducto}
        onOpenChange={setModalNuevoProducto}
        onSave={handleSaveProduct}
      />

      <EditProductModal
        producto={productoSeleccionado}
        open={modalEditarProducto}
        onOpenChange={setModalEditarProducto}
        onSave={handleUpdateProduct}
      />

      <DeleteProductModal
        producto={productoSeleccionado}
        open={modalEliminarProducto}
        onOpenChange={setModalEliminarProducto}
        onDelete={handleDeleteConfirm}
      />
    </div>
  )
}