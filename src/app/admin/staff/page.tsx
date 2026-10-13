"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import {
  Users,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  BadgeCent,
  ChefHat,
  Coffee,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  salary: number;
  isActive: boolean;
  pinCode: string; // 👈 Đã thêm pinCode
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  // 👈 Khởi tạo pinCode
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "WAITER",
    salary: "",
    pinCode: "",
    isActive: true,
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/staff");
      // Xử lý unwrap data giống như ở Kiosk
      const payload = res.data?.data || res.data || res;
      setStaffList(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("Lỗi tải danh sách nhân viên:", error);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "WAITER",
      salary: "",
      pinCode: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: Staff) => {
    setEditingId(staff.id);
    setForm({
      name: staff.name,
      email: staff.email,
      password: "",
      role: staff.role,
      salary: staff.salary.toString(),
      pinCode: staff.pinCode || "", // 👈 Load mã PIN cũ
      isActive: staff.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.pinCode && form.pinCode.length !== 4) {
      showToast("Mã PIN phải có đúng 4 chữ số!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.patch(`/staff/${editingId}`, form);
        showToast("Cập nhật thông tin thành công!");
      } else {
        await api.post("/staff", form);
        showToast("Tạo tài khoản nhân viên thành công!");
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (error: any) {
      const errorPayload =
        error.response?.data?.data ||
        error.response?.data ||
        error.response ||
        {};
      showToast(errorPayload.message || "Lỗi khi lưu nhân viên!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên ${name} không?`))
      return;
    try {
      await api.delete(`/staff/${id}`);
      showToast("Đã xóa nhân viên thành công!");
      fetchStaff();
    } catch (error) {
      showToast("Không thể xóa nhân viên này!", "error");
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldAlert size={14} /> Quản lý
          </span>
        );
      case "CHEF":
        return (
          <span className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <ChefHat size={14} /> Đầu bếp
          </span>
        );
      case "CASHIER":
        return (
          <span className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BadgeCent size={14} /> Thu ngân
          </span>
        );
      case "WAITER":
        return (
          <span className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Coffee size={14} /> Phục vụ
          </span>
        );
      case "SECURITY":
        return (
          <span className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <ShieldCheck size={14} /> Bảo vệ
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Toast */}
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý Nhân sự
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Cấp tài khoản, mã PIN Kiosk và quản lý lương nhân viên.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
        >
          <Plus size={18} /> Thêm nhân viên
        </button>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-800/30">
              <tr>
                <th className="px-6 py-4">Nhân viên</th>
                <th className="px-6 py-4">Chức vụ</th>
                <th className="px-6 py-4">Mã PIN (Kiosk)</th>
                <th className="px-6 py-4">Mức lương (VNĐ)</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {staffList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Chưa có nhân viên nào.
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr
                    key={staff.id}
                    className={`hover:bg-slate-800/40 transition-colors ${!staff.isActive ? "opacity-50 grayscale" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">
                            {staff.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                            {staff.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderRoleBadge(staff.role)}</td>

                    {/* Cột hiển thị Mã PIN */}
                    <td className="px-6 py-4">
                      {staff.pinCode ? (
                        <span className="flex items-center gap-1.5 text-blue-400 font-mono font-bold bg-blue-500/10 px-2.5 py-1 rounded-md w-fit border border-blue-500/20">
                          <KeyRound size={14} /> {staff.pinCode}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs italic">
                          Chưa cấp
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-400">
                      {staff.salary
                        ? staff.salary.toLocaleString() + " đ"
                        : "Thỏa thuận"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(staff)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors mr-1"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Nhân Viên */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingId ? "Cập nhật Nhân viên" : "Thêm Nhân viên mới"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      Tên nhân viên
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      Email đăng nhập
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="nhanvien@cijibi.com"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      {editingId
                        ? "Đổi Mật khẩu (Trống = Giữ nguyên)"
                        : "Mật khẩu hệ thống"}
                    </label>
                    <input
                      required={!editingId}
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-400 mb-1 uppercase flex items-center gap-1">
                      <KeyRound size={12} /> Mã PIN Kiosk (4 số)
                    </label>
                    {/* 👇 Bắt buộc chỉ được nhập đúng số bằng Regex thay thế */}
                    <input
                      type="text"
                      maxLength={4}
                      value={form.pinCode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          pinCode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="VD: 1503"
                      className="w-full bg-slate-800/50 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-400 font-bold font-mono focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      Chức vụ
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none"
                    >
                      <option value="WAITER">Phục vụ</option>
                      <option value="CHEF">Đầu bếp</option>
                      <option value="CASHIER">Thu ngân / Lễ tân</option>
                      <option value="SECURITY">Bảo vệ</option>
                      <option value="ADMIN">Quản lý (Admin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
                      Mức lương (VNĐ)
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.salary}
                      onChange={(e) =>
                        setForm({ ...form, salary: e.target.value })
                      }
                      placeholder="VD: 5000000"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {editingId && (
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm({ ...form, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-slate-300 cursor-pointer"
                    >
                      Nhân viên đang làm việc (Bỏ chọn nếu đã nghỉ)
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Lưu hồ sơ"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
