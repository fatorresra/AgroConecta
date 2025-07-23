import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { productTypes } from "@/shared/utils/options/productTypes"

export default function ProductInterestSelector({ selectedProducts, onProductChange }) {
  const tiposProductos = productTypes.map(opt => opt.plural || opt.label)
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg">
      <h3 className="font-medium text-primary">Información de Comprador</h3>
      <div className="space-y-3">
        <Label className="text-base text-foreground">Tipos de Productos de Interés</Label>
        <div className="grid grid-cols-2 gap-3">
          {tiposProductos.map((producto) => (
            <div key={producto} className="flex items-center space-x-2">
              <Checkbox
                id={producto}
                checked={selectedProducts.includes(producto)}
                onCheckedChange={(checked) => onProductChange(producto, checked)}
              />
              <Label htmlFor={producto} className="text-sm cursor-pointer text-foreground">
                {producto}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
