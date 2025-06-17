import axios from "axios";
import { PORTS } from "../../../shared/utils/Ports";
import { useAuthStore } from "../../authentication/store/AuthStore";

const BASE_URL = PORTS.PRODUCTS.BASE_URL;

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    console.warn('No se encontró token de autorización');
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

const transformProduct = (product) => ({
  // Keep existing id if it's a temp id (starts with 'temp-'), otherwise use product_id from backend
  id: product.id?.startsWith?.('temp-') ? product.id : product.product_id,
  name: product.name || '',                  // Use || instead of ?? for empty strings
  price_per_unit: Number(product.price_per_unit || 0),
  quantity: Number(product.quantity || 0),   
  type: product.type || '',                  
  description: product.description || '',     
  harvest_date: product.harvest_date || null,
  created_at: product.created_at || new Date().toISOString(),
  status: "Activo",                         
  image: product.image || "/placeholder.svg?height=80&width=80",
  visits: Number(product.visits || 0)        
});
export const productService = {
  getProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      const products = response.data.map(transformProduct);
      // console.log("Productos actuales:", products);
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


  getMyProducts: async () => {
    try {
      const { headers } = getAuthHeader();
      const response = await axios.get(`${BASE_URL}/products/me`, { headers });
      // Ahora usamos response.data.products que es el array de productos
      const products = response.data.products.map(transformProduct);
      console.log('Products fetched:', products); // Para debug
      return { 
        success: true, 
        products,
        count: response.data.count,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching my products:', error);
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "No autorizado. Por favor, inicie sesión nuevamente.",
        };
      }
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "No tienes permisos para ver estos productos",
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener tus productos",
      };
    }
  },



  createProduct: async (productData) => {
    try {
      const config = getAuthHeader();
      const response = await axios.post(
        `${BASE_URL}/products`, 
        productData,
        config
      );
      
      console.log('Create product response:', response.data);
      
      // Solo verificamos si la creación fue exitosa
      return { 
        success: true,
        message: response.data.message || 'Product created successfully'
      };
    } catch (error) {
      console.error('Error in createProduct:', error);
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "No autorizado. Por favor, inicie sesión nuevamente.",
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || "Error al crear producto",
      };
    }
  },
  updateProduct: async (id, productData) => {
    try {
      const config = getAuthHeader();
      const response = await axios.patch(
        `${BASE_URL}/products/${id}`,
        productData,
        config
      );
      return {
        success: true,
        product: transformProduct(response.data)
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "No autorizado. Por favor, inicie sesión nuevamente.",
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || "Error al actualizar producto",
      };
    }
  },
  deleteProduct: async (id) => {
    try {
      const { headers } = getAuthHeader();
      await axios.delete(`${BASE_URL}/products/${id}`, { headers });
      return {
        success: true,
        id
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "No tienes permisos para eliminar este producto.",
        };
      }
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "No autorizado. Por favor, inicie sesión nuevamente.",
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || "Error al eliminar producto",
      };
    }
  }
};
