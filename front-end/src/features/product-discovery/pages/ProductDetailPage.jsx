import { useParams, useNavigate } from "react-router-dom"
import { MapPin, Star, MessageSquare, Package, Calendar, ArrowLeft, AlertCircle, User } from "lucide-react"
import Header from "@/shared/components/templates/Header"
import Footer from "@/shared/components/templates/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProductChat } from "@/features/messaging/hooks/useProductChat"
import { useProductSearch } from "../hooks/useProductSearch"
import { productTypes } from "@/shared/utils/options/productTypes"

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { selectedProduct: product, isLoading, error } = useProductSearch(undefined, id) // not passing filters
  const { loading: chatLoading, startChatWithProduct } = useProductChat();

  const handleChatClick = async () => {
    if (product) {
      await startChatWithProduct(product);
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Estado de error
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error || 'Producto no encontrado'}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={() => navigate('/products')} className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a productos
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const fallbackImageUrl = "https://img.freepik.com/foto-gratis/vacas-pastando-alrededor-granja_23-2150454914.jpg?semt=ais_hybrid&w=740";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Botón de regreso */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a productos
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="relative">
            <img
              src={product.image || fallbackImageUrl}
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
                    <p className="font-medium">{product.harvest_date ? product.harvest_date.split('T')[0] : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Agricultor/a</p>
                    <p className="font-medium">{""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Categoría</p>
                    <p className="font-medium">{
                      productTypes.find(pt => pt.value === product.type)?.label || product.type
                    }</p>
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
                {caracteristicas.map((caracteristica, index) => (
                  <li key={index}>{caracteristica}</li>
                ))}
              </ul>
            </div> */}

            <div className="pt-6 flex gap-4">
              <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                Contactar Agricultor
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex gap-2"
                onClick={handleChatClick}
                disabled={chatLoading}
              >
                <MessageSquare className="h-5 w-5" />
                {chatLoading ? 'Iniciando Chat...' : 'Chat'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
