"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Delete,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
} from "lucide-react";
import api from "../lib/axios";

export default function KioskPage() {
  const [pin, setPin] = useState("");
  const [time, setTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    action: string;
    type: "success" | "error";
  } | null>(null);

  // Cập nhật đồng hồ thời gian thực
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const showToast = (
    message: string,
    action: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, action, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      showToast("Vui lòng nhập đủ 4 số mã PIN!", "ERROR", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/attendance/kiosk", { pinCode: pin });

      // Khắc phục triệt để mọi lớp bọc dữ liệu (NestJS Interceptor / Axios)
      const payload = res.data?.data || res.data || res;

      const message = payload.message || "Chấm công thành công!";
      const action = payload.action || "CHECK_OUT";

      showToast(message, action, "success");
    } catch (error: any) {
      const errorPayload =
        error.response?.data?.data ||
        error.response?.data ||
        error.response ||
        {};
      showToast(
        errorPayload.message || "Mã PIN không hợp lệ!",
        "ERROR",
        "error",
      );
    } finally {
      setIsLoading(false);
      setPin("");
    }
  };
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Toast Cảnh Báo Lớn giữa màn hình */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className={`fixed top-10 z-[100] px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-xl ${
              toast.type === "success"
                ? toast.action === "CHECK_IN"
                  ? "bg-emerald-900/90 border-emerald-500/50 text-emerald-400"
                  : "bg-orange-900/90 border-orange-500/50 text-orange-400"
                : "bg-red-900/90 border-red-500/50 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={32} />
            ) : (
              <AlertCircle size={32} />
            )}
            <span className="text-xl font-bold text-white tracking-wide">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Màn hình Kiosk chính */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10 flex flex-col items-center">
        {/* Đồng hồ số */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
            <Clock size={20} />
            <span className="text-sm font-semibold uppercase tracking-widest">
              {time.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-5xl font-black text-white font-mono tracking-tighter">
            {time.toLocaleTimeString("vi-VN", { hour12: false })}
          </h1>
        </div>

        <div className="w-16 h-1 bg-slate-800 rounded-full mb-8"></div>

        {/* Khu vực nhập mã PIN */}
        <h2 className="text-lg font-bold text-white mb-6">
          NHẬP MÃ PIN ĐỂ CHẤM CÔNG
        </h2>
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-14 h-16 rounded-xl flex items-center justify-center text-3xl font-black transition-all ${
                pin.length > index
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500"
                  : "bg-slate-800 border border-slate-700 text-slate-600"
              }`}
            >
              {pin.length > index ? "•" : ""}
            </div>
          ))}
        </div>

        {/* Bàn phím ảo (Numpad) */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="h-16 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-2xl text-2xl font-bold text-white transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-16 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center transition-colors active:scale-95"
          >
            <Delete size={28} />
          </button>
          <button
            onClick={() => handlePress("0")}
            className="h-16 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-2xl text-2xl font-bold text-white transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || pin.length < 4}
            className="h-16 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl flex items-center justify-center transition-colors active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:shadow-none"
          >
            <Fingerprint size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}
