import { create } from 'zustand';
import { productService } from '../services/productService';

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,
  selectedProduct: null,

  // Acciones
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await productService.getMyProducts();
      if (response.success) {
        // response.products already contains the transformed products array
        set({ products: response.products, isLoading: false, error: null });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addProduct: async (productData) => {
    // 1. Add temp product with only English field names
    const tempId = `temp-${Date.now()}`;
    const tempProduct = {
      ...productData,
      id: tempId,
      status: "Activo",
      image: "/placeholder.svg?height=80&width=80",
      visits: 0,
      created_at: new Date().toISOString()
    };
    set(state => ({
      products: [...state.products, tempProduct],
      error: null
    }));
    try {
      const response = await productService.createProduct(productData);
      if (response.success && response.product) {
        // Replace temp product with real one from backend
        set(state => ({
          products: state.products.map(p =>
            p.id === tempId ? response.product : p
          ),
          error: null
        }));
        return true;
      }
      // If no valid product in response, remove the temp one
      set(state => ({
        products: state.products.filter(p => p.id !== tempId),
        error: "Failed to create product"
      }));
      return false;
    } catch (error) {
      set(state => ({
        products: state.products.filter(p => p.id !== tempId),
        error: error.message
      }));
      return false;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await productService.updateProduct(id, productData);
      if (response.success) {
        set(state => ({
          products: state.products.map(p =>
            p.id === id ? response.product : p
          ),
          error: null
        }));
        return true;
      }
      set({ error: response.message });
      return false;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },
  deleteProduct: async (id) => {
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        set(state => ({
          products: state.products.filter(p => p.id !== id),
          error: null
        }));
        return true;
      }
      set({ error: response.message });
      return false;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  clearError: () => set({ error: null }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null })
}));
