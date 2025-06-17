import ProductInput from "../atoms/ProductInput"

export default function ProductPricing({ 
  producto, 
  onChange,
  errors = {}
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ProductInput 
        id="price_per_unit"
        label="Precio por Unidad (COP)"
        type="number"
        placeholder="Ej: 25000"
        defaultValue={producto?.price_per_unit}
        onChange={(e) => {
          const value = e.target.value;
          // Asegurarnos de que es un número válido y positivo
          if (!isNaN(value) && Number(value) >= 0) {
            onChange("price_per_unit", value);
          }
        }}
        error={errors.price_per_unit}
      />
      
      <ProductInput
        id="quantity"
        label="Cantidad Disponible"
        type="number"
        placeholder="Ej: 100"
        defaultValue={producto?.quantity}
        onChange={(e) => {
          const value = e.target.value;
          // Asegurarnos de que es un número entero válido y positivo
          if (!isNaN(value) && Number(value) >= 0) {
            onChange("quantity", value);
          }
        }}
        error={errors.quantity}
      />

      <div className="col-span-2">
        <ProductInput
          id="harvest_date"
          label="Fecha de Cosecha"
          type="date"
          defaultValue={producto?.harvest_date}
          onChange={(e) => {
            const date = e.target.value;
            // La fecha se convertirá a ISO 8601 en el momento del envío
            onChange("harvest_date", date);
          }}
          error={errors.harvest_date}
        />
      </div>
    </div>
  )
}
