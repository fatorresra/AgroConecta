import axios from 'axios';
import { PORTS } from '@/shared/utils/Ports';

const PRODUCTS_API_URL = `${PORTS.PRODUCTS.BASE_URL}/products`;

// Función para transformar producto del backend al formato frontend
const transformProductFromAPI = (product) => {
  if (!product) return null;

  return {
    id: product.product_id,
    nombre: product.name,
    name: product.name,
    agricultor: `Agricultor ${product.farm_id}`, // TODO: Obtener nombre real del agricultor
    farmer: `Agricultor ${product.farm_id}`,
    farmer_id: product.farm_id,
    agricultor_id: product.farm_id,
    ubicacion: 'Colombia', // TODO: Obtener ubicación real
    location: 'Colombia',
    precio: product.price_per_unit,
    price: product.price_per_unit,
    unidad: 'kg', // TODO: Obtener unidad real
    unit: 'kg',
    imagen: '/placeholder.svg?height=200&width=300',
    image: '/placeholder.svg?height=200&width=300',
    rating: 4.5 + Math.random() * 0.5, // Rating simulado
    cosecha: product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Disponible',
    harvest: product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Disponible',
    categoria: product.type,
    category: product.type,
    certificacion: 'Convencional', // TODO: Obtener certificación real
    certification: 'Convencional',
    disponible: product.quantity,
    available: product.quantity,
    descripcion: product.description,
    description: product.description,
    fechaCreacion: product.created_at,
    createdAt: product.created_at
  };
};

export const productDiscoveryService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      console.log('🔍 Obteniendo productos desde:', PRODUCTS_API_URL);
      const response = await axios.get(PRODUCTS_API_URL);
      console.log('📊 Productos del backend:', response.data);
      console.log('📈 Cantidad de productos del backend:', response.data.length);
      
      const products = response.data.map(transformProductFromAPI);
      console.log('🔄 Productos transformados:', products);
      console.log('✅ Cantidad final de productos:', products.length);
      
      return {
        success: true,
        products,
        count: products.length
      };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Error al obtener productos',
        products: []
      };
    }
  },

  // Obtener un producto por ID
  getProductById: async (productId) => {
    try {
      const response = await axios.get(`${PRODUCTS_API_URL}/${productId}`);
      const product = transformProductFromAPI(response.data);
      return {
        success: true,
        product
      };
    } catch (error) {
      console.error('Error fetching product by id:', error);
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
  },

  // Buscar productos con filtros
  searchProducts: async (filters = {}) => {
    try {
      // Obtener todos los productos y filtrar en el frontend
      // TODO: Implementar filtros en el backend cuando esté disponible
      const response = await axios.get(PRODUCTS_API_URL);
      let products = response.data.map(transformProductFromAPI);

      // Aplicar filtros
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(product => 
          product.nombre.toLowerCase().includes(searchTerm) ||
          product.descripcion.toLowerCase().includes(searchTerm) ||
          product.agricultor.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.category && filters.category !== 'Todas') {
        products = products.filter(product => product.categoria === filters.category);
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        products = products.filter(product => 
          product.precio >= min && product.precio <= max
        );
      }

      if (filters.location && filters.location !== 'Todos') {
        products = products.filter(product => 
          product.ubicacion.includes(filters.location)
        );
      }

      if (filters.certification && filters.certification !== 'Todas') {
        products = products.filter(product => 
          product.certificacion === filters.certification
        );
      }

      if (filters.organicOnly) {
        products = products.filter(product => 
          product.certificacion === 'Orgánico'
        );
      }

      // Ordenar productos
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'precio-menor':
            products.sort((a, b) => a.precio - b.precio);
            break;
          case 'precio-mayor':
            products.sort((a, b) => b.precio - a.precio);
            break;
          case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
          case 'recientes':
            products.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
            break;
          default:
            // Relevancia por defecto
            break;
        }
      }

      return {
        success: true,
        products,
        count: products.length
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Error al buscar productos',
        products: []
      };
    }
  },

  // Obtener categorías únicas
  getCategories: async () => {
    try {
      const response = await axios.get(PRODUCTS_API_URL);
      const categories = [...new Set(response.data.map(product => product.type))];
      return {
        success: true,
        categories: ['Todas', ...categories]
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        message: 'Error al obtener categorías',
        categories: ['Todas']
      };
    }
  }
};

export default productDiscoveryService; 