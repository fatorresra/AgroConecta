import axios from "axios";
import { PORTS } from "../../../shared/utils/Ports";

const BASE_URL = PORTS.PRODUCTS.BASE_URL;

export async function getProducts() {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    // Transformamos los datos para que coincidan con nuestro formato de UI
    const transformedProducts = response.data.map((product) => ({
      id: product.product_id,
      nombre: product.name,
      precio: product.price_per_unit,
      cantidad: `${product.quantity} unidades`,
      estado: "Activo", // Esto podría venir del backend en el futuro
      visitas: 0, // Esto podría venir del backend en el futuro
      fechaPublicacion: new Date(product.created_at).toLocaleDateString(),
      tipo: product.type,
      descripcion: product.description,
      fechaCosecha: new Date(product.harvest_date).toLocaleDateString(),
    }));

    return { success: true, products: transformedProducts };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener productos",
    };
  }
}