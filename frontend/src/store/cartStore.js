import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addItem: (product, size, requestedQuantity) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product === product._id && item.size === size
          );

          // Calculate quantity taking stock into account
          const itemInCart = existingItemIndex >= 0 ? state.items[existingItemIndex].quantity : 0;
          let newQuantity = itemInCart + requestedQuantity;

          if (product.stock < newQuantity) {
            toast.error(`Apenas ${product.stock} unidades em estoque.`);
            newQuantity = product.stock;
            if (newQuantity <= itemInCart) return { items: state.items };
          }

          toast.success(`${product.name} adicionado ao carrinho!`);

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity = newQuantity;
            return { items: updatedItems, isCartOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.salePrice || product.price,
                size,
                quantity: newQuantity,
                stock: product.stock,
              },
            ],
            isCartOpen: true,
          };
        });
      },

      updateQuantity: (productId, size, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.product === productId && item.size === size) {
              const newQty = Math.max(1, Math.min(quantity, item.stock));
              return { ...item, quantity: newQty };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product === productId && item.size === size)
          ),
        }));
        toast.success('Item removido do carrinho');
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
);
