import axios from "axios";
import { PORTS } from "../../../shared/utils/Ports";
// import { useAuthStore } from "../../authentication/store/AuthStore";

const BASE_URL = PORTS.PRODUCTS.BASE_URL;

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
    status: "Activo",
    image: product.image || "/placeholder.svg?height=80&width=80",
    visits: Number(product.visits || 0)
  };
};

export const productSearchService = {
  getProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      const products = response.data.map(transformProduct);
      return {
        success: true,
        products
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener productos",
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      return {
        success: true,
        product: transformProduct(response.data)
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener el producto",
      };
    }
  }
};
