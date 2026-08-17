"use client";

import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Utensils,
  User,
  MapPin,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function POSPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const categories = [
    "ALL",
    ...Array.from(
      new Set(menuItems.map((item) => item.category?.name).filter(Boolean)),
    ),
  ] as string[];

  // 3. Tạo danh sách món ăn đã được lọc
  const filteredMenuItems =
    selectedCategory === "ALL"
      ? menuItems
      : menuItems.filter((item) => item.category?.name === selectedCategory);
  // Lấy danh sách thực đơn từ Backend khi vào trang
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get("/menu");
        const payload = response.data;
        if (payload?.data && Array.isArray(payload.data)) {
          setMenuItems(payload.data);
        } else if (Array.isArray(payload)) {
          setMenuItems(payload);
        }
      } catch (error) {
        console.error("Lỗi tải thực đơn:", error);
      }
    };
    fetchMenu();
  }, []);

  // Các hàm xử lý giỏ hàng
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Hàm gửi Đơn hàng lên Backend
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Giỏ hàng đang trống!");

    setIsSubmitting(true);
    try {
      const payload = {
        customer: customer || "Khách vãng lai",
        tableNumber: tableNumber || "Mang đi",
        totalAmount: totalAmount,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await api.post("/orders", payload);
      alert("🎉 Đặt món thành công!");

      // Reset lại màn hình sau khi đặt xong
      setCart([]);
      setTableNumber("");
      setCustomer("");
    } catch (error) {
      console.error("Lỗi đặt món:", error);
      alert("Có lỗi xảy ra, không thể đặt món.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen max-h-screen bg-slate-900 text-slate-300">
      {/* CỘT TRÁI: DANH SÁCH MÓN ĂN */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Utensils className="text-blue-500" /> Thực đơn
          </h1>
        </div>
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0 bg-slate-900/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-500"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
              }`}
            >
              {cat === "ALL" ? "🍽️ Tất cả món" : cat}
            </button>
          ))}
        </div>
        {/* LƯU Ý: Thêm auto-rows-max và content-start vào class của Grid để chống kéo giãn */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-max content-start">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden cursor-pointer hover:bg-slate-750 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group select-none flex flex-col"
            >
              {/* Vùng hình ảnh: Nếu có ảnh thì hiện ảnh, không có thì hiện khung icon đẹp mắt */}
              <div className="h-40 w-full relative overflow-hidden bg-slate-800">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700/50 to-slate-800 group-hover:scale-105 transition-transform duration-500">
                    <Utensils className="text-slate-600 w-12 h-12 opacity-50" />
                  </div>
                )}

                {/* Nút Cộng (Dấu Plus) nổi lên góc phải ảnh */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:bg-blue-500 flex items-center justify-center transition-colors border border-white/10">
                  <Plus size={18} />
                </button>

                {/* Tag Giá tiền nổi lên góc trái ảnh */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/10 flex items-center shadow-lg">
                  <span className="font-bold text-green-400 text-sm">
                    {item.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Thông tin tên món ăn */}
              <div className="p-4 bg-gradient-to-b from-transparent to-slate-900/40">
                <h3 className="text-slate-200 font-semibold line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: GIỎ HÀNG */}
      <div className="w-full lg:w-[400px] bg-slate-800/50 border-l border-slate-800 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-slate-800 bg-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-blue-500" /> Giỏ hàng hiện tại
          </h2>
        </div>

        {/* Danh sách món đã chọn */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
              <ShoppingBag size={48} className="mb-4" />
              <p>Chưa có món nào được chọn</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700/50"
              >
                <div className="flex-1 pr-3">
                  <h4 className="text-sm font-medium text-white line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-green-400 font-bold mt-1">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Khu vực Thanh toán & Thông tin */}
        <div className="p-6 bg-slate-800 border-t border-slate-700 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-900 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 focus-within:border-blue-500 transition-colors">
              <MapPin size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Bàn (VD: Bàn 5)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex-1 bg-slate-900 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 focus-within:border-blue-500 transition-colors">
              <User size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Tên khách"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-400">Tổng cộng:</span>
            <span className="text-2xl font-black text-green-400">
              {totalAmount.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0 || isSubmitting}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${
              cart.length === 0
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Xác nhận Đặt món"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
