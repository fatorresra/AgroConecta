import ProductInput from "../atoms/ProductInput"
import ProductSelect from "../atoms/ProductSelect"
import { productTypes } from "@/shared/utils/options/productTypes"

export default function ProductBasicInfo({ 
  producto, 
  onChange,
  errors = {}
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ProductInput 
        id="name"
        label="Nombre del Producto"
        placeholder="Ej: Tomates Cherry"
        defaultValue={producto?.name}
        onChange={(e) => onChange("name", e.target.value)}
        error={errors.name}
      />
      
      <ProductSelect
        id="type"
        label="Tipo de Producto"
        options={productTypes}
        defaultValue={producto?.type}
        onChange={(value) => onChange("type", value)}
        placeholder="Selecciona tipo"
        error={errors.type}
      />
    </div>
  )
}
