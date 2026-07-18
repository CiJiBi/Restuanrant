"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Bell,
  Camera,
  Mail,
  Phone,
  MapPin,
  Save,
  Key,
  Smartphone,
} from "lucide-react";
import { useNotification } from "../components/notification";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");
  const { toast } = useNotification();
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="bg-glow-blue top-[0%] right-[-10%] opacity-40 fixed pointer-events-none"></div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 relative z-10">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="mb-8 px-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Cài đặt tài khoản
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Quản lý hồ sơ và bảo mật của bạn
            </p>
          </div>

          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "general"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <User size={18} />
              <span className="font-medium text-sm">Thông tin chung</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "security"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Shield size={18} />
              <span className="font-medium text-sm">Bảo mật & Đăng nhập</span>
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* Tab: Thông tin chung */}
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-white/5">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-primary transition-colors">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-xl font-bold text-white">
                      Ảnh đại diện
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 mb-4">
                      Định dạng hỗ trợ: JPG, PNG hoặc GIF. Kích thước tối đa
                      2MB.
                    </p>
                    <div className="flex gap-3 justify-center sm:justify-start">
                      <button className="px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-all shadow-md">
                        Tải ảnh lên
                      </button>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all">
                        Xóa ảnh
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Thông tin */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5">
                  <h2 className="text-lg font-bold text-white mb-6">
                    Thông tin cá nhân
                  </h2>
                  <form
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault(); // Chặn hành vi tải lại trang mặc định của form

                      // Kích hoạt thông báo thành công
                      toast(
                        "success",
                        "Lưu hồ sơ thành công",
                        "Thông tin cá nhân của bạn đã được cập nhật an toàn.",
                      );
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Họ và tên
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            size={18}
                          />
                          <input
                            type="text"
                            defaultValue="Nguyễn Văn A"
                            className="glass-input !py-2.5"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <Phone
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            size={18}
                          />
                          <input
                            type="text"
                            defaultValue="0901234567"
                            className="glass-input !py-2.5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Địa chỉ Email
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                          size={18}
                        />
                        <input
                          type="email"
                          defaultValue="nguyenvana@example.com"
                          className="glass-input !py-2.5 text-slate-500"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Email này được dùng để đăng nhập nên không thể tự thay
                        đổi.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Địa chỉ liên hệ
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                          size={18}
                        />
                        <input
                          type="text"
                          placeholder="Nhập địa chỉ của bạn"
                          className="glass-input !py-2.5"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      {/* Nút bấm Submit của Form */}
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white font-medium rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:-translate-y-px"
                      >
                        <Save size={18} />
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Tab: Bảo mật */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Đổi mật khẩu */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                      <Key size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Đổi mật khẩu
                      </h2>
                      <p className="text-sm text-slate-400 mt-0.5">
                        Nên cập nhật mật khẩu thường xuyên để bảo mật
                      </p>
                    </div>
                  </div>

                  <form className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="glass-input !pl-4 !py-2.5"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="glass-input !pl-4 !py-2.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="glass-input !pl-4 !py-2.5"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all text-sm border border-slate-700">
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2FA Section */}
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-500/20 text-green-400 rounded-lg shrink-0">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          Xác thực 2 yếu tố (2FA)
                        </h2>
                        <p className="text-sm text-slate-400 mt-1 max-w-md">
                          Bảo vệ tài khoản của bạn bằng cách yêu cầu mã xác nhận
                          từ điện thoại mỗi khi đăng nhập.
                        </p>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white font-medium rounded-lg transition-all text-sm shrink-0">
                      Bật 2FA
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
