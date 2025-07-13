"use client"

import { useState, useEffect } from "react"
import { Search, Filter, SlidersHorizontal, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/shared/components/templates/Header"
import Footer from "@/shared/components/templates/Footer"
import ProductGrid from "../components/organisms/ProductGrid"
import ProductFilters from "../components/organisms/ProductFilters"
import { useProducts } from "../hooks/useProducts"

// Configuración de filtros
const departamentos = ["Todos", "Antioquia", "Boyacá", "Córdoba", "Huila", "Quindío", "Santander"]
const certificaciones = ["Todas", "Orgánico", "Fair Trade", "Convencional"]

export default function SearchProductsPage() {
  const { 
    products, 
    categories, 
    loading, 
    error, 
    totalProducts, 
    searchProducts, 
    clearError,
    reloadAllProducts 
  } = useProducts();

  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas")
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("Todos")
  const [certificacionSeleccionada, setCertificacionSeleccionada] = useState("Todas")
  const [rangoPrecios, setRangoPrecios] = useState([0, 20000])
  const [soloOrganicos, setSoloOrganicos] = useState(false)
  const [ordenarPor, setOrdenarPor] = useState("relevancia")

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filters = {
      search: busqueda,
      category: categoriaSeleccionada,
      location: departamentoSeleccionado,
      certification: certificacionSeleccionada,
      priceRange: rangoPrecios,
      organicOnly: soloOrganicos,
      sortBy: ordenarPor
    };
    
    // Solo aplicar filtros si hay al menos un filtro activo
    const hasActiveFilters = busqueda || 
                           categoriaSeleccionada !== "Todas" || 
                           departamentoSeleccionado !== "Todos" || 
                           certificacionSeleccionada !== "Todas" || 
                           soloOrganicos || 
                           ordenarPor !== "relevancia";
    
    if (hasActiveFilters) {
      searchProducts(filters);
    }
  }, [busqueda, categoriaSeleccionada, departamentoSeleccionado, certificacionSeleccionada, rangoPrecios, soloOrganicos, ordenarPor]);

  const filters = {
    categoriaSeleccionada,
    departamentoSeleccionado,
    certificacionSeleccionada,
    rangoPrecios,
    soloOrganicos,
  }

  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "categoriaSeleccionada":
        setCategoriaSeleccionada(value)
        break
      case "departamentoSeleccionado":
        setDepartamentoSeleccionado(value)
        break
      case "certificacionSeleccionada":
        setCertificacionSeleccionada(value)
        break
      case "rangoPrecios":
        setRangoPrecios(value)
        break
      case "soloOrganicos":
        setSoloOrganicos(value)
        break
    }
  }

  const limpiarFiltros = () => {
    setBusqueda("")
    setCategoriaSeleccionada("Todas")
    setDepartamentoSeleccionado("Todos")
    setCertificacionSeleccionada("Todas")
    setRangoPrecios([0, 20000])
    setSoloOrganicos(false)
    setOrdenarPor("relevancia")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Título y descripción */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Productos Agrícolas Frescos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre productos directamente de los agricultores colombianos. Calidad garantizada y precios justos.
          </p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              <Button 
                variant="link" 
                size="sm" 
                onClick={clearError}
                className="ml-2 text-red-600 p-0 h-auto"
              >
                Cerrar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos, agricultores..."
                className="pl-10"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={ordenarPor} onValueChange={setOrdenarPor}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Más Relevantes</SelectItem>
                  <SelectItem value="precio-menor">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-mayor">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="rating">Mejor Calificados</SelectItem>
                  <SelectItem value="recientes">Más Recientes</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtros móviles */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros de Búsqueda</SheetTitle>
                    <SheetDescription>Refina tu búsqueda para encontrar exactamente lo que necesitas</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      categorias={categories}
                      departamentos={departamentos}
                      certificaciones={certificaciones}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filtros laterales - Desktop */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductFilters
                  categorias={categories}
                  departamentos={departamentos}
                  certificaciones={certificaciones}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Lista de productos */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? 'Cargando...' : `${totalProducts} productos encontrados`}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={reloadAllProducts}
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Recargar Todos'}
                </Button>
                <Button variant="outline" onClick={limpiarFiltros}>
                  Limpiar Filtros
                </Button>
              </div>
            </div>

            {/* Estado de carga */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}

            {/* Productos */}
            {!loading && products.length > 0 ? (
              <ProductGrid products={products} />
            ) : !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <Button variant="outline" onClick={limpiarFiltros}>
                  Limpiar Filtros
                </Button>
              </div>
            )}

            {/* Paginación */}
            {!loading && products.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" disabled>
                    Anterior
                  </Button>
                  <Button variant="default" className="bg-green-600">
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Siguiente</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
