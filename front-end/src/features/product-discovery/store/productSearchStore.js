import { create } from 'zustand';
import { productSearchService } from '../services/productSearchService';

export const useProductSearchStore = create((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  // Get all products
  fetchProducts: async (filters) => {
    set({ isLoading: true });
    try {
      const response = await productSearchService.getProducts(filters);
      if (response.success) {
        set({ products: response.products, isLoading: false, error: null });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Get product details by ID
  fetchProductById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await productSearchService.getProductById(id);
      if (response.success) {
        set({ selectedProduct: response.product, isLoading: false, error: null });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedProduct: () => set({ selectedProduct: null })
}));
