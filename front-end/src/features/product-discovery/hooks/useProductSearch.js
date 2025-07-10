import { useEffect } from 'react';
import { useProductSearchStore } from '../store/productSearchStore';

export const useProductSearch = (fetchOnMount = true) => {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    selectedProduct,
    clearError,
    clearSelectedProduct
  } = useProductSearchStore();

  useEffect(() => {
    if (fetchOnMount) {
      fetchProducts();
    }
    // eslint-disable-next-line
  }, [fetchOnMount]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    selectedProduct,
    clearError,
    clearSelectedProduct
  };
};
