"use client"

import { useState } from "react"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Header from "@/shared/components/templates/Header"
import Footer from "@/shared/components/templates/Footer"
import ProductGrid from "../components/organisms/ProductGrid"
import ProductFilters from "../components/organisms/ProductFilters"
import { productTypes } from "@/shared/utils/options/productTypes"
import { PRODUCT_FILTERS } from "@/shared/utils/options/productFilters"
import { useProductSearch } from "../hooks/useProductSearch"

const typeOptions = [
  { value: "all", label: "Todas" },
  ...productTypes.map(opt => ({ value: opt.value, label: opt.plural || opt.label }))
]

export default function SearchProductsPage() {
  const { products, isLoading, error } = useProductSearch()

  const getDefaultFilters = () => {
    return Object.fromEntries(
      Object.entries(PRODUCT_FILTERS).map(([key, config]) => [key, config.default])
    );
  }
  
  const [filters, setFilters] = useState(getDefaultFilters());
  const [sortBy, setSortBy] = useState("recientes");

  // Update a filter by name
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "disponibilidad":
        return (b.quantity || 0) - (a.quantity || 0);
      case "precio-menor":
        return (a.price_per_unit || 0) - (b.price_per_unit || 0);
      case "precio-mayor":
        return (b.price_per_unit || 0) - (a.price_per_unit || 0);
      case "recientes":
        return new Date(b.harvest_date) - new Date(a.harvest_date);
      default:
        return 0;
    }
  });

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

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos, agricultores..."
                className="pl-10"
                value={filters.name}
                onChange={e => handleFilterChange("name", e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recientes">Más Recientes</SelectItem>
                  <SelectItem value="disponibilidad">Mayor Disponibilidad</SelectItem>
                  <SelectItem value="precio-menor">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-mayor">Precio: Mayor a Menor</SelectItem>
                  {/* <SelectItem value="rating">Mejor Calificados</SelectItem> */}
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
                      typeOptions={typeOptions}
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
                  typeOptions={typeOptions}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Lista de productos */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{products.length} productos encontrados</p>
            </div>

            {sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters(getDefaultFilters())}
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}

            {/* Paginación */}
            {/* {products.length > 0 && (
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
            )} */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
