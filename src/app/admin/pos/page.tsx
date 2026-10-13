"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import api from "../../lib/axios";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Utensils,
  Coffee,
  Flame,
  Send,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  User,
  Phone,
} from "lucide-react";

const socket = io("http://localhost:4000");

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}
interface CartItem extends Product {
  cartId: string;
  quantity: number;
  note: string;
}
interface Table {
  id: string;
  name: string;
  status: string;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedTable, setSelectedTable] = useState<string>("");
  // 👇 State cho CRM Khách hàng
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [activeCategory, setActiveCategory] = useState<string>("TẤT CẢ");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // --- LẤY DỮ LIỆU THẬT TỪ DATABASE ---
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [menuRes, tablesRes] = await Promise.all([
          api.get("/menu"),
          api.get("/tables"),
        ]);

        const menuData = menuRes.data?.data || menuRes.data || [];
        const tablesData = tablesRes.data?.data || tablesRes.data || [];

        setProducts(menuData);

        // 👇 Chỉ lấy những bàn đang TRỐNG
        const emptyTables = tablesData.filter((t: any) => {
          if (!t.status) return true; // Nếu DB chưa có trạng thái, cứ cho hiện ra
          const statusStr = t.status.toString().toUpperCase().trim();
          return (
            statusStr.includes("TRỐNG") ||
            statusStr.includes("TRONG") ||
            statusStr.includes("EMPTY") ||
            statusStr.includes("AVAILABLE")
          );
        });
        setTables(emptyTables);
        if (emptyTables.length > 0) setSelectedTable(emptyTables[0].id);
      } catch (error) {
        showToast("Không thể tải dữ liệu từ máy chủ!", "error");
      }
    };
    fetchStoreData();
  }, []);

  // Tự động tạo danh sách Category từ dữ liệu thực tế
  const categories = [
    "TẤT CẢ",
    ...Array.from(
      new Set(
        products.map((p) => {
          const catData = p.category as any;
          const catName =
            catData && typeof catData === "object" ? catData.name : catData;
          return catName || "KHÁC";
        }),
      ),
    ),
  ];

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- LOGIC GIỎ HÀNG ---
  const addToCart = (product: Product) => {
    const existingItem = cart.find(
      (item) => item.id === product.id && item.note === "",
    );
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.cartId === existingItem.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        { ...product, cartId: Math.random().toString(), quantity: 1, note: "" },
      ]);
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.cartId === cartId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }),
    );
  };

  const removeItem = (cartId: string) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  // --- LƯU DATABASE & BẮN SOCKET ---
  const handleCheckout = async () => {
    if (cart.length === 0) return showToast("Giỏ hàng đang trống!", "error");
    if (!selectedTable) return showToast("Vui lòng chọn bàn!", "error");

    setIsSubmitting(true);
    try {
      // 1. DÙNG CHUNG CẤU TRÚC PAYLOAD VỚI TRANG "SƠ ĐỒ BÀN"
      const dbPayload = {
        items: cart.map((item) => ({
          id: item.id, // ID của món ăn
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          note: item.note,
        })),
      };

      // 2. GỌI ĐÚNG API TẠO ĐƠN CỦA TABLE (Giống hệt bên page Table)
      const res = await api.post(`/tables/${selectedTable}/order`, dbPayload);
      const savedOrder = res?.data?.data || res?.data || {};

      // Cập nhật trạng thái bàn thành Occupied & Gắn tên khách (nếu có)
      await api.patch(`/tables/${selectedTable}/status`, {
        status: "occupied",
        guestName: customerName.trim() || "Khách lẻ",
      });

      // 3. BẮN TÍN HIỆU SANG BẾP (KDS)
      const tableName =
        tables.find((t) => t.id === selectedTable)?.name || "Bàn mang đi";
      const kdsPayload = {
        id:
          savedOrder.orderNumber ||
          savedOrder.id ||
          `#ORD-${Math.floor(Math.random() * 9000)}`,
        dbId: savedOrder.id, // 👈 THÊM DÒNG NÀY: Gửi ID thật của Database sang Bếp
        table: tableName,
        customerName: customerName,
        time: new Date().toLocaleTimeString("vi-VN", { hour12: false }),
        items: cart.map((item) => ({
          id: item.cartId,
          name: item.name,
          quantity: item.quantity,
          status: "PENDING",
          note: item.note,
        })),
      };

      socket.emit("sendOrderToKitchen", kdsPayload);
      showToast(`Đã chốt đơn cho ${tableName} và Báo bếp thành công!`);

      // RESET FORM & ẨN BÀN VỪA ĐẶT KHỎI DROPDOWN
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      const remainingTables = tables.filter((t) => t.id !== selectedTable);
      setTables(remainingTables);
      if (remainingTables.length > 0) setSelectedTable(remainingTables[0].id);
    } catch (error) {
      showToast("Lỗi khi xử lý đơn hàng! Vui lòng kiểm tra lại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredProducts = products.filter((p) => {
    // Ép kiểu để lấy đúng tên Category ra so sánh
    const catData = p.category as any;
    const catName =
      catData && typeof catData === "object" ? catData.name : catData;

    const matchCategory =
      activeCategory === "TẤT CẢ" || catName === activeCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 -mt-2">
      {/* Toast Notification */}
      <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md ${toast.type === "success" ? "bg-slate-900/90 border-green-500/30 text-green-400" : "bg-slate-900/90 border-red-500/30 text-red-400"}`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="text-sm font-medium text-white">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CỘT TRÁI: MENU & TÌM KIẾM (70%) */}
      <div className="flex-1 flex flex-col bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-slate-800/80 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Thực đơn
            </h1>
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white px-10 py-2.5 rounded-xl outline-none focus:border-primary transition-colors text-sm"
              />
              <Search
                className="absolute left-3.5 top-3 text-slate-400"
                size={18}
              />
            </div>
          </div>

          {/* Lọc danh mục tự động từ dữ liệu thật */}
          <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Utensils size={48} className="mb-4 opacity-50" />
              <p>
                Chưa có món ăn nào trong dữ liệu. Vui lòng thêm món ở phần Thực
                Đơn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                // Lấy ảnh thật từ DB (hỗ trợ nhiều tên cột khác nhau tùy bạn đặt)
                const imageUrl =
                  product.image ||
                  (product as any).imageUrl ||
                  (product as any).hinh_anh;

                return (
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-4 cursor-pointer transition-all group flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      {/* 👇 KIỂM TRA: CÓ ẢNH THÌ HIỆN ẢNH, KHÔNG CÓ THÌ HIỆN ICON */}
                      {imageUrl ? (
                        <div className="w-full h-24 mb-3 rounded-xl overflow-hidden bg-slate-900 group-hover:scale-105 transition-transform">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          {product.category === "ĐỒ UỐNG" ? (
                            <Coffee size={18} className="text-blue-400" />
                          ) : product.category === "ĂN VẶT" ? (
                            <Flame size={18} className="text-orange-400" />
                          ) : (
                            <Utensils size={18} className="text-emerald-400" />
                          )}
                        </div>
                      )}

                      <h3 className="font-bold text-white text-sm leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-blue-400 font-black mt-2">
                      {product.price.toLocaleString()} đ
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: GIỎ HÀNG & THÔNG TIN KHÁCH (30%) */}
      <div className="w-[400px] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Thông tin Đơn hàng */}
        <div className="p-5 border-b border-slate-800 bg-slate-800/30 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Khu vực phục vụ (Bàn trống)
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-emerald-400 font-bold text-lg px-4 py-3 rounded-xl outline-none focus:border-primary appearance-none"
            >
              {tables.length === 0 && <option value="">Hết bàn trống</option>}
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form nhập thông tin khách hàng */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User
                className="absolute left-3 top-2.5 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Tên khách..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm px-9 py-2.5 rounded-xl outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="relative">
              <Phone
                className="absolute left-3 top-2.5 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="SĐT khách..."
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-sm px-9 py-2.5 rounded-xl outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Danh sách món đã chọn */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
              <ShoppingBag size={48} className="mb-4" />
              <p className="font-bold">Chưa có món nào</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={item.cartId}
                  className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-blue-400 font-black text-sm">
                      {item.price.toLocaleString()} đ
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950 rounded-lg p-1 border border-slate-700">
                    <button
                      onClick={() => updateQuantity(item.cartId, -1)}
                      className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-md"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center font-bold text-white text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartId, 1)}
                      className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-md"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartId)}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Tổng tiền & Nút Báo Bếp */}
        <div className="p-5 border-t border-slate-800 bg-slate-800/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-bold uppercase tracking-wider">
              Tổng cộng
            </span>
            <span className="text-3xl font-black text-emerald-400">
              {totalAmount.toLocaleString()} đ
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isSubmitting || !selectedTable}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all bg-primary hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:shadow-none flex items-center justify-center gap-2"
          >
            <Send size={20} />{" "}
            {isSubmitting ? "Đang xử lý..." : "Báo Bếp & Lưu Đơn"}
          </button>
        </div>
      </div>
    </div>
  );
}
