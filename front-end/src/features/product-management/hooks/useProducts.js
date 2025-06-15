import { useEffect } from 'react';
import { useProductStore } from '../store/productStore';

export const useProducts = () => {
  const { 
    products, 
    isLoading, 
    error,
    selectedProduct,
    fetchProducts,
    addProduct,
    // updateProduct,
    // deleteProduct,
    setSelectedProduct,
    clearSelectedProduct,
    clearError
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
    // Only on mount
    // eslint-disable-next-line
  }, []);

  return {
    // Estado
    products,
    isLoading,
    error,
    selectedProduct,
    
    // Acciones
    addProduct,
    updateProduct: (...args) => { throw new Error("updateProduct no implementado. Implementa este método en el hook."); },
    deleteProduct: (...args) => { throw new Error("deleteProduct no implementado. Implementa este método en el hook."); },
    setSelectedProduct,
    clearSelectedProduct,
    clearError,
    
    // Utilidades
    refreshProducts: fetchProducts
  };
};
