import ProductInput from "../atoms/ProductInput"
import ProductSelect from "../atoms/ProductSelect"

export default function ProductPricing({ 
  producto, 
  onChange,
  errors = {}
}) {
  const unitOptions = [
    { value: "kg", label: "Kilogramos" },
    { value: "g", label: "Gramos" },
    { value: "lb", label: "Libras" },
    { value: "unidad", label: "Unidad" },
    { value: "docena", label: "Docena" }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      <ProductInput 
        id="precio"
        label="Precio (COP)"
        type="number"
        placeholder="Ej: 25000"
        defaultValue={producto?.precio}
        onChange={(e) => onChange("precio", e.target.value)}
        error={errors.precio}
      />
      
      <ProductSelect
        id="unidad"
        label="Unidad de Medida"
        options={unitOptions}
        defaultValue={producto?.unidad}
        onChange={(value) => onChange("unidad", value)}
        placeholder="Selecciona unidad"
        error={errors.unidad}
      />
    </div>
  )
}
