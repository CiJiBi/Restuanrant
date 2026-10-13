"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import {
  Package,
  Scale,
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  AlertTriangle,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import { io } from "socket.io-client";

interface Ingredient {
  id: string;
  name: string;
  unit: string; // kg, gram, lít, ml, cái...
  currentStock: number;
  minStockLevel: number;
}

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [activeTab, setActiveTab] = useState<"INGREDIENTS" | "RECIPES">(
    "INGREDIENTS",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // State cho Tab Công thức
  const [menuList, setMenuList] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any | null>(null);
  const [recipeItems, setRecipeItems] = useState<
    { ingredientId: string; quantity: string }[]
  >([]);
  // Thông Báo
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const socket = io("http://localhost:4000");
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    unit: "kg",
    currentStock: "",
    minStockLevel: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    fetchIngredients();
    fetchMenuList();
    const handleRefresh = () => fetchIngredients();
    socket.on("orderStatusUpdated", handleRefresh);
    return () => {
      socket.off("orderStatusUpdated", handleRefresh);
    };
  }, []);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/inventory/ingredients");
      setIngredients(res.data?.data || res.data || []);
    } catch (error) {
      console.log("Lấy dữ liệu kho thất bại");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchMenuList = async () => {
    try {
      const res = await api.get("/menu");
      const menuData = res.data?.data || res.data || [];
      // Chỉ lấy các món đang bán và chưa bị xóa
      setMenuList(menuData.filter((m: any) => !m.isDeleted && m.isAvailable));
    } catch (error) {
      console.log("Không thể tải danh sách món ăn");
    }
  };
  const handleOpenModal = (item?: Ingredient) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        name: item.name,
        unit: item.unit,
        currentStock: item.currentStock.toString(),
        minStockLevel: item.minStockLevel.toString(),
      });
    } else {
      setEditingId(null);
      setForm({ name: "", unit: "kg", currentStock: "", minStockLevel: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        unit: form.unit,
        currentStock: Number(form.currentStock),
        minStockLevel: Number(form.minStockLevel),
      };

      if (editingId) {
        await api.patch(`/inventory/ingredients/${editingId}`, payload);
      } else {
        await api.post("/inventory/ingredients", payload);
      }
      setIsModalOpen(false);
      fetchIngredients();
    } catch (error) {
      alert("Lỗi khi lưu nguyên liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/inventory/ingredients/${itemToDelete}`);
      showToast("Đã xóa nguyên liệu thành công!");
      fetchIngredients();
    } catch (error) {
      showToast("Không thể xóa nguyên liệu này!", "error");
    } finally {
      setItemToDelete(null);
    }
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleSelectMenu = async (menu: any) => {
    setSelectedMenu(menu);
    try {
      // Gọi API lấy công thức của món này (API chúng ta đã viết ở Backend lúc nãy)
      const res = await api.get(`/inventory/ingredients/recipes/${menu.id}`);
      const recipes = res.data?.data || res.data || [];

      // Đổ dữ liệu công thức vào Form
      setRecipeItems(
        recipes.map((r: any) => ({
          ingredientId: r.ingredientId,
          quantity: r.quantity.toString(),
        })),
      );
    } catch (error) {
      // Nếu chưa có công thức thì để trống
      setRecipeItems([]);
    }
  };
  const handleSaveRecipe = async () => {
    if (recipeItems.some((i) => !i.ingredientId || !i.quantity)) {
      return showToast(
        "Vui lòng điền đầy đủ nguyên liệu và định lượng!",
        "error",
      );
    }
    try {
      // SỬA ĐƯỜNG DẪN API CHO CHUẨN VỚI BACKEND
      await api.post(`/inventory/ingredients/recipes/${selectedMenu.id}`, {
        items: recipeItems,
      });
      showToast(`Lưu công thức cho món ${selectedMenu.name} thành công!`);
    } catch (e) {
      showToast("Lỗi khi lưu công thức! Vui lòng thử lại.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* 👇 TOAST NOTIFICATION HIỆN ĐẠI */}
      <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${toast.type === "success" ? "bg-slate-900/90 border-emerald-500/30 text-emerald-400" : "bg-slate-900/90 border-red-500/30 text-red-400"}`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
              <span className="text-sm font-bold text-white">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý Kho & Định lượng
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý nguyên liệu và cài đặt công thức trừ kho tự động.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("INGREDIENTS")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "INGREDIENTS" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
          >
            <Package size={18} /> Nguyên liệu
          </button>
          <button
            onClick={() => setActiveTab("RECIPES")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "RECIPES" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
          >
            <Scale size={18} /> Công thức Món
          </button>
        </div>
      </div>

      {/* Nội dung Tab Nguyên Liệu */}
      {activeTab === "INGREDIENTS" && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col min-h-[500px]">
          <div className="p-5 border-b border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/30">
            <h2 className="text-lg font-bold text-white">
              Danh sách Nguyên liệu
            </h2>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Tìm nguyên liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white px-10 py-2.5 rounded-xl outline-none focus:border-primary text-sm"
                />
                <Search
                  className="absolute left-3.5 top-3 text-slate-500"
                  size={16}
                />
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-lg"
              >
                <Plus size={18} /> Thêm Nguyên liệu
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tên Nguyên Liệu</th>
                  <th className="px-6 py-4 text-right">Tồn Kho Hiện Tại</th>
                  <th className="px-6 py-4 text-center">Mức Cảnh Báo</th>
                  <th className="px-6 py-4 text-center">Đơn vị</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredIngredients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      Chưa có nguyên liệu nào. Hãy thêm mới!
                    </td>
                  </tr>
                ) : (
                  filteredIngredients.map((item) => {
                    const isLowStock = item.currentStock <= item.minStockLevel;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-lg font-black ${isLowStock ? "text-red-400" : "text-emerald-400"}`}
                          >
                            {item.currentStock.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${isLowStock ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                          >
                            {isLowStock ? (
                              <AlertTriangle size={14} />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            &le; {item.minStockLevel.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-400 font-medium uppercase">
                          {item.unit}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors mr-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nội dung Tab Công Thức */}
      {activeTab === "RECIPES" && (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
          {/* CỘT TRÁI: DANH SÁCH MÓN ĂN */}
          <div className="w-full lg:w-1/3 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-800/30">
              <h3 className="font-bold text-white uppercase text-sm">
                Chọn Món Ăn
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {/* 👇 VÒNG LẶP RẢI DỮ LIỆU THẬT */}
              {menuList.length === 0 ? (
                <div className="text-center text-slate-500 mt-10 text-sm">
                  Đang tải thực đơn...
                </div>
              ) : (
                menuList.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => handleSelectMenu(menu)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                      selectedMenu?.id === menu.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {menu.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT ĐỊNH LƯỢNG */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden">
            {!selectedMenu ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <Scale size={48} className="mb-4 opacity-30" />
                <p>Vui lòng chọn 1 món ăn bên trái để cài đặt định lượng.</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                      Công thức cho món
                    </p>
                    <h2 className="text-2xl font-black text-white">
                      {selectedMenu.name}
                    </h2>
                  </div>
                  <button
                    onClick={() =>
                      setRecipeItems([
                        ...recipeItems,
                        { ingredientId: "", quantity: "" },
                      ])
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm border border-slate-700 transition-colors"
                  >
                    <Plus size={16} /> Thêm nguyên liệu
                  </button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-3">
                  {recipeItems.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 italic text-sm">
                      Món này chưa có công thức. Mặc định sẽ không trừ kho.
                    </div>
                  ) : (
                    recipeItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50"
                      >
                        <div className="flex-1">
                          <select
                            value={item.ingredientId}
                            onChange={(e) => {
                              const newItems = [...recipeItems];
                              newItems[index].ingredientId = e.target.value;
                              setRecipeItems(newItems);
                            }}
                            className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2.5 rounded-lg outline-none focus:border-primary text-sm font-bold appearance-none"
                          >
                            <option value="" disabled>
                              -- Chọn nguyên liệu --
                            </option>
                            {ingredients.map((ing) => (
                              <option key={ing.id} value={ing.id}>
                                {ing.name} ({ing.unit})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-32 relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...recipeItems];
                              newItems[index].quantity = e.target.value;
                              setRecipeItems(newItems);
                            }}
                            className="w-full bg-slate-950 border border-slate-700 text-emerald-400 px-4 py-2.5 rounded-lg outline-none focus:border-primary text-sm font-black text-right"
                          />
                        </div>

                        <button
                          onClick={() =>
                            setRecipeItems(
                              recipeItems.filter((_, i) => i !== index),
                            )
                          }
                          className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-5 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={handleSaveRecipe}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all"
                  >
                    <Save size={20} /> LƯU CÔNG THỨC
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Modal Thêm/Sửa Nguyên Liệu */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingId ? "Sửa Nguyên Liệu" : "Thêm Nguyên Liệu Mới"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                    Tên Nguyên Liệu
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="VD: Bò Wagyu, Cà phê hạt..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      Đơn Vị Đo
                    </label>
                    <select
                      value={form.unit}
                      onChange={(e) =>
                        setForm({ ...form, unit: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="gram">Gram (g)</option>
                      <option value="lít">Lít (L)</option>
                      <option value="ml">Millilit (ml)</option>
                      <option value="cái">Cái / Quả</option>
                      <option value="lon">Lon / Chai</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      Tồn Kho Hiện Tại
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={form.currentStock}
                      onChange={(e) =>
                        setForm({ ...form, currentStock: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none font-bold text-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase flex items-center gap-1">
                    <AlertCircle size={14} /> Mức Cảnh Báo Gần Hết
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="VD: 5 (Cảnh báo khi tồn kho dưới 5)"
                    value={form.minStockLevel}
                    onChange={(e) =>
                      setForm({ ...form, minStockLevel: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 italic">
                    Hệ thống sẽ bôi đỏ nguyên liệu khi tồn kho thấp hơn mức này.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-colors"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Lưu Nguyên Liệu"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 👇 MODAL XÁC NHẬN XÓA HIỆN ĐẠI (THAY THẾ WINDOW.CONFIRM) */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-red-500/30 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 space-y-5 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400 mb-2">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2">
                  Xác nhận xóa kho
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Bạn có chắc chắn muốn xóa nguyên liệu này? Các món ăn đang
                  dùng nguyên liệu này sẽ{" "}
                  <span className="text-red-400 font-bold">
                    không được trừ kho tự động
                  </span>{" "}
                  nữa.
                </p>
              </div>
              <div className="flex gap-3 pt-2 mt-4">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-500/20"
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
