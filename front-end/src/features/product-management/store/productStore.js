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
    // 1. Create optimistic temp product with all required fields
    const tempId = `temp-${Date.now()}`;
    const tempProduct = {
      id: tempId,
      name: productData.name || '',
      type: productData.type || '',
      price_per_unit: Number(productData.price_per_unit || 0),
      quantity: Number(productData.quantity || 0),
      description: productData.description || '',
      harvest_date: productData.harvest_date || null,
      created_at: new Date().toISOString(),
      status: "Activo",
      image: "/placeholder.svg?height=80&width=80",
      visits: 0
    };

    // 2. Add temp product to state immediately
    set(state => ({
      products: [...state.products, tempProduct],
      error: null
    }));

    try {
      // 3. Create product in backend
      const response = await productService.createProduct(productData);
      if (response.success) {
        // Keep temp product until next natural fetch
        console.log('Product created successfully, keeping temp version until next fetch');
        return true;
      }
      
      // 4. If creation failed, remove temp product
      console.error('Failed to create product:', response);
      set(state => ({
        products: state.products.filter(p => p.id !== tempId),
        error: "Failed to create product"
      }));
      return false;
    } catch (error) {
      // 5. Handle any errors by removing temp product
      console.error('Error creating product:', error);
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
