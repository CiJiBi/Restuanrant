"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Menu,
  Sparkles,
  ArrowRight,
  Star,
  ChefHat,
  Clock,
  Phone,
} from "lucide-react";
import { useNotification } from "./components/notification";
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-dark text-slate-50 overflow-hidden">
      {/* Background Glows (Tái sử dụng hiệu ứng ánh sáng xanh) */}
      <div className="bg-glow-blue top-[-20%] left-[-10%] opacity-60"></div>
      <div className="bg-glow-blue top-[40%] right-[-20%] opacity-40"></div>

      {/* 1. Thanh Navbar Cao Cấp */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-dark/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-wide">CIJIBI</span>
          </div>

          {/* Menu giữa (Dành cho Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Solutions
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Resources
            </a>
          </nav>

          {/* Cụm nút bấm Đăng nhập / Đăng ký */}
          <div className="hidden md:flex items-center gap-4">
            {/* NÚT LOGIN - Trỏ về trang /login mà chúng ta vừa di chuyển */}
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>

            {/* Nút Đăng ký (Register) */}
            <Link
              href="/login" // Tạm thời trỏ về login, sau này sẽ có trang /register riêng
              className="text-sm font-medium bg-white text-dark px-5 py-2.5 rounded-full hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </Link>
          </div>

          {/* Menu Mobile */}
          <button className="md:hidden text-slate-300">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section (Khu vực trung tâm chào mừng) */}
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Cijibi <span className="text-primary">Fusion</span>
          </motion.h1>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
            Trải nghiệm ẩm thực đẳng cấp tại Đà Nẵng. Đặt món ngay để nhận ưu
            đãi đặc biệt hôm nay!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-secondary rounded-full font-bold text-lg transition-all hover:scale-105"
          >
            Xem thực đơn <ArrowRight size={20} />
          </Link>
        </div>
      </section>
      <main className="relative pt-32 pb-16 md:pt-48 md:pb-32 max-w-7xl mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Badge phát sáng */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/30 text-primary text-sm font-medium mb-8 cursor-pointer hover:bg-primary/10 transition-colors">
            <Sparkles size={16} />
            <span>Introducing CIJIBI Restaurant 2.0</span>
            <ArrowRight size={16} />
          </div>

          {/* Tiêu đề chính */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Manage your restaurant <br className="hidden md:block" />
            with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Precision & Style
            </span>
          </h1>

          {/* Mô tả */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
            The all-in-one premium SaaS platform for modern restaurants.
            Real-time table tracking, smart menus, and powerful analytics at
            your fingertips.
          </p>

          {/* Cụm nút Call-to-action */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-secondary text-white rounded-full font-medium transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group">
                Start for free
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>

            <button className="w-full sm:w-auto px-8 py-4 glass-card hover:bg-white/10 rounded-full font-medium transition-all text-white flex items-center justify-center gap-2">
              Book a Demo
            </button>
          </div>
        </motion.div>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 max-w-6xl mx-auto -mt-20 relative z-20">
          {[
            { icon: ChefHat, label: "Đầu bếp 5 sao" },
            { icon: Star, label: "Top 10 Đà Nẵng" },
            { icon: Clock, label: "Giao 30 phút" },
            { icon: Phone, label: "Hỗ trợ 24/7" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 text-center rounded-2xl">
              <item.icon className="mx-auto text-primary mb-3" size={24} />
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </section>
        {/* Khung Dashboard Mockup (Hình chữ nhật giả lập giao diện bên trong) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-20 w-full max-w-5xl mx-auto h-[400px] md:h-[600px] glass-card rounded-t-3xl border-b-0 relative overflow-hidden"
        >
          {/* Thanh top bar của Dashboard giả lập */}
          <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          </div>
          {/* Lớp phủ mờ (Gradient) tạo cảm giác chờ đợi khám phá */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent top-12"></div>
        </motion.div>
      </main>
    </div>
  );
}
