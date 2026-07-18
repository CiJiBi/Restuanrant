"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Star,
  Utensils,
} from "lucide-react";

// Mock Data Tổng quan Tài chính
const financialMetrics = [
  {
    title: "Tổng Doanh Thu (Tháng)",
    value: "1,245,800,000đ",
    icon: DollarSign,
    trend: "+14.2%",
    isUp: true,
    desc: "với tháng trước",
  },
  {
    title: "Lợi Nhuận Ròng",
    value: "412,350,000đ",
    icon: TrendingUp,
    trend: "+8.6%",
    isUp: true,
    desc: "với tháng trước",
  },
  {
    title: "Giá Trị Đơn Trung Bình (AOV)",
    value: "542,000đ",
    icon: CreditCard,
    trend: "-1.5%",
    isUp: false,
    desc: "với tuần trước",
  },
  {
    title: "Tổng Số Đơn Hàng",
    value: "2,298 đơn",
    icon: ShoppingBag,
    trend: "+21.3%",
    isUp: true,
    desc: "với mục tiêu",
  },
];

// Mock Data Món ăn bán chạy nhất (Top Selling)
const topDishes = [
  {
    name: "Thịt bò Wagyu sốt vang",
    sales: 412,
    revenue: "515,000,000đ",
    rating: 4.9,
    change: "+12%",
  },
  {
    name: "Tôm hùm đút lò phô mai",
    sales: 289,
    revenue: "534,650,000đ",
    rating: 4.8,
    change: "+5%",
  },
  {
    name: "Súp bào ngư vi cá",
    sales: 195,
    revenue: "185,250,000đ",
    rating: 5.0,
    change: "+18%",
  },
  {
    name: "Rượu Vang Chateau Margaux",
    sales: 88,
    revenue: "396,000,000đ",
    rating: 4.9,
    change: "-2%",
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "12m">("30d");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Trung tâm phân tích tài chính
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Báo cáo trực quan về doanh thu, chi phí và hiệu suất bán hàng.
          </p>
        </div>

        {/* Bộ lọc thời gian & Nút hành động */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="glass-card rounded-xl p-1 flex items-center gap-1">
            {(["7d", "30d", "12m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === range
                    ? "bg-slate-700 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {range === "7d"
                  ? "7 Ngày"
                  : range === "30d"
                    ? "30 Ngày"
                    : "12 Tháng"}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-slate-200 text-sm font-medium transition-colors">
            <Download size={16} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Grid thẻ số liệu tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded ${metric.isUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                >
                  {metric.isUp ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {metric.trend}
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                {metric.title}
              </p>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                {metric.value}
              </h3>
              <p className="text-slate-500 text-xs mt-2">So {metric.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Biểu đồ phân tích cấu trúc doanh thu & Kênh bán hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Khối Biểu đồ xu hướng */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/5 flex flex-col min-h-[380px]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                Xu hướng Doanh thu & Chi phí
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dữ liệu phân tích dòng tiền vận hành
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 bg-primary rounded-full"></span> Doanh
                thu
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-3 h-3 bg-slate-700 rounded-full"></span> Chi
                phí gốc
              </div>
            </div>
          </div>

          {/* Mô phỏng đường đồ thị trực quan bằng các cột lồng tầng tinh tế */}
          <div className="flex-1 flex items-end justify-between gap-4 pt-10 mt-auto">
            {[35, 60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 100]
              .slice(timeRange === "7d" ? 5 : 0)
              .map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-full bg-slate-800/20 rounded-t-lg h-44 relative overflow-hidden flex items-end justify-center">
                    {/* Cột Chi phí */}
                    <div
                      className="absolute bottom-0 w-full bg-slate-700/40 rounded-t-md transition-all group-hover:bg-slate-700/60"
                      style={{ height: `${h * 0.6}%` }}
                    ></div>
                    {/* Cột Doanh thu */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.03 }}
                      className="w-[60%] sm:w-[45%] bg-gradient-to-t from-primary to-accent rounded-t-md relative z-10 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    ></motion.div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    {timeRange === "12m" ? `T${i + 1}` : `N${i + 1}`}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Khối Cơ cấu nguồn thu (Kênh đặt đơn) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Cơ cấu Kênh đặt đơn
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Tỷ lệ đóng góp nguồn thu theo hình thức
            </p>
          </div>

          {/* Thanh tỉ lệ ngang phân tầng tinh tế */}
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">
                  Dùng tại bàn (Table Mapping)
                </span>
                <span className="text-white">55%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "55%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-primary rounded-full"
                ></motion.div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">
                  Giao hàng tận nơi (Xanh SM Delivery)
                </span>
                <span className="text-white">30%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-accent rounded-full"
                ></motion.div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Đặt mang đi (Takeaway)</span>
                <span className="text-white">15%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  transition={{ duration: 1 }}
                  className="h-full bg-slate-600 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-center text-xs text-slate-400 font-medium">
            Kênh trực tiếp tại bàn đang dẫn đầu tăng trưởng.
          </div>
        </motion.div>
      </div>

      {/* Bảng xếp hạng sản phẩm bán chạy nhất */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card rounded-3xl p-6 border border-white/5 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Top 4 Thượng Phẩm Doanh Thu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Xếp hạng các mặt hàng có đóng góp tài chính lớn nhất.
            </p>
          </div>
          <Utensils size={20} className="text-slate-500" />
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-800/40 text-slate-400 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Tên món ăn</th>
                    <th className="px-6 py-3.5 font-bold text-center">
                      Số lượng bán
                    </th>
                    <th className="px-6 py-3.5 font-bold">Tổng doanh thu</th>
                    <th className="px-6 py-3.5 font-bold">Đánh giá sao</th>
                    <th className="px-6 py-3.5 font-bold text-right">
                      Biến động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {topDishes.map((dish, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">
                        {dish.name}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-200">
                        {dish.sales} suất
                      </td>
                      <td className="px-6 py-4 font-medium text-accent">
                        {dish.revenue}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="text-yellow-400 fill-yellow-400"
                          />{" "}
                          {dish.rating}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-bold ${dish.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {dish.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
