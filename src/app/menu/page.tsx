"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Star,
  Flame,
  Plus,
  Minus,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// --- DỮ LIỆU MẪU (MOCK DATA) ---
const categories = [
  "Tất cả",
  "Khai vị",
  "Món chính",
  "Hải sản",
  "Rượu vang",
  "Tráng miệng",
];

const products = [
  {
    id: "P01",
    name: "Thịt bò Wagyu sốt vang",
    category: "Món chính",
    price: 1250000,
    calories: 650,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1544025162-8315520c6792?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: "P02",
    name: "Tôm hùm đút lò phô mai",
    category: "Hải sản",
    price: 1850000,
    calories: 520,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: "P03",
    name: "Súp bào ngư vi cá",
    category: "Khai vị",
    price: 950000,
    calories: 320,
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1548943487-a2e4b43b5930?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: "P04",
    name: "Rượu Vang Chateau Margaux",
    category: "Rượu vang",
    price: 4500000,
    calories: 150,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: "P05",
    name: "Salad cá hồi Na Uy",
    category: "Khai vị",
    price: 350000,
    calories: 210,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: "P06",
    name: "Bánh Mousse Chanh Dây",
    category: "Tráng miệng",
    price: 180000,
    calories: 380,
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=500",
  },
];

export default function CustomerMenuPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State Giỏ hàng: Lưu id món và số lượng
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      activeCategory === "Tất cả" || p.category === activeCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Logic Giỏ hàng
  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setIsCartOpen(true); // Tự động mở giỏ hàng khi thêm món
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: newQty };
    });
  };

  // Tính toán hóa đơn
  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);
  const vat = subtotal * 0.1; // VAT 10%
  const total = subtotal + vat;

  // Format tiền VNĐ
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="bg-glow-blue top-[-10%] left-[-10%] opacity-40 fixed pointer-events-none"></div>

      {/* Navbar Khách hàng Mini */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-wide">CIJIBI</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white transition-colors"
          >
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-accent text-[#0F172A] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
              >
                {cartItemsCount}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Thực Đơn Tinh Hoa
          </h1>
          <p className="text-slate-400">
            Khám phá bộ sưu tập ẩm thực đẳng cấp được chế biến từ những nguyên
            liệu thượng hạng nhất.
          </p>
        </div>

        {/* Bảng điều khiển (Lọc & Tìm kiếm) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Tabs Danh mục */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "glass-card text-slate-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Ô Tìm kiếm */}
          <div className="relative w-full md:w-72 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input !rounded-full !pl-11"
            />
          </div>
        </div>

        {/* Lưới Sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
                className="glass-card rounded-3xl overflow-hidden group flex flex-col border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Ảnh */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="glass-card px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 backdrop-blur-md bg-black/30 border-white/10">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-yellow-400"
                      />{" "}
                      {product.rating}
                    </span>
                    <span className="glass-card px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 backdrop-blur-md bg-black/30 border-white/10">
                      <Flame size={12} className="text-orange-400" />{" "}
                      {product.calories} kcal
                    </span>
                  </div>
                </div>

                {/* Nội dung Card */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-xs text-primary font-medium uppercase tracking-wider mb-4">
                    {product.category}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                      {formatMoney(product.price)}
                    </span>

                    {cart[product.id] ? (
                      <div className="flex items-center gap-3 bg-slate-800 rounded-full p-1 border border-slate-700">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1.5 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-4 text-center font-bold text-white text-sm">
                          {cart[product.id]}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1.5 bg-primary rounded-full text-white hover:bg-secondary transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-5 py-2.5 bg-white text-[#0F172A] font-bold rounded-full hover:bg-slate-200 transition-all flex items-center gap-2"
                      >
                        <Plus size={18} /> Thêm
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            Không tìm thấy món ăn nào phù hợp với tìm kiếm của bạn.
          </div>
        )}
      </main>

      {/* --- SLIDE-OUT CART (GIỎ HÀNG) --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay nền đen mờ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel Giỏ hàng trượt từ phải sang */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0F172A] border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart size={24} className="text-primary" />
                  Giỏ hàng của bạn
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItemsCount === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                    <ShoppingCart size={64} className="opacity-20" />
                    <p>Giỏ hàng đang trống</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const product = products.find((p) => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} className="flex gap-4 items-center">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-20 h-20 rounded-xl object-cover border border-white/10"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-sm leading-tight mb-1">
                            {product.name}
                          </h4>
                          <p className="text-accent font-medium text-sm mb-3">
                            {formatMoney(product.price)}
                          </p>
                          <div className="flex items-center gap-3 w-fit bg-slate-800 rounded-full p-1 border border-slate-700">
                            <button
                              onClick={() => updateQuantity(id, -1)}
                              className="p-1 hover:bg-slate-700 rounded-full text-slate-300"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center font-bold text-white text-xs">
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQuantity(id, 1)}
                              className="p-1 hover:bg-slate-700 rounded-full text-slate-300"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right font-bold text-white">
                          {formatMoney(product.price * qty)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Phần tính tiền (Footer của Cart) */}
              {cartItemsCount > 0 && (
                <div className="p-6 bg-slate-900 border-t border-white/10 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Tạm tính</span>
                      <span className="text-white">
                        {formatMoney(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Thuế VAT (10%)</span>
                      <span className="text-white">{formatMoney(vat)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-white/10 pt-4 mb-6">
                    <span className="text-slate-300 font-medium">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatMoney(total)}
                    </span>
                  </div>

                  <button className="w-full py-4 rounded-xl bg-primary hover:bg-secondary text-white font-bold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all flex items-center justify-center gap-2 group">
                    Tiến hành Thanh toán
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
