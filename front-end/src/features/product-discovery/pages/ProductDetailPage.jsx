import { useParams } from "react-router-dom"
import { MapPin, Star, MessageSquare, Package, Calendar, Award, User } from "lucide-react"
import Header from "@/shared/components/templates/Header"
import Footer from "@/shared/components/templates/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProductSearch } from "../hooks/useProductSearch"

export default function ProductDetailPage() {
  const { id } = useParams()
  const { selectedProduct: product, isLoading, error } = useProductSearch(id)

  // TODO: fetch farmer data from ID and potentially use it to link to chat

  // Wait until product is loaded
  if (isLoading || !product) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg object-cover"
            />
            {/* <Badge className="absolute top-4 right-4 bg-green-600">
              {product.certificacion}
            </Badge> */}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.location && (
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-bold text-green-600">
                  ${product.price_per_unit.toLocaleString()}
                </span>
                <span className="text-gray-500">/{product.unit || "unidad"}</span>
              </div>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{product.rating}</span>
                </div>
              )}
            </div>

            <Card>
              <CardContent className="grid grid-cols-2 gap-4 pb-6 pt-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Disponible</p>
                    <p className="font-medium">{product.quantity} {product.unit || "unidades"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Cosecha</p>
                    <p className="font-medium">{product.harvest_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Agricultor/a</p>
                    <p className="font-medium">{""}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Separate field, not being used */}
            {/* <div>
              <h2 className="text-xl font-semibold mb-2">Características</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.caracteristicas.map((caracteristica) => (
                  <li key={caracteristica}>{caracteristica}</li>
                ))}
              </ul>
            </div> */}

            <div className="pt-6 flex gap-4">
              <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                Contactar Agricultor
              </Button>
              <Button size="lg" variant="outline" className="flex gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
