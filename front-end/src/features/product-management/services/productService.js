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

export const productService = {
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
      // Asegurarse de que solo enviamos los campos que han cambiado
      const updateFields = {};
      if (productData.name !== undefined) updateFields.name = productData.name;
      if (productData.type !== undefined) updateFields.type = productData.type;
      if (productData.quantity !== undefined) updateFields.quantity = Number(productData.quantity);
      if (productData.price_per_unit !== undefined) updateFields.price_per_unit = Number(productData.price_per_unit);
      if (productData.description !== undefined) updateFields.description = productData.description;
      if (productData.harvest_date !== undefined) updateFields.harvest_date = productData.harvest_date;

      console.log('Sending update with fields:', updateFields); // Debug log

      const config = getAuthHeader();
      const response = await axios.patch(
        `${BASE_URL}/products/${id}`,
        updateFields,
        config
      );

      console.log('Update response:', response.data); // Debug log

      // La respuesta tiene la estructura { message, product }
      if (response.data.product) {
        return {
          success: true,
          message: response.data.message,
          // Transformamos el producto devuelto por el backend
          product: transformProduct(response.data.product)
        };
      }

      return {
        success: false,
        message: "No se recibieron los datos del producto actualizado"
      };
    } catch (error) {
      console.error('Error updating product:', error.response || error);
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "No autorizado. Por favor, inicie sesión nuevamente.",
        };
      }
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message || "Error en los datos enviados",
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
