"use client";
import { useCartStore } from "../store/useCartStore";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function FloatingCart() {
  const { cart, addToCart, removeFromCart, clearCart, totalPrice } =
    useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const handleCheckout = () => {
    setIsOrdering(true);

    // Giả lập thời gian chờ gọi API (1 giây)
    setTimeout(() => {
      alert("🎉 Đặt món thành công! Cijibi sẽ sớm chuẩn bị món cho bạn.");
      clearCart(); // Làm sạch giỏ hàng
      setIsOpen(false); // Đóng popup
      setIsOrdering(false); // Tắt trạng thái loading
    }, 1000);
  };
  if (cart.length === 0) return 1; // Ẩn nếu giỏ hàng trống

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Khung chi tiết giỏ hàng */}
      {isOpen && (
        <div className="mb-4 w-80 rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold text-lg">Giỏ hàng của bạn</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto p-4 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-blue-600">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-black"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium text-sm w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="text-gray-500 hover:text-black"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Tổng cộng:</span>
              <span className="text-blue-600">
                {totalPrice().toLocaleString("vi-VN")} đ
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isOrdering}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isOrdering ? "Đang xử lý..." : "Tiến hành Đặt món"}
            </button>
          </div>
        </div>
      )}

      {/* Nút bấm giỏ hàng nổi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition-transform"
      >
        <ShoppingCart size={28} />
        <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white border-2 border-white">
          {cart.reduce((total, item) => total + item.quantity, 0)}
        </span>
      </button>
    </div>
  );
}
