import { Link } from "react-router-dom"
import { MapPin, Star, Calendar, MessageCircle } from "lucide-react"
// import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { productTypes } from "@/shared/utils/options/productTypes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { useProductChat } from "@/features/messaging/hooks/useProductChat"

export default function ProductCard({ product }) {
  const { loading, startChatWithProduct } = useProductChat();

  const handleChatClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await startChatWithProduct(product);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">

        {/*space to add product images */}

        {/* <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name || product.nombre}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        /> */}
        {product.type && (
          <Badge className="absolute top-2 right-2 bg-green-600">
            {(
              productTypes.find(pt => pt.value === product.type)?.label
              || product.type
            )}
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.name || product.nombre}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          {/* Product department/city is not saved yet */}
          {/* <MapPin className="h-4 w-4" />
          {product.location || product.ubicacion} */}
          <Calendar className="h-4 w-4" />
          {product.harvest_date && (
            "Cosecha: " + new Date(product.harvest_date).toLocaleDateString('es-CO')
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-600">
              ${(product.price || product.price_per_unit).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">COP</span>
          </span>
          <span className="text-gray-500">/{product.unit || "unidad"}</span>
        </div>
        <span className="block text-xs text-gray-500 mb-2">
          Cantidad en stock: {product.quantity}
        </span>
        <div className="flex items-center justify-between">
          {/* Could use farm_id to fetch owner name */}
          {/* <span className="text-sm text-gray-600">
            Por: {product.farmer || product.agricultor}
          </span> */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 bg-green-600 hover:bg-green-700" asChild>
            <Link to={`/products/${product.id}`}>Ver Detalles</Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleChatClick}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <MessageCircle className="h-4 w-4" />
            {loading ? 'Iniciando...' : 'Chat'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
