"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../lib/axios";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  DownloadCloud,
  Zap,
} from "lucide-react";

interface DashboardData {
  revenueToday: number;
  totalOrders: number;
  activeTables: string;
  lowStockCount: number;
  weeklyRevenue: { date: string; total: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    tableName: string;
    customerName: string;
    totalAmount: number;
    status: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Gọi xuống API Hybrid chúng ta vừa tạo ở Backend
      const res = await api.get("/dashboard/overview");
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm phụ trợ: Hiển thị màu sắc trạng thái đơn hàng cho chuẩn
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Hoàn thành
          </span>
        );
      case "COOKING":
      case "PREPARING":
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Đang nấu
          </span>
        );
      case "SERVED":
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Chờ thanh toán
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">
            Đang đồng bộ dữ liệu hệ thống...
          </p>
        </div>
      </div>
    );
  }
  const safeWeeklyRevenue = data.weeklyRevenue || [];
  const safeRecentOrders = data.recentOrders || [];

  // Tìm mức doanh thu cao nhất trong tuần để vẽ chiều cao cột Biểu đồ
  const maxRevenue = Math.max(...safeWeeklyRevenue.map((d) => d.total), 1); // Tránh chia cho 0

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-10 text-slate-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Tổng quan hệ thống
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Chào mừng bạn trở lại, theo dõi hiệu suất hoạt động nhà hàng hôm
            nay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-xl text-sm font-medium border border-slate-700/50 transition-all">
            Hôm nay
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all">
            <DownloadCloud size={16} /> Tải báo cáo
          </button>
        </div>
      </div>

      {/* 4 THẺ TỔNG QUAN (TOP CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <DollarSign size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} /> +12%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Doanh thu hôm nay
            </p>
            <h3 className="text-2xl font-black text-white">
              {Number(data.revenueToday || 0).toLocaleString("vi-VN")}đ
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <ShoppingCart size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} /> +8%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tổng đơn hàng
            </p>
            <h3 className="text-2xl font-black text-white">
              {data.totalOrders || 0}
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg">
              Hoạt động
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Bàn đang phục vụ
            </p>
            <h3 className="text-2xl font-black text-white">
              {data.activeTables || "0 / 0"}
            </h3>
          </div>
        </motion.div>

        {/* THẺ SỐ 4: Tích hợp thông minh với hệ thống Kho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${(data.lowStockCount || 0) > 0 ? "bg-amber-500/10 text-amber-500" : "bg-slate-800 text-slate-400"}`}
            >
              <Package size={20} />
            </div>
            {(data.lowStockCount || 0) > 0 ? (
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                <AlertTriangle size={12} /> Chú ý kho
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                Kho an toàn
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nguyên liệu sắp hết
            </p>
            <h3
              className={`text-2xl font-black ${(data.lowStockCount || 0) > 0 ? "text-amber-400" : "text-white"}`}
            >
              {data.lowStockCount || 0}{" "}
              <span className="text-sm font-medium text-slate-500 lowercase">
                Món
              </span>
            </h3>
          </div>
        </motion.div>
      </div>
      {/* MAIN CONTENT GRID (BIỂU ĐỒ & ĐƠN HÀNG) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI (2/3): BIỂU ĐỒ DOANH THU */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Biểu đồ doanh
              thu tuần
            </h3>
            <button className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700/50 rounded-lg transition-colors">
              Cập nhật trực tiếp
            </button>
          </div>

          {/* Vùng vẽ Biểu đồ bằng CSS */}
          <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 pt-4 border-b border-slate-800/50 pb-2">
            {safeWeeklyRevenue.length === 0 ? (
              <div className="w-full text-center text-slate-500">
                Chưa có dữ liệu biểu đồ.
              </div>
            ) : (
              safeWeeklyRevenue.map((day, idx) => {
                const heightPercent = Math.max(
                  (day.total / maxRevenue) * 100,
                  2,
                );
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-3 flex-1 group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md absolute -mt-10 pointer-events-none whitespace-nowrap z-10">
                      {day.total.toLocaleString()} đ
                    </div>
                    <div className="w-full max-w-[60px] relative flex items-end justify-center h-full rounded-t-xl overflow-hidden bg-slate-800/30">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className={`w-full rounded-t-xl bg-gradient-to-t ${
                          idx === safeWeeklyRevenue.length - 1
                            ? "from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            : "from-blue-800 to-blue-600"
                        }`}
                      ></motion.div>
                    </div>
                    <span
                      className={`text-xs font-bold ${idx === safeWeeklyRevenue.length - 1 ? "text-blue-400" : "text-slate-500"}`}
                    >
                      {day.date}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* CỘT PHẢI (1/3): DANH SÁCH ĐƠN HÀNG MỚI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Đơn hàng mới</h3>
            <button className="text-xs text-blue-500 font-medium hover:text-blue-400 transition-colors">
              Xem tất cả
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {safeRecentOrders.length === 0 ? (
              <div className="text-center text-slate-500 py-10 text-sm">
                Chưa có đơn hàng nào hôm nay.
              </div>
            ) : (
              safeRecentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-800/80 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {order.tableName}
                      </span>
                    </div>
                    <p className="font-bold text-slate-200 text-sm">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="font-black text-emerald-400 text-sm">
                      {Number(order.totalAmount).toLocaleString("vi-VN")}đ
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
