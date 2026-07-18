"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Bike,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  Clock,
  Receipt,
} from "lucide-react";
import Link from "next/link";

// Mock Data
const orderSteps = [
  { id: 1, title: "Đã xác nhận", icon: CheckCircle2, time: "10:15 AM" },
  { id: 2, title: "Đang chế biến", icon: ChefHat, time: "10:20 AM" },
  { id: 3, title: "Đang giao hàng", icon: Bike, time: "10:45 AM" },
  { id: 4, title: "Hoàn thành", icon: MapPin, time: "Dự kiến 11:00 AM" },
];

const driverInfo = {
  name: "Hoàng Minh",
  vehicle: "VinFast Feliz S - 29AA 123.45",
  service: "Xanh SM Bike",
  rating: 4.9,
  avatar:
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
};

const orderDetails = {
  id: "#ORD-88294",
  total: 5850000,
  items: 3,
  address: "Tòa nhà Landmark 81, Vinhomes Central Park, Bình Thạnh",
};

export default function OrderTrackingPage() {
  // Giả lập tiến trình hiện tại (Đang giao hàng)
  const [currentStep, setCurrentStep] = useState(3);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="bg-glow-blue top-[-20%] left-[-10%] opacity-30 fixed pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Về trang chủ</span>
          </Link>
          <div className="text-right">
            <p className="text-sm text-slate-400">Mã đơn hàng</p>
            <p className="text-lg font-bold text-accent">{orderDetails.id}</p>
          </div>
        </div>

        {/* Trạng thái đơn hàng (Tiến trình) */}
        <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">
              Trạng thái đơn hàng
            </h2>
            <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20">
              <Clock size={16} />
              <span>Dự kiến đến trong 15 phút</span>
            </div>
          </div>

          <div className="relative">
            {/* Thanh Progress nền */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-slate-800 rounded-full"></div>

            {/* Thanh Progress động */}
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep - 1) / (orderSteps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-6 left-6 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            ></motion.div>

            {/* Các bước (Steps) */}
            <div className="relative flex justify-between">
              {orderSteps.map((step, index) => {
                const isCompleted = step.id <= currentStep;
                const isCurrent = step.id === currentStep;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-3 z-10 w-20"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 border-4 border-[#0F172A] ${
                        isCompleted
                          ? "bg-primary text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                          : "bg-slate-800 text-slate-500"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                    >
                      <Icon size={20} />
                    </motion.div>
                    <div className="text-center">
                      <p
                        className={`text-xs font-bold ${isCompleted ? "text-white" : "text-slate-500"}`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Thông tin đối tác giao hàng & Bản đồ giả lập */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Thông tin giao hàng
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src={driverInfo.avatar}
                  alt="Driver"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/50"
                />
                <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400" />{" "}
                  {driverInfo.rating}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {driverInfo.name}
                </h4>
                <p className="text-sm text-slate-300 mt-0.5">
                  {driverInfo.vehicle}
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/30 rounded text-xs font-bold">
                  {driverInfo.service}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700">
                <MessageSquare size={18} /> Nhắn tin
              </button>
              <button className="flex-1 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Phone size={18} /> Gọi điện
              </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col justify-center">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-1 border border-red-500/20">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Giao đến</p>
                <p className="text-white font-medium leading-relaxed">
                  {orderDetails.address}
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-slate-800 mb-6"></div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/20">
                <Receipt size={20} />
              </div>
              <div className="w-full">
                <p className="text-sm text-slate-400 mb-1">
                  Tổng cộng ({orderDetails.items} món)
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-accent">
                    {formatMoney(orderDetails.total)}
                  </p>
                  <button className="text-sm font-medium text-primary hover:text-white transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
