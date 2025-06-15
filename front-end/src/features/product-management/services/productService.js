import axios from "axios";
import { PORTS } from "../../../shared/utils/Ports";
import { useAuthStore } from "../../authentication/store/AuthStore";

const BASE_URL = PORTS.PRODUCTS.BASE_URL;

const getAuthHeader = () => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

const transformProduct = (product) => ({
  id: product.product_id,
  nombre: product.name,
  precio: product.price_per_unit,
  cantidad: `${product.quantity} unidades`,
  estado: "Activo", //could be implemeted later in the backend
  imagen: product.image || "/placeholder.svg?height=80&width=80", // default image if not provided
  visitas: 0,//could be implemeted later in backend
  fechaPublicacion: new Date(product.created_at).toLocaleDateString(),
  tipo: product.type,
  descripcion: product.description,
  fechaCosecha: new Date(product.harvest_date).toLocaleDateString()
});

export const productService = {
  getProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      return { 
        success: true, 
        products: response.data.map(transformProduct)
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener productos",
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
      const config = getAuthHeader();
      await axios.delete(
        `${BASE_URL}/products/${id}`,
        config
      );
      return { 
        success: true,
        id 
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
        message: error.response?.data?.message || "Error al eliminar producto",
      };
    }
  }
};
