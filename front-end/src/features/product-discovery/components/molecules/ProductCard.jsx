import { Link } from "react-router-dom"
import { MapPin, Star, MessageCircle } from "lucide-react"
// import Image from "next/image"
import { Badge } from "@/components/ui/badge"
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
        {product.harvest && (
          <Badge className="absolute top-2 right-2 bg-green-600">
            {product.harvest}
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.name || product.nombre}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {product.location || product.ubicacion}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-green-600">
            ${(product.price || product.precio).toLocaleString()}
          </span>
          <span className="text-gray-500">/{product.unit || product.unidad}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Por: {product.farmer || product.agricultor}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
          </div>
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
