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

    // 3. Return true immediately to close the modal
    setTimeout(async () => {
      try {
        // 4. Try to create the product in the backend
        const response = await productService.createProduct(productData);
        
        if (response.success) {
          // 5. If successful, update the products list
          const productsResponse = await productService.getMyProducts();
          if (productsResponse.success) {
            set({ 
              products: productsResponse.products,
              error: null
            });
          }
        } else {
          // 6. If creation failed, remove temp product
          console.error('Failed to create product:', response);
          set(state => ({
            products: state.products.filter(p => p.id !== tempId),
            error: "Failed to create product"
          }));
        }
      } catch (error) {
        // 7. If error occurred, remove temp product
        console.error('Error creating product:', error);
        set(state => ({
          products: state.products.filter(p => p.id !== tempId),
          error: error.message
        }));
      }
    }, 0);

    return true;
  },

  updateProduct: async (id, productData) => {
    // 1. Actualización optimista inmediata
    const originalProducts = get().products;
    const updatedProduct = {
      ...originalProducts.find(p => p.id === id),
      ...productData
    };

    // 2. Actualizar inmediatamente en el estado
    set(state => ({
      products: state.products.map(p =>
        p.id === id ? updatedProduct : p
      ),
      error: null
    }));

    // 3. Retornar true inmediatamente para cerrar el modal
    setTimeout(async () => {
      try {
        // 4. Intentar actualizar en el backend
        const response = await productService.updateProduct(id, productData);
        
        if (response.success) {
          // 5. Si es exitoso, actualizar la lista completa
          const productsResponse = await productService.getMyProducts();
          if (productsResponse.success) {
            set({ 
              products: productsResponse.products,
              error: null
            });
          }
        } else {
          // 6. Si falló, revertir los cambios
          console.error('Update failed:', response.message);
          set(state => ({
            products: originalProducts,
            error: response.message
          }));
        }
      } catch (error) {
        // 7. En caso de error, revertir
        console.error('Update error:', error);
        set(state => ({
          products: originalProducts,
          error: error.message
        }));
      }
    }, 0);

    return true;
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
