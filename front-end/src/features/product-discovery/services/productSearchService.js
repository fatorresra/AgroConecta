import axios from "axios";
import { PORTS } from "../../../shared/utils/Ports";
// import { useAuthStore } from "../../authentication/store/AuthStore";

const BASE_URL = PORTS.PRODUCTS.BASE_URL;
const SEARCH_URL = PORTS.PRODUCTS.SEARCH_URL;

const transformProduct = (product) => {
  // Si el producto es null o undefined, retornar null
  if (!product) return null;

  return {
    // Use product_id from backend, or keep temp id if it exists
    id: product.id?.startsWith?.('temp-') ? product.id : product.product_id,
    
    // Datos básicos
    name: product.name || '',
    type: product.type || '',
    description: product.description || '',
    
    // Datos numéricos (asegurar que son números)
    price_per_unit: Number(product.price_per_unit || 0),
    quantity: Number(product.quantity || 0),
    total_value: Number(product.total_value || 0),
    
    // Fechas (mantener formato ISO)
    harvest_date: product.harvest_date || null,
    created_at: product.created_at || new Date().toISOString(),
    
    // Datos adicionales
    farm_id: product.farm_id || null,
    image: product.image || "/placeholder.svg?height=80&width=80",

    // Nombres de datos alternativos por compatibilidad
    category: product.type || '',
    price: product.price_per_unit || 0,
    farmer_id: product.farm_id || null,

    // Nombres en español alternativos por compatibilidad
    nombre: product.name || '',
    imagen: product.image || "/placeholder.svg?height=80&width=80",
    precio: product.price_per_unit || 0,
    unidad: product.unit || 'unidad',
  };
};

export function buildProductQueryParams(filters) {
  const params = new URLSearchParams();
  if (!filters) return '';

  // Map of special handlers for specific filter keys
  const specialHandlers = {
    price: (value) => {
      if (Array.isArray(value)) {
        params.append('min_price', value[0]);
        params.append('max_price', value[1]);
      }
    },
    // Only filtering by dates after harvest_date for now
    harvest_date: (value) => {
      if (value) {
        try {
          params.append('harvest_date_start', new Date(value).toISOString());
        } catch {
          params.append('harvest_date_start', value);
        }
      }
    },
    quantity: (value) => {
      if (value) {
        params.append('min_quantity', value);
      }
    },
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'all')
      return;
    if (specialHandlers[key]) {
      specialHandlers[key](value);
    } else {
      params.append(key, value);
    }
  });
  return params.toString();
}

export const productSearchService = {
  getProducts: async (filters) => {
    try {
      const query = buildProductQueryParams(filters);
      const url = query ? `${SEARCH_URL}/product-search?${query}` : `${SEARCH_URL}/product-search`;
      console.log('Fetching products from:', url);

      const response = await axios.get(url);
      const products = response.data.map(transformProduct);
      console.log('Number of products found:', products.length);

      return {
        success: true,
        products
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener productos",
        products: []
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      const product = transformProduct(response.data);
      return {
        success: true,
        product
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Producto no encontrado',
          product: null
        };
      }
      return {
        success: false,
        message: error.response?.data?.error || 'Error al obtener el producto',
        product: null
      };
    }
  }
};

export default productSearchService;