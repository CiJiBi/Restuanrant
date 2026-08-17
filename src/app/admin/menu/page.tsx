"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Coffee,
} from "lucide-react";

interface MenuItem {
  id: string;
  itemCode: string;
  name: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
  category?: { name: string };
}

interface ToastMessage {
  message: string;
  type: "success" | "error";
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý Modal thêm/sửa món
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State quản lý Popup xác nhận xóa (Thay thế window.confirm)
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // State quản lý Toast thông báo hiện đại
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const [newItem, setNewItem] = useState({
    itemCode: "",
    name: "",
    price: "" as string | number,
    isAvailable: true,
    categoryId: 1,
    imageUrl: "",
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/menu");
      const payload = response.data;

      if (payload?.data?.data && Array.isArray(payload.data.data)) {
        setMenuItems(payload.data.data);
      } else if (payload?.data && Array.isArray(payload.data)) {
        setMenuItems(payload.data);
      } else if (Array.isArray(payload)) {
        setMenuItems(payload);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("❌ Lỗi đồng bộ dữ liệu:", error);
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm mở modal thêm món và tự động lấy mã SP tiếp theo từ Backend
  const handleOpenAddModal = async () => {
    setEditingId(null);
    try {
      const response = await api.get("/menu/next-code");
      const resData = response.data;

      // Bóc tách linh hoạt dữ liệu từ object bọc chuẩn chung của Backend
      const code =
        typeof resData === "string"
          ? resData
          : typeof resData?.data === "string"
            ? resData.data
            : resData?.code || "SP01";

      console.log("Mã mới nhận được:", code);

      setNewItem({
        itemCode: code,
        name: "",
        price: "",
        isAvailable: true,
        categoryId: 1,
        imageUrl: "",
      });
    } catch (error) {
      setNewItem({
        itemCode: "SP01",
        name: "",
        price: "",
        isAvailable: true,
        categoryId: 1,
        imageUrl: "",
      });
    }
    setIsModalOpen(true);
  };
  const handleOpenEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setNewItem({
      itemCode: item.itemCode,
      name: item.name,
      price: item.price,
      isAvailable: item.isAvailable,
      categoryId: 1,
      imageUrl: item.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewItem({
      itemCode: "",
      name: "",
      price: "",
      isAvailable: true,
      categoryId: 1,
      imageUrl: "",
    });
  };

  // Hàm Lưu món ăn (Thêm hoặc Sửa)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(newItem.price);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      showToast("Giá bán phải lớn hơn 0!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        itemCode: String(newItem.itemCode),
        name: String(newItem.name),
        price: numericPrice,
        isAvailable: Boolean(newItem.isAvailable),
        categoryId: Number(newItem.categoryId) || 1,
        imageUrl: String(newItem.imageUrl || ""),
      };

      console.log("📦 Payload gửi lên Backend:", payload);

      if (editingId) {
        await api.patch(`/menu/${editingId}`, payload);
        showToast("Cập nhật món ăn thành công!");
      } else {
        await api.post("/menu", payload);
        showToast("Đã thêm món mới thành công!");
      }

      fetchMenu();
      handleCloseModal();
    } catch (error: any) {
      console.error("🔥 CHI TIẾT LỖI 400 TỪ BACKEND:", error.response?.data);

      // Hiển thị thông báo lỗi cụ thể từ backend nếu có (ví dụ: mảng message validation)
      const errorMsg = error.response?.data?.message;
      const displayMessage = Array.isArray(errorMsg)
        ? errorMsg.join(", ")
        : errorMsg || "Lỗi khi lưu món ăn!";

      showToast(displayMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Thực thi xóa món sau khi bấm xác nhận trên Popup
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await api.delete(`/menu/${itemToDelete.id}`);
      showToast("Đã xóa món ăn thành công!");
      setItemToDelete(null);
      fetchMenu();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Không thể xóa món ăn này!",
        "error",
      );
      setItemToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-300 relative">
      {/* Toast Notification Container (Góc trên bên phải) */}
      <div className="fixed top-6 right-6 z-50 pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-slate-900/90 border-green-500/30 text-green-400"
                  : "bg-slate-900/90 border-red-500/30 text-red-400"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={20} className="text-green-400 shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-red-400 shrink-0" />
              )}
              <span className="text-sm font-medium text-white">
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý Thực đơn
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý danh sách món ăn, giá cả và trạng thái phục vụ.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} /> Thêm món mới
        </button>
      </div>

      {/* Thanh Tìm kiếm & Lọc */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors">
          <Filter size={16} /> Lọc danh mục
        </button>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 bg-slate-800/20">
              <tr>
                <th className="px-6 py-4">MÓN ĂN</th>
                <th className="px-6 py-4">DANH MỤC</th>
                <th className="px-6 py-4">GIÁ BÁN</th>
                <th className="px-6 py-4">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Đang đồng bộ dữ liệu hệ thống...
                    </div>
                  </td>
                </tr>
              ) : menuItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Chưa có món ăn nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-slate-500 border border-slate-700/50">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Coffee size={18} className="text-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-sm mb-0.5">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-blue-400 font-mono uppercase">
                          {item.itemCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs">
                        {item.category?.name || "Món chính"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {item.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4">
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-[11px] font-medium border border-green-500/20">
                          <CheckCircle2 size={13} /> Đang bán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">
                          <X size={13} /> Tạm hết
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 pr-6">
                      <div className="flex items-center justify-end gap-2 text-slate-500 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Sửa"
                          className="p-2 hover:bg-slate-700/50 hover:text-blue-400 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          title="Xóa"
                          className="p-2 hover:bg-slate-700/50 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal Thêm/Sửa Món Ăn */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Cập nhật thông tin món" : "Thêm món ăn mới"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-500 hover:text-slate-300 transition-colors bg-slate-800/50 p-2 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                    Mã món (Tự động sinh)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={newItem.itemCode}
                    className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Tên món ăn
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="VD: Phở bò đặc biệt"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="VD: 50000"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Trạng thái phục vụ
                  </label>
                  <select
                    value={newItem.isAvailable ? "true" : "false"}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        isAvailable: e.target.value === "true",
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all"
                  >
                    <option value="true">🟢 Đang bán (Còn món)</option>
                    <option value="false">🔴 Tạm hết (Hết món)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Đường dẫn Ảnh minh họa
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newItem.imageUrl}
                    onChange={(e) =>
                      setNewItem({ ...newItem, imageUrl: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors shadow-lg shadow-blue-500/20"
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : editingId
                      ? "Lưu thay đổi"
                      : "Lưu món ăn"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Custom Confirm Modal Xóa Món (Thay thế hoàn toàn window.confirm) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#111827] border border-red-500/30 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 space-y-5 text-center"
          >
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Xác nhận xóa món ăn
              </h3>
              <p className="text-slate-400 text-sm">
                Bạn có chắc chắn muốn xóa{" "}
                <span className="text-white font-semibold">
                  {itemToDelete.name}
                </span>{" "}
                khỏi thực đơn không? Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-500/20"
              >
                Xóa món
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
