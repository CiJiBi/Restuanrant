import { create } from "zustand";

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

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  // Thêm món vào giỏ
  addToCart: (item) => {
    const currentCart = get().cart;
    const existingItem = currentCart.find((i) => i.id === item.id);

    // Nếu món đã có, tăng số lượng
    if (existingItem) {
      set({
        cart: currentCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      });
    } else {
      // Nếu món chưa có, thêm mới với số lượng 1
      set({
        cart: [
          ...currentCart,
          { id: item.id, name: item.name, price: item.price, quantity: 1 },
        ],
      });
    }
  },
  // Trừ số lượng hoặc xóa món
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
  // Xóa sạch giỏ hàng
  clearCart: () => set({ cart: [] }),
  // Tính tổng tiền
  totalPrice: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
}));
