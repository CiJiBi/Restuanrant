"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Star,
  Crown,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

// --- MOCK DATA ---
const customerStats = [
  {
    title: "Tổng Khách Hàng",
    value: "12,450",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Khách Hàng Mới (Tháng)",
    value: "+342",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Thành Viên VIP",
    value: "128",
    icon: Crown,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

const customers = [
  {
    id: "CUS-001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    tier: "Platinum",
    totalSpent: "45,200,000đ",
    lastVisit: "Hôm nay",
    points: 4500,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "CUS-002",
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    tier: "Gold",
    totalSpent: "18,500,000đ",
    lastVisit: "3 ngày trước",
    points: 1850,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "CUS-003",
    name: "Lê Hoàng C",
    email: "lehoangc@gmail.com",
    phone: "0923456789",
    tier: "Silver",
    totalSpent: "5,400,000đ",
    lastVisit: "1 tuần trước",
    points: 540,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "CUS-004",
    name: "Phạm Văn D",
    email: "phamvand@gmail.com",
    phone: "0934567890",
    tier: "Member",
    totalSpent: "1,200,000đ",
    lastVisit: "2 tuần trước",
    points: 120,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "CUS-005",
    name: "Vũ Thị E",
    email: "vuthie@gmail.com",
    phone: "0945678901",
    tier: "Gold",
    totalSpent: "22,100,000đ",
    lastVisit: "1 tháng trước",
    points: 2210,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm chọn màu huy hiệu theo hạng thành viên
  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-gradient-to-r from-slate-400 to-slate-200 text-slate-900 border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.3)]";
      case "Gold":
        return "bg-gradient-to-r from-yellow-600 to-yellow-400 text-yellow-950 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
      case "Silver":
        return "bg-gradient-to-r from-slate-600 to-slate-400 text-white border-slate-500";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return <Crown size={12} className="mr-1" />;
      case "Gold":
        return <Star size={12} className="mr-1" />;
      case "Silver":
        return <Award size={12} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hồ sơ Khách hàng
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý thông tin, phân hạng và lịch sử chi tiêu của thực khách.
          </p>
        </div>
      </div>

      {/* Thẻ Thống Kê Nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customerStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 flex items-center gap-4 border border-white/5"
            >
              <div
                className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}
              >
                <Icon size={28} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Thanh Công Cụ (Search & Filter) */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10 border border-white/5">
        <div className="relative w-full sm:w-96 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT hoặc Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium rounded-xl transition-all w-full sm:w-auto justify-center">
            <Filter size={16} />
            Lọc phân hạng
          </button>
        </div>
      </div>

      {/* Bảng Dữ Liệu Khách Hàng */}
      <div className="glass-card rounded-2xl overflow-hidden relative z-10 border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium tracking-wider"
                >
                  Liên hệ
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium tracking-wider"
                >
                  Hạng thẻ
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium tracking-wider"
                >
                  Tổng chi tiêu
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium tracking-wider"
                >
                  Lần cuối đến
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium tracking-wider text-right"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {customers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600 group-hover:border-primary transition-colors"
                    />
                    <div>
                      <p className="font-bold text-white group-hover:text-primary transition-colors cursor-pointer">
                        {customer.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {customer.id}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone size={14} className="text-slate-500" />{" "}
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Mail size={12} className="text-slate-600" />{" "}
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md border ${getTierStyle(customer.tier)}`}
                    >
                      {getTierIcon(customer.tier)}
                      {customer.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-accent">
                      {customer.totalSpent}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {customer.points} điểm
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-400">
                    {customer.lastVisit}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
