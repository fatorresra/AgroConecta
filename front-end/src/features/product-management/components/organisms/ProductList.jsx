import { Eye, Package, Calendar, DollarSign, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProductList({ productos: products, onEdit, onDelete, onView }) {
  if (!products?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products available
      </div>
    );
  }
  console.log("Rendering ProductList with products:", products);
  return (
    <div className="grid gap-6">
      {products.map((product) => (        <Card key={product.id}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {/* product image can be enabled later */}
              {/* <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover"
              /> */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <Badge variant={product.status === "Activo" ? "default" : "secondary"}>
                    {product.type}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${product.price_per_unit?.toLocaleString() || 0}
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {product.quantity || 0} units
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Harvest: {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Posted: {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onView?.(product)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDelete?.(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
