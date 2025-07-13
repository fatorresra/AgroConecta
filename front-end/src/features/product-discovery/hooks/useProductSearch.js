import { useEffect } from 'react';
import { useProductSearchStore } from '../store/productSearchStore';

export const useProductSearch = (filters, productId) => {
  const {
    products,
    selectedProduct,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    clearError,
    clearSelectedProduct
  } = useProductSearchStore();

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    } else {
      fetchProducts(filters);
    }
    // eslint-disable-next-line
  }, [filters, productId]);

  return {
    products,
    selectedProduct,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    clearError,
    clearSelectedProduct
  };
};
