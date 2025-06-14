import { create } from 'zustand';
import { productService } from '../services/productService';

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  selectedProduct: null,

  // Acciones
  fetchProducts: async () => {
    set({ isLoading: true });
    const response = await productService.getProducts();
    if (response.success) {
      set({ 
        products: response.products, 
        isLoading: false,
        error: null 
      });
    } else {
      set({ 
        error: response.message, 
        isLoading: false 
      });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true });
    const response = await productService.createProduct(productData);
    if (response.success) {
      set(state => ({ 
        products: [...state.products, response.product],
        isLoading: false,
        error: null
      }));
      return true;
    } else {
      set({ 
        error: response.message, 
        isLoading: false 
      });
      return false;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    const response = await productService.updateProduct(id, productData);
    if (response.success) {
      set(state => ({
        products: state.products.map(product =>
          product.id === id ? response.product : product
        ),
        isLoading: false,
        error: null
      }));
      return true;
    } else {
      set({ 
        error: response.message, 
        isLoading: false 
      });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    const response = await productService.deleteProduct(id);
    if (response.success) {
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        isLoading: false,
        error: null
      }));
      return true;
    } else {
      set({ 
        error: response.message, 
        isLoading: false 
      });
      return false;
    }
  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
  },

  clearSelectedProduct: () => {
    set({ selectedProduct: null });
  },

  clearError: () => {
    set({ error: null });
  }
}));
