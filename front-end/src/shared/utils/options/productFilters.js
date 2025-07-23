// Filters to use in product discovery
export const PRODUCT_FILTERS = {
  name: {
    label: "Nombre",
    default: "",
    type: "text",
  },
  type: {
    label: "Categoría",
    default: "all",
    type: "select",
    // options injected from productTypes
  },
  price: {
    label: "Rango de Precios",
    default: [0, 20000],
    type: "range",
    min: 0,
    max: 20000,
    step: 500,
  },
  quantity: {
    label: "Disponibilidad mínima",
    default: "",
    type: "number",
  },
  harvest_date: {
    label: "Fecha de cosecha",
    default: "",
    type: "date",
  },
}
