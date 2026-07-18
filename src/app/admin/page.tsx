"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const statCards = [
  {
    title: "Doanh thu hôm nay",
    value: "45,230,000đ",
    icon: DollarSign,
    trend: "+12.5%",
    isUp: true,
  },
  {
    title: "Đơn hàng đang xử lý",
    value: "24",
    icon: ShoppingCart,
    trend: "+4.2%",
    isUp: true,
  },
  {
    title: "Khách hàng mới",
    value: "18",
    icon: Users,
    trend: "-2.1%",
    isUp: false,
  },
  {
    title: "Bàn đang phục vụ",
    value: "12 / 30",
    icon: Clock,
    trend: "+10.0%",
    isUp: true,
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    customer: "Nguyễn Văn A",
    table: "Bàn 05",
    amount: "1,250,000đ",
    status: "Đang chuẩn bị",
    time: "10 phút trước",
  },
  {
    id: "#ORD-002",
    customer: "Trần Thị B",
    table: "Bàn 12",
    amount: "850,000đ",
    status: "Hoàn thành",
    time: "35 phút trước",
  },
  {
    id: "#ORD-003",
    customer: "Lê Hoàng C",
    table: "Bàn 02",
    amount: "2,400,000đ",
    status: "Đang giao",
    time: "1 giờ trước",
  },
  {
    id: "#ORD-004",
    customer: "Phạm Văn D",
    table: "Mang đi",
    amount: "450,000đ",
    status: "Đang chuẩn bị",
    time: "1.5 giờ trước",
  },
];

export default function DashboardPage() {
  return (
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
        <button className="px-4 py-2 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          Tải báo cáo
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-all">
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
        {/* Lấp chỗ trống cho Biểu đồ (Sẽ tích hợp thư viện Chart sau) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 min-h-[400px] flex flex-col"
        >
          <h2 className="text-lg font-bold text-white mb-6">
            Biểu đồ doanh thu (Tuần)
          </h2>
          <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 mt-auto">
            {/* Giả lập các cột biểu đồ bằng CSS */}
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-3">
                <div className="w-full bg-slate-800/50 rounded-t-md h-48 relative overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      duration: 1,
                      delay: 0.5 + i * 0.1,
                      type: "spring",
                    }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-primary/80 to-accent/80 rounded-t-md"
                  ></motion.div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  T{i + 2}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bảng Đơn hàng gần đây */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Đơn hàng mới</h2>
            <button className="text-primary text-sm hover:text-accent font-medium">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order, i) => (
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
                  <p className="text-sm font-bold text-accent">
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
  );
}
