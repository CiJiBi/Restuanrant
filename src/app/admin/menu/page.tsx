"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { INITIAL_MENU_ITEMS } from "../../constants/data";

export default function MenuManagementPage() {
  // 1. Quản lý State Dữ liệu Thực đơn
  const [items, setItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cijibi_menu");
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    }
    return INITIAL_MENU_ITEMS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Món chính",
    price: "",
    stock: "",
  });

  // 2. Tự động lưu vào trình duyệt khi có thay đổi
  useEffect(() => {
    localStorage.setItem("cijibi_menu", JSON.stringify(items));
  }, [items]);

  // 3. Logic xử lý dữ liệu
  const filteredItems = items.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const itemToAdd = {
      ...newItem,
      id: `MN${Math.floor(Math.random() * 1000)}`,
      price: Number(newItem.price),
      stock: Number(newItem.stock),
      status: "Đang bán",
      img: "https://images.unsplash.com/photo-1544025162-8315520c6792?q=80&w=150&auto=format&fit=crop",
    };
    setItems([itemToAdd, ...items]);
    setIsModalOpen(false);
    setNewItem({ name: "", category: "Món chính", price: "", stock: "" });
  };

  const deleteItem = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa món này?")) {
      setItems(items.filter((i: any) => i.id !== id));
    }
  };

  // 4. Hàm chọn màu huy hiệu
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang bán":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Sắp hết":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Hết hàng":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý Thực đơn
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý danh sách món ăn, giá cả và tình trạng kho.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] hover:-translate-y-px"
        >
          <Plus size={18} /> Thêm món mới
        </button>
      </div>

      {/* Toolbar (Search & Filter) */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 relative">
        <div className="relative w-full sm:w-96 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium rounded-xl transition-all w-full sm:w-auto justify-center">
          <Filter size={16} /> Lọc danh mục
        </button>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-2xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Món ăn</th>
                <th className="px-6 py-4 font-medium tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 font-medium tracking-wider">
                  Giá bán
                </th>
                <th className="px-6 py-4 font-medium tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-4 font-medium tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredItems.map((item: any, index: number) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/50 relative">
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <ImageIcon
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500"
                          size={18}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-800 rounded-md text-xs font-medium text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {Number(item.price).toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">{item.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-primary transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              Không tìm thấy món ăn nào.
            </div>
          )}
        </div>
      </div>

      {/* --- OVERLAY MODAL THÊM MÓN --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Thêm món ăn mới
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">
                    Tên món ăn
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">
                    Danh mục
                  </label>
                  <select
                    className="glass-input w-full appearance-none bg-slate-800"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                  >
                    <option>Món chính</option>
                    <option>Khai vị</option>
                    <option>Hải sản</option>
                    <option>Tráng miệng</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">
                      Giá bán (VNĐ)
                    </label>
                    <input
                      type="number"
                      required
                      className="glass-input"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">
                      Số lượng kho
                    </label>
                    <input
                      type="number"
                      required
                      className="glass-input"
                      value={newItem.stock}
                      onChange={(e) =>
                        setNewItem({ ...newItem, stock: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 mt-2 bg-primary hover:bg-secondary text-white rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
                >
                  Lưu vào thực đơn
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
