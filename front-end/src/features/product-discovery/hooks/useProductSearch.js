import { useEffect } from 'react';
import { useProductSearchStore } from '../store/productSearchStore';

export const useProductSearch = (productId) => {
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
      fetchProducts();
    }
    // eslint-disable-next-line
  }, []);

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
