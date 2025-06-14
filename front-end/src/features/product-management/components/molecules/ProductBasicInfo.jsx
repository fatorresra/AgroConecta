import ProductInput from "../atoms/ProductInput"
import ProductSelect from "../atoms/ProductSelect"

export default function ProductBasicInfo({ 
  producto, 
  onChange,
  errors = {}
}) {
  const categoryOptions = [
    { value: "frutas", label: "Frutas" },
    { value: "verduras", label: "Verduras" },
    { value: "cafe", label: "Café" },
    { value: "cacao", label: "Cacao" },
    { value: "tuberculos", label: "Tubérculos" },
    { value: "granos", label: "Granos" }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      <ProductInput 
        id="nombre"
        label="Nombre del Producto"
        placeholder="Ej: Café Orgánico Premium"
        defaultValue={producto?.nombre}
        onChange={(e) => onChange("nombre", e.target.value)}
        error={errors.nombre}
      />
      
      <ProductSelect
        id="categoria"
        label="Categoría"
        options={categoryOptions}
        defaultValue={producto?.categoria}
        onChange={(value) => onChange("categoria", value)}
        placeholder="Selecciona categoría"
        error={errors.categoria}
      />
    </div>
  )
}
