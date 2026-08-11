"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios"; // Công cụ gọi API tự động gắn Token
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

// Tạm thời giữ lại dữ liệu mẫu làm giá trị khởi tạo (Fallback)
const initialStats = [
  {
    title: "Doanh thu hôm nay",
    value: "0đ",
    icon: DollarSign,
    trend: "+0%",
    isUp: true,
  },
  {
    title: "Đơn hàng đang xử lý",
    value: "0",
    icon: ShoppingCart,
    trend: "+0%",
    isUp: true,
  },
  {
    title: "Món ăn trong Menu",
    value: "0",
    icon: Users,
    trend: "0%",
    isUp: true,
  }, // Tạm đổi thành Món ăn để dùng API menu
  {
    title: "Bàn đang phục vụ",
    value: "0 / 30",
    icon: Clock,
    trend: "+0%",
    isUp: true,
  },
];

const initialOrders = [
  {
    id: "#ORD-001",
    customer: "Đang tải...",
    table: "--",
    amount: "0đ",
    status: "...",
    time: "...",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  // 1. Chuyển dữ liệu tĩnh thành State để có thể cập nhật từ Backend
  const [stats, setStats] = useState(initialStats);
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Kích hoạt Khiên bảo vệ & Gọi dữ liệu
  useEffect(() => {
    const token = localStorage.getItem("cijibi_token");
    if (!token) {
      router.push("/login"); // Đá văng ra ngoài nếu không có Token
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Tạm thời lấy số lượng món ăn từ API /menu hiện có của chúng ta
      const menuRes = await api.get("/menu");
      const menuCount = menuRes.data?.data?.length || 0;

      // Cập nhật State với dữ liệu thật (Các chỉ số khác tạm thời giữ giả lập cho đến khi có API)
      setStats((prevStats) => {
        const newStats = [...prevStats];
        newStats[2].value = menuCount.toString(); // Cập nhật thẻ số 3 thành tổng số món ăn
        return newStats;
      });

      // Tương lai: Gọi thêm API /orders, /revenue ở đây để setOrders và setStats...
    } catch (error) {
      console.error("Lỗi tải dữ liệu Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cijibi_token");
    router.push("/login");
  };

  // Tránh render chớp nhoáng UI trước khi check Token xong
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Đang đồng bộ dữ liệu...
      </div>
    );
  }

  return (
    // Thêm bg-slate-900 để làm nền tối tôn lên các thẻ Glassmorphism của bạn
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Tổng quan hệ thống
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Theo dõi hoạt động kinh doanh nhà hàng theo thời gian thực.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Tải báo cáo
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/20"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:border-blue-400/30 transition-all">
                    <Icon size={24} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${stat.isUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                  >
                    {stat.isUp ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Grid: Charts & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biểu đồ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 min-h-[400px] flex flex-col"
          >
            <h2 className="text-lg font-bold text-white mb-6">
              Biểu đồ doanh thu (Tuần)
            </h2>
            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 mt-auto">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div
                  key={i}
                  className="w-full flex flex-col items-center gap-3"
                >
                  <div className="w-full bg-slate-800/50 rounded-t-md h-48 relative overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.5 + i * 0.1,
                        type: "spring",
                      }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500/80 to-purple-500/80 rounded-t-md"
                    ></motion.div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    T{i + 2}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bảng Đơn hàng */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Đơn hàng mới</h2>
              <button className="text-blue-400 text-sm hover:text-blue-300 font-medium">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-4">
              {orders.map((order, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/30 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50"
                >
                  <div>
                    <p className="text-sm font-bold text-white">
                      {order.customer}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {order.table} • {order.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-400">
                      {order.amount}
                    </p>
                    <p
                      className={`text-xs mt-1 font-medium ${order.status === "Hoàn thành" ? "text-green-400" : "text-orange-400"}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
