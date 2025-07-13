import { useState, useEffect } from 'react';
import { productDiscoveryService } from '../services/ProductDiscoveryService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Cargar productos iniciales
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productDiscoveryService.getAllProducts();
      if (response.success) {
        setProducts(response.products);
        setTotalProducts(response.count);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error al cargar productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías
  const loadCategories = async () => {
    try {
      const response = await productDiscoveryService.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Buscar productos con filtros
  const searchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productDiscoveryService.searchProducts(filters);
      if (response.success) {
        setProducts(response.products);
        setTotalProducts(response.count);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error al buscar productos');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un producto por ID
  const getProductById = async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productDiscoveryService.getProductById(productId);
      if (response.success) {
        return response.product;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError('Error al obtener el producto');
      console.error('Error fetching product by id:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  return {
    // Estado
    products,
    categories,
    loading,
    error,
    totalProducts,
    
    // Acciones
    loadProducts,
    searchProducts,
    getProductById,
    clearError,
    
    // Función para recargar todos los productos sin filtros
    reloadAllProducts: loadProducts
  };
};

export default useProducts; 