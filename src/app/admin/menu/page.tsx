"use client";

import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { Edit, Trash2, Plus, Search, Filter, X } from "lucide-react";

interface MenuItem {
  id: string;
  itemCode: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: { name: string };
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // THÊM MỚI: Biến lưu ID của món đang sửa (Nếu null nghĩa là đang Thêm mới)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    itemCode: "",
    name: "",
    price: "",
    stock: "",
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

  // THÊM MỚI: Hàm mở Form để Sửa (Điền sẵn dữ liệu cũ vào Form)
  const handleOpenEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setNewItem({
      itemCode: item.itemCode,
      name: item.name,
      price: item.price.toString(),
      stock: item.stock.toString(),
      categoryId: 1,
      imageUrl: item.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  // THÊM MỚI: Hàm đóng Form và dọn dẹp sạch sẽ
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewItem({
      itemCode: "",
      name: "",
      price: "",
      stock: "",
      categoryId: 1,
      imageUrl: "",
    });
  };

  // CẬP NHẬT: Hàm Lưu giờ đây xử lý được cả THÊM và SỬA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...newItem,
        price: Number(newItem.price),
        stock: Number(newItem.stock),
      };

      if (editingId) {
        // Nếu có editingId -> Gọi API Sửa (PATCH)
        await api.patch(`/menu/${editingId}`, payload);
      } else {
        // Nếu không có editingId -> Gọi API Thêm (POST)
        await api.post("/menu", payload);
      }

      fetchMenu(); // Tải lại bảng
      handleCloseModal(); // Đóng Popup
      alert(
        editingId
          ? "✅ Cập nhật món ăn thành công!"
          : "✅ Đã thêm món mới thành công!",
      );
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi lưu món ăn!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirm = window.confirm(
      "⚠️ Bạn có chắc chắn muốn xóa món ăn này khỏi hệ thống không?",
    );
    if (!isConfirm) return;
    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
      alert("✅ Đã xóa món ăn thành công!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa món ăn!");
    }
  };

  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý Thực đơn
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý danh sách món ăn, giá cả và tình trạng kho.
          </p>
        </div>
        <button
          onClick={() => {
            handleCloseModal(); // Reset form sạch sẽ trước khi Thêm mới
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
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
                <th className="px-6 py-4">TỒN KHO</th>
                <th className="px-6 py-4">TRẠNG THÁI</th>
                <th className="px-6 py-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Đang đồng bộ dữ liệu hệ thống...
                    </div>
                  </td>
                </tr>
              ) : (Array.isArray(menuItems) ? menuItems : []).length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Chưa có món ăn nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                (Array.isArray(menuItems) ? menuItems : []).map((item) => (
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
                          "No img"
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-sm mb-0.5">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 uppercase">
                          {item.itemCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs">
                        {item.category?.name || "Món chính"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {item.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4">
                      {item.stock > 0 ? (
                        <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-[11px] font-medium border border-green-500/20">
                          Đang bán
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">
                          Hết hàng
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
                          onClick={() => handleDelete(item.id)}
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

      {/* Popup Modal Dùng chung cho Thêm & Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
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
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Mã món
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="VD: MN003"
                    value={newItem.itemCode}
                    onChange={(e) =>
                      setNewItem({ ...newItem, itemCode: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Tên món
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Tên món ăn"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="0"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                    Tồn kho
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="Số lượng"
                    value={newItem.stock}
                    onChange={(e) =>
                      setNewItem({ ...newItem, stock: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  />
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
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4">
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
          </div>
        </div>
      )}
    </div>
  );
}
