import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. Import middleware persist

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

// 2. Bọc toàn bộ logic bên trong hàm persist()
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cart: currentCart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({
            cart: [
              ...currentCart,
              { id: item.id, name: item.name, price: item.price, quantity: 1 },
            ],
          });
        }
      },
      removeFromCart: (id) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((i) => i.id === id);
        if (existingItem && existingItem.quantity > 1) {
          set({
            cart: currentCart.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          });
        } else {
          set({ cart: currentCart.filter((i) => i.id !== id) });
        }
      },
      clearCart: () => set({ cart: [] }),
      totalPrice: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "cijibi-cart-storage", // 3. Tên khóa lưu trữ trong LocalStorage
    },
  ),
);
